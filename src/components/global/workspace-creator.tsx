"use client";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { User, workspace } from "@/lib/supabase/supabase.types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Lock, UsersRound } from "lucide-react";
import { Button } from "../ui/button";
import { v4 } from "uuid";
import { createWorkspace } from "@/lib/supabase/queries";

const WorkspaceCreator = () => {
  const { user } = useSupabaseUser();
  const router = useRouter();
  const [permissions, setPermissions] = useState("private");
  const [title, setTitle] = useState("");
  const [collaborators, setCollaborators] = useState<User[]>([]);

  const addCollaborator = (user: User) => {
    setCollaborators([...collaborators, user]);
  };

  const removeCollaborator = (user: User) => {
    setCollaborators(collaborators.filter((c) => c.id !== user.id));
  };

  const createItem = async () => {
    const uuid = v4();
    if (user?.id) {
      const newWorkspace: workspace = {
        data: null,
        createdAt: new Date().toISOString(),
        iconId: "✨",
        id: uuid,
        inTrash: "",
        title,
        workspaceOwner: "",
        logo: null,
        bannerUrl: "",
      };
    if (permissions === "private") {
      await createWorkspace (newWorkspace);
      router.refresh();
    }
    if (permissions === "shared") {
      await createWorkspace(newWorkspace);
      await addCollaborator(collaborators, uuid)
      
      
    }
    }
  };

  return (
    <div className=" flex gap-4 flex-col">
      <div>
        <Label htmlFor="name" className="text-sm text-muted-foreground ">
          Name
        </Label>
        <div className=" flex justify-center items-center gap-2 ">
          <Input
            className=""
            name="name"
            value={title}
            placeholder="Workspace Name"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          ></Input>
        </div>
      </div>
      <>
        <Label htmlFor="permissions" className="text-sm text-muted-foreground">
          Permissions
        </Label>
        <Select
          onValueChange={(val) => {
            setPermissions(val);
          }}
          defaultValue={permissions}
        >
          <SelectTrigger className=" w-full h-26 -mt-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="private">
                <div className=" p-2 flex gap-4 justify-center items-center ">
                  <Lock />
                  <article className=" text-left flex flex-col">
                    <span>Private</span>
                    <p className=" text-muted-foreground">
                      {" "}
                      Workspace, keep stuffs, write stuffs, and everything and
                      everyone who you choose only be there
                    </p>
                  </article>
                </div>
              </SelectItem>
              <SelectItem value="shared">
                <div className=" p-2 flex gap-4 justify-center items-center ">
                  <UsersRound />
                  <article className=" text-left flex flex-col">
                    <span>Shared</span>
                    <p className=" text-muted-foreground">
                      {" "}
                      Workspace thats shared with you, keep stuffs, write
                      stuffs, and invite peoples
                    </p>
                  </article>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </>
      {permissions === "shared" && <div></div>}
      <Button
        type="button"
        disabled={
          !title || (permissions === "shared" && collaborators.length === 0)
        }
        variant={"secondary"}
        onClick={createItem}
      >
        Create
      </Button>
    </div>
  );
};

export default WorkspaceCreator;