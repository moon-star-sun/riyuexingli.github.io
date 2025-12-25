import React from 'react';

interface HtmlContentProps {
  path: string;
}

export const HtmlContent: React.FC<HtmlContentProps> = ({ path }) => {
  return (
    <div className="flex-1 w-full overflow-hidden">
      <iframe
        src={path}
        title={path.replace('.html', '')}
        className="w-full h-screen border-0"
        sandbox="allow-scripts allow-same-origin allow-pointer-lock"
        allowFullScreen
      />
    </div>
  );
};