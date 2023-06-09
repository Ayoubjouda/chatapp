import { fetchRedis } from "@/app/helpers/redisHelper";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { redis } from "@/lib/redis";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);
    //check if user is logged in
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    //verify both users are not already friends

    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriends) {
      return new Response("Already Friends", { status: 400 });
    }

    // verify that the user has a friend request from the user they are trying to accept
    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );

    if (!hasFriendRequest) {
      return new Response("No Friend Request", { status: 400 });
    }

    const [userRaw, friendRaw] = (await Promise.all([
      fetchRedis("get", `user:${session.user.id}`),
      fetchRedis("get", `user:${idToAdd}`),
    ])) as [string, string];

    const user = JSON.parse(userRaw) as User;
    const friend = JSON.parse(friendRaw) as User;

    // notify added user

    await Promise.all([
      pusherServer.trigger(toPusherKey(`user:${idToAdd}:friends`), "new_friend", user),
      pusherServer.trigger(toPusherKey(`user:${session.user.id}:friends`), "new_friend", friend),
    ]);
    // if all okey we add the usertoadd to the friends list of the user
    await redis.sadd(`user:${session.user.id}:friends`, idToAdd);
    // and we add the user to add to the friends list of the user
    await redis.sadd(`user:${idToAdd}:friends`, session.user.id);

    // we remove the friend request from the user
    await redis.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);

    return new Response("Friend Added", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("invalid Request Payload", { status: 422 });
    }
    return new Response("Invalid Request", { status: 400 });
  }
}
