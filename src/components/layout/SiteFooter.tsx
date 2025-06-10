import React from 'react';
import { Link } from 'react-router-dom';

const SiteFooter: React.FC = () => {
  console.log("Rendering SiteFooter");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-12 py-8 bg-background text-muted-foreground">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4 mb-4 text-sm">
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/blog" className="hover:text-foreground">Blog</Link>
          <Link to="/careers" className="hover:text-foreground">Careers</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          {/* Add more links as needed */}
        </div>
        <p className="text-xs">&copy; {currentYear} Pinspired Inc. All rights reserved.</p>
        <p className="text-xs mt-1">A project for demonstration purposes.</p>
      </div>
    </footer>
  );
};
export default SiteFooter;