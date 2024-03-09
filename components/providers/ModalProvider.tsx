"use client";

import {useEffect, useState} from "react";
import CreateServerModal from "../modal/CreateServerModal";
import InviteModal from "../modal/InviteModal";
import EditServerModal from "../modal/EditServerModal";
import MembersModal from "../modal/MembersModal";
import CreateChannelModal from "../modal/CreateChannelModal";
import LeaveServer from "../modal/LeaveServerModal";
import LeaveServerModal from "../modal/LeaveServerModal";
import DeleteServerModal from "../modal/DeleteServerModal";
import DeleteChannel from "../modal/DeleteChannelModal";
import EditChannelModal from "../modal/EditChannelModal";

export function ModalProvider() {
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
    </>
  );
}
