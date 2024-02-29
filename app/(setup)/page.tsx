import InitalModal from "@/components/modal/initalModal";
import {db} from "@/lib/db";
import {initialProfile} from "@/lib/initial-profile";
import {redirect} from "next/navigation";

export default async function Setup() {
  const profile = await initialProfile();
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/server/${server.id}`);
  }

  return (
    <div>
      <InitalModal />
    </div>
  );
}
