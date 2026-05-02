import React from 'react';
import Svg, { Path, Circle, Rect, Polygon, Line } from 'react-native-svg';

interface StructureArtProps {
  type: string;
  size: number;
}

const s = (n: number) => n;

const MineIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Rect x="4" y="22" width="32" height="14" rx="2" fill="#4a3520" />
    <Path d="M8,22 L20,8 L32,22" fill="#3a2510" />
    <Path d="M12,22 L20,12 L28,22" fill="#2a1500" />
    <Rect x="8" y="24" width="24" height="3" rx="1" fill="#5a4530" />
    <Path d="M17,24 L17,34 M20,24 L20,34 M23,24 L23,34" stroke="#2a1500" strokeWidth="1" opacity="0.4" />
    <Circle cx="14" cy="30" r="1.5" fill="#e8c040" opacity="0.7" />
    <Circle cx="26" cy="28" r="1" fill="#e8c040" opacity="0.6" />
  </Svg>
);

const FarmIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Rect x="4" y="16" width="32" height="20" rx="2" fill="#5a3520" />
    <Polygon points="6,16 20,4 34,16" fill="#8b4513" />
    <Polygon points="10,16 20,8 30,16" fill="#a0522d" />
    <Line x1="8" y1="22" x2="32" y2="22" stroke="#4a8f4a" strokeWidth="2" />
    <Line x1="8" y1="26" x2="32" y2="26" stroke="#5aaf5a" strokeWidth="2" />
    <Line x1="8" y1="30" x2="32" y2="30" stroke="#4a8f4a" strokeWidth="2" />
    <Circle cx="10" cy="21" r="1.5" fill="#f5d742" />
    <Circle cx="30" cy="29" r="1.5" fill="#f5d742" />
  </Svg>
);

const MarketIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Rect x="6" y="14" width="28" height="22" rx="2" fill="#8b6914" />
    <Polygon points="4,14 20,4 36,14" fill="#a07818" />
    <Rect x="14" y="22" width="12" height="14" rx="1" fill="#5a4510" />
    <Rect x="8" y="18" width="24" height="2" fill="#c09820" />
    <Rect x="10" y="20" width="20" height="1.5" fill="#d0a828" />
    <Circle cx="18" cy="18" r="1" fill="#f0d060" />
    <Circle cx="22" cy="18" r="1" fill="#f0d060" />
    <Circle cx="26" cy="18" r="1" fill="#f0d060" />
  </Svg>
);

const TownHallIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Polygon points="2,16 20,2 38,16" fill="#6a5a3a" />
    <Rect x="6" y="16" width="28" height="22" rx="1" fill="#8a7a5a" />
    <Rect x="12" y="20" width="16" height="18" rx="1" fill="#6a5a3a" />
    <Rect x="14" y="24" width="12" height="14" rx="0.5" fill="#5a4a2a" />
    <Line x1="16" y1="24" x2="16" y2="36" stroke="#8a7a5a" strokeWidth="1" />
    <Line x1="18" y1="24" x2="18" y2="36" stroke="#8a7a5a" strokeWidth="1" />
    <Line x1="20" y1="24" x2="20" y2="36" stroke="#8a7a5a" strokeWidth="1" />
    <Line x1="22" y1="24" x2="22" y2="36" stroke="#8a7a5a" strokeWidth="1" />
    <Line x1="24" y1="24" x2="24" y2="36" stroke="#8a7a5a" strokeWidth="1" />
    <Polygon points="16,16 20,10 24,16" fill="#5a4a2a" />
    <Circle cx="20" cy="10" r="2" fill="#e8c040" />
  </Svg>
);

const CabinIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Rect x="6" y="16" width="28" height="22" rx="1" fill="#7a5a3a" />
    <Polygon points="4,16 20,3 36,16" fill="#8b4513" />
    <Polygon points="10,16 20,8 30,16" fill="#a0522d" />
    <Rect x="15" y="22" width="10" height="16" rx="1" fill="#5a3a1a" />
    <Rect x="8" y="20" width="5" height="5" rx="1" fill="#f0e060" />
    <Circle cx="10.5" cy="22.5" r="1.5" fill="#e8c040" />
    <Line x1="8" y1="20" x2="13" y2="20" stroke="#5a3a1a" strokeWidth="1" />
    <Line x1="8" y1="25" x2="13" y2="25" stroke="#5a3a1a" strokeWidth="1" />
    <Line x1="8" y1="20" x2="8" y2="25" stroke="#5a3a1a" strokeWidth="1" />
    <Line x1="13" y1="20" x2="13" y2="25" stroke="#5a3a1a" strokeWidth="1" />
    <Path d="M20,10 L20,3" stroke="#8b4513" strokeWidth="1.5" />
  </Svg>
);

export const StructureArt: React.FC<StructureArtProps> = ({ type, size }) => {
  switch (type) {
    case 'mine':
      return <MineIcon size={size} />;
    case 'farm':
      return <FarmIcon size={size} />;
    case 'market':
      return <MarketIcon size={size} />;
    case 'town_hall':
      return <TownHallIcon size={size} />;
    case 'cabin':
      return <CabinIcon size={size} />;
    default:
      return null;
  }
};
