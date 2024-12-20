import { useState } from 'react';
import { Upload } from 'lucide-react';
import JSZip from 'jszip';

const REQUIRED_FILES = [
  'conversations.json'
];

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
}

interface WrappedData {
  processed: boolean;
  stats?: ExtractedData;
}

interface LandingPageProps {
  onDataReady: (data: WrappedData) => void;
}

interface ProcessingStatus {
  step: string;
  progress: number;
}

export default function LandingPage({ onDataReady }: LandingPageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [processedData, setProcessedData] = useState<WrappedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({ step: '', progress: 0 });

  const validateZipContents = async (zip: JSZip): Promise<boolean> => {
    const fileNames = Object.keys(zip.files);
    
    // Check if conversations.json is present
    if (!fileNames.includes('conversations.json')) {
      setError('Missing required file: conversations.json');
      return false;
    }

    // Check if there are any non-JSON files (except chat.html)
    const invalidFiles = fileNames.filter(file => {
      if (file === 'chat.html') return false;
      return !file.endsWith('.json');
    });

    if (invalidFiles.length > 0) {
      setError('ZIP contains unexpected non-JSON files. Only .json files and chat.html are allowed.');
      return false;
    }

    return true;
  };

  const extractConversationsData = async (conversationsJson: string): Promise<ExtractedData> => {
    setProcessingStatus({ step: 'Parsing conversations...', progress: 50 });
    const conversationsArray = JSON.parse(conversationsJson);
    
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
    let titles: string[] = [];
    
    // Time of day counters
    let timeOfDay = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0
    };

    // Filter for 2024 conversations
    const year2024Conversations = conversationsArray.filter((conversation: any) => {
      const date = new Date(conversation.create_time * 1000);
      return date.getFullYear() === 2024;
    });

    totalConversations = year2024Conversations.length;

    // Process each conversation
    year2024Conversations.forEach((conversation: any) => {
      // Add title to titles array
      if (conversation.title) {
        titles.push(conversation.title);
      }

      // Track conversation creation time
      if (conversation.create_time) {
        const date = new Date(conversation.create_time * 1000);
        const dateStr = date.toISOString().split('T')[0];
        
        // Count daily conversations
        dailyConversations.set(dateStr, (dailyConversations.get(dateStr) || 0) + 1);
        dailyActive.add(dateStr);

        // Track time of day
        const hour = date.getHours();
        if (hour >= 5 && hour <= 11) timeOfDay.morning++;
        else if (hour >= 12 && hour <= 16) timeOfDay.afternoon++;
        else if (hour >= 17 && hour <= 21) timeOfDay.evening++;
        else timeOfDay.night++;
      }

      // Process messages in the conversation
      const messages = Object.values(conversation.mapping || {});
      let conversationMessages = 0;

      messages.forEach((node: any) => {
        if (node.message?.author?.role && node.message.create_time) {
          // Only count messages with valid timestamps and roles
          const messageDate = new Date(node.message.create_time * 1000);
          if (messageDate.getFullYear() === 2024) {
            totalMessages++;
            conversationMessages++;
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

    // Calculate streaks
    const dates = Array.from(dailyActive).sort();
    let tempStreak = 1;
    let currentDate = new Date();
    
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

      // Calculate current streak
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

    setProcessingStatus({ step: 'Analyzing data...', progress: 75 });

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
      titles
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
      const zipContents = await zip.loadAsync(file);
      
      if (!(await validateZipContents(zip))) {
        setIsLoading(false);
        return;
      }

      // Read conversations.json
      const conversationsFile = zipContents.files['conversations.json'];
      if (!conversationsFile) {
        throw new Error('Could not read conversations.json');
      }

      const conversationsJson = await conversationsFile.async('string');
      const extractedData = await extractConversationsData(conversationsJson);

      setProcessingStatus({ step: 'Finalizing...', progress: 90 });

      const data: WrappedData = {
        processed: true,
        stats: extractedData
      };

      setProcessedData(data);
      setIsProcessed(true);
      setProcessingStatus({ step: 'Complete!', progress: 100 });
    } catch (error: unknown) {
      console.error('Error processing file:', error);
      setError(error instanceof Error ? error.message : 'Error processing file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewWrapped = () => {
    if (processedData) {
      onDataReady(processedData);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.zip')) {
      await processFile(file);
    } else {
      setError('Please upload a ZIP file');
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.zip')) {
      await processFile(file);
    } else {
      setError('Please upload a ZIP file');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">ChatGPT Wrapped</h1>
          <p className="text-xl text-gray-400">Visualize your AI journey in 2024</p>
        </div>

        {!isProcessed && (
          <>
            <div className="space-y-6 bg-white/5 p-6 rounded-lg">
              <h2 className="text-xl font-semibold">How to get your data:</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Go to <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">chat.openai.com</a></li>
                <li>Click on your profile picture in the bottom-left</li>
                <li>Select &ldquo;Settings&rdquo;</li>
                <li>Click &ldquo;Export data&rdquo;</li>
                <li>Wait for the email with your data</li>
                <li>Download and upload the ZIP file here</li>
              </ol>
            </div>

            <div 
              className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
                isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="space-y-2">
                  <p className="text-lg">
                    {isLoading ? processingStatus.step : 'Drop your ZIP file here'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {isLoading ? `${processingStatus.progress}% complete` : 'or click to browse'}
                  </p>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                  disabled={isLoading}
                />
                {isLoading && (
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
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
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Select File'}
                </label>
              </div>
            </div>
          </>
        )}

        {isProcessed && processedData?.stats && (
          <div className="text-center space-y-6">
            <div className="bg-green-500/10 text-green-400 p-6 rounded-lg">
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
    </div>
  );
} 