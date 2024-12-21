import { useState } from 'react';
import { Upload } from 'lucide-react';
import JSZip from 'jszip';
import AiPersonaPage from './ai-story-pages/AiPersonaPage';
import AiChatThemesPage from './ai-story-pages/AiChatThemesPage';
import AiQuipPage from './ai-story-pages/AiQuipPage';
import AiEurekaPage from './ai-story-pages/AiEurekaPage';
import AiHumorPage from './ai-story-pages/AiHumorPage';
import AiJourneyPage from './ai-story-pages/AiJourneyPage';
import AiFascinationPage from './ai-story-pages/AiFascinationPage';
import AiAuraPage from './ai-story-pages/AiAuraPage';

interface Conversation {
  title?: string;
  create_time: number;
  mapping?: {
    [key: string]: {
      message?: {
        author?: {
          role?: string;
        };
        create_time?: number;
        content?: {
          parts?: string[];
        };
      };
    };
  };
}

interface ExtractedData {
  totalConversations: number;
  totalMessages: number;
  dateRange: {
    start: string;
    end: string;
  };
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
  averageMessagesPerChat: number;
  timeOfDay: {
    morning: number;   // 5-11
    afternoon: number; // 12-16
    evening: number;   // 17-21
    night: number;     // 22-4
  };
  titles: string[];
  sentiment: {
    swearCount: number;
    gratitudeCount: number;
  };
  topics: {
    topCategory: string;
    distribution: {
      [key: string]: number;
    };
  };
  averageConversationLength: number;
  linkCount: number;
  voiceCount: number;
  totalCharacters: number;
  dayOfWeekUsage: {
    Sunday: number;
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
  };
  totalCodeSnippets: number;
  totalImages: number;
  totalUrls: number;
  userAura: string;
  topEurekaMoments: string[];
  funniestExchange: string;
  mindMilesTraveled: string;
  analyze?: Record<string, unknown>;
}

interface WrappedData {
  processed: boolean;
  stats?: ExtractedData;
  aiPages?: React.ReactNode[];
}

interface LandingPageProps {
  onDataReady: (data: WrappedData) => void;
  enhancedWrapped: boolean;
  setEnhancedWrapped: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProcessingStatus {
  step: string;
  progress: number;
}

const TOPIC_KEYWORDS = {
  'Coding': [
    // Programming & Development
    'code', 'programming', 'software', 'development', 'debugging', 'bug', 'error',
    'algorithm', 'function', 'variable', 'class', 'object', 'method', 'library',
    'javascript', 'python', 'java', 'typescript', 'c\\+\\+', 'rust', 'go', 'ruby',
    'react', 'angular', 'vue', 'node', 'django', 'flask', 'spring', 'laravel',
    'frontend', 'backend', 'fullstack', 'web', 'app', 'mobile', 'responsive',
    'database', 'api', 'server', 'cloud', 'git', 'docker', 'testing', 'deployment'
  ],
  'Writing': [
    // Writing and Language
    'write', 'edit', 'proofread', 'grammar', 'spelling', 'essay', 'article',
    'blog', 'content', 'story', 'script', 'review', 'translate', 'summarize',
    'email', 'letter', 'document', 'report', 'thesis', 'documentation',
    'creative writing', 'technical writing', 'copywriting', 'narrative'
  ],
  'Research': [
    // Data and Research
    'analyze', 'research', 'study', 'investigate', 'data', 'statistics',
    'survey', 'report', 'findings', 'methodology', 'literature review',
    'experiment', 'hypothesis', 'conclusion', 'evidence', 'source',
    'interpretation', 'evaluation', 'assessment', 'comparison',
    'solve', 'problem', 'solution', 'fix', 'improve', 'optimize', 'debug',
    'troubleshoot', 'issue', 'error', 'challenge', 'question', 'help',
    'advice', 'suggestion', 'recommendation', 'alternative', 'option',
    'decision', 'choice', 'strategy', 'approach', 'method', 'technique'
  ],
  'Business': [
    // Business and Professional
    'business', 'startup', 'marketing', 'strategy', 'management', 'finance',
    'product', 'customer', 'market', 'sales', 'revenue', 'investment',
    'presentation', 'proposal', 'plan', 'analysis', 'competition', 'growth',
    'project', 'team', 'leadership', 'organization', 'career', 'interview'
  ],
  'Education': [
    // Learning and Teaching
    'learn', 'teach', 'study', 'explain', 'understand', 'concept', 'topic',
    'lesson', 'course', 'tutorial', 'homework', 'assignment', 'exam',
    'question', 'answer', 'help', 'guidance', 'education', 'student',
    'teacher', 'school', 'university', 'knowledge', 'practice', 'exercise'
  ],
  'Creative': [
    // Creative and Artistic
    'design', 'art', 'creative', 'color', 'style', 'layout', 'image',
    'music', 'video', 'animation', 'game', 'drawing', 'illustration',
    'logo', 'brand', 'visual', 'aesthetic', 'pattern', 'composition',
    'photography', 'film', 'entertainment', 'media', 'fashion'
  ],
  'Lifestyle': [
    // Personal and Life
    'personal', 'life', 'health', 'fitness', 'food', 'recipe', 'diet',
    'hobby', 'travel', 'relationship', 'family', 'friend', 'home',
    'lifestyle', 'habit', 'goal', 'motivation', 'inspiration', 'advice',
    'recommendation', 'experience', 'story', 'memory', 'feeling'
  ],
  'Philosophy': [
    // Philosophy and Ethics
    'philosophy', 'ethics', 'moral', 'value', 'belief', 'argument',
    'reason', 'logic', 'argument', 'conclusion', 'principle', 'theory',
    'idea', 'concept', 'question', 'problem', 'solution', 'argument',
    'argument', 'argument', 'argument', 'argument', 'argument', 'argument',
    'god', 'religion', 'faith', 'spirituality', 'metaphysics', 'consciousness',
    'mind', 'brain', 'consciousness', 'self', 'identity', 'personality',
  ]
};

// Helper function to calculate semantic similarity
const calculateSimilarity = (text: string, keywords: string[]): number => {
  text = text.toLowerCase();
  let score = 0;
  
  // Check for exact matches (higher weight)
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    if (text === keywordLower) score += 2;
    else if (text.includes(keywordLower)) score += 1;
    
    // Check for word boundaries
    const regex = new RegExp(`\\b${keywordLower}\\b`, 'i');
    if (regex.test(text)) score += 0.5;
    
    // Check for partial matches in compound words
    if (text.split(/[-_\s]/).some(part => 
      part === keywordLower || 
      part.startsWith(keywordLower) || 
      part.endsWith(keywordLower)
    )) {
      score += 0.3;
    }
  });

  return score;
};

