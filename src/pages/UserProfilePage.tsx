import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SiteHeader from '@/components/layout/SiteHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BoardCoverDisplay from '@/components/BoardCoverDisplay';
import MasonryGridContainer from '@/components/MasonryGridContainer';
import PinCard from '@/components/PinCard';
import SiteFooter from '@/components/layout/SiteFooter';
import { Settings, UserPlus, Share2, PlusCircle } from 'lucide-react';

// Placeholder data for a user profile
const getPlaceholderUserProfile = (username?: string) => {
  if (!username) return null;
  const isOwnProfile = username === "currentuser"; // Example check

  return {
    username: username,
    displayName: username.charAt(0).toUpperCase() + username.slice(1) + (isOwnProfile ? " (You)" : ""),
    avatarUrl: `https://i.pravatar.cc/150?u=${username}`,
    bio: "Lover of all things creative and inspiring. Follow me for daily doses of ideas, DIY, travel, and more! Let's create something beautiful together.",
    followers: isOwnProfile ? 1234 : 5678,
    following: isOwnProfile ? 234 : 789,
    website: isOwnProfile ? "https://myportfolio.example.com" : "https://othersite.example.com",
    isOwnProfile: isOwnProfile,
    boards: Array.from({ length: 5 }, (_, i) => ({
      id: `board-${username}-${i + 1}`,
      name: `${username}'s Board ${i + 1}`,
      pinCount: Math.floor(Math.random() * 50) + 5,
      coverImages: Array.from({length: 3}, (__, k) => ({ id: `cover-${i}-${k}`, src: `https://source.unsplash.com/random/200x200?board,sig=${i*10+k}` })),
      boardUrl: `/profile/${username}/board/board-${username}-${i + 1}`
    })),
    pins: Array.from({ length: 15 }, (_, i) => ({
      id: `pin-${username}-${i + 1}`,
      title: `User ${username}'s Pin ${i + 1}`,
      imageUrl: `https://source.unsplash.com/random/400x${Math.floor(Math.random() * 200) + 300}?userpin,sig=${i}`,
      aspectRatio: 400 / (Math.floor(Math.random() * 200) + 300),
      uploader: { name: username, avatarUrl: `https://i.pravatar.cc/40?u=${username}` }
    })),
  };
};


const UserProfilePage = () => {
  const { username = "currentuser" } = useParams<{ username?: string }>(); // Default to current user for example
  console.log(`UserProfilePage loaded for user: ${username}`);
  const userProfile = getPlaceholderUserProfile(username);
  const [activeTab, setActiveTab] = React.useState("boards");


  if (!userProfile) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 container mx-auto px-4 py-6 text-center">
          <p>User profile not found.</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-6">
        {/* Profile Header */}
        <section className="flex flex-col items-center text-center mb-10">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 mb-4 border-4 border-background ring-2 ring-primary">
            <AvatarImage src={userProfile.avatarUrl} alt={userProfile.displayName} />
            <AvatarFallback>{userProfile.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl md:text-4xl font-bold">{userProfile.displayName}</h1>
          <p className="text-muted-foreground">@{userProfile.username}</p>
          <p className="mt-2 max-w-md text-sm">{userProfile.bio}</p>
          {userProfile.website && (
            <a href={userProfile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm mt-1">
              {userProfile.website}
            </a>
          )}
          <div className="flex space-x-4 mt-3 text-sm">
            <span><span className="font-semibold">{userProfile.followers.toLocaleString()}</span> followers</span>
            <span><span className="font-semibold">{userProfile.following.toLocaleString()}</span> following</span>
          </div>
          <div className="mt-6 flex space-x-2">
            {userProfile.isOwnProfile ? (
              <>
                <Button variant="outline" asChild>
                  <Link to="/settings/profile">Edit profile</Link>
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Follow
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Tabs for Boards and Pins */}
        <Tabs defaultValue="boards" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center border-b mb-6">
            <TabsList>
              <TabsTrigger value="boards">Boards</TabsTrigger>
              <TabsTrigger value="pins">Pins</TabsTrigger>
              {/* <TabsTrigger value="activity">Activity</TabsTrigger> */}
            </TabsList>
            {userProfile.isOwnProfile && activeTab === "boards" && (
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/create-board"> {/* Assuming a route for creating boards */}
                        <PlusCircle className="mr-2 h-4 w-4" /> Create Board
                    </Link>
                </Button>
            )}
             {userProfile.isOwnProfile && activeTab === "pins" && (
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/create-pin">
                        <PlusCircle className="mr-2 h-4 w-4" /> Create Pin
                    </Link>
                </Button>
            )}
          </div>
          
          <TabsContent value="boards">
            {userProfile.boards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {userProfile.boards.map(board => (
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
              <p className="text-center text-muted-foreground py-8">
                {userProfile.isOwnProfile ? "You haven't created any boards yet." : `${userProfile.displayName} hasn't created any boards yet.`}
              </p>
            )}
          </TabsContent>

          <TabsContent value="pins">
            {userProfile.pins.length > 0 ? (
                <MasonryGridContainer smCols={2} mdCols={3} lgCols={4} xlCols={5} gap={4}>
                {userProfile.pins.map(pin => (
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
                 <p className="text-center text-muted-foreground py-8">
                    {userProfile.isOwnProfile ? "You haven't created or saved any pins yet." : `${userProfile.displayName} hasn't created or saved any pins yet.`}
                </p>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  );
};

export default UserProfilePage;