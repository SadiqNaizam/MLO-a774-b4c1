import React from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import MasonryGridContainer from '@/components/MasonryGridContainer';
import PinCard from '@/components/PinCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import SiteFooter from '@/components/layout/SiteFooter';

// Placeholder data for PinCards
const placeholderPins = Array.from({ length: 20 }, (_, i) => ({
  id: `pin-${i + 1}`,
  title: `Amazing Idea ${i + 1}`,
  imageUrl: `https://source.unsplash.com/random/400x${Math.floor(Math.random() * 200) + 500}?sig=${i}`, // Random height
  aspectRatio: 400 / (Math.floor(Math.random() * 200) + 500),
  uploader: {
    name: `Creator ${i % 5 + 1}`,
    avatarUrl: `https://i.pravatar.cc/40?u=creator${i % 5 + 1}`,
    profileUrl: `/profile/creator${i % 5 + 1}`,
  },
  boards: [
    { id: 'board1', name: 'My Inspirations' },
    { id: 'board2', name: 'Future Projects' },
  ],
}));

const HomePageFeedPage = () => {
  console.log('HomePage/FeedPage loaded');

  // Mock function for infinite scroll, in a real app this would fetch more data
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop === clientHeight) {
      console.log('Reached bottom of ScrollArea, load more pins...');
      // Add logic to fetch and append more pins to placeholderPins state
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-6">
        <ScrollArea className="h-[calc(100vh-150px)]" onScroll={handleScroll}> {/* Adjust height as needed */}
          <MasonryGridContainer smCols={2} mdCols={3} lgCols={4} xlCols={5} gap={4}>
            {placeholderPins.map(pin => (
              <PinCard
                key={pin.id}
                id={pin.id}
                title={pin.title}
                imageUrl={pin.imageUrl}
                aspectRatio={pin.aspectRatio}
                uploader={pin.uploader}
                boards={pin.boards}
                onSavePin={(pinId, boardId) => console.log(`Pin ${pinId} saved to board ${boardId}`)}
              />
            ))}
          </MasonryGridContainer>
        </ScrollArea>
      </main>
      <SiteFooter />
    </div>
  );
};

export default HomePageFeedPage;