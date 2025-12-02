import React from 'react';

export type AvatarType = 'axolotl' | 'cat' | 'dog' | 'bunny' | 'frog' | 'panda';

interface AvatarIconProps {
  type: string;
  className?: string;
}

export const AvatarIcon: React.FC<AvatarIconProps> = ({ type, className = "" }) => {
  const getSvgContent = () => {
    switch (type) {
      case 'axolotl':
        return (
          <g>
            <path fill="#fbcfe8" d="M2 11c0-5 4-9 10-9s10 4 10 9-4 9-10 9-10-4-10-9z" />
            {/* Gills Left */}
            <path stroke="#f472b6" strokeWidth="2" strokeLinecap="round" d="M2 11l-2-2 M2 11h-2 M2 11l-2 2" />
            {/* Gills Right */}
            <path stroke="#f472b6" strokeWidth="2" strokeLinecap="round" d="M22 11l2-2 M22 11h2 M22 11l2 2" />
            {/* Eyes */}
            <circle cx="8" cy="11" r="1.5" fill="#1e293b" />
            <circle cx="16" cy="11" r="1.5" fill="#1e293b" />
            {/* Mouth */}
            <path stroke="#1e293b" strokeWidth="1" strokeLinecap="round" d="M10 15q2 1 4 0" />
          </g>
        );
      case 'cat':
        return (
          <g>
            <path fill="#cbd5e1" d="M3 10l0-6l5 3h8l5-3l0 6c0 6-5 10-10 10s-10-4-10-10z" />
            <circle cx="8" cy="12" r="1.5" fill="#1e293b" />
            <circle cx="16" cy="12" r="1.5" fill="#1e293b" />
            <path stroke="#1e293b" strokeWidth="1" d="M11 15l1 1l1-1" fill="none" />
            {/* Whiskers */}
            <line x1="2" y1="13" x2="5" y2="13" stroke="#94a3b8" />
            <line x1="19" y1="13" x2="22" y2="13" stroke="#94a3b8" />
          </g>
        );
      case 'dog':
        return (
          <g>
            <path fill="#fdba74" d="M4 8c0-4 4-6 8-6s8 2 8 6v4c0 5-4 8-8 8s-8-3-8-8z" />
            {/* Ears */}
            <path fill="#fb923c" d="M4 8l-3 4l3-1z M20 8l3 4l-3-1z" />
             <circle cx="8" cy="10" r="1.5" fill="#1e293b" />
            <circle cx="16" cy="10" r="1.5" fill="#1e293b" />
            <circle cx="12" cy="13" r="2" fill="#1e293b" />
          </g>
        );
      case 'bunny':
        return (
          <g>
             {/* Ears */}
            <path fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="1" d="M8 8V1a2 2 0 0 1 4 0v7 M12 8V1a2 2 0 0 1 4 0v7" />
            <circle cx="12" cy="12" r="9" fill="#f3f4f6" />
            <circle cx="9" cy="11" r="1.5" fill="#1e293b" />
            <circle cx="15" cy="11" r="1.5" fill="#1e293b" />
             <path stroke="#1e293b" strokeWidth="1" strokeLinecap="round" d="M10 15q2 1 4 0" />
             <path fill="#fbcfe8" d="M11 13h2v2h-2z" className="rounded-full" />
          </g>
        );
      case 'frog':
        return (
           <g>
             <circle cx="6" cy="6" r="3" fill="#86efac" />
             <circle cx="18" cy="6" r="3" fill="#86efac" />
             <ellipse cx="12" cy="13" rx="10" ry="8" fill="#86efac" />
             <circle cx="6" cy="6" r="1" fill="#1e293b" />
             <circle cx="18" cy="6" r="1" fill="#1e293b" />
             <path stroke="#166534" strokeWidth="1" d="M8 15q4 2 8 0" fill="none" />
           </g>
        );
      case 'panda':
        return (
          <g>
             {/* Ears */}
            <circle cx="5" cy="5" r="3" fill="#1e293b" />
            <circle cx="19" cy="5" r="3" fill="#1e293b" />
            <circle cx="12" cy="12" r="9" fill="#fff" />
            {/* Eye patches */}
            <ellipse cx="8" cy="11" rx="2.5" ry="3" fill="#1e293b" transform="rotate(-30 8 11)" />
            <ellipse cx="16" cy="11" rx="2.5" ry="3" fill="#1e293b" transform="rotate(30 16 11)" />
            <circle cx="12" cy="15" r="1" fill="#1e293b" />
          </g>
        );
      default:
        return <circle cx="12" cy="12" r="10" fill="#cbd5e1" />;
    }
  };

  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      {getSvgContent()}
    </svg>
  );
};