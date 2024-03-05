import {currentUser} from "@/lib/current-user";
import {db} from "@/lib/db";
import {ChannelType} from "@prisma/client";
import {redirect} from "next/navigation";
import ServerHeader from "./ServerHeader";

interface ServerSidebarProps {
  serverId: string;
}

export default async function ServerSidebar({serverId}: ServerSidebarProps) {
  const profile = await currentUser();
  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {id: serverId},
    include: {
      channels: {
        orderBy: {
          createdAt: "desc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = server?.members.find(
    (member) => member.profileId !== profile.id
  );

  if (!server) return redirect("/");
  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
    </div>
  );
}
