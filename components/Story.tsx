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
    
    // Get both the container and the actual component
    const container = document.getElementById('story-container');
    const componentElement = document.getElementById('story-component');
    
    if (container && componentElement) {
      try {
        // Hide controls temporarily
        const controls = container.querySelectorAll('.story-control');
        controls.forEach(control => (control as HTMLElement).style.display = 'none');

        // Set fixed dimensions that match mobile aspect ratio
        const width = 1080;
        const height = 1920;
        
        // Store original styles
        const originalStyles = {
          container: {
            width: container.style.width,
            height: container.style.height,
            position: container.style.position,
            transform: container.style.transform
          },
          component: {
            width: componentElement.style.width,
            height: componentElement.style.height,
            position: componentElement.style.position,
            transform: componentElement.style.transform
          }
        };

        // Set capture styles
        container.style.width = `${width}px`;
        container.style.height = `${height}px`;
        container.style.position = 'relative';
        container.style.transform = 'none';

        componentElement.style.width = '100%';
        componentElement.style.height = '100%';
        componentElement.style.position = 'relative';
        componentElement.style.transform = 'none';

        // Wait for styles to apply
        await new Promise(resolve => setTimeout(resolve, 100));

        // Force all images to load
        const images = componentElement.getElementsByTagName('img');
        await Promise.all(Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }));

        // Capture the component
        const canvas = await html2canvas(componentElement, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#000000',
          width,
          height,
          scale: 2,
          logging: true,
          onclone: (clonedDoc) => {
            const clonedComponent = clonedDoc.getElementById('story-component');
            if (clonedComponent) {
              // Ensure clone has correct dimensions
              clonedComponent.style.width = `${width}px`;
              clonedComponent.style.height = `${height}px`;
              
              // Process all images in the clone
              const clonedImages = clonedComponent.getElementsByTagName('img');
              Array.from(clonedImages).forEach(img => {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.objectFit = 'cover';
              });
            }
          }
        });

        // Convert to blob and download
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

            // Restore original styles
            Object.assign(container.style, originalStyles.container);
            Object.assign(componentElement.style, originalStyles.component);
            
            // Show controls again
            controls.forEach(control => (control as HTMLElement).style.display = '');
          }
        }, 'image/png', 1.0);
      } catch (error) {
        console.error('Error exporting image:', error);
      }
    }
  };

  return (
    <div id="story-container" className="relative h-full w-full bg-black flex flex-col">
      <div className="absolute top-6 left-4 z-10 story-control">
        <span className="text-white font-bold text-lg">ChatGPT Wrapped</span>
      </div>
      <button 
        className="absolute top-6 right-4 z-10 p-2 rounded-full bg-black/50 text-white story-control"
        onClick={(e) => onTogglePause(e)}
      >
        {isPaused ? <Play size={24} /> : <Pause size={24} />}
      </button>
      <button
        className="absolute top-6 right-16 z-10 p-2 rounded-full bg-black/50 text-white story-control"
        onClick={handleExport}
      >
        <Download size={24} />
      </button>
      <div id="story-component" className="flex-1">
        {component}
      </div>
    </div>
  );
}

