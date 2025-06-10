import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Bookmark, Share2, ChevronDown } from 'lucide-react';
// Assume useToast is available for notifications
// import { useToast } from "@/hooks/use-toast";

interface PinCardProps {
  id: string;
  title?: string; // Optional title displayed on hover or below image
  imageUrl: string;
  videoUrl?: string; // If it's a video pin
  aspectRatio?: number; // e.g., 9/16 for tall pins, 16/9 for wide, 1 for square
  uploader?: {
    name: string;
    avatarUrl?: string;
    profileUrl?: string;
  };
  // Mock boards for the dropdown
  boards?: { id: string; name: string }[];
  onSavePin?: (pinId: string, boardId?: string) => void;
}

const PinCard: React.FC<PinCardProps> = ({
  id,
  title,
  imageUrl,
  videoUrl, // We'll prioritize video if present
  aspectRatio = 3 / 4, // Default to a slightly tall aspect ratio
  uploader,
  boards = [
    { id: 'board1', name: 'My Awesome Ideas' },
    { id: 'board2', name: 'Travel Inspiration' },
  ], // Example boards
  onSavePin,
}) => {
  console.log("Rendering PinCard:", id, title);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<string | undefined>(boards.length > 0 ? boards[0].id : undefined);
  // const { toast } = useToast(); // Uncomment if using toast

  const handleSave = () => {
    if (onSavePin) {
      onSavePin(id, selectedBoard);
      // toast({ title: "Pin Saved!", description: `Saved to ${boards.find(b => b.id === selectedBoard)?.name || 'your pins'}.` });
      console.log(`Pin ${id} saved to board ${selectedBoard}`);
    } else {
      console.log(`Save action for pin ${id} to board ${selectedBoard} (no handler provided)`);
    }
  };

  const pinDetailUrl = `/pin/${id}`;

  return (
    <div
      className="relative group rounded-lg overflow-hidden shadow-md bg-muted cursor-pointer break-inside-avoid"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={pinDetailUrl} className="absolute inset-0 z-0" aria-label={title || `View pin ${id}`}></Link>
      
      <div className="relative z-10"> {/* Content sits above the link overlay */}
        <AspectRatio ratio={aspectRatio}>
          {videoUrl ? (
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline // Important for mobile autoplay
              onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if error
            />
          ) : (
            <img
              src={imageUrl || '/placeholder.svg'}
              alt={title || `Pin ${id}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          )}
        </AspectRatio>

        {/* Overlay appears on hover, contains actions */}
        {(isHovered || videoUrl) && ( // Keep overlay for video pins for controls if added
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-between p-2 md:p-3 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            {/* Top part of overlay: Save button and board selector */}
            <div className="flex justify-end items-center space-x-2">
              {boards.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="bg-white hover:bg-gray-100 text-black text-xs h-8">
                      {boards.find(b => b.id === selectedBoard)?.name.substring(0,15) + (boards.find(b => b.id === selectedBoard)?.name.length ?? 0 > 15 ? '...' : '') || "Select Board"}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 z-20"> {/* Ensure dropdown is above other elements */}
                    <DropdownMenuLabel>Save to Board</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {boards.map(board => (
                      <DropdownMenuItem key={board.id} onSelect={() => setSelectedBoard(board.id)}>
                        {board.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button variant="destructive" size="sm" onClick={handleSave} className="h-8 text-xs">
                Save
              </Button>
            </div>

            {/* Bottom part of overlay: Optional actions like share or more options */}
            <div className="flex items-center justify-end space-x-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 bg-black/30 hover:bg-black/50 text-white">
                <Share2 className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 bg-black/30 hover:bg-black/50 text-white">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Optional: Title and Uploader Info below the image/video */}
      {(title || uploader) && (
        <div className="p-2 md:p-3">
          {title && <h3 className="font-semibold text-sm truncate">{title}</h3>}
          {uploader && (
            <Link
              to={uploader.profileUrl || '#'}
              className="flex items-center space-x-1.5 text-xs text-muted-foreground mt-1 hover:underline z-10 relative"
              onClick={(e) => e.stopPropagation()} // Prevent card click if clicking uploader
            >
              <Avatar className="h-5 w-5">
                <AvatarImage src={uploader.avatarUrl} alt={uploader.name} />
                <AvatarFallback>{uploader.name.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <span>{uploader.name}</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
export default PinCard;