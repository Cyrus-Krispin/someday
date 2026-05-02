import React from 'react';
import Svg, {
  Defs, LinearGradient, Stop, Path, Circle, Rect, Polygon, Ellipse,
} from 'react-native-svg';

interface TileProps {
  width: number;
  height: number;
}

const asp = 'xMidYMid slice';

const GrasslandTile: React.FC<TileProps> = ({ width, height }) => (
  <Svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio={asp}>
    <Defs>
      <LinearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#7ec97e" />
        <Stop offset="100%" stopColor="#5fa85f" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width="100" height="100" fill="url(#gg)" />
    <Path d="M15,90 Q20,50 12,30" stroke="#4a8f4a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M40,95 Q45,55 38,35" stroke="#4a8f4a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M65,90 Q70,50 62,30" stroke="#4a8f4a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M85,95 Q90,60 82,40" stroke="#4a8f4a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M30,92 Q25,55 33,35" stroke="#5aaf5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Path d="M55,88 Q50,48 58,28" stroke="#5aaf5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Path d="M75,85 Q78,45 72,25" stroke="#5aaf5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Circle cx="22" cy="55" r="2.5" fill="#f5d742" />
    <Circle cx="50" cy="60" r="2" fill="#f5d742" />
    <Circle cx="78" cy="50" r="2" fill="#f5d742" />
    <Circle cx="35" cy="70" r="1.5" fill="#f5a742" />
    <Circle cx="62" cy="75" r="1.5" fill="#f5a742" />
    <Path d="M-10,85 Q50,70 110,80" stroke="#8b7a50" strokeWidth="3" opacity="0.25" fill="none" />
  </Svg>
);

const ForestTile: React.FC<TileProps> = ({ width, height }) => (
  <Svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio={asp}>
    <Defs>
      <LinearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#3d7a3d" />
        <Stop offset="100%" stopColor="#2a5f2a" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width="100" height="100" fill="url(#fg)" />
    <Rect x="30" y="60" width="5" height="20" rx="1" fill="#5a3a1a" />
    <Circle cx="32" cy="45" r="18" fill="#1f551f" />
    <Circle cx="28" cy="40" r="13" fill="#2d752d" />
    <Rect x="62" y="55" width="5" height="22" rx="1" fill="#4a2a0a" />
    <Circle cx="65" cy="40" r="20" fill="#1a4a1a" />
    <Circle cx="60" cy="35" r="14" fill="#286828" />
    <Rect x="10" y="65" width="4" height="15" rx="1" fill="#5a3a1a" />
    <Circle cx="12" cy="55" r="14" fill="#1f551f" />
    <Rect x="83" y="58" width="4" height="18" rx="1" fill="#4a2a0a" />
    <Circle cx="85" cy="43" r="15" fill="#1a4a1a" />
    <Circle cx="82" cy="38" r="10" fill="#286828" />
    <Circle cx="45" cy="80" r="4" fill="#357535" />
    <Circle cx="55" cy="75" r="3" fill="#3a803a" />
    <Circle cx="72" cy="82" r="3.5" fill="#357535" />
    <Circle cx="20" cy="82" r="2.5" fill="#3a803a" />
    <Circle cx="90" cy="75" r="2" fill="#357535" />
  </Svg>
);

const MountainTile: React.FC<TileProps> = ({ width, height }) => (
  <Svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio={asp}>
    <Defs>
      <LinearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#9a9a9a" />
        <Stop offset="100%" stopColor="#707070" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width="100" height="100" fill="url(#mg)" />
    <Polygon points="50,10 5,95 95,95" fill="#808080" />
    <Polygon points="50,10 35,90 50,95 65,90" fill="#606060" opacity="0.5" />
    <Polygon points="50,10 60,32 40,32" fill="#f0f0f0" />
    <Polygon points="50,12 50,32 60,32" fill="#ffffff" />
    <Polygon points="50,12 40,32 50,32" fill="#e0e0e0" />
    <Circle cx="47" cy="18" r="2" fill="#fff" opacity="0.6" />
    <Circle cx="53" cy="24" r="1.5" fill="#fff" opacity="0.5" />
    <Ellipse cx="20" cy="75" rx="8" ry="4" fill="#606060" opacity="0.6" />
    <Ellipse cx="75" cy="80" rx="7" ry="3.5" fill="#606060" opacity="0.6" />
    <Ellipse cx="82" cy="70" rx="5" ry="3" fill="#606060" opacity="0.5" />
    <Circle cx="30" cy="65" r="1.5" fill="#505050" />
    <Circle cx="70" cy="60" r="1" fill="#505050" />
    <Circle cx="45" cy="85" r="1.5" fill="#505050" />
  </Svg>
);

