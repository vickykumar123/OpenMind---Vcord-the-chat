import {currentUser} from "@/lib/current-user";
import {db} from "@/lib/db";
import {MemberRole} from "@prisma/client";
import {NextResponse} from "next/server";

export async function DELETE(
  req: Request,
  {params}: {params: {channelId: string}}
) {
  try {
    const profile = await currentUser();
    const {searchParams} = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", {status: 401});

    if (!serverId)
      return new NextResponse("Server  ID is missing", {status: 400});

    if (!params.channelId)
      return new NextResponse("Channel ID is missing", {status: 400});

    // UPDATE server
    // SET ... -- Any updates you might have for the server table
    // WHERE id = <serverId_value>
    // AND EXISTS (
    //     SELECT 1
    //     FROM members
    //     WHERE server.id = members.serverId
    //     AND members.profileId = <profile_id_value>
    //     AND members.role IN ('ADMIN', 'MODERATOR')
    // );

    //     DELETE FROM channels
    // WHERE id = <channelId_value>
    // AND name != 'general'
    // AND serverId = <serverId_value>;

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[DELETE_CHANNEL] ", error);
    return new NextResponse("Internal Error", {status: 500});
  }
}

export async function PATCH(
  req: Request,
  {params}: {params: {channelId: string}}
) {
  try {
    const profile = await currentUser();
    const {name, type} = await req.json();
    const {searchParams} = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", {status: 401});

    if (!serverId)
      return new NextResponse("Server  ID is missing", {status: 400});

    if (!params.channelId)
      return new NextResponse("Channel ID is missing", {status: 400});

    if (name === "general")
      return new NextResponse("Name cannot be 'general'", {status: 400});

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[PATCH_CHANNEL] ", error);
    return new NextResponse("Internal Error", {status: 500});
  }
}
