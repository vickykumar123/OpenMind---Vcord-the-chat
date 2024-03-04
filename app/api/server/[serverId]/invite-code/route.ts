import {v4 as uuidv4} from "uuid";
import {NextResponse} from "next/server";
import {currentUser} from "@/lib/current-user";
import {db} from "@/lib/db";

export async function PATCH(
  req: Request,
  {params}: {params: {serverId: string}}
) {
  try {
    const profile = await currentUser();
    if (!profile) return new NextResponse("Unauthorized", {status: 401});

    if (!params.serverId)
      return new NextResponse("ServerId is missing", {status: 401});

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID] ", error);
    return new NextResponse("Internal Error", {status: 500});
  }
}
