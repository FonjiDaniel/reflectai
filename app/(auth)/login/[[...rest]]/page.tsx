import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};



import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";




export default async function LoginPage() {

  const { userId } = await auth();
  if (userId) {
    redirect("/home");
  }
  return (
    <div className="flex justify-center items-center min-h-screen">

      <SignIn />
    </div>


  );
}