import {currentUser} from "@/lib/current-user";
import {db} from "@/lib/db";
import {redirectToSignIn} from "@clerk/nextjs";
import {redirect} from "next/navigation";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

export default async function InviteCodePage({params}: InviteCodePageProps) {
  const profile = await currentUser();

  if (!profile) return redirectToSignIn();
  if (!params.inviteCode) return redirect("/");

  const existingMemberOfServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingMemberOfServer)
    return redirect(`/servers/${existingMemberOfServer.id}`);

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
}
