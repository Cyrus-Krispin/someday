import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Defs, LinearGradient, Stop, Rect, Circle, Path, Polygon,
} from 'react-native-svg';

const useId = (prefix: string) => {
  const id = useMemo(() => `${prefix}-${Math.random().toString(36).slice(2, 8)}`, [prefix]);
  return id;
};

const starData = [
  { cx: 0.08, cy: 0.06, r: 1.5, o: 0.7 },
  { cx: 0.15, cy: 0.18, r: 1, o: 0.5 },
  { cx: 0.22, cy: 0.08, r: 1.8, o: 0.8 },
  { cx: 0.32, cy: 0.22, r: 1.2, o: 0.6 },
  { cx: 0.42, cy: 0.05, r: 1, o: 0.4 },
  { cx: 0.50, cy: 0.15, r: 1.6, o: 0.7 },
  { cx: 0.58, cy: 0.04, r: 1.2, o: 0.5 },
  { cx: 0.65, cy: 0.20, r: 1.8, o: 0.8 },
  { cx: 0.72, cy: 0.08, r: 1, o: 0.4 },
  { cx: 0.78, cy: 0.25, r: 1.4, o: 0.6 },
  { cx: 0.85, cy: 0.10, r: 1.2, o: 0.5 },
  { cx: 0.92, cy: 0.18, r: 1.6, o: 0.7 },
  { cx: 0.12, cy: 0.35, r: 1, o: 0.3 },
  { cx: 0.28, cy: 0.40, r: 1.5, o: 0.5 },
  { cx: 0.48, cy: 0.32, r: 1.2, o: 0.4 },
  { cx: 0.62, cy: 0.38, r: 1, o: 0.3 },
  { cx: 0.82, cy: 0.30, r: 1.3, o: 0.5 },
  { cx: 0.95, cy: 0.05, r: 1, o: 0.6 },
  { cx: 0.05, cy: 0.22, r: 1.3, o: 0.5 },
  { cx: 0.38, cy: 0.12, r: 0.8, o: 0.4 },
];

const mountainRanges = [
  // Far mountains
  { points: '0,55 40,22 80,35 120,18 160,30 200,25 240,20 280,32 320,15 360,28 400,55', fill: '#1a1a3e', o: 0.6 },
  // Mid mountains
  { points: '0,60 30,35 60,45 90,30 130,40 170,28 210,38 250,25 290,35 330,20 370,30 400,60', fill: '#222255', o: 0.7 },
  // Near mountains
  { points: '0,65 50,42 100,52 150,38 200,48 250,35 300,45 350,30 400,65', fill: '#2a2a5e', o: 0.8 },
];

const treeGroups = [
  // Group 1
  { baseX: 0.05, baseY: 0.62, heights: [18, 14, 20, 12] },
  { baseX: 0.12, baseY: 0.60, heights: [15, 22, 16, 10] },
  // Group 2
  { baseX: 0.35, baseY: 0.58, heights: [20, 16, 24, 14] },
  { baseX: 0.42, baseY: 0.60, heights: [12, 18, 15, 20] },
  // Group 3
  { baseX: 0.65, baseY: 0.63, heights: [22, 14, 18, 25] },
  { baseX: 0.72, baseY: 0.61, heights: [16, 20, 12, 18] },
  // Group 4
  { baseX: 0.90, baseY: 0.59, heights: [18, 24, 14, 20] },
  { baseX: 0.97, baseY: 0.62, heights: [12, 16, 20, 10] },
];

interface TerrainBackgroundProps {
  children?: React.ReactNode;
}

export const TerrainBackground: React.FC<TerrainBackgroundProps> = ({ children }) => {
  const skyId = useId('sky');
  const mountId1 = useId('m1');
  const mountId2 = useId('m2');
  const mountId3 = useId('m3');

  return (
    <View style={styles.container}>
      <Svg
        style={StyleSheet.absoluteFill}
        viewBox="0 0 400 110"
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#05051a" />
            <Stop offset="30%" stopColor="#0a0a2e" />
            <Stop offset="55%" stopColor="#151540" />
            <Stop offset="75%" stopColor="#1a1a4e" />
            <Stop offset="100%" stopColor="#0d1b2a" />
          </LinearGradient>
          <LinearGradient id={mountId1} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#1a1a3e" />
            <Stop offset="100%" stopColor="#0d0d28" />
          </LinearGradient>
          <LinearGradient id={mountId2} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#222255" />
            <Stop offset="100%" stopColor="#121240" />
          </LinearGradient>
          <LinearGradient id={mountId3} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#2a2a5e" />
            <Stop offset="100%" stopColor="#1a1a4a" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${skyId})`} />

        {starData.map((star, i) => (
          <Circle
            key={i}
            cx={star.cx * 400}
            cy={star.cy * 110}
            r={star.r}
            fill="#ffffff"
            opacity={star.o}
          />
        ))}

        <Circle
          cx={300}
          cy={42}
          r="60"
          fill="#e8c4a0"
          opacity={0.08}
        />
        <Circle
          cx={300}
          cy={42}
          r="45"
          fill="#f0d4b8"
          opacity={0.12}
        />
        <Circle
          cx={300}
          cy={42}
          r="35"
          fill="#f8e4c8"
          opacity={0.15}
        />

        {mountainRanges.map((range, i) => (
          <Polygon
            key={i}
            points={range.points}
            fill={`url(#${[mountId1, mountId2, mountId3][i]})`}
            opacity={range.o}
          />
        ))}

        {treeGroups.map((group, gi) =>
          group.heights.map((h, ti) => (
            <Polygon
              key={`t-${gi}-${ti}`}
              points={`${group.baseX * 100 + ti * 16},${group.baseY * 100} ${group.baseX * 100 + ti * 16 - 5},${group.baseY * 100 + h} ${group.baseX * 100 + ti * 16 + 5},${group.baseY * 100 + h}`}
              fill={`hsl(150, ${20 + gi * 5}%, ${10 + ti * 2}%)`}
              opacity={0.7}
            />
          ))
        )}

        <Path
          d="M-10,70 Q50,60 100,67 Q150,55 200,63 Q250,52 300,60 Q350,50 410,58 L410,110 L-10,110 Z"
          fill="#0a1a14"
          opacity={0.6}
        />

        <Path
          d="M-10,80 Q60,72 120,78 Q180,68 240,75 Q300,65 360,72 Q390,68 410,74 L410,110 L-10,110 Z"
          fill="#0d2218"
          opacity={0.5}
        />

        <Path
          d="M-10,90 Q80,82 160,88 Q240,78 320,85 Q370,80 410,86 L410,110 L-10,110 Z"
          fill="#0f2a1c"
          opacity={0.4}
        />

        <Path
          d="M-10,100 Q100,52 200,48 Q300,44 410,60 L410,110 L-10,110 Z"
          fill="#0a0a2e"
          opacity={0.3}
        />
      </Svg>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a2e',
  },
});