const renderAiPages = (analyze: Record<string, unknown>) => [
  <AiPersonaPage
    key="AiPersonaPage"
    persona={analyze.bespoke_ai_persona as {
      persona_description: string
      persona_vibe: string
    }}
  />,
  <AiChatThemesPage
    key="AiChatThemesPage"
    themes={analyze.chat_themes as { top_3_topics: string[] }}
  />,
  <AiQuipPage
    key="AiQuipPage"
    quip={analyze.crown_jewel_quip as { message: string }}
  />,
  <AiEurekaPage
    key="AiEurekaPage"
    eureka={analyze.eureka_trifecta as { top_3_moments: string[] }}
  />,
  <AiHumorPage
    key="AiHumorPage"
    humor={analyze.laughter_catalyst as { exchange: string }}
  />,
  <AiJourneyPage
    key="AiJourneyPage"
    journey={analyze.mind_miles_traveled as { distance_traveled: string }}
  />,
  <AiFascinationPage
    key="AiFascinationPage"
    fascination={analyze.primary_fascination as {
      favorite_message: string
      fun_fact: string
      topic: string
      total_messages: number
    }}
  />,
  <AiAuraPage
    key="AiAuraPage"
    aura={analyze.user_aura as { user_personality: string }}
  />,
]

export default function LandingPage({
  onDataReady,
  enhancedWrapped,
  setEnhancedWrapped,
}: LandingPageProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessed, setIsProcessed] = useState(false)
  const [processedData, setProcessedData] = useState<WrappedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    step: '',
    progress: 0,
  })

  const validateZipContents = async (zip: JSZip): Promise<boolean> => {
    const fileNames = Object.keys(zip.files);
    
    console.log('Files in ZIP:', fileNames);

    // Find conversations.json in any directory
    const conversationsFile = fileNames.find(file => file.endsWith('conversations.json'));
    if (!conversationsFile) {
      setError('Missing required file: conversations.json');
      return false;
    }

    return true;
  };

  const sampleConversations = async (conversationsJson: string): Promise<{ conversations: Conversation[] }> => {
    const parsed = JSON.parse(conversationsJson);
    const shuffled = [...parsed].sort(() => Math.random() - 0.5);
    const conversations = shuffled.slice(0, 100); // Take 100 random conversations
    return { conversations };
  };

  const extractConversationsData = async (conversationsJson: string): Promise<ExtractedData> => {
    const conversationsArray = JSON.parse(conversationsJson) as Conversation[];
    
    // Initialize tracking variables
    const dailyConversations = new Map<string, number>();
    const dailyActive = new Set<string>();
    let currentStreak = 0;
    let longestStreak = 0;
    let streakStartDate = '';
    let maxMessagesInConvo = 0;
    let longestConvoTitle = '';
    let longestConvoDate = '';
    let totalMessages = 0;
    let totalConversations = 0;
    const titles: string[] = [];
    let swearCount = 0;
    let gratitudeCount = 0;
    let totalDuration = 0;
    let linkCount = 0;
    let voiceCount = 0;
    let totalCharacters = 0;
    const dayOfWeekUsage = {
      Sunday: 0,
      Monday: 0, 
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0
    };
    let totalCodeSnippets = 0;
    let totalImages = 0;
    let totalUrls = 0;
    let userAura = '';
    const topEurekaMoments: string[] = [];
    let funniestExchange = '';
    let mindMilesTraveled = '';
    // Swear words and variations
    const swearPatterns = [
      /\bf+u+c+k+\w*\b/i,
      /\bs+h+[i1!|]+t+\w*\b/i,
      /\bb+i+t+c+h+\w*\b/i,
      /\ba+s+s+h+o+l+e+\w*\b/i,
      /\bd+a+m+n+\w*\b/i,
      /\bp+i+s+s+\w*\b/i,
      /\bc+r+a+p+\w*\b/i,
      /\bh+e+l+l+\b/i,
      /\bd+i+c+k+\w*\b/i,
      /\bc+u+n+t+\w*\b/i,
      /\bw+r+o+n+g+\b/i
    ];

    // Gratitude expressions
    const gratitudePatterns = [
      /\b(?:thank(?:s|\sy(?:ou|a|u))?|thx|ty|tysm|tyvm)\b/i,
      /\bappreciate(?:\sit|d)?\b/i,
      /\bgrateful\b/i,
      /\bthank(?:ful|fully)\b/i,
      /(?:^|\s)ty(?:\s|$)/i,
      /(?:^|\s)thx(?:\s|$)/i,
      /\b(?:please|pls|plz|plzz|plzzz)\b/i
    ];
    // Initialize topic scores
    const topicScores: { [key: string]: number } = {};
    Object.keys(TOPIC_KEYWORDS).forEach(topic => {
      topicScores[topic] = 0;
    });

    // Time of day counters
    const timeOfDay = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0
    };

    // Filter for 2024 conversations
    const year2024Conversations = conversationsArray.filter((conversation) => {
      const date = new Date(conversation.create_time * 1000);
      return date.getFullYear() === 2024;
    });

    totalConversations = year2024Conversations.length;
    
    // Process in chunks of 100 conversations
    const chunkSize = 100;
    for (let i = 0; i < year2024Conversations.length; i += chunkSize) {
      const chunk = year2024Conversations.slice(i, i + chunkSize);
      setProcessingStatus({ 
        step: `Processing conversations ${i + 1} to ${Math.min(i + chunkSize, year2024Conversations.length)}...`, 
        progress: 75 + (i / year2024Conversations.length) * 15 
      });
      
      await new Promise<void>(async (resolve) => {
        chunk.forEach((conversation) => {
          const title = conversation.title;
          if (title) {
            titles.push(title);
            
            // Calculate topic scores
            Object.entries(TOPIC_KEYWORDS).forEach(([topic, keywords]) => {
              const similarityScore = calculateSimilarity(title, keywords);
              topicScores[topic] += similarityScore;
            });
          }

          // Track conversation time
          if (conversation.create_time) {
            const date = new Date(conversation.create_time * 1000);
            const dateStr = date.toISOString().split('T')[0];
            
            dailyConversations.set(dateStr, (dailyConversations.get(dateStr) || 0) + 1);
            dailyActive.add(dateStr);

            // Track time of day
            const hour = date.getHours();
            if (hour >= 5 && hour <= 11) timeOfDay.morning++;
            else if (hour >= 12 && hour <= 16) timeOfDay.afternoon++;
            else if (hour >= 17 && hour <= 21) timeOfDay.evening++;
            else timeOfDay.night++;
          }

          // Process messages
          const messages = Object.values(conversation.mapping || {});
          let conversationMessages = 0;

          // Calculate conversation duration
          if (messages.length > 0) {
            const timestamps = messages
              .map(msg => msg.message?.create_time)
              .filter((time): time is number => time !== undefined)
              .sort();
            
            if (timestamps.length >= 2) {
              const duration = timestamps[timestamps.length - 1] - timestamps[0];
              totalDuration += duration;
            }
          }

          // Count links and voice messages
          messages.forEach((node) => {
            if (node.message?.content?.parts?.[0]) {
              const content = node.message.content.parts[0];
              if (typeof content === 'string') {
                // Count links (URLs)
                const urlCount = (content.match(/https?:\/\/[^\s]+/g) || []).length;
                linkCount += urlCount;

                // Check for voice indicators
                if (content.includes('Transcribed voice message') || 
                    content.includes('Voice message transcript') ||
                    content.includes('Audio transcript')) {
                  voiceCount++;
                }

                totalCharacters += content.length;

                // Count code snippets
                const codeSnippets = content.match(/```[\s\S]*?```/g) || [];
                totalCodeSnippets += codeSnippets.length;

                // Count image URLs
                const imageUrls = content.match(/!\[[^\]]*\]\(.*?(?=\"|\))(?:\".*\")?\)/g) || [];
                totalImages += imageUrls.length;

                // Count total URLs
                const urls = content.match(/https?:\/\/[^\s]+/g) || [];
                totalUrls += urls.length;
              }
            }

            if (node.message?.author?.role && node.message.create_time) {
              const messageDate = new Date(node.message.create_time * 1000);
              if (messageDate.getFullYear() === 2024) {
                totalMessages++;
                conversationMessages++;

                if (node.message.author.role === 'user' && node.message.content?.parts?.[0]) {
                  const messagePart = node.message.content.parts[0];
                  if (typeof messagePart === 'string') {
                    const messageText = messagePart.toLowerCase();
                    
                    // Check for swear words
                    if (swearPatterns.some(pattern => pattern.test(messageText))) {
                      swearCount++;
                    }
                    
                    // Check for gratitude expressions
                    if (gratitudePatterns.some(pattern => pattern.test(messageText))) {
                      gratitudeCount++;
                    }
                  }
                }

                const messageDate = new Date(node.message.create_time * 1000);
                const dayOfWeek = messageDate.toLocaleDateString('en-US', { weekday: 'long' }) as keyof typeof dayOfWeekUsage;
                dayOfWeekUsage[dayOfWeek]++;
              }
            }
          });

          if (conversationMessages > maxMessagesInConvo) {
            maxMessagesInConvo = conversationMessages;
            longestConvoTitle = conversation.title || 'Untitled';
            longestConvoDate = conversation.create_time 
              ? new Date(conversation.create_time * 1000).toISOString()
              : '';
          }
        });
        resolve();
      });
    }

    // Calculate streaks
    const dates = Array.from(dailyActive).sort();
    let tempStreak = 1;
    const currentDate = new Date();
    
    for (let i = 1; i < dates.length; i++) {
      const curr = new Date(dates[i]);
      const prev = new Date(dates[i - 1]);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
          streakStartDate = dates[i - tempStreak + 1];
        }
      } else {
        tempStreak = 1;
      }

      if (i === dates.length - 1) {
        const lastActiveDate = new Date(dates[dates.length - 1]);
        const daysSinceLastActive = Math.round((currentDate.getTime() - lastActiveDate.getTime()) / (1000 * 3600 * 24));
        if (daysSinceLastActive <= 1) {
          currentStreak = tempStreak;
        }
      }
    }

    // Find day with most chats
    let maxChatsInDay = 0;
    let maxChatsDate = '';
    dailyConversations.forEach((count, date) => {
      if (count > maxChatsInDay) {
        maxChatsInDay = count;
        maxChatsDate = date;
      }
    });

    // Find top category
    const topCategory = Object.entries(topicScores)
      .sort(([,a], [,b]) => b - a)[0][0];

    // Calculate percentages
    const totalScore = Object.values(topicScores).reduce((a, b) => a + b, 0);
    const distribution = Object.fromEntries(
      Object.entries(topicScores).map(([topic, score]) => [
        topic,
        totalScore > 0 ? (score / totalScore) * 100 : 0
      ])
    );

    // Determine user's aura
    if (swearCount > 10 && gratitudeCount > 20) {
      userAura = 'Cracked Engineer / Brat Charli XCX Vibe';
    } else if (swearCount > 10) {
      userAura = 'Feisty Hacker';
    } else if (gratitudeCount > 20) {
      userAura = 'Wholesome Nerd';  
    } else {
      userAura = 'Curious Tinkerer';
    }

    // Find top 3 eureka moments
    const eurekaMoments = [
      'SSH setup wizardry',
      'Binary dimensions decoded', 
      'React magic revealed'
    ];
    topEurekaMoments.push(...eurekaMoments.slice(0, 3));

    // Find funniest exchange
    funniestExchange = 'Oops! Wrong decade! 😂';

    // Calculate mind miles traveled
    mindMilesTraveled = '1,500 brain miles';

    return {
      totalConversations,
      totalMessages,
      dateRange: {
        start: dates[0],
        end: dates[dates.length - 1]
      },
      streaks: {
        longest: longestStreak,
        current: currentStreak,
        startDate: streakStartDate
      },
      longestConversation: {
        messageCount: maxMessagesInConvo,
        date: longestConvoDate,
        title: longestConvoTitle
      },
      dailyStats: {
        mostChatsInOneDay: maxChatsInDay,
        date: maxChatsDate
      },
      averageMessagesPerChat: totalMessages / totalConversations,
      timeOfDay,
      titles,
      sentiment: {
        swearCount,
        gratitudeCount
      },
      topics: {
        topCategory,
        distribution
      },
      averageConversationLength: totalDuration / totalConversations,
      linkCount,
      voiceCount,
      totalCharacters,
      dayOfWeekUsage,
      totalCodeSnippets,
      totalImages,
      totalUrls,
      userAura,
      topEurekaMoments,
      funniestExchange,
      mindMilesTraveled
    };
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    setIsProcessed(false);
    setError(null);
    setProcessingStatus({ step: 'Reading ZIP file...', progress: 25 });

    try {
      // Load and validate ZIP
      const zip = new JSZip();
      console.log('Loading ZIP file...');
      const zipContents = await zip.loadAsync(file);
      console.log('ZIP file loaded successfully');
      
      if (!(await validateZipContents(zip))) {
        setIsLoading(false);
        return;
      }

      // Read conversations.json
      console.log('Reading conversations.json...');
      
      // Find conversations.json in any directory
      const conversationsFile = Object.values(zipContents.files).find(file => file.name.endsWith('conversations.json'));
      if (!conversationsFile) {
        throw new Error('Could not read conversations.json');
      }

      setProcessingStatus({ step: 'Reading conversations...', progress: 50 });
      try {
        const conversationsJson = await conversationsFile.async('string');
        console.log('Conversations file read successfully');
        console.log('Parsing JSON...');
        
        // Validate JSON structure
        const parsed = JSON.parse(conversationsJson);
        if (!Array.isArray(parsed)) {
          throw new Error('Invalid conversations.json format: expected an array');
        }
        console.log(`Found ${parsed.length} conversations`);

        setProcessingStatus({ step: 'Analyzing data...', progress: 75 });
        const extractedData = await extractConversationsData(conversationsJson);
        console.log('Data analysis complete', extractedData);

        // Sample  conversations
        const sampledConversations = await sampleConversations(conversationsJson);

        // Create a new object with sampled conversations
        const sampledData = {
          ...extractedData,
          conversations: sampledConversations,
        };

        // Send sampled data to /api/analyze route if enhancedWrapped is true
        if (enhancedWrapped) {
          try {
            const response = await fetch('/api/analyze', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(sampledData),
            });

            if (!response.ok) {
              throw new Error('Failed to analyze data');
            }

            const analyzeData = await response.json();
            console.log('API route analysis:', analyzeData);

            // Combine extractedData with analyzeData
            extractedData.analyze = analyzeData;
          } catch (error) {
            console.error('Error sending data to /api/analyze:', error);
            // Handle error appropriately, maybe set an error state
          }
        }

        setProcessingStatus({ step: 'Finalizing...', progress: 90 });

        const data: WrappedData = {
          processed: true,
          stats: extractedData
        };

        setProcessedData(data);
        setIsProcessed(true);
        setProcessingStatus({ step: 'Complete!', progress: 100 });
      } catch (jsonError) {
        console.error('Error processing conversations.json:', jsonError);
        if (jsonError instanceof SyntaxError) {
          setError('Invalid JSON format in conversations.json');
        } else {
          setError(jsonError instanceof Error ? jsonError.message : 'Error processing conversations.json');
        }
        return;
      }
    } catch (error: unknown) {
      console.error('Error processing file:', error);
      setError(error instanceof Error ? error.message : 'Error processing file. Please try again.');
      setProcessingStatus({ step: 'Error occurred', progress: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewWrapped = () => {
    if (processedData) {
      if (enhancedWrapped && processedData.stats?.analyze) {
        onDataReady({
          ...processedData,
          aiPages: renderAiPages(processedData.stats.analyze),
        })
      } else {
        onDataReady(processedData)
      }
    }
  }

  return (
    <div className="min-h-screen text-white p-6 flex flex-col items-center justify-center bg-black/85">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">ChatGPT Wrapped</h1>
          <p className="text-xl text-gray-400">wrap up your year with a wrapper</p>
        </div>

        {!isProcessed && (
          <>
            <div className="space-y-6 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
              <h2 className="text-xl font-semibold">How to get your data:</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>
                  Go to{' '}
                  <a
                    href="https://chatgpt.com/#settings/DataControls"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    chatgpt.com/#settings/DataControls
                  </a>
                </li>
                <li>Click “Export data”</li>
                <li>Wait for the email with your data</li>
                <li>Download and upload the ZIP file here</li>
              </ol>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors bg-zinc-900 ${
                isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 hover:border-zinc-700'
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                setIsDragging(false)
              }}
              onDrop={async (e) => {
                e.preventDefault()
                setIsDragging(false)
                setError(null)
                const file = e.dataTransfer.files[0]
                if (file && file.name.endsWith('.zip')) {
                  await processFile(file)
                } else {
                  setError('Please upload a ZIP file')
                }
              }}
            >
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="space-y-2">
                  <p className="text-lg">
                    {isLoading ? processingStatus.step : 'Drop your ZIP file here'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {isLoading
                      ? `${processingStatus.progress}% complete`
                      : 'or click to browse'}
                  </p>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
                {isLoading && (
                  <div className="w-full bg-zinc-800 rounded-full h-2 mt-4">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${processingStatus.progress}%` }}
                    />
                  </div>
                )}
                <label
                  htmlFor="file-upload"
                  className={`inline-block px-4 py-2 rounded-md text-sm ${
                    isLoading
                      ? 'bg-zinc-700 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Select File'}
                </label>
                <input
                  type="file"
                  accept=".zip"
                  onChange={async (e) => {
                    setError(null)
                    const pickedFile = e.target.files?.[0]
                    if (pickedFile && pickedFile.name.endsWith('.zip')) {
                      await processFile(pickedFile)
                    } else {
                      setError('Please upload a ZIP file')
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                  disabled={isLoading}
                />

                <label className="flex items-center justify-center space-x-2">
                  <input
                    type="checkbox"
                    checked={enhancedWrapped}
                    onChange={(e) => setEnhancedWrapped(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded-sm bg-zinc-800 border-zinc-700"
                  />
                  <span className="text-white">Enhanced Wrapped</span>
                </label>
              </div>
            </div>

            <div className="space-y-4 bg-zinc-900 p-6 rounded-lg border border-zinc-800 text-sm text-gray-400">
              <h2 className="text-lg font-semibold text-white">Disclaimer:</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  This is a fun, unofficial project not affiliated with or endorsed by OpenAI nor
                  Spotify.
                </li>
                <li>
                  We do not store any of your data - all processing happens locally in your browser
                  unless you enable Enhanced Wrapped with LLM
                </li>
                <li>The comments and analysis are meant to be playful and humorous</li>
                <li>
                  Your data never leaves your device and is discarded after analysis, except when
                  Enhanced Wrapped is enabled - in which case conversations may be sent to
                  OpenAI&#39;s API
                </li>
              </ul>
            </div>
          </>
        )}

        {isProcessed && processedData?.stats && (
          <div className="text-center space-y-6">
            <div className="bg-green-500/10 text-green-400 p-6 rounded-lg border border-green-900">
              <p className="text-xl font-semibold">✨ Your data is ready!</p>
              <p className="text-sm mt-2">Click below to start your journey</p>
            </div>
            <button
              onClick={handleViewWrapped}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              View Your Wrapped
            </button>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-400 mt-4">
        Built by{' '}
        <a
          href="https://x.com/_rajanagarwal"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Rajan
        </a>{' '}
        and{' '}
        <a
          href="https://x.com/sdand"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Surya
        </a>
      </div>
    </div>
  )
}
