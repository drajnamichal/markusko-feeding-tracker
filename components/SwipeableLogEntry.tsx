import React, { useState, useRef, useEffect } from 'react';
import { hapticLight, hapticMedium } from '../utils/haptic';

interface SwipeableLogEntryProps {
  children: React.ReactNode;
  onSwipeLeft: () => void;  // Delete
  onSwipeRight: () => void; // Edit
  threshold?: number;
}

const SwipeableLogEntry: React.FC<SwipeableLogEntryProps> = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight,
  threshold = 100 
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeAction, setSwipeAction] = useState<'delete' | 'edit' | null>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    // Limit swipe distance
    const maxSwipe = 150;
    const limitedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));
    
    setTranslateX(limitedDiff);
    
    // Determine action
    if (Math.abs(limitedDiff) > threshold / 2) {
      if (limitedDiff < 0) {
        setSwipeAction('delete');
      } else {
        setSwipeAction('edit');
      }
      
      // Light haptic when threshold reached
      if (Math.abs(limitedDiff) > threshold && swipeAction === null) {
        hapticLight();
      }
    } else {
      setSwipeAction(null);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    
    // Execute action if threshold is met
    if (Math.abs(translateX) > threshold) {
      if (translateX < 0) {
        // Swipe left = Delete
        hapticMedium();
        onSwipeLeft();
      } else {
        // Swipe right = Edit
        hapticMedium();
        onSwipeRight();
      }
    }
    
    // Reset position
    setTranslateX(0);
    setSwipeAction(null);
  };

  // Mouse events for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    setIsSwiping(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSwiping) return;
    
    currentX.current = e.clientX;
    const diff = currentX.current - startX.current;
    
    const maxSwipe = 150;
    const limitedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));
    
    setTranslateX(limitedDiff);
    
    if (Math.abs(limitedDiff) > threshold / 2) {
      if (limitedDiff < 0) {
        setSwipeAction('delete');
      } else {
        setSwipeAction('edit');
      }
    } else {
      setSwipeAction(null);
    }
  };

  const handleMouseUp = () => {
    if (!isSwiping) return;
    handleTouchEnd();
  };

  // Cleanup on unmount
  useEffect(() => {
    const handleMouseUpGlobal = () => {
      if (isSwiping) {
        handleTouchEnd();
      }
    };
    
    document.addEventListener('mouseup', handleMouseUpGlobal);
    return () => {
      document.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isSwiping, translateX]);

  const getBackgroundColor = () => {
    if (swipeAction === 'delete') {
      return 'bg-red-500';
    } else if (swipeAction === 'edit') {
      return 'bg-teal-500';
    }
    return 'bg-slate-100';
  };

  const getIcon = () => {
    if (swipeAction === 'delete') {
      return <i className="fas fa-trash-alt text-2xl text-white"></i>;
    } else if (swipeAction === 'edit') {
      return <i className="fas fa-edit text-2xl text-white"></i>;
    }
    return null;
  };

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden rounded-xl"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Background action indicators */}
      <div className={`absolute inset-0 flex items-center ${translateX < 0 ? 'justify-end pr-6' : 'justify-start pl-6'} ${getBackgroundColor()} transition-colors duration-200`}>
        {getIcon()}
      </div>
      
      {/* Swipeable content */}
      <div
        className="relative"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {children}
      </div>
      
      {/* Swipe hint (show on first few entries) */}
      {!isSwiping && translateX === 0 && swipeAction === null && (
        <div className="absolute bottom-2 right-2 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <i className="fas fa-hand-pointer mr-1"></i>
          Swipe ← → 
        </div>
      )}
    </div>
  );
};

export default SwipeableLogEntry;

