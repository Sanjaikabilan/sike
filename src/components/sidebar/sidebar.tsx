import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { cookies } from "next/headers";
import { getFolders, getUserSubscriptionStatus } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";

interface SidebarProps {
  params: { workspaceId: string };
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = async ({ params, className }) => {
  const supabase = createServerComponentClient({ cookies });
  //user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  //subscription_status
  const { data: subscription, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  //folders
  const { data: workspaceFolderData, error: foldersError } = await getFolders(
    params.workspaceId
  );

  //errors

  if (subscriptionError || foldersError) redirect("/dashboard");

  //get all the different workspaces => private, collaborated, shared
  return <div>Sidebar</div>;
};

export default Sidebar;
