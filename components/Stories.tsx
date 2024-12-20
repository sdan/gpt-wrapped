'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProgressBar from './ProgressBar';
import Story from './Story';

interface StoryData {
  component: React.ReactNode;
}

interface StoriesProps {
  stories: StoryData[];
}

export default function Stories({ stories }: StoriesProps) {
  const [currentStory, setCurrentStory] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextStory = useCallback(() => {
    if (currentStory < stories.length - 1) {
      setCurrentStory(currentStory + 1);
      setProgress(0);
    }
  }, [currentStory, stories.length]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isPaused) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            nextStory();
            return 0;
          }
          return prevProgress + (100 / 120); // 100% over 12 seconds
        });
      }, 100); // Update every 100ms for smoother progress
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentStory, nextStory, isPaused]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const halfWidth = window.innerWidth / 2;
    if (e.clientX > halfWidth) {
      nextStory();
    } else if (currentStory > 0) {
      setCurrentStory(currentStory - 1);
      setProgress(0);
    }
  };

  const handleTogglePause = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from propagating to parent
    setIsPaused(prev => !prev);
  }, []);

  const handleTouchStart = useCallback(() => {
    holdTimeoutRef.current = setTimeout(() => {
      setIsPaused(true);
    }, 200);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }
    setIsPaused(false);
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black" 
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mx-auto h-full relative" style={{ aspectRatio: '9/16', maxWidth: '100vw' }}>
        <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-2">
          {stories.map((_, index) => (
            <div key={index} className="flex-1">
              <ProgressBar
                progress={index === currentStory ? progress : index < currentStory ? 100 : 0}
              />
            </div>
          ))}
        </div>
        <div className="h-full">
          <Story 
            {...stories[currentStory]} 
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
          />
        </div>
      </div>
    </div>
  );
}

