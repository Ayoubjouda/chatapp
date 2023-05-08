"use client";
import { FC, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({ incomingFriendRequests, sessionId }) => {
  const [friendRequests, setFriendRequests] =
    useState<IncomingFriendRequest[]>(incomingFriendRequests);

  const router = useRouter();

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`));
    console.log("listening to ", `user:${sessionId}:incoming_friend_requests`);

    const friendRequestHandler = ({
      senderId,
      senderEmail,
      senderAvatar,
      senderName,
    }: IncomingFriendRequest) => {
      console.log("function got called");
      setFriendRequests((prev) => [{ senderId, senderEmail, senderAvatar, senderName }]);
    };

    pusherClient.bind("incoming_friend_requests", friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`));
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    };
  }, [sessionId]);

  const acceptFriend = async (senderId: string) => {
    await axios.post("/api/friends/accept", { id: senderId });

    setFriendRequests((prev) => prev.filter((request) => request.senderId !== senderId));

    router.refresh();
  };
  const denyFriend = async (senderId: string) => {
    await axios.post("/api/friends/deny", { id: senderId });

    setFriendRequests((prev) => prev.filter((request) => request.senderId !== senderId));

    router.refresh();
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <p>Nothing to show here</p>
      ) : (
        friendRequests.map((friendRequest) => (
          <div key={friendRequest.senderId} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={friendRequest.senderAvatar} />
                <AvatarFallback>{friendRequest.senderName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{friendRequest.senderName}</p>
                <p className="text-sm text-muted-foreground">{friendRequest.senderEmail}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => acceptFriend(friendRequest.senderId)}>Accept</Button>
              <Button onClick={() => denyFriend(friendRequest.senderId)} variant="secondary">
                Decline
              </Button>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
