"use client";

import {memo, useEffect, useState} from "react";
import CreateServerModal from "@/components/modal/CreateServerModal";
import InviteModal from "../modal/InviteModal";
import EditServerModal from "../modal/EditServerModal";
import MembersModal from "../modal/MembersModal";
import CreateChannelModal from "../modal/CreateChannelModal";

import LeaveServerModal from "../modal/LeaveServerModal";
import DeleteServerModal from "../modal/DeleteServerModal";
import DeleteChannel from "../modal/DeleteChannelModal";
import EditChannelModal from "../modal/EditChannelModal";
import MessageAttachment from "../modal/MessageAttachment";
import DeleteMessage from "../modal/DeleteMessage";

export const ModalProvider = memo(() => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannel />
      <EditChannelModal />
      <MessageAttachment />
      <DeleteMessage />
    </>
  );
});

ModalProvider.displayName = "Child";
