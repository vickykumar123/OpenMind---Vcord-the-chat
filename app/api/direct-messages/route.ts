import {NextResponse} from "next/server";
import {DirectMessage} from "@prisma/client";

import {db} from "@/lib/db";
import {currentUser} from "@/lib/current-user";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentUser();
    const {searchParams} = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!profile) {
      return new NextResponse("Unauthorized", {status: 401});
    }

    if (!conversationId) {
      return new NextResponse("Conversation ID missing", {status: 400});
    }

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
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
                  createdAt: false,
                  updatedAt: false,
                  servers: true,
                  members: false,
                  channels: false,
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
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
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
                  createdAt: false,
                  updatedAt: false,
                  servers: false,
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

    let nextCursor: string | null = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("[DIRECT_MESSAGE_GET]", error);
    return new NextResponse("Internal Error", {status: 500});
  }
}
