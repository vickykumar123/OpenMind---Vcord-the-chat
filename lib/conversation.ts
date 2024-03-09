import {db} from "./db";

const findConversationn = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{memberOneId: memberOneId}, {memberTwoId: memberTwoId}],
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
        memberTwo: {
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
  } catch {
    return null;
  }
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
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
        memberTwo: {
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
  } catch (error) {
    return null;
  }
};

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConversationn(memberOneId, memberTwoId)) ||
    (await findConversationn(memberTwoId, memberOneId));

  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }
  return conversation;
};
