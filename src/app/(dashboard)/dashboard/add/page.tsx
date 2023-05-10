import AddFriendForm from "@/app/components/AddFriendForm";
import { FC } from "react";

interface pageProps {}

const page = async ({}) => {
  return (
    <div className="mx-4 mt-14">
      <AddFriendForm />
    </div>
  );
};

export default page;
