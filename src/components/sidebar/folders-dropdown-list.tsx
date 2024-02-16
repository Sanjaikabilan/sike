"use client";
import { useAppState } from "@/lib/providers/state-provider";
import { Folder } from "@/lib/supabase/supabase.types";
import React, { useEffect, useState } from "react";

interface FoldersDropDownListProps {
  workspaceFolders: Folder[];
  workspaceId: string;
}

const FoldersDropDownList: React.FC<FoldersDropDownListProps> = ({
  workspaceFolders,
  workspaceId,
}) => {
  // wip local state folders
  // wip set realtime updates
  const { state, dispatch } = useAppState();
  const [folders, setFolders] = useState();

  // effect set initial state server app state
  useEffect(() => {
    if (workspaceFolders.length > 0) {
      dispatch({
        type: "SET_FOLDERS",
        payload : {
          workspaceId,
          folders: workspaceFolders.map((folder) => ({
            ...folder,
            files: state.workspaces.find(
              (workspace) => workspace.id === workspaceId
            )?.folders.find(f => f.id === folder.id)?.files || [],
          })),
        },
      });
    }
  }, [workspaceFolders, workspaceId]);
  // state

  

  //add folder function

  return <div>FoldersDropDownList</div>;
};

export default FoldersDropDownList;
