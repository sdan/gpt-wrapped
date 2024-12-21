import { Pause, Play, Download as DownloadIcon } from 'lucide-react';
import html2canvas from 'html2canvas';

interface StoryProps {
  component: React.ReactNode;
  isPaused: boolean;
  onTogglePause: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Story({ component, isPaused, onTogglePause }: StoryProps) {
  async function handleDownloadStory() {
    const node = document.getElementById('story-container');
    const pauseButton = document.getElementById('pause-button');
    const downloadButton = document.getElementById('download-button');
    const watermark = document.getElementById('watermark');

    if (node) {
      try {
        // Hide buttons so they're not visible in the screenshot
        if (pauseButton) pauseButton.style.display = 'none';
        if (downloadButton) downloadButton.style.display = 'none';
        
        // Temporarily show the watermark
        if (watermark) watermark.style.display = 'block';

        // Capture screenshot
        const canvas = await html2canvas(node, { useCORS: true });

        // Restore elements
        if (pauseButton) pauseButton.style.display = '';
        if (downloadButton) downloadButton.style.display = '';
        if (watermark) watermark.style.display = 'none';

        // Convert to data URL and download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'story.png';
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error capturing image:', error);
      }
    }
  }

  return (
    <div
      id="story-container"
      className="relative h-full w-full bg-black flex flex-col"
      style={{ aspectRatio: '9/16' }}
    >

      <div
        id="watermark"
        style={{ display: 'none' }}
        className="absolute top-2 left-2 z-[9999] p-2 text-white text-xs pointer-events-none"
      >
        gpt-wrapped.rajan.sh
      </div>

      <button
        id="download-button"
        className="absolute top-6 right-4 z-10 p-2 rounded-full bg-black/50 text-white story-control"
        onClick={(e) => {
          e.stopPropagation();
          handleDownloadStory();
        }}
      >
        <DownloadIcon size={24} />
      </button>

      <button
        id="pause-button"
        className="absolute top-6 right-16 z-10 p-2 rounded-full bg-black/50 text-white story-control"
        onClick={onTogglePause}
      >
        {isPaused ? <Play size={24} /> : <Pause size={24} />}
      </button>

      <div className="flex-1">
        {component}
      </div>
    </div>
  );
}

