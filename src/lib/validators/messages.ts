import { z } from "zod";

export const messagesSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  text: z.string(),
  timestamp: z.number(),
});

export const messageArrayValidator = z.array(messagesSchema);
export type Message = z.infer<typeof messagesSchema>;