const DesertTile: React.FC<TileProps> = ({ width, height }) => (
  <Svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio={asp}>
    <Defs>
      <LinearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#f2dba0" />
        <Stop offset="100%" stopColor="#d4b87a" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width="100" height="100" fill="url(#dg)" />
    <Path d="M-10,55 Q20,35 40,50 T80,45 T110,55 L110,100 L-10,100 Z" fill="#dcc080" />
    <Path d="M-10,75 Q30,60 60,75 T110,70 L110,100 L-10,100 Z" fill="#c8a870" />
    <Circle cx="15" cy="50" r="1.5" fill="#a08040" />
    <Circle cx="45" cy="45" r="1" fill="#a08040" />
    <Circle cx="75" cy="55" r="1.5" fill="#a08040" />
    <Circle cx="30" cy="80" r="1" fill="#a08040" />
    <Circle cx="60" cy="70" r="1.5" fill="#a08040" />
    <Circle cx="85" cy="80" r="1" fill="#a08040" />
    <Path d="M68,48 Q72,42 76,48" stroke="#a08040" strokeWidth="1" fill="none" opacity="0.5" />
    <Path d="M70,50 Q74,44 78,50" stroke="#a08040" strokeWidth="1" fill="none" opacity="0.5" />
    <Rect x="18" y="52" width="2" height="6" rx="1" fill="#7a6030" opacity="0.6" />
    <Rect x="18" y="52" width="6" height="2" rx="1" fill="#7a6030" opacity="0.6" />
  </Svg>
);

const WaterTile: React.FC<TileProps> = ({ width, height }) => (
  <Svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio={asp}>
    <Defs>
      <LinearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#4a9ff5" />
        <Stop offset="100%" stopColor="#2a7fd5" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width="100" height="100" fill="url(#wg)" />
    <Ellipse cx="50" cy="50" rx="18" ry="12" fill="#1a6fc5" opacity="0.25" />
    <Ellipse cx="30" cy="45" rx="10" ry="6" fill="#1a6fc5" opacity="0.2" />
    <Ellipse cx="70" cy="55" rx="12" ry="7" fill="#1a6fc5" opacity="0.2" />
    <Path d="M-5,35 Q15,25 30,35 T60,35 T90,35 T105,35" stroke="#7abffa" strokeWidth="2" fill="none" opacity="0.7" />
    <Path d="M-5,55 Q20,45 40,55 T75,55 T105,55" stroke="#7abffa" strokeWidth="2" fill="none" opacity="0.6" />
    <Path d="M-5,75 Q25,65 50,75 T100,75 T105,75" stroke="#7abffa" strokeWidth="1.5" fill="none" opacity="0.5" />
    <Circle cx="10" cy="33" r="1.5" fill="#fff" opacity="0.6" />
    <Circle cx="45" cy="38" r="1" fill="#fff" opacity="0.5" />
    <Circle cx="65" cy="32" r="1.5" fill="#fff" opacity="0.6" />
    <Circle cx="90" cy="36" r="1" fill="#fff" opacity="0.5" />
    <Circle cx="25" cy="52" r="1" fill="#fff" opacity="0.4" />
    <Circle cx="55" cy="58" r="1.5" fill="#fff" opacity="0.5" />
    <Circle cx="80" cy="52" r="1" fill="#fff" opacity="0.4" />
    <Circle cx="35" cy="72" r="1" fill="#fff" opacity="0.3" />
    <Circle cx="70" cy="78" r="1" fill="#fff" opacity="0.3" />
  </Svg>
);

export const TerrainTileArt: React.FC<{ terrainType: string; width: number; height: number }> = ({ terrainType, width, height }) => {
  switch (terrainType) {
    case 'grassland':
      return <GrasslandTile width={width} height={height} />;
    case 'forest':
      return <ForestTile width={width} height={height} />;
    case 'mountain':
      return <MountainTile width={width} height={height} />;
    case 'desert':
      return <DesertTile width={width} height={height} />;
    case 'water':
      return <WaterTile width={width} height={height} />;
    default:
      return <GrasslandTile width={width} height={height} />;
  }
};
