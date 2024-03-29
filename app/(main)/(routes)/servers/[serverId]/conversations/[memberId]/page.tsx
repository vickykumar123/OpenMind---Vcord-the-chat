import MediaRoom from "@/components/MediaRoom";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import {getOrCreateConversation} from "@/lib/conversation";
import {currentUser} from "@/lib/current-user";
import {db} from "@/lib/db";
import {redirectToSignIn} from "@clerk/nextjs";
import {Email} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}
export default async function MemberIdPage({
  params,
  searchParams,
}: MemberIdPageProps) {
  const profile = await currentUser();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentProfile = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: {
        select: {
          anon_name: true,
        },
      },
    },
  });

  if (!currentProfile) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentProfile.id, // Current User
    params.memberId // user to whom we need to chat
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }
  const {memberOne, memberTwo} = conversation;
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne; // if we are memberOne then memberTwo is other party

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.anon_name}
        serverId={params.serverId}
        type="conversation"
      />
      {searchParams.video && (
        <MediaRoom
          audio={true}
          video={true}
          chatId={conversation.id}
          name={profile.anon_name}
        />
      )}
      {!searchParams.video && (
        <>
          <ChatMessages
            member={currentProfile}
            name={otherMember.profile.anon_name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember.profile.anon_name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
}
