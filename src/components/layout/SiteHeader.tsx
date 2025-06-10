import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, PlusCircle, Bell, MessageCircle, ChevronDown, User, LogOut, Settings, Shield } from 'lucide-react';

// Mock user data - replace with actual authentication logic
const mockUser = {
  name: 'User Name',
  avatarUrl: '/placeholder.svg', // Replace with actual avatar or remove if none
  initials: 'UN',
};

const SiteHeader: React.FC = () => {
  console.log("Rendering SiteHeader");
  const [searchQuery, setSearchQuery] = useState('');
  const isAuthenticated = true; // Replace with actual auth state

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted:", searchQuery);
    // Navigate to search results page with searchQuery
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 px-4 md:px-6">
        {/* Logo and Home Link */}
        <Link to="/" className="flex items-center space-x-2">
          {/* Replace with your actual logo SVG or Image */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-red-600">
            <path d="M12.001 2.003c-5.518 0-9.994 4.48-9.994 10.002 0 5.522 4.476 10.002 9.994 10.002s9.994-4.48 9.994-10.002c0-5.522-4.476-10.002-9.994-10.002Zm0 18.004c-4.411 0-7.994-3.588-7.994-8.002s3.583-8.002 7.994-8.002 7.994 3.588 7.994 8.002-3.583 8.002-7.994 8.002Z" />
            <path d="m10.863 7.443 2.673 5.834a.298.298 0 0 1-.047.348l-2.626 2.887c-.62.682-.04 1.779.818 1.779h.035c.383 0 .733-.201.92-.529l2.278-3.911c.14-.24.46-.24.601 0l2.278 3.911c.187.328.537.529.92.529h.036c.857 0 1.438-1.097.818-1.779l-2.627-2.887a.298.298 0 0 1-.047-.348l2.674-5.834c.246-.538-.13-.946-.658-.946h-.036c-.383 0-.732.201-.92.529l-2.314 4.001c-.14.24-.46.24-.601 0l-2.314-4.001c-.188-.328-.537-.529-.92-.529h-.036c-.527 0-.903.408-.657.946Z" />
          </svg>
          <span className="font-bold text-lg hidden sm:inline-block">Pinspired</span>
        </Link>

        {/* Navigation Links (for larger screens) */}
        <nav className="hidden md:flex items-center space-x-2">
          <Button variant="default" asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/explore">Explore</Link>
          </Button>
          {isAuthenticated && (
            <Button variant="ghost" asChild>
              <Link to="/create-pin">Create</Link>
            </Button>
          )}
        </nav>

        {/* Search Bar (flex-grow to take available space) */}
        <form onSubmit={handleSearchSubmit} className="flex-1 mx-4 hidden sm:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for ideas..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Icons and User Menu */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-2 md:space-x-3">
            <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex">
              <Link to="/notifications" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex">
              <Link to="/messages" aria-label="Messages">
                <MessageCircle className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="md:hidden">
              <Link to="/search" aria-label="Search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
                    <AvatarFallback>{mockUser.initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{mockUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{mockUser.name.toLowerCase().replace(' ', '')}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Admin (coming soon)</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem > {/* Add onClick for logout */}
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation (Optional, example) */}
      {isAuthenticated && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-2 flex justify-around">
            <Button variant="ghost" size="icon" asChild className="flex flex-col h-auto p-1">
                <Link to="/" aria-label="Home"><Search className="h-5 w-5 mb-1" /> <span className="text-xs">Home</span></Link>
            </Button>
             <Button variant="ghost" size="icon" asChild className="flex flex-col h-auto p-1">
                <Link to="/explore" aria-label="Explore"><Search className="h-5 w-5 mb-1" /> <span className="text-xs">Explore</span></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="flex flex-col h-auto p-1">
                <Link to="/create-pin" aria-label="Create Pin"><PlusCircle className="h-5 w-5 mb-1" /> <span className="text-xs">Create</span></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="flex flex-col h-auto p-1">
                <Link to="/notifications" aria-label="Updates"><Bell className="h-5 w-5 mb-1" /> <span className="text-xs">Updates</span></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="flex flex-col h-auto p-1">
                <Link to="/profile" aria-label="Profile">
                    <Avatar className="h-5 w-5 mb-1">
                        <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
                        <AvatarFallback>{mockUser.initials[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">Profile</span>
                </Link>
            </Button>
        </nav>
      )}
    </header>
  );
};
export default SiteHeader;