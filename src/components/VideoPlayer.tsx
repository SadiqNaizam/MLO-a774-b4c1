import React, { useRef, useState, useEffect } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string; // Thumbnail image
  title?: string;
  aspectRatio?: number; // e.g., 16/9
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean; // Initial muted state
  showControls?: boolean; // Whether to show custom controls
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  // Add more event handlers as needed: onTimeUpdate, onVolumeChange, etc.
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title,
  aspectRatio = 16 / 9,
  autoplay = false,
  loop = false,
  muted = false,
  showControls = true,
  onPlay,
  onPause,
  onEnded,
}) => {
  console.log("Rendering VideoPlayer for src:", src);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  let controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted; // Sync muted state
    }
  }, [isMuted]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        videoRef.current.play().then(() => setIsPlaying(true));
        if (onPlay) onPlay();
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        if (onPause) onPause();
      }
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newVolume = parseFloat(e.target.value);
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      videoRef.current.currentTime = parseFloat(e.target.value);
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleFullScreenToggle = () => {
    // Basic full screen - browser's default. For custom, need more complex handling.
    if (videoRef.current?.parentElement) {
        if (!document.fullscreenElement) {
            videoRef.current.parentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
            setIsFullScreen(true);
        } else {
            document.exitFullscreen();
            setIsFullScreen(false);
        }
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
        setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);


  const showControlsTemporarily = () => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if(isPlaying && !videoRef.current?.paused) setControlsVisible(false);
    }, 3000);
  };

  useEffect(() => {
    if (isPlaying) {
      showControlsTemporarily();
    } else {
      setControlsVisible(true) // Keep controls visible when paused
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    }
  }, [isPlaying]);


  return (
    <div 
      className="relative w-full bg-black group"
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => { if(isPlaying && !videoRef.current?.paused) setControlsVisible(false) }}
    >
      <AspectRatio ratio={aspectRatio}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          title={title}
          className="w-full h-full object-contain"
          autoPlay={autoplay}
          loop={loop}
          muted={muted} // Initial muted state controlled by prop
          playsInline
          onClick={handlePlayPause} // Play/pause on video click
          onPlay={() => { setIsPlaying(true); if (onPlay) onPlay(); }}
          onPause={() => { setIsPlaying(false); if (onPause) onPause(); }}
          onEnded={() => { setIsPlaying(false); if (onEnded) onEnded(); }}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          // Disable default controls if custom ones are shown
          controls={!showControls} 
        />
      </AspectRatio>

      {showControls && (
        <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-2 md:p-4 transition-opacity duration-300 ${controlsVisible ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 accent-red-500 cursor-pointer"
            aria-label="Video progress"
          />
          <div className="flex items-center justify-between text-white mt-1.5">
            <div className="flex items-center space-x-2 md:space-x-3">
              <Button variant="ghost" size="icon" onClick={handlePlayPause} className="text-white hover:bg-white/10 h-8 w-8 md:h-9 md:w-9">
                {isPlaying ? <Pause className="h-4 w-4 md:h-5 md:w-5" /> : <Play className="h-4 w-4 md:h-5 md:w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleMuteToggle} className="text-white hover:bg-white/10 h-8 w-8 md:h-9 md:w-9">
                {isMuted ? <VolumeX className="h-4 w-4 md:h-5 md:w-5" /> : <Volume2 className="h-4 w-4 md:h-5 md:w-5" />}
              </Button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-12 md:w-20 h-1 accent-white cursor-pointer hidden sm:block"
                aria-label="Volume"
              />
              <div className="text-xs md:text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
                {/* <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8 md:h-9 md:w-9">
                    <Settings className="h-4 w-4 md:h-5 md:w-5" />
                </Button> */}
              <Button variant="ghost" size="icon" onClick={handleFullScreenToggle} className="text-white hover:bg-white/10 h-8 w-8 md:h-9 md:w-9">
                {isFullScreen ? <Minimize className="h-4 w-4 md:h-5 md:w-5" /> : <Maximize className="h-4 w-4 md:h-5 md:w-5" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default VideoPlayer;