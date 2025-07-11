import { z } from "zod";

export const uptimeRequest = z.object({
  txnId: z.string(),
  url: z.string(),
  creatorWallet: z.string(),
  rewardLamports: z.string(),
  maxResponses: z.number(),
});