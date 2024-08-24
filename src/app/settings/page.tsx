import UserNameForm from "@/components/UserNameForm";
import { authOptions, getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = { title: "Settings" };

const page = async () => {
  const session = await getAuthSession();

  if (!session?.user) redirect(authOptions?.pages?.signIn || "/sign-in");

  return (
    <div className="max-w-4xl mx-auto py-12 flex flex-col gap-6">
      {/* <div className="grid items-start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl">Update Username</h1>
      </div> */}
      <div className="grid gap-10">
        <UserNameForm
          user={{
            username: session?.user.username || "",
            id: session?.user.id || "",
          }}
        />
      </div>
    </div>
  );
};

export default page;
