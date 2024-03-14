"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import {Button} from "../ui/button";

import {useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
import {useModal} from "hooks/useModelStore";

export default function DeleteServerModal() {
  const {isOpen, onClose, type, data} = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isModalOpen = isOpen && type === "deleteServer";
  const {server} = data;

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/server/${server?.id}`);

      onClose();
      router.refresh();
      window.location.reload();
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure, You want to delete{" "}
            <span className="text-black font-bold">
              &quot;{server?.name}&quot;
            </span>{" "}
            for permanently ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 bg-gray-100 py-4 ">
          <div className="flex items-center justify-between w-full">
            <Button onClick={onClose} disabled={isLoading} variant="ghost">
              Cancel
            </Button>
            <Button
              onClick={onDelete}
              variant="destructive"
              disabled={isLoading}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
