import React from 'react';

interface MasonryGridContainerProps {
  children: React.ReactNode;
  // Define column counts for different breakpoints
  // These are just examples, adjust as needed for your design
  smCols?: number; // Small screens
  mdCols?: number; // Medium screens
  lgCols?: number; // Large screens
  xlCols?: number; // Extra large screens
  gap?: number; // Gap between items in pixels
}

const MasonryGridContainer: React.FC<MasonryGridContainerProps> = ({
  children,
  smCols = 2,
  mdCols = 3,
  lgCols = 4,
  xlCols = 5,
  gap = 4, // Corresponds to Tailwind's `gap-4` (1rem)
}) => {
  console.log("Rendering MasonryGridContainer");

  // This is a simple CSS columns approach. For more robust masonry,
  // consider libraries like 'react-masonry-css' or a custom JS solution if needed.
  // Note: `column-count` can sometimes have issues with items breaking unexpectedly
  // if their heights are dynamic or content loads late.
  // A grid-based approach like `grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))`
  // is more robust for varying item widths but doesn't create a true masonry effect without JS.

  const columnStyle: React.CSSProperties = {
    // These will be overridden by Tailwind classes for responsiveness
    // but provide a fallback if Tailwind isn't fully configured.
    columnGap: `${gap * 0.25}rem`,
  };

  // Construct responsive column classes
  // Example: 'columns-2 md:columns-3 lg:columns-4'
  // Tailwind JIT needs full class names.
  const getColumnClasses = () => {
    let classes = '';
    if (smCols) classes += ` columns-${smCols}`;
    if (mdCols) classes += ` md:columns-${mdCols}`;
    if (lgCols) classes += ` lg:columns-${lgCols}`;
    if (xlCols) classes += ` xl:columns-${xlCols}`;
    return classes.trim();
  };

  const gapClass = `gap-${gap}`; // e.g., gap-4

  return (
    <div
      className={`masonry-grid ${getColumnClasses()} ${gapClass}`}
      style={columnStyle}
    >
      {React.Children.map(children, (child) => (
        // Ensure child items break inside correctly and have bottom margin
        <div className={`break-inside-avoid mb-${gap}`}>
          {child}
        </div>
      ))}
    </div>
  );
};

export default MasonryGridContainer;