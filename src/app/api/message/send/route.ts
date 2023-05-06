import { fetchRedis } from "@/app/helpers/redisHelper";
import { authOptions } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { messageValidator, Message } from "@/lib/validators/messages";
import { ZodError } from "zod";
export async function POST(req: Request) {
  try {
    const { text, chatId } = await req.json();
    const session = await getServerSession(authOptions);
    //check if user is logged in

    if (!session) throw new Response("Unauthorized", { status: 401 });

    // get the usersIds from the chatId
    const [userId1, userId2] = chatId.split("--");

    //check if the user is part of the chat
    if (session.user.id !== userId1 && session.user.id !== userId2)
      throw new Response("Unauthorized", { status: 401 });

    //get the friendId
    const friendId = session.user.id === userId1 ? userId2 : userId1;

    const friendList = (await fetchRedis(
      "smembers",
      `user:${session.user.id}:friends`
    )) as string[];

    //check if the user is friend with the other user

    const isFriend = friendList.includes(friendId);
    if (!isFriend) throw new Response("Unauthorized", { status: 401 });

    const rawSender = (await fetchRedis("get", `user:${session.user.id}`)) as string;
    const sender = JSON.parse(rawSender) as User;

    const timestamp = Date.now();

    const MessageData: Message = {
      id: nanoid(),
      text,
      senderId: session.user.id,
      timestamp,
    };
    //check if the message is valid
    const message = messageValidator.parse(MessageData);

    //add the message to the db
    redis.zadd(`chat:${chatId}:messages`, { score: timestamp, member: JSON.stringify(message) });

    return new Response("message sent Successfuly", { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response("invalid Message Format", { status: 422 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
