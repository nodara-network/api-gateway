import { Request, Response, Router } from "express";
import { prismaClient } from "..";
import { redis } from "../cache/redis";
import { uptimeRequest } from "../zod/requestTypes";

const uptimeRouter: Router = Router();

uptimeRouter.post("/", async (req: Request, res: Response) => {
  const body = req.body;
  const { txnId, creatorWallet, url, rewardLamports, maxResponses } = uptimeRequest.parse(body);
  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  const newTask = await prismaClient.task.create({
    data: {
      onchainId: txnId,
      creatorWallet,
      url,
      rewardLamports: BigInt(rewardLamports),
      maxResponses,
      status: "pending",
    },
  });

  if (!newTask) {
    return res.status(500).json({ message: "Failed to create task" });
  }

  // Store task details in Redis for quick access
  const redisKey = `task:${newTask.id}`;
  const taskForRedis = {
    id: newTask.id,
    url: newTask.url,
    status: newTask.status,
    rewardLamports: newTask.rewardLamports.toString(),
    maxResponses: newTask.maxResponses,
    createdAt: newTask.createdAt.toISOString(),
  };

  await redis.set(redisKey, JSON.stringify(taskForRedis));

  // Push to job queue for Job Scheduler to pick up
  await redis.lpush(process.env.REDIS_JOB_QUEUE ?? "job_queue", JSON.stringify({
    taskId: newTask.id,
    type: "uptime_check",
    priority: "normal",
    createdAt: new Date().toISOString()
  }));

  res.status(200).json({ taskId: newTask.id, message: "Task created successfully" });
});

export default uptimeRouter;