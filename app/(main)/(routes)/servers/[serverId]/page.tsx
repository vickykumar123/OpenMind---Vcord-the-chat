import {currentUser} from "@/lib/current-user";
import {db} from "@/lib/db";
import {redirectToSignIn} from "@clerk/nextjs";
import {redirect} from "next/navigation";

interface ServerIdPage {
  params: {
    serverId: string;
  };
}

export default async function ServerIdPage({params}: ServerIdPage) {
  const profile = await currentUser();
  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {profileId: profile.id},
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const generalChannel = server?.channels[0];

  if (generalChannel?.name !== "general") return null;

  return redirect(`/servers/${params.serverId}/channels/${generalChannel.id}`);
}
