"use client";
import { FC, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { addFriendValidator } from "@/lib/validators/add-Firend";
import axios, { AxiosError } from "axios";
import { ZodError, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddFriendFormProps {}

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendForm: FC<AddFriendFormProps> = ({}) => {
  const [showSuccessState, setshowSuccessState] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });
  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email });
      await axios.post("api/friends/add", { email: validatedEmail });
      setshowSuccessState(true);
    } catch (error) {
      if (error instanceof ZodError) {
        setError("email", { message: error.message });
        return;
      }
      if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data });

        return;
      }
      setError("email", { message: "Something went wrong" });
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email-2">Add Friend by Email</Label>
        <div className="flex gap-1">
          <Input {...register("email")} type="email" id="email-2" placeholder="Email" />

          <Button type="submit">Add</Button>
        </div>
        <p className="text-sm text-red-600 ">{errors.email?.message}</p>
        {showSuccessState ? <p className="text-sm text-green-600 ">Friend request sent!</p> : null}
      </div>
    </form>
  );
};

export default AddFriendForm;
