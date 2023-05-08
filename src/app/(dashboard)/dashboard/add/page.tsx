import AddFriendForm from "@/app/components/AddFriendForm";
import { FC } from "react";

interface pageProps {}

const page = async ({}) => {
  return (
    <div className="mt-14 md:hidden ">
      <AddFriendForm />
    </div>
  );
};

export default page;
