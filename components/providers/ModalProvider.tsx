"use client";

import {useEffect, useState} from "react";
import CreateServerModal from "../modal/CreateServerModal";
import InviteModal from "../modal/InviteModal";
import EditServerModal from "../modal/EditServerModal";
import MembersModal from "../modal/MembersModal";
import CreateChannelModal from "../modal/CreateChannelModal";

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
    </>
  );
}
