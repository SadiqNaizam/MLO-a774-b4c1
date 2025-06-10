import React from 'react';
import { Link } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface BoardCoverDisplayProps {
  id: string;
  name: string;
  pinCount: number;
  // Display up to 3-4 cover images for the board
  coverImages: { id: string; src: string; alt?: string }[];
  boardUrl?: string; // URL to the board page
  className?: string;
}

const BoardCoverDisplay: React.FC<BoardCoverDisplayProps> = ({
  id,
  name,
  pinCount,
  coverImages,
  boardUrl,
  className = '',
}) => {
  console.log("Rendering BoardCoverDisplay:", name);

  const mainImage = coverImages[0];
  const sideImages = coverImages.slice(1, 3); // Max 2 side images

  const content = (
    <div className={`w-full rounded-xl overflow-hidden shadow-lg bg-muted ${className}`}>
      <AspectRatio ratio={4 / 3} className="flex">
        {/* Main image takes up left 2/3 or full if no side images */}
        <div className={`${sideImages.length > 0 ? 'w-2/3' : 'w-full'} h-full`}>
          {mainImage ? (
            <img
              src={mainImage.src || '/placeholder.svg'}
              alt={mainImage.alt || name}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No pins</span>
            </div>
          )}
        </div>
        {/* Side images take up right 1/3, split vertically */}
        {sideImages.length > 0 && (
          <div className="w-1/3 h-full flex flex-col">
            <div className="h-1/2 w-full border-l border-b border-background">
              {sideImages[0] ? (
                <img
                  src={sideImages[0].src || '/placeholder.svg'}
                  alt={sideImages[0].alt || name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                />
              ) : (
                <div className="w-full h-full bg-gray-200"></div>
              )}
            </div>
            <div className="h-1/2 w-full border-l border-background">
              {sideImages[1] ? (
                <img
                  src={sideImages[1].src || '/placeholder.svg'}
                  alt={sideImages[1].alt || name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                />
              ) : (
                <div className="w-full h-full bg-gray-200"></div>
              )}
            </div>
          </div>
        )}
      </AspectRatio>
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-base md:text-lg truncate">{name}</h3>
        <p className="text-xs md:text-sm text-muted-foreground">{pinCount} Pin{pinCount !== 1 ? 's' : ''}</p>
      </div>
    </div>
  );

  if (boardUrl) {
    return (
      <Link to={boardUrl} aria-label={`View board ${name}`} className="block hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};
export default BoardCoverDisplay;