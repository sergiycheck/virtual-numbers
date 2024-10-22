import { z } from "zod";

export const MessageSchema = z.object({
  content: z.string(),
  sender: z.string(),
  receivedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format. Must be ISO string.",
  }),
  receiver: z.string(),
  modemId: z.string(),
  gatewayId: z.string(),
  metadata: z.object({
    userId: z.string(),
  }),
  clientId: z.string(),
  id: z.string(),
  isWrongService: z.boolean(),
  service: z.number(),
});

export type Message = z.infer<typeof MessageSchema>;
