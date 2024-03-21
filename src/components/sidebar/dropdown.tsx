"use client";
import { useAppState } from "@/lib/providers/state-provider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { AccordionItem, AccordionTrigger } from "../ui/accordion";
import clsx from "clsx";
import EmojiPicker from "../global/emoji-picker";
import { updateFolder } from "@/lib/supabase/queries";
import { useToast } from "../ui/use-toast";
import { set } from "zod";

interface DropdownProps {
  title: string;
  id: string;
  listType: "folder" | "file";
  iconId: string;
  children?: React.ReactNode;
  disabled?: Boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  children,
  title,
  id,
  listType,
  iconId,
  disabled,
}) => {
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const { state, dispatch, workspaceId, folderId } = useAppState();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // folder Title synced with server and local data

  const folderTitle: string | undefined = useMemo(() => {
    if (listType === "folder") {
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === id)?.title;
      if (title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [state, listType, workspaceId, id, title]);

  // fileTitle

  const fileTitle: string | undefined = useMemo(() => {
    if (listType === "file") {
      const fileAndFolderId = id.split("folder");
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === fileAndFolderId[0])
        ?.files.find((file) => file.id === fileAndFolderId[1])?.title;

      if (title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [state, listType, workspaceId, id, title]);

  // Navigation function to different pages
  const navigatePage = (accordionId: string, type: string) => {
    if (type === "folder") {
      router.push(`/dashboard/${workspaceId}/${accordionId}`);
    }
    if (type === "file") {
      router.push(`/dashboard/${workspaceId}/${folderId}/${accordionId}`);
    }
  };

  // Add a file

  // double click handler

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  // blur

  const handleBlur = async () => {
    setIsEditing(false);
    const fId = id.split("folder");
    if (fId?.length === 1) {
      if (!folderTitle) return;
      await updateFolder({ title }, fId[0]);
    }
    if (fId?.length === 2 && fId[1]) {
      if (!fileTitle) return;
      // wip updatefile
    }
  };

  // onchanges

  const onchangeEmoji = async (selectedEmoji: string) => {
    if (!workspaceId) return;
    if (listType === "folder") {
      dispatch({
        type: "UPDATE_FOLDER",
        payload: {
          workspaceId,
          folderId: id,
          folder: { iconId: selectedEmoji },
        },
      });
      const { data, error } = await updateFolder({ iconId: selectedEmoji }, id);
      if (error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Could not update folder icon",
        });
      } else {
        toast({
          title: "Success",
          description: "Folder icon updated",
        });
      }
    }
  };

  // emoji change

  // move to trash

  const isFolder = listType === "folder";
  const groupIdentifies = clsx(
    " dark:text-white whitespace-nowrap flex justify-between items-center w-full relative",
    {
      "group/folder": isFolder,
      "group/file": !isFolder,
    }
  );

  const listStyles = useMemo(
    () =>
      clsx(" relative", {
        "border-none": isFolder,
        "border-none ml-6 text-[16px] py-1": !isFolder,
      }),
    [isFolder]
  );

  return (
    <AccordionItem
      value={id}
      className={listStyles}
      onClick={(e) => {
        // stop propagation
        e.stopPropagation();
        navigatePage(id, listType);
      }}
    >
      <AccordionTrigger
        id={listType}
        className=" hover:no-underline p-2 dark:text-muted-foreground text-sm"
        disabled={listType === "file"}
      >
        <div className={groupIdentifies}>
          <div className=" flex gap-4 items-center justify-center overflow-hidden ">
            <div className=" relative ">
              <EmojiPicker getValue={onchangeEmoji}>{iconId}</EmojiPicker>
              <input
                type="text"
                value={listType === "folder" ? "" : ""}
                className={`outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7 ${
                  isEditing
                    ? "bg-muted cursor-text"
                    : "bg-transparent cursor-pointer"
                }`}
                readOnly={!isEditing}
                onDoubleClick={handleDoubleClick}
                onBlur={handleBlur}
                // onChange={listType==='folder' ? "" : ""}
              ></input>
            </div>
          </div>
        </div>
      </AccordionTrigger>
    </AccordionItem>
  );
};

export default Dropdown;
