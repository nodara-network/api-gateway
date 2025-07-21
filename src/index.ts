import cors from 'cors';
import "dotenv/config";
import express from 'express';
import morgan from 'morgan';
import cron from 'node-cron';
import swaggerUi from 'swagger-ui-express';
import { redis } from './cache/redis';
import { PrismaClient } from "@prisma/client";
import { swaggerSpec } from "./lib/swagger";
import healthRouter from "./routes/health";
import uptimeRouter from './routes/uptime';
import webhookRouter from './routes/webhook';
export const prismaClient = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

// ----- V1 -----
app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/v1/health', healthRouter);
app.use("/v1/uptime", uptimeRouter);
app.use("/v1", webhookRouter);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

cron.schedule("*/30 * * * * *", async () => { // every 30s
  const tasks = await prismaClient.task.findMany({
    where: { status: "pending" },
  });

  for (const task of tasks) {
    const redisKey = `task:${task.id}`;
    const isAlreadyInRedis = await redis.exists(redisKey);

    if (!isAlreadyInRedis) {
      await redis.set(redisKey, JSON.stringify(task));
      console.log(`Synced task ${task.id} to Redis`);
    }
  }
});
