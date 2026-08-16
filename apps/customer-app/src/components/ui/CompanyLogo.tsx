import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Path, G, Rect } from 'react-native-svg';

export interface CompanyLogoProps {
  size?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  size = 32,
  width,
  height,
  className,
}) => {
  const w = width || size;
  const h = height || size;

  return (
    <Svg
      width={w}
      height={h}
      viewBox="0 0 280 280"
      fill="none"
      className={className}
    >
      <Defs>
        <LinearGradient id="ed-mg" x1="20%" y1="0%" x2="80%" y2="100%">
          <Stop offset="0%" stopColor="#46D9A2" />
          <Stop offset="100%" stopColor="#0E9E86" />
        </LinearGradient>
      </Defs>
      <Path
        d="M140 42 C 190 103, 221 147, 221 181 A 81 81 0 1 1 59 181 C 59 147, 90 103, 140 42 Z"
        fill="url(#ed-mg)"
      />
      <G transform="translate(140 160)">
        <Rect x="-9" y="-30" width="18" height="60" rx="5" fill="#123A34" />
        <Rect x="-30" y="-9" width="60" height="18" rx="5" fill="#123A34" />
      </G>
    </Svg>
  );
};
