import React, { useEffect, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

const InfiniteScroll = ({ 
  children, 
  hasMore, 
  isLoading, 
  onLoadMore, 
  threshold = 100,
  className = ''
}) => {
  const observerRef = useRef();
  const loadingRef = useRef();

  const lastElementRef = useCallback(node => {
    if (isLoading) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    }, { threshold });
    
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasMore, onLoadMore, threshold]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className={className}>
      {children}
      
      {hasMore && (
        <div 
          ref={loadingRef}
          className="flex justify-center items-center py-8"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2 text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading more...</span>
            </div>
          ) : (
            <div 
              ref={lastElementRef}
              className="h-1 w-full"
            />
          )}
        </div>
      )}
      
      {!hasMore && (
        <div className="text-center py-8 text-gray-500">
          <p>No more items to load</p>
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
