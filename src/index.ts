// import cors from 'cors';
// import "dotenv/config";
// import express from 'express';
// import morgan from 'morgan';
// import cron from 'node-cron';
// import swaggerUi from 'swagger-ui-express';
// import { redis } from './cache/redis';
// import { PrismaClient } from "@prisma/client";
// import { swaggerSpec } from "./lib/swagger";
// import healthRouter from "./routes/health";
// import uptimeRouter from './routes/uptime';
// import webhookRouter from './routes/webhook';
// export const prismaClient = new PrismaClient();

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(morgan('tiny'));
// app.use(cors());

// // ----- V1 -----
// app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// app.use('/v1/health', healthRouter);
// app.use("/v1/uptime", uptimeRouter);
// app.use("/v1", webhookRouter);
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// cron.schedule("*/30 * * * * *", async () => { // every 30s
//   const tasks = await prismaClient.task.findMany({
//     where: { status: "pending" },
//   });

//   for (const task of tasks) {
//     const redisKey = `task:${task.id}`;
//     const isAlreadyInRedis = await redis.exists(redisKey);

//     if (!isAlreadyInRedis) {
//       await redis.set(redisKey, JSON.stringify(task));
//       console.log(`Synced task ${task.id} to Redis`);
//     }
//   }
// });



// below priyanshu code
import express from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware";
import prisma from "./lib/prisma";
import { xAddBulk } from "./redis";

const app = express();

app.use(express.json());


app.post("/website", authMiddleware, async (req, res) => {
    if (!req.body.url) {
        res.status(411).json({});
        return
    }
    const website = await prisma.website.create({
        data: {
            url: req.body.url,
            time_added: new Date(),
            user_id: req.userId!
        }
    })

    res.json({
        id: website.id
    })
});

app.get("/status/:websiteId", authMiddleware, async (req, res) => {
    const website = await prisma.website.findFirst({
        where: {
            user_id: req.userId!,
            id: req.params.websiteId,
        },
        include: {
            ticks: {
                orderBy: [{
                    createdAt: 'desc',
                }],
                take: 1
            }
        }
    })

    if (!website) {
        res.status(409).json({
            message: "Not found"
        })
        return;
    }

    res.json({
        url: website.url,
        id: website.id,
        user_id: website.user_id,
        ticks: website.ticks
    })

})

app.post("/user/signup", async (req, res) => {
    const data = req.body;

    try {
        let user = await prisma.user.create({
            data: {
                username: data.username,
                password: data.password
            }
    })
        res.json({
            id: user.id
        })
    } catch(e) {
        console.log(e);
        res.status(403).send("");
    }
})

app.post("/user/signin", async (req, res) => {
    const data = req.body;
    let user = await prisma.user.findFirst({
        where: {
            username: data.username
        }
    })

    if (user?.password !== data.password) {
        res.status(403).send("");
        return;
    }

    let token = jwt.sign({
        sub: user?.id
    }, process.env.JWT_SECRET!)


    res.json({
        jwt: token
    })
})

async function xmain() {
    let websites = await prisma.website.findMany({
        select: {
            url: true,
            id: true
        }
    })
  
    await xAddBulk(websites.map(w => ({
        url: w.url,
        id: w.id
    })));
}


app.listen(3000, () => {
  console.log("Server is running on port 3000");
  setInterval(() => {
        xmain()
    }, 3 * 1000 * 60)

    xmain()
});