import PusherClient from "pusher-js";
import PusherServer from "pusher";

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_APP_KEY!,
  secret: process.env.PUSHER_APP_SECRET!,
  cluster: "eu",
  useTLS: true,
});

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_APP_KEY!, {
  cluster: "eu",
});
