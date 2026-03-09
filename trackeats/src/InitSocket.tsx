"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getSocket } from "@/lib/socket";

function InitSocket() {
  const userId = useSelector((state: RootState) => state.user.userData?._id);
  const lastIdentifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    const socket = getSocket();

    const identifyIfPossible = () => {
      if (!userId) return;
      if (lastIdentifiedUserId.current === userId) return;
      lastIdentifiedUserId.current = userId;
      socket.emit("identify", userId);
    };

    if (socket.connected) identifyIfPossible();

    socket.on("connect", identifyIfPossible);
    socket.on("reconnect", identifyIfPossible);
    socket.on("connect_error", (err: any) => {
      console.error("socket connect_error:", err?.message ?? err);
      console.error("Error details:", {
        type: err?.type,
        description: err?.description,
        context: err?.context,
      });
    });

    return () => {
      socket.off("connect", identifyIfPossible);
      socket.off("reconnect", identifyIfPossible);
      socket.off("connect_error");
    };
  }, [userId]);

  return null;
}

export default InitSocket;
