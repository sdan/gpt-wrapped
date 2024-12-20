import { Pause, Play, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

interface StoryProps {
  component: React.ReactNode;
  isPaused: boolean;
  onTogglePause: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Story({ 
  component, 
  isPaused, 
  onTogglePause 
}: StoryProps) {
  const handleExport = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const element = document.getElementById('story-container');
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          useCORS: true,
          scale: 2, // Higher quality
          logging: false,
          backgroundColor: '#000000',
          allowTaint: true,
        });
        
        // Convert to blob instead of data URL for better handling
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'chatgpt-wrapped-story.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, 'image/png', 1.0);
      } catch (error) {
        console.error('Error exporting image:', error);
      }
    }
  };

  return (
    <div id="story-container" className="relative h-full w-full bg-black flex flex-col">
      <div className="absolute top-6 left-4 z-10">
        <span className="text-white font-bold text-lg">ChatGPT Wrapped</span>
      </div>
      <button 
        className="absolute top-6 right-4 z-10 p-2 rounded-full bg-black/50 text-white"
        onClick={(e) => onTogglePause(e)}
      >
        {isPaused ? <Play size={24} /> : <Pause size={24} />}
      </button>
      <button
        className="absolute top-6 right-16 z-10 p-2 rounded-full bg-black/50 text-white"
        onClick={handleExport}
      >
        <Download size={24} />
      </button>
      {component}
    </div>
  );
}

