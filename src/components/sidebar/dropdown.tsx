"use client";
import { useAppState } from "@/lib/providers/state-provider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { AccordionItem, AccordionTrigger } from "../ui/accordion";
import clsx from "clsx";
import EmojiPicker from "../global/emoji-picker";

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
  const supabase = createClientComponentClient();
  const { state, dispatch, workspaceId, folderId } = useAppState();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // folder Title synced with server and local data

  // const folderTitle =

  // fileTitle

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

  // blur

  // onchanges

  const onchangeEmoji =async (selectedEmoji: string) => {
    if (listType === 'folder') {
      // dispatch({})
      
      
    }
    
  }

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
            </div>
          </div>
        </div>
      </AccordionTrigger>
    </AccordionItem>
  );
};

export default Dropdown;
