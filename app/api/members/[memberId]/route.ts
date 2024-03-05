import {currentUser} from "@/lib/current-user";
import {db} from "@/lib/db";
import {NextResponse} from "next/server";

export async function DELETE(
  req: Request,
  {params}: {params: {memberId: string}}
) {
  try {
    const profile = await currentUser();
    const {searchParams} = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", {status: 401});

    if (!serverId)
      return new NextResponse("Server ID is missing", {status: 400});

    if (!params.memberId)
      return new NextResponse("Member ID is missing", {status: 400});

    //   DELETE FROM members
    //   WHERE id = <memberId_value>
    //   AND profileId != <profile_id_value>
    //   AND serverId = <serverId_value>;

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
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

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBER_ID_DELETE] ", error);
    return new NextResponse("Internal Error", {status: 500});
  }
}

export async function PATCH(
  req: Request,
  {params}: {params: {memberId: string}}
) {
  try {
    const profile = await currentUser();
    const {searchParams} = new URL(req.url);
    const {role} = await req.json();
    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", {status: 401});

    if (!serverId)
      return new NextResponse("Server ID is missing", {status: 400});

    if (!params.memberId)
      return new NextResponse("Member ID is missing", {status: 400});

    // UPDATE server SET members.role = <role_value> FROM members INNER JOIN server ON members.serverId = server.id WHERE server.id = <serverId_value> AND members.id = <memberId_value> AND members.profileId != <profile_id_value>;
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
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

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBER_ID_PATCH] ", error);
    return new NextResponse("Internal Error", {status: 500});
  }
}
