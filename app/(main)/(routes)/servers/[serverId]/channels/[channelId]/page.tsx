interface ChannelIdPageProps {
  params: {
    channelId: string;
  };
}

export default function ChannelIdPage({params}: ChannelIdPageProps) {
  return <div>Channel {params.channelId} </div>;
}
