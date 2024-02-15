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
import { Lock, Plus, Scroll, UsersRound } from "lucide-react";
import { Button } from "../ui/button";
import { v4 } from "uuid";
import { addCollaborators, createWorkspace } from "@/lib/supabase/queries";
import CollaboratorSearch from "./collaborator-search";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { useToast } from "../ui/use-toast";

const WorkspaceCreator = () => {
  const { toast } = useToast();
  const { user } = useSupabaseUser();
  const router = useRouter();
  const [permissions, setPermissions] = useState("private");
  const [title, setTitle] = useState("");
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addCollaborator = (user: User) => {
    setCollaborators([...collaborators, user]);
  };

  const removeCollaborator = (user: User) => {
    setCollaborators(collaborators.filter((c) => c.id !== user.id));
  };

  const createItem = async () => {
    setIsLoading(true);
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
        await createWorkspace(newWorkspace);
        toast({title: "Success", description: "Created Workspace"})
        router.refresh();
      }
      if (permissions === "shared") {
        await createWorkspace(newWorkspace);
        await addCollaborators(collaborators, uuid);
        router.refresh();
      }
    }
    setIsLoading(false);
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
      {permissions === "shared" && (
        <div>
          <CollaboratorSearch
            existingCollaborators={collaborators}
            getCollaborator={(user) => {
              addCollaborator(user);
            }}
          >
            <Button type="button">
              <Plus />
              Add Collaborators
            </Button>
          </CollaboratorSearch>
          <div className=" mt-4">
            <span className=" text-sm text-muted-foreground">
              Collabortors {collaborators.length || "0"}
            </span>
            <ScrollArea
              className=" 
            h-[120px] overflow-scroll w-full rounded-md border
            border-muted-forground/20"
            >
              {collaborators.length ? (
                collaborators.map((c) => (
                  <div
                    key={c.id}
                    className=" p-4 flex justify-between items-center"
                  >
                    <div className=" flex gap-4 items-center">
                      <Avatar>
                        <AvatarImage src="/avatars/7.png"></AvatarImage>
                        <AvatarFallback>PJ</AvatarFallback>
                      </Avatar>
                      <div
                        className=" 
                        text-sm gap-2 text-muted-foreground 
                        overflow-hidden overflow-ellipsis
                        sm:w-[300px] w-[140px]"
                      >
                        {c.email}
                      </div>
                    </div>
                    <Button
                      variant={"secondary"}
                      onClick={() => removeCollaborator(c)}
                    >
                      
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <div
                  className=" 
                absolute right-0 left-0 top-0 bottom-0 
                flex justify-center items-center"
                >
                  <span className=" text-muted-foreground text-sm ">
                    You have no friends witch, go get some friends
                  </span>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      )}
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
