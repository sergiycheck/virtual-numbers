import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  transactionType: z.string(),
  transactionFlow: z.string(),
  sum: z.number(),
  paymentIntentId: z.string(),
  fromUserId: z.string().uuid().nullable(),
  toUserId: z.string().uuid(),
  amountInUSD: z.number(),
});

export type Transaction = z.infer<typeof transactionSchema>;
