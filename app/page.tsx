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
  const [data, setData] = useState(null);

  const handleDataReady = (parsedData) => {
    setData(parsedData);
    setIsReady(true);
  };

  let stories = [];

  if (enhancedWrapped && data?.stats?.analyze) {
    console.log('Rendering ONLY AI pages');
    stories.push(
      { component: <AIWelcomePage /> },
      { component: <AiPersonaPage persona={data.stats.analyze.bespoke_ai_persona} /> },
      { component: <AiChatThemesPage themes={data.stats.analyze.chat_themes} /> },
      { component: <AiQuipPage quip={data.stats.analyze.crown_jewel_quip} /> },
      { component: <AiEurekaPage eureka={data.stats.analyze.eureka_trifecta} /> },
      { component: <AiHumorPage humor={data.stats.analyze.laughter_catalyst} /> },
      { component: <AiJourneyPage journey={data.stats.analyze.mind_miles_traveled} /> },
      { component: <AiFascinationPage fascination={data.stats.analyze.primary_fascination} /> },
      { component: <AiAuraPage aura={data.stats.analyze.user_aura} /> }
    );
  } else {
    console.log('Rendering ONLY basic pages');
    stories.push(
      { component: <WelcomePage /> },
      { component: data?.stats ? <TotalStatsPage stats={data.stats} /> : null },
      { component: data?.stats ? <StreakStatsPage stats={data.stats} /> : null },
      { component: data?.stats ? <TimeStatsPage stats={data.stats} /> : null },
      { component: data?.stats ? <SentimentStatsPage stats={data.stats} /> : null },
      { component: data?.stats ? <TopicStatsPage stats={data.stats} /> : null },
      { component: data?.stats ? <SummaryStatsPage stats={data.stats} /> : null }
    );
  }

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
