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
    const {serverId, channelId} = req.query;

    if (!profile) {
      return res.status(401).json({error: "Unauthorized"});
    }

    if (!serverId) {
      return res.status(400).json({error: "Server ID missing"});
    }

    if (!channelId) {
      return res.status(400).json({error: "Channel ID missing"});
    }

    if (!content) {
      return res.status(400).json({error: "Content missing"});
    }

    // SELECT *
    // FROM server
    // WHERE id = '<serverId_value>'
    // AND EXISTS (
    //     SELECT 1
    //     FROM members
    //     WHERE server.id = members.serverId
    //     AND members.profileId = '<profile_id_value>'
    // );

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({error: "Server is not found"});
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({
        error: "Channel is not found",
      });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({
        error: "Member is not found",
      });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
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

    const channelKey = `chat:${channelId}:messages`;
    res.socket.server.io.emit(channelKey, message); //Will emit the message to all the member in that channel

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({
      error: "Internal Error",
    });
  }
}
