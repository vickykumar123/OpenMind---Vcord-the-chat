import {Server as NetServer, Socket} from "net";
import {NextApiResponse} from "next";
import {Server as SocketIOServer} from "socket.io";

import {Server, Member, Profile} from "@prisma/client";

export type ProfileWithoutName = Omit<Profile, "name" | "email">;

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & {profile: ProfileWithoutName})[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
