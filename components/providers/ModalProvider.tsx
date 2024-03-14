"use client";

import {memo, useEffect, useState} from "react";
import InviteModal from "../modals/InviteModal";
import EditServerModal from "../modals/EditServerModal";
import MembersModal from "../modals/MembersModal";
import CreateChannelModal from "../modals/CreateChannelModal";

import LeaveServerModal from "../modals/LeaveServerModal";
import DeleteServerModal from "../modals/DeleteServerModal";
import DeleteChannel from "../modals/DeleteChannelModal";
import EditChannelModal from "../modals/EditChannelModal";
import MessageAttachment from "../modals/MessageAttachment";
import DeleteMessage from "../modals/DeleteMessage";
import CreateServerModal from "../modals/CreateServerModal";

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
