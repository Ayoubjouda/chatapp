import { FC } from "react";
import { Loader2 } from "lucide-react";

interface LoadingProps {}

const Loading: FC<LoadingProps> = ({}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <Loader2 className="w-20 h-20 mr-10 text-black animate-spin" />
    </div>
  );
};

export default Loading;
