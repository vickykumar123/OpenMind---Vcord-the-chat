import {NextResponse} from "next/server";
import {Message} from "@prisma/client";

import {db} from "@/lib/db";
import {currentUser} from "@/lib/current-user";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentUser();
    const {searchParams} = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", {status: 401});
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", {status: 400});
    }

    let messages: Message[] = [];

    if (cursor !== "0") {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor!,
        },
        where: {
          channelId,
        },
        include: {
          member: {
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
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
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
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", {status: 500});
  }
}
