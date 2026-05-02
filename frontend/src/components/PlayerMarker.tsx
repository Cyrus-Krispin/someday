import React from 'react';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';

interface PlayerMarkerProps {
  size: number;
}

export const PlayerMarker: React.FC<PlayerMarkerProps> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Defs>
      <RadialGradient id="pg" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#ff6b81" />
        <Stop offset="100%" stopColor="#e94560" />
      </RadialGradient>
      <RadialGradient id="pgGlow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#e94560" stopOpacity="0.3" />
        <Stop offset="100%" stopColor="#e94560" stopOpacity="0" />
      </RadialGradient>
    </Defs>
    <Circle cx="20" cy="20" r="16" fill="url(#pgGlow)" />
    <Circle cx="20" cy="20" r="12" fill="url(#pg)" stroke="#fff" strokeWidth="2" />
    <Circle cx="20" cy="20" r="6" fill="#fff" opacity="0.3" />
    <Circle cx="17" cy="17" r="3" fill="#fff" opacity="0.15" />
  </Svg>
);
