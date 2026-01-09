import React from 'react';
import Marquee from 'react-fast-marquee';

interface Sponsor {
  id: number;
  name: string;
  logoUrl?: string;
}

interface SponsorsMarqueeProps {
  sponsors?: Sponsor[];
  speed?: number; // 0-100
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  pauseOnClick?: boolean;
  gradient?: boolean;
  gradientColor?: string;
  gradientWidth?: number | string;
  className?: string;
}

const SponsorsMarquee: React.FC<SponsorsMarqueeProps> = ({
  sponsors = defaultSponsors,
  speed = 50,
  direction = 'left',
  pauseOnHover = true,
  pauseOnClick = false,
  gradient = false,
  gradientColor = '#ffffff',
  gradientWidth = '5rem',
  className = '',
}) => {
  return (
    <div className={`w-full flex justify-center ${className}`}>
      {/* 75% width container */}
      <div className="w-full max-w-[75%]">
        <div className="py-4">
          <Marquee
            speed={speed}
            direction={direction}
            pauseOnHover={pauseOnHover}
            pauseOnClick={pauseOnClick}
            gradient={gradient}
            gradientColor={gradientColor}
            gradientWidth={gradientWidth}
          >
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="mx-4 flex items-center space-x-3 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {sponsor.logoUrl ? (
                  <img
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    className="h-8 w-auto object-contain"
                  />
                ) : (
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {sponsor.name.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="text-gray-800 font-medium text-lg whitespace-nowrap">
                  {sponsor.name}
                </span>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

// Default sponsors
const defaultSponsors: Sponsor[] = [
  { id: 1, name: "Apple", logoUrl: "/img/logos/apple.png" },
  { id: 2, name: "Meta", logoUrl: "/img/logos/meta.png" },
  { id: 3, name: "Facebook", logoUrl: "/img/logos/facebook.png" },
  { id: 4, name: "Google", logoUrl: "/img/logos/google.png" },
  { id: 5, name: "Paypal", logoUrl: "/img/logos/paypal.png" },
  { id: 6, name: "X", logoUrl: "/img/logos/twitter.png" },
  { id: 7, name: "TikTok", logoUrl: "/img/logos/tik-tok.png" },
  { id: 8, name: "Spotify", logoUrl: "/img/logos/spotify.png" },
  { id: 9, name: "Adidas", logoUrl: "/img/logos/adidas.png" },
  { id: 10, name: "Amazon", logoUrl: "/img/logos/amazon.png" },
];

export default SponsorsMarquee;