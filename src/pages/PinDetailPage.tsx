import React from 'react';
import { useParams } from 'react-router-dom';
import SiteHeader from '@/components/layout/SiteHeader';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import MasonryGridContainer from '@/components/MasonryGridContainer';
import PinCard from '@/components/PinCard';
import VideoPlayer from '@/components/VideoPlayer'; // Assuming this custom component exists
import SiteFooter from '@/components/layout/SiteFooter';
import { Heart, MessageCircle, Send, MoreHorizontal, Bookmark } from 'lucide-react';

// Placeholder data for a single Pin
const getPlaceholderPinDetail = (pinId?: string) => {
  if (!pinId) return null;
  const isVideo = Math.random() > 0.7; // 30% chance of being a video
  return {
    id: pinId,
    title: `Detailed View of Pin ${pinId}`,
    description: "This is a detailed description of the pin. It could be about travel, recipes, DIY projects, or anything inspiring. The content here should give users more context about what they are looking at.",
    imageUrl: `https://source.unsplash.com/random/800x600?pin=${pinId}`,
    videoUrl: isVideo ? `https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4?pin=${pinId}` : undefined, // Example video
    uploader: {
      name: "Inspiration Guru",
      avatarUrl: `https://i.pravatar.cc/80?u=gurupin${pinId}`,
      profileUrl: "/profile/inspirationguru",
      followers: 1250,
    },
    comments: [
      { id: 'comment1', user: { name: 'Commenter One', avatarUrl: 'https://i.pravatar.cc/40?u=commenter1' }, text: 'Wow, this is amazing!', timestamp: '2 hours ago' },
      { id: 'comment2', user: { name: 'Another User', avatarUrl: 'https://i.pravatar.cc/40?u=commenter2' }, text: 'Love this idea. Thanks for sharing!', timestamp: '1 hour ago' },
    ],
    boards: [ { id: 'board1', name: 'My Collection' }, { id: 'board2', name: 'Great Finds' } ],
  };
};

// Placeholder for related pins
const placeholderRelatedPins = Array.from({ length: 10 }, (_, i) => ({
  id: `related-pin-${i + 1}`,
  title: `Related Idea ${i + 1}`,
  imageUrl: `https://source.unsplash.com/random/400x${Math.floor(Math.random() * 200) + 400}?related,sig=${i}`,
  aspectRatio: 400 / (Math.floor(Math.random() * 200) + 400),
  uploader: {
    name: `Related Creator ${i % 3 + 1}`,
    avatarUrl: `https://i.pravatar.cc/40?u=relatedcreator${i % 3 + 1}`,
  },
}));

const PinDetailPage = () => {
  const { pinId } = useParams<{ pinId: string }>();
  console.log(`PinDetailPage loaded for pin ID: ${pinId}`);
  const pin = getPlaceholderPinDetail(pinId);

  if (!pin) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 container mx-auto px-4 py-6 text-center">
          <p>Pin not found.</p>
        </main>
        <SiteFooter />
      </div>
    );
  }
  
  const [commentText, setCommentText] = React.useState('');

  const handlePostComment = () => {
    if(commentText.trim()){
      console.log(`Posting comment for pin ${pinId}: ${commentText}`);
      // Add comment to pin.comments state, clear textarea
      setCommentText('');
      // Show toast notification
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {/* Could link to a category or search result page */}
              <BreadcrumbLink href="/explore">Explore</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pin.title.substring(0,30)}...</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Media Section (Image or Video) */}
            <div className="bg-black flex items-center justify-center">
              {pin.videoUrl ? (
                <VideoPlayer src={pin.videoUrl} poster={pin.imageUrl} title={pin.title} aspectRatio={16/9} showControls={true} />
              ) : (
                <img src={pin.imageUrl} alt={pin.title} className="w-full h-auto max-h-[80vh] object-contain" />
              )}
            </div>

            {/* Details Section */}
            <div className="p-6 md:p-8 flex flex-col space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  {/* Source link could go here if available */}
                </div>
                <Button variant="ghost" size="icon"><MoreHorizontal className="h-5 w-5"/></Button>
                <Button variant="destructive" size="lg" className="ml-2">Save</Button>
              </div>
              
              <h1 className="text-3xl font-bold">{pin.title}</h1>
              <p className="text-muted-foreground text-sm">{pin.description}</p>

              {/* Uploader Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={pin.uploader.avatarUrl} alt={pin.uploader.name} />
                    <AvatarFallback>{pin.uploader.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <a href={pin.uploader.profileUrl} className="font-semibold hover:underline">{pin.uploader.name}</a>
                    <p className="text-xs text-muted-foreground">{pin.uploader.followers.toLocaleString()} followers</p>
                  </div>
                </div>
                <Button variant="secondary">Follow</Button>
              </div>

              {/* Comments Section */}
              <div>
                <h2 className="text-xl font-semibold mb-3">Comments ({pin.comments.length})</h2>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  {pin.comments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user.avatarUrl} alt={comment.user.name} />
                        <AvatarFallback>{comment.user.name.substring(0,1).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p>
                          <span className="font-semibold text-sm">{comment.user.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">{comment.timestamp}</span>
                        </p>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-start space-x-2">
                   <Avatar className="h-10 w-10 mt-1">
                     <AvatarImage src={pin.uploader.avatarUrl} /> {/* Current user avatar */}
                     <AvatarFallback>{pin.uploader.name.substring(0,1).toUpperCase()}</AvatarFallback>
                   </Avatar>
                   <Textarea 
                     placeholder="Add a comment..." 
                     className="flex-1"
                     value={commentText}
                     onChange={(e) => setCommentText(e.target.value)}
                     rows={2}
                   />
                   <Button onClick={handlePostComment} size="icon" className="mt-1" disabled={!commentText.trim()}>
                     <Send className="h-4 w-4" />
                   </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Related Pins Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">More like this</h2>
          <MasonryGridContainer smCols={2} mdCols={3} lgCols={4} xlCols={5} gap={4}>
            {placeholderRelatedPins.map(relatedPin => (
              <PinCard
                key={relatedPin.id}
                id={relatedPin.id}
                title={relatedPin.title}
                imageUrl={relatedPin.imageUrl}
                aspectRatio={relatedPin.aspectRatio}
                uploader={relatedPin.uploader}
              />
            ))}
          </MasonryGridContainer>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default PinDetailPage;