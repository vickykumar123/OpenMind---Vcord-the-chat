import {Server} from "@prisma/client";
import {create} from "zustand";
export type ModelType = "createServer" | "invite";

interface ModalData {
  server?: Server;
}

interface ModelStore {
  type: ModelType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModelType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModelStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({isOpen: true, type, data}),
  onClose: () => {
    set({type: null, isOpen: false});
  },
}));