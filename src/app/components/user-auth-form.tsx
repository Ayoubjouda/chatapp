"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Icons } from "@components/ui/icons";

import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function loginWithGoogle(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const cred = await signIn("google");
    } catch (error) {
      toast.error("Something went wrong with your Google login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Button variant="outline" type="button" disabled={isLoading} onClick={loginWithGoogle}>
        {isLoading ? (
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        ) : (
          <Icons.google className="w-5 h-5 mr-2" />
        )}{" "}
        Sign in with Google
      </Button>
    </div>
  );
}
