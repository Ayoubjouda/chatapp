import { chatHrefConstructor, cn } from "@/lib/utils";
import Image from "next/image";
import { FC } from "react";
import { toast, type Toast } from "react-hot-toast";

interface UnseenChatToastProps {
  t: Toast;
  sessionId: string;
  senderId: string;
  senderImg: string;
  senderName: string;
  senderMessage: string;
}

const UnseenChatToast: FC<UnseenChatToastProps> = ({
  t,
  senderId,
  sessionId,
  senderImg,
  senderName,
  senderMessage,
}) => {
  return (
    <div
      className={cn(
        "max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5",
        { "animate-enter": t.visible, "animate-leave": !t.visible }
      )}
    >
      <a
        onClick={() => toast.dismiss(t.id)}
        href={`/dashboard/chat/${chatHrefConstructor(sessionId, senderId)}`}
        className="flex-1 w-0 p-4"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <div className="relative w-10 h-10">
              <Image
                fill
                referrerPolicy="no-referrer"
                className="rounded-full"
                src={senderImg}
                alt={`${senderName} profile picture`}
              />
            </div>
          </div>

          <div className="flex-1 ml-3">
            <p className="text-sm font-medium text-gray-900">{senderName}</p>
            <p className="mt-1 text-sm text-gray-500">{senderMessage}</p>
          </div>
        </div>
      </a>

      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex items-center justify-center w-full p-4 text-sm font-medium text-black border border-transparent rounded-none rounded-r-lg hover:text-black focus:outline-none focus:ring-2 focus:ring-black"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UnseenChatToast;
