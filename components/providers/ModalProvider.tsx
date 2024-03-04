"use client";

import {useEffect, useState} from "react";
import CreateServerModal from "../modal/CreateServerModal";
import InviteModal from "../modal/InviteModal";

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
    </>
  );
}
