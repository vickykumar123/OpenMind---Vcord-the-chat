import {Hash, Mic, ShieldAlert, ShieldCheck, Video} from "lucide-react";
import {redirect} from "next/navigation";
import {ChannelType} from "@prisma/client";

import {currentUser} from "@/lib/current-user";
import {db} from "@/lib/db";
import ServerHeader from "./ServerHeader";
import {ScrollArea} from "../ui/scroll-area";
import ServerSearch from "./ServerSearch";
import {Separator} from "../ui/separator";
import ServerSection from "./ServerSection";
import ServerChannel from "./ServerChannel";
import ServerMember from "./ServerMember";
import {Suspense} from "react";
import SkeletonLoader from "../../app/(main)/(routes)/loading";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

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
          profile: {
            select: {
              id: true,
              name: false,
              imageUrl: true,
              email: false,
              anon_name: true,
              createdAt: true,
              updatedAt: true,
              servers: true,
              members: true,
              channels: true,
              userId: true,
              _count: true,
            },
          },
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
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  if (!server) return redirect("/");
  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader server={server} role={role} />
        <ScrollArea className="flex-1 px-3">
          <div className="mt-2">
            <ServerSearch
              data={[
                {
                  label: "Text Channels",
                  type: "channel",
                  data: textChannels?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Voice Channels",
                  type: "channel",
                  data: audioChannels?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Video Channels",
                  type: "channel",
                  data: videoChannels?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Members",
                  type: "member",
                  data: members?.map((member) => ({
                    id: member.id,
                    name: member.profile.anon_name,
                    icon: roleIconMap[member.role],
                  })),
                },
              ]}
            />
          </div>
          <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
          {!!textChannels?.length && (
            <div className="mb-2">
              <ServerSection
                label="Text Channels"
                role={role}
                sectionType="channels"
                channelType={ChannelType.TEXT}
              />
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          )}

          {!!audioChannels?.length && (
            <div className="mb-2">
              <ServerSection
                label="Voice Channels"
                role={role}
                sectionType="channels"
                channelType={ChannelType.AUDIO}
              />
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          )}

          {!!videoChannels?.length && (
            <div className="mb-2">
              <ServerSection
                label="Video Channels"
                role={role}
                sectionType="channels"
                channelType={ChannelType.VIDEO}
              />
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          )}

          {!!members?.length && (
            <div className="mb-2">
              <ServerSection
                label="Members"
                role={role}
                sectionType="members"
                server={server}
              />
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </Suspense>
  );
}
