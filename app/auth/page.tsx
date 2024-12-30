import React from "react";
import AuthForm from "./components/AuthForm";
import { readUserSession } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function page() {
  const { data: userSession } = await readUserSession();

  if (userSession.session) {
    return redirect("/dashboard");
  }
  return (
    <div>
      <AuthForm />
    </div>
  );
}
