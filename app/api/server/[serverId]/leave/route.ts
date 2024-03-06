import {currentUser} from "@/lib/current-user";
import {db} from "@/lib/db";
import {NextResponse} from "next/server";

export async function PATCH(
  req: Request,
  {params}: {params: {serverId: string}}
) {
  try {
    const profile = await currentUser();

    if (!profile) return new NextResponse("Unauthorized", {status: 401});

    if (!params.serverId)
      return new NextResponse("Server ID is missing", {status: 400});

    //  DELETE FROM members
    //  WHERE serverId IN (
    //     SELECT id
    //     FROM server
    //     WHERE id = <serverId_value>
    //     AND profileId != <profile_id_value>
    //     AND EXISTS (
    //         SELECT 1
    //         FROM members
    //         WHERE server.id = members.serverId
    //         AND members.profileId = <profile_id_value>
    //     )
    // )
    // AND profileId = <profile_id_value>;

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id, // Not Admin
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_LEAVE_ERROR", error);
    return new NextResponse("Internal server ", {status: 500});
  }
}
