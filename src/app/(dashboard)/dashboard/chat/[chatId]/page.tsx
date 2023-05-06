import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";
import { Icons, Icon } from "@components/ui/icons";
import { MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { fetchRedis } from "@/app/helpers/redisHelper";
import { authOptions } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { messageArrayValidator } from "@/lib/validators/messages";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { Separator } from "@components/ui/separator";
import { Button } from "@/app/components/ui/button";
import Messages from "@/app/components/messages";
import ChatInput from "@/app/components/ChatInput";
interface pageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const result: string[] = await fetchRedis("zrange", `chat:${chatId}:messages`, 0, -1);

    const dMessages = result.map((message) => JSON.parse(message) as Message);
    const reversedMessages = dMessages.reverse();
    const messages = messageArrayValidator.parse(reversedMessages);
    return messages as Message[];
  } catch (error) {
    notFound();
  }
}

const page = async ({ params }: pageProps) => {
  const { chatId } = params;

  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;
  //split the chatId into two user ids that are in the chat
  const [userId1, userId2] = chatId.split("--");

  //if the current user is not one of the users in the chat, return 404
  if (user.id !== userId1 && user.id !== userId2) notFound();

  //chatPartnerId is the id of the user that is not the current user
  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartner = (await redis.get(`user:${chatPartnerId}`)) as User;
  const initialMessages = await getChatMessages(chatId);
  console.log(initialMessages);
  const [partnerFirstName, partnterLastname] = chatPartner.name.split(" ");
  const chatPartnerName = `${partnerFirstName[0]} ${partnterLastname[0]}`.toUpperCase();

  return (
    <div className="flex-1">
      <Card className="min-h-[calc(100vh-1rem)] flex-1 justify-between flex flex-col h-full  ">
        <CardHeader className="py-3">
          <div key={chatPartner.id} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={chatPartner.image} />

                <AvatarFallback children={chatPartnerName} />
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{chatPartner.name}</p>
                <p className="text-sm text-muted-foreground">{chatPartner.email}</p>
              </div>
            </div>
            <Button variant="ghost">
              <MoreVertical />
            </Button>
          </div>
          <Separator />
        </CardHeader>

        <CardContent className="flex-col w-full h-full">
          <Messages
            sessionId={session.user.id}
            sessionImg={session.user.image}
            initialMessages={initialMessages}
            chatPartner={chatPartner}
          />
          <div className="flex flex-col flex-grow w-full bg-black"></div>
          <ChatInput chatPartner={chatPartner} chatId={chatId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
