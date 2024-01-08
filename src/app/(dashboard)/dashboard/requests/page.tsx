import FriendRequests from "@components/FriendRequests";
import { fetchRedis } from "@/app/helpers/redisHelper";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { Skeleton } from "@components/ui/skeleton";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  // ids of people who sent current logged in user a friend requests
  const incomingSenderIds = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await fetchRedis("get", `user:${senderId}`)) as string;
      const senderParsed = JSON.parse(sender) as User;

      return {
        senderId,
        senderEmail: senderParsed.email,
        senderName: senderParsed.name,
        senderAvatar: senderParsed.image,
      };
    })
  );

  return (
    <main className="pt-1">
      <div className="flex flex-col gap-4">
        <div className="min-h-[90vh]">
          <CardHeader>
            <CardTitle>Friends Requets</CardTitle>
            <CardDescription>
              You can see your friends requests below , accepting requets will allow you to chat
              with them
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FriendRequests
              incomingFriendRequests={incomingFriendRequests}
              sessionId={session.user.id}
            />
            {/* // loader */}
            {/* <div className="flex items-center space-x-4">
              <Skeleton className="w-16 h-12 rounded-full" />
              <div className="w-full space-y-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="w-[100px] h-10" />
                <Skeleton className="w-[100px] h-10" />
              </div>
            </div> */}
          </CardContent>
        </div>
      </div>
    </main>
  );
};

export default page;
