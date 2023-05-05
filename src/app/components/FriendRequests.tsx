"use client";
import { FC, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import axios from "axios";
import { useRouter } from "next/navigation";
interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({ incomingFriendRequests }) => {
  const [friendRequests, setFriendRequests] =
    useState<IncomingFriendRequest[]>(incomingFriendRequests);

  const router = useRouter();

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
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{friendRequest.senderName}</p>
                <p className="text-sm text-muted-foreground">{friendRequest.senderEmail}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => acceptFriend(friendRequest.senderId)}>Accept</Button>
              <Button onClick={() => acceptFriend(friendRequest.senderId)} variant="secondary">
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
