import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SiteHeader from '@/components/layout/SiteHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MasonryGridContainer from '@/components/MasonryGridContainer';
import PinCard from '@/components/PinCard';
import BoardCoverDisplay from '@/components/BoardCoverDisplay';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SiteFooter from '@/components/layout/SiteFooter';
import { Search as SearchIcon, SlidersHorizontal, UserPlus } from 'lucide-react';

// Placeholder data for search results
const placeholderPinsResults = (query: string) => Array.from({ length: 12 }, (_, i) => ({
  id: `search-pin-${query}-${i + 1}`,
  title: `Pin related to '${query}' ${i + 1}`,
  imageUrl: `https://source.unsplash.com/random/400x${Math.floor(Math.random() * 200) + 400}?${encodeURIComponent(query)},sig=${i}`,
  aspectRatio: 400 / (Math.floor(Math.random() * 200) + 400),
  uploader: { name: `Creator ${i % 4 + 1}`, avatarUrl: `https://i.pravatar.cc/40?u=sCreator${i%4+1}` },
}));

const placeholderBoardsResults = (query: string) => Array.from({ length: 6 }, (_, i) => ({
  id: `search-board-${query}-${i + 1}`,
  name: `Board for '${query}' Collection ${i + 1}`,
  pinCount: Math.floor(Math.random() * 100) + 10,
  coverImages: Array.from({length: 3}, (__, k) => ({ id: `cover-${i}-${k}`, src: `https://source.unsplash.com/random/200x200?${encodeURIComponent(query)},board,sig=${i*10+k}` })),
  boardUrl: `/profile/boardUser${i+1}/board/search-board-${query}-${i+1}`
}));

const placeholderProfilesResults = (query: string) => Array.from({ length: 4 }, (_, i) => ({
  id: `search-profile-${query}-${i + 1}`,
  username: `${query}Fan${i + 1}`,
  displayName: `${query.charAt(0).toUpperCase() + query.slice(1)} Fan ${i + 1}`,
  avatarUrl: `https://i.pravatar.cc/80?u=${query}Fan${i + 1}`,
  bio: `Passionate about ${query} and sharing related ideas.`,
  followers: Math.floor(Math.random() * 2000) + 50,
  profileUrl: `/profile/${query}Fan${i + 1}`
}));


const SearchAndDiscoveryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'pins');

  console.log(`SearchAndDiscoveryPage loaded. Query: "${query}", Tab: "${activeTab}"`);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm, tab: activeTab });
    } else {
      setSearchParams({}); // Clear query if search term is empty
    }
  };

  useEffect(() => {
    // Update searchTerm if URL query changes (e.g. browser back/forward)
    setSearchTerm(searchParams.get('q') || '');
    setActiveTab(searchParams.get('tab') || 'pins');
  }, [searchParams]);
  
  const pins = query ? placeholderPinsResults(query) : [];
  const boards = query ? placeholderBoardsResults(query) : [];
  const profiles = query ? placeholderProfilesResults(query) : [];

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader /> {/* SiteHeader already has a search bar, this page might enhance it or have its own focused one */}
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-6">
        <section className="mb-8">
          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 max-w-2xl mx-auto">
            <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search for Pins, Boards, or Profiles..."
                className="pl-10 py-3 h-12 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button type="submit" size="lg" className="h-12">Search</Button>
            <Button type="button" variant="outline" size="icon" className="h-12 w-12">
                <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </form>
        </section>

        {query ? (
          <Tabs value={activeTab} onValueChange={(value) => setSearchParams({q: query, tab: value})} className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex mb-6">
              <TabsTrigger value="pins">Pins ({pins.length})</TabsTrigger>
              <TabsTrigger value="boards">Boards ({boards.length})</TabsTrigger>
              <TabsTrigger value="profiles">Profiles ({profiles.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pins">
              {pins.length > 0 ? (
                <MasonryGridContainer smCols={2} mdCols={3} lgCols={4} xlCols={5} gap={4}>
                  {pins.map(pin => (
                    <PinCard
                      key={pin.id}
                      id={pin.id}
                      title={pin.title}
                      imageUrl={pin.imageUrl}
                      aspectRatio={pin.aspectRatio}
                      uploader={pin.uploader}
                    />
                  ))}
                </MasonryGridContainer>
              ) : (
                <p className="text-center text-muted-foreground py-8">No Pins found for "{query}". Try a different search.</p>
              )}
            </TabsContent>

            <TabsContent value="boards">
              {boards.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {boards.map(board => (
                    <BoardCoverDisplay
                      key={board.id}
                      id={board.id}
                      name={board.name}
                      pinCount={board.pinCount}
                      coverImages={board.coverImages}
                      boardUrl={board.boardUrl}
                    />
                  ))}
                </div>
              ) : (
                 <p className="text-center text-muted-foreground py-8">No Boards found for "{query}".</p>
              )}
            </TabsContent>

            <TabsContent value="profiles">
              {profiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {profiles.map(profile => (
                    <Card key={profile.id} className="text-center">
                      <CardHeader className="items-center">
                        <Avatar className="w-20 h-20 mb-2">
                          <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
                          <AvatarFallback>{profile.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{profile.displayName}</CardTitle>
                        <CardDescription>@{profile.username}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground truncate">{profile.bio}</p>
                        <p className="text-xs mt-2">{profile.followers.toLocaleString()} followers</p>
                      </CardContent>
                      <CardFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:justify-center">
                        <Button variant="default" asChild size="sm">
                            <a href={profile.profileUrl}>View Profile</a>
                        </Button>
                        <Button variant="outline" size="sm">
                            <UserPlus className="mr-1.5 h-4 w-4" /> Follow
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No Profiles found for "{query}".</p>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-2">Discover new ideas</h2>
            <p className="text-muted-foreground">Start by typing in the search bar above.</p>
            {/* Optionally, display trending searches or categories here */}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default SearchAndDiscoveryPage;