import {NextApiRequest} from "next";
import {NextApiResponseServerIo} from "@/types";
import {currentUserPages} from "@/lib/current-user-pages";
import {db} from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const profile = await currentUserPages(req);
    const {content, fileUrl} = req.body;
    const {conversationId} = req.query;
    console.log(conversationId);

    if (!profile) {
      return res.status(401).json({error: "Unauthorized"});
    }

    if (!conversationId) {
      return res.status(400).json({error: "Conversation ID missing"});
    }

    if (!content) {
      return res.status(400).json({error: "Content missing"});
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
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
                members: true,
                channels: true,
                userId: true,
                _count: true,
              },
            },
          },
        },
        memberTwo: {
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
                members: true,
                channels: true,
                userId: true,
                _count: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({
        error: "Conversation is not found",
      });
    }
    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({
        error: "Member is not found",
      });
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl: fileUrl || "",
        conversationId: conversationId as string,
        memberId: member.id,
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
    });

    const channelKey = `chat:${conversationId}:messages`;
    res.socket.server.io.emit(channelKey, message); //Will emit the message to all the member in that channel

    return res.status(200).json(message);
  } catch (error) {
    console.log("[DIRECT_MESSAGE_POST]", error);
    return res.status(500).json({
      error: "Internal Error",
    });
  }
}
