import { FC } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import { Button } from "./components/ui/button";
import { redis } from "@/lib/redis";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

interface pageProps {}

export default async function Home({}) {
  redirect("/login");
  return;
}
