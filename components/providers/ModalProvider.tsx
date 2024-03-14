"use client";

import {memo, useEffect, useState} from "react";
import CreateServerModal from "@/components/modal/CreateServerModal";
import InviteModal from "@/components/modal/InviteModal";
import EditServerModal from "@/components/modal/EditServerModal";
import MembersModal from "@/components/modal/MembersModal";
import CreateChannelModal from "@/components/modal/CreateChannelModal";

import LeaveServerModal from "@/components/modal/LeaveServerModal";
import DeleteServerModal from "@/components/modal/DeleteServerModal";
import DeleteChannel from "@/components/modal/DeleteChannelModal";
import EditChannelModal from "@/components/modal/EditChannelModal";
import MessageAttachment from "@/components/modal/MessageAttachment";
import DeleteMessage from "@/components/modal/DeleteMessage";

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
