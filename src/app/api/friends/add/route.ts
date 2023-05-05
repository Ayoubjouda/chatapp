import { redis } from "@/lib/redis";
import { fetchRedis } from "@/app/helpers/redisHelper";
import { authOptions } from "@/lib/auth";
import { addFriendValidator } from "@/lib/validators/add-Firend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    // check if user exists
    const idToAdd = (await fetchRedis("get", `user:email:${emailToAdd}`)) as string;
    if (!idToAdd) return new Response("This person does not exist", { status: 400 });

    const session = await getServerSession(authOptions);

    if (!session) throw new Error("Not Authorized");

    // check if user is trying to add himself
    if (idToAdd === session.user.id) return new Response("You can not add yourself");

    // check if user already sent a request to this person

    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;
    if (isAlreadyAdded)
      return new Response("You already sent a request to this person", { status: 400 });
    // check if user already added this person
    const isAlreadyFriends = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      session.user.id
    )) as 0 | 1;

    if (isAlreadyAdded) return new Response("You already Friends with this user", { status: 400 });

    // if valid send friend request

    redis.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    return new Response("Friend request sent successfully");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response("Invalid request payload", { status: 422 });
  }
  return new Response("Invalid request", { status: 400 });
}
