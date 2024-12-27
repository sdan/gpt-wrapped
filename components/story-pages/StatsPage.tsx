import Image from 'next/image';

interface StatsPageProps {
  stats: {
    totalConversations: number;
    totalMessages: number;
    streaks: {
      longest: number;
      current: number;
      startDate: string;
    };
    longestConversation: {
      messageCount: number;
      date: string;
      title: string;
    };
    dailyStats: {
      mostChatsInOneDay: number;
      date: string;
    };
    timeOfDay: {
      morning: number;
      afternoon: number;
      evening: number;
      night: number;
    };
  };
}

export default function StatsPage({ stats }: StatsPageProps) {
  // Calculate preferred time of day
  const timePreference = Object.entries(stats.timeOfDay).reduce((a, b) => 
    a[1] > b[1] ? a : b
  )[0];

  const timeLabels = {
    morning: "Early Bird 🌅",
    afternoon: "Afternoon Thinker 🌤",
    evening: "Evening Explorer 🌆",
    night: "Night Owl 🌙"
  };

  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-1/3 relative">
        <Image
          src="/welcome/top.svg"
          alt="Top decorative pattern"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
        {/* Left decorative image */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-48">
          <Image
            src="/welcome/left.png"
            alt="Left decorative pattern"
            fill
            className="object-contain opacity-50"
          />
        </div>
        {/* Right decorative image */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-48">
          <Image
            src="/welcome/right.png"
            alt="Right decorative pattern"
            fill
            className="object-contain opacity-50"
          />
        </div>

        {/* Content */}
        <div className="text-center space-y-12 relative z-10 max-w-sm w-full">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white mb-4">Your ChatGPT Style</h2>
            <p className="text-xl text-gray-400">{timeLabels[timePreference as keyof typeof timeLabels]}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-3xl font-bold text-white">{stats.totalConversations}</p>
              <p className="text-sm text-gray-300">Conversations</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-3xl font-bold text-white">{stats.totalMessages}</p>
              <p className="text-sm text-gray-300">Messages</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <p className="text-3xl font-bold text-white">{stats.streaks.longest}</p>
            <p className="text-sm text-gray-300">Day Streak 🔥</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <p className="text-sm text-gray-300 mb-1">Most Active Day</p>
            <p className="text-2xl font-bold text-white">{stats.dailyStats.mostChatsInOneDay} chats</p>
            <p className="text-xs text-gray-400">
              {new Date(stats.dailyStats.date).toLocaleDateString(undefined, { 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full h-1/3 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  );
}
