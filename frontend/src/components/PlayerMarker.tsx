import React from 'react';
import Svg, { Circle, Path, Ellipse } from 'react-native-svg';

interface PlayerMarkerProps {
  size: number;
}

export const PlayerMarker: React.FC<PlayerMarkerProps> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Circle cx="20" cy="21" r="17" fill="#e94560" opacity="0.15" />
    <Circle cx="20" cy="21" r="17" fill="none" stroke="#e94560" strokeWidth="1.5" opacity="0.3" />

    <Path d="M14,24 L14,33 Q14,36 20,36 Q26,36 26,33 L26,24" fill="#e94560" />

    <Circle cx="20" cy="16" r="7" fill="#ffd5b8" />

    <Path d="M13,14 Q13,7 20,6 Q27,7 27,14" fill="#4a2a0a" />
    <Path d="M13,14 C11,12 12,9 14,10" fill="#4a2a0a" />
    <Path d="M27,14 C29,12 28,9 26,10" fill="#4a2a0a" />

    <Circle cx="17" cy="16" r="1.2" fill="#333" />
    <Circle cx="23" cy="16" r="1.2" fill="#333" />

    <Path d="M17,19 Q20,21 23,19" stroke="#c07050" strokeWidth="1" fill="none" strokeLinecap="round" />

    <Path d="M14,25 L10,30" stroke="#ffd5b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <Path d="M26,25 L30,30" stroke="#ffd5b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />

    <Path d="M16,34 L14,39" stroke="#e94560" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <Path d="M24,34 L26,39" stroke="#e94560" strokeWidth="2.5" strokeLinecap="round" fill="none" />

    <Ellipse cx="13" cy="39" rx="3" ry="1.5" fill="#5a3a1a" />
    <Ellipse cx="27" cy="39" rx="3" ry="1.5" fill="#5a3a1a" />

    <Circle cx="20" cy="21" r="18" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
  </Svg>
);
