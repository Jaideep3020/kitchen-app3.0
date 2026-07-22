import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fadeColorClass?: string;
  className?: string;
}

export default function ScrollAffordance({ children, fadeColorClass = 'from-white dark:from-[#121212]', className = '' }: Props) {
  const [isScrolledToRight, setIsScrolledToRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    if (scrollWidth <= clientWidth) {
      setIsScrolledToRight(true);
      return;
    }
    setIsScrolledToRight(scrollLeft + clientWidth >= scrollWidth - 5);
  };

  useEffect(() => {
    // Initial check after a short delay to allow rendering
    const timer = setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScroll);
    };
  }, [children]);

  return (
    <div className="relative w-full max-w-full">
      <div 
        ref={scrollContainerRef} 
        onScroll={checkScroll} 
        className={`overflow-x-auto no-scrollbar snap-x snap-mandatory touch-pan-x ${className}`}
      >
        {children}
      </div>
      <div 
        className={`absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l ${fadeColorClass} to-transparent pointer-events-none transition-opacity duration-300 rounded-r-inherit ${isScrolledToRight ? 'opacity-0' : 'opacity-100'}`}
        style={{ borderTopRightRadius: 'inherit', borderBottomRightRadius: 'inherit' }}
      ></div>
    </div>
  );
}
