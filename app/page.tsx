'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import WelcomePage from '../components/story-pages/WelcomePage';
import TotalStatsPage from '../components/story-pages/TotalStatsPage';
import StreakStatsPage from '../components/story-pages/StreakStatsPage';
import TimeStatsPage from '../components/story-pages/TimeStatsPage';
import SentimentStatsPage from '../components/story-pages/SentimentStatsPage';
import TopicStatsPage from '../components/story-pages/TopicStatsPage';
import SummaryStatsPage from '../components/story-pages/SummaryStatsPage';
import LandingPage from '../components/LandingPage';
import AIWelcomePage from '@/components/ai-story-pages/AIWelcomePage';
import AiPersonaPage from '../components/ai-story-pages/AiPersonaPage';
import AiChatThemesPage from '../components/ai-story-pages/AiChatThemesPage';
import AiQuipPage from '../components/ai-story-pages/AiQuipPage';
import AiEurekaPage from '../components/ai-story-pages/AiEurekaPage';
import AiHumorPage from '../components/ai-story-pages/AiHumorPage';
import AiJourneyPage from '../components/ai-story-pages/AiJourneyPage';
import AiFascinationPage from '../components/ai-story-pages/AiFascinationPage';
import AiAuraPage from '../components/ai-story-pages/AiAuraPage';
import { WrappedProvider } from '../components/WrappedContext';

const Stories = dynamic(() => import('../components/Stories'), { 
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function Home() {
  const [enhancedWrapped, setEnhancedWrapped] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleDataReady = (parsedData: any) => {
    setData(parsedData);
    setIsReady(true);
  };

  const stories = enhancedWrapped && data?.stats?.analyze
    ? [
        { component: <AIWelcomePage key="AIWelcomePage" /> },
        { component: <AiPersonaPage key="AiPersonaPage" persona={data.stats.analyze.bespoke_ai_persona} /> },
        { component: <AiChatThemesPage key="AiChatThemesPage" themes={data.stats.analyze.chat_themes} /> },
        { component: <AiQuipPage key="AiQuipPage" quip={data.stats.analyze.crown_jewel_quip} /> },
        { component: <AiEurekaPage key="AiEurekaPage" eureka={data.stats.analyze.eureka_trifecta} /> },
        { component: <AiHumorPage key="AiHumorPage" humor={data.stats.analyze.laughter_catalyst} /> },
        { component: <AiJourneyPage key="AiJourneyPage" journey={data.stats.analyze.mind_miles_traveled} /> },
        { component: <AiFascinationPage key="AiFascinationPage" fascination={data.stats.analyze.primary_fascination} /> },
        { component: <AiAuraPage key="AiAuraPage" aura={data.stats.analyze.user_aura} /> },
      ]
    : [
        { component: <WelcomePage key="WelcomePage" /> },
        { component: data?.stats ? <TotalStatsPage key="TotalStatsPage" stats={data.stats} /> : null },
        { component: data?.stats ? <StreakStatsPage key="StreakStatsPage" stats={data.stats} /> : null },
        { component: data?.stats ? <TimeStatsPage key="TimeStatsPage" stats={data.stats} /> : null },
        { component: data?.stats ? <SentimentStatsPage key="SentimentStatsPage" stats={data.stats} /> : null },
        { component: data?.stats ? <TopicStatsPage key="TopicStatsPage" stats={data.stats} /> : null },
        { component: data?.stats ? <SummaryStatsPage key="SummaryStatsPage" stats={data.stats} /> : null },
      ]

  if (!isReady) {
    return (
      <WrappedProvider>
        <LandingPage
          onDataReady={handleDataReady}
          enhancedWrapped={enhancedWrapped}
          setEnhancedWrapped={setEnhancedWrapped}
        />
      </WrappedProvider>
    );
  }

  return (
    <main className="h-screen w-screen overflow-hidden">
      <Stories stories={stories} />
    </main>
  );
}
