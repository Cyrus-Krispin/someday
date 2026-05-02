import React from 'react';
import Svg, {
  Defs, LinearGradient, Stop, Path, Circle, Rect, Polygon, Ellipse,
} from 'react-native-svg';

interface TileProps {
  width: number;
  height: number;
}

const asp = 'xMidYMid slice';

const V = 300;
const H = V;
const C = V / 2;
const Q = V / 6;

const g = (cx: number, cy: number, r: number, fill: string, opacity?: number) => (
  <Circle key={`c${cx}${cy}`} cx={cx} cy={cy} r={r} fill={fill} opacity={opacity ?? 1} />
);

const p = (d: string, stroke: string, w: number, fill?: string, op?: number) => (
  <Path key={d.slice(0, 12)} d={d} stroke={stroke} strokeWidth={w} fill={fill ?? 'none'} opacity={op ?? 1} strokeLinecap="round" />
);

const GrasslandTile: React.FC<TileProps> = ({ width, height }) => (
  <Svg width={width} height={height} viewBox={`0 0 ${V} ${H}`} preserveAspectRatio={asp}>
    <Defs>
      <LinearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#7ec97e" />
        <Stop offset="100%" stopColor="#5fa85f" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width={V} height={H} fill="url(#gg)" />
    <Rect x="0" y="0" width={Q} height={V} fill="#6abf6a" opacity="0.15" />
    <Rect x={Q * 3} y="0" width={Q} height={V} fill="#8fd48f" opacity="0.1" />
    <Rect x="0" y={Q * 2} width={V} height={Q} fill="#6abf6a" opacity="0.08" />
    <Rect x={Q * 4} y={Q * 3} width={Q} height={Q} fill="#8fd48f" opacity="0.06" />
    {[
      [30,270,90,30],[80,280,85,25],[140,265,95,35],[190,275,92,28],[250,270,88,32],
      [50,250,48,20],[110,260,55,22],[170,255,52,18],[230,265,50,25],[290,258,48,20],
      [20,230,18,10],[65,240,22,12],[125,235,20,8],[185,245,25,14],[245,230,22,10],
      [280,240,20,12],[35,210,15,8],[95,220,18,10],[155,215,16,8],[215,225,20,12],
      [270,215,18,10],[10,195,12,6],[75,200,14,8],[135,190,13,6],[200,195,16,10],
      [260,200,14,8],[45,175,11,6],[105,180,13,8],[165,170,12,6],[225,175,15,8],
      [290,180,11,6],[25,155,10,5],[85,160,12,7],[145,150,11,5],[205,155,13,8],
      [250,160,10,5],[55,135,9,5],[115,140,11,6],[175,130,10,5],[235,135,12,7],
      [275,140,9,5],[15,115,8,4],[70,120,10,5],[130,110,9,4],[190,115,11,6],
      [240,120,8,4],[40,95,7,4],[100,100,9,5],[160,90,8,4],[220,95,10,5],
      [280,100,7,4],
    ].map(([x, y, endY, _]) =>
      p(`M${x},${y} Q${x + (x % 15 < 5 ? -8 : 8)},${(y + endY) / 2} ${x + (x % 11 < 3 ? -5 : 5)},${endY}`,
        '#4a8f4a', 2)
    )}
    {[
      [22,145,2.5,'#f5d742'],[48,158,2,'#f5d742'],[72,142,2,'#f5d742'],[95,155,1.5,'#f5a742'],
      [118,148,2,'#f5d742'],[142,160,1.5,'#f5d742'],[165,140,2,'#f5d742'],[188,152,1.5,'#f5a742'],
      [212,145,2,'#f5d742'],[238,158,1.5,'#f5d742'],[262,142,2,'#f5d742'],[285,155,1.5,'#f5a742'],
      [35,185,2,'#f5d742'],[68,175,1.5,'#f5a742'],[98,190,2,'#f5d742'],[128,180,1.5,'#f5d742'],
      [158,195,2,'#f5a742'],[188,178,1.5,'#f5d742'],[218,190,2,'#f5a742'],[248,182,1.5,'#f5d742'],
      [278,195,2,'#f5a742'],[42,120,1.5,'#f5d742'],[82,110,2,'#f5a742'],[112,125,1.5,'#f5d742'],
      [152,115,2,'#f5d742'],[182,130,1.5,'#f5a742'],[222,115,2,'#f5d742'],[252,125,1.5,'#f5a742'],
      [282,120,2,'#f5d742'],[55,90,1.5,'#f5d742'],[135,85,2,'#f5d742'],[205,90,1.5,'#f5a742'],
      [265,88,2,'#f5d742'],
    ].map(([x, y, r, fill]) => g(x, y, r, fill))}
    <Path d={`M-10,${V - 30} Q${C - 40},${V - 80} ${C},${V - 50} T${V + 10},${V - 40}`}
      stroke="#8b7a50" strokeWidth={5} opacity="0.2" fill="none" />
    <Path d={`M-10,${V - 55} Q${C + 30},${V - 95} ${C + 60},${V - 65} T${V + 10},${V - 60}`}
      stroke="#8b7a50" strokeWidth={3} opacity="0.12" fill="none" />
  </Svg>
);

const ForestTile: React.FC<TileProps> = ({ width, height }) => (
  <Svg width={width} height={height} viewBox={`0 0 ${V} ${H}`} preserveAspectRatio={asp}>
    <Defs>
      <LinearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#3d7a3d" />
        <Stop offset="100%" stopColor="#2a5f2a" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width={V} height={H} fill="url(#fg)" />
    <Rect x={Q * 2} y="0" width={Q} height={V} fill="#357535" opacity="0.1" />
    <Rect x="0" y={Q * 3} width={V} height={Q} fill="#256f25" opacity="0.08" />
    <Rect x={Q * 4} y={Q} width={Q} height={Q} fill="#357535" opacity="0.06" />
    {[
      [45,170,14,28,24,'#1a4a1a','#286828'],[140,155,16,30,22,'#1f551f','#2d752d'],
      [230,165,15,28,26,'#1a4a1a','#286828'],[85,200,12,22,18,'#1f551f','#2d752d'],
      [180,190,13,24,20,'#1a4a1a','#286828'],[270,195,11,20,16,'#1f551f','#2d752d'],
      [60,120,10,18,14,'#1a4a1a','#286828'],[155,110,11,20,16,'#1f551f','#2d752d'],
      [250,115,12,22,18,'#1a4a1a','#286828'],[35,250,9,16,12,'#1f551f','#2d752d'],
      [130,240,10,18,14,'#1a4a1a','#286828'],[220,245,11,20,16,'#1f551f','#2d752d'],
      [290,230,8,14,10,'#1f551f','#2d752d'],[15,80,8,14,10,'#1a4a1a','#286828'],
      [195,75,9,16,12,'#1f551f','#2d752d'],[285,80,7,12,8,'#1a4a1a','#286828'],
      [105,280,8,14,10,'#1f551f','#2d752d'],[205,275,9,16,12,'#1a4a1a','#286828'],
      [280,270,7,12,8,'#1f551f','#2d752d'],
    ].flatMap(([cx, cy, r1, r2, r3, dark, light]) => [
      <Rect key={`tr${cx}`} x={cx - 2} y={cy + r1 - 2} width={4} height={r2} rx={1} fill="#4a2a0a" />,
      <Circle key={`tc${cx}`} cx={cx} cy={cy} r={r1} fill={dark} />,
      <Circle key={`tl${cx}`} cx={cx - (cx % 7 - 3)} cy={cy - (cx % 5 - 2)} r={r3} fill={light} />,
    ])}
    {[
      [45,220,4,'#357535'],[65,210,3,'#3a803a'],[95,230,3.5,'#357535'],[120,215,3,'#3a803a'],
      [145,225,4,'#357535'],[170,210,3,'#3a803a'],[200,230,3.5,'#357535'],[225,215,3,'#3a803a'],
      [250,225,4,'#357535'],[275,210,3,'#3a803a'],[15,240,2.5,'#357535'],[85,245,3,'#3a803a'],
      [155,240,2.5,'#357535'],[215,250,3,'#3a803a'],[285,245,2,'#357535'],[35,270,3,'#3a803a'],
      [110,265,2.5,'#357535'],[175,270,3,'#3a803a'],[245,260,2.5,'#357535'],[55,285,2,'#3a803a'],
      [135,280,2.5,'#357535'],[195,290,2,'#3a803a'],[265,285,2.5,'#357535'],
      [30,95,2.5,'#357535'],[100,90,3,'#3a803a'],[170,95,2.5,'#357535'],[235,90,3,'#3a803a'],
      [290,95,2,'#357535'],[75,60,2,'#3a803a'],[160,55,2.5,'#357535'],[225,60,2,'#3a803a'],
    ].map(([x, y, r, fill]) => g(x, y, r, fill))}
  </Svg>
);

const MountainTile: React.FC<TileProps> = ({ width, height }) => (
  <Svg width={width} height={height} viewBox={`0 0 ${V} ${H}`} preserveAspectRatio={asp}>
    <Defs>
      <LinearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#9a9a9a" />
        <Stop offset="100%" stopColor="#707070" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width={V} height={H} fill="url(#mg)" />
    <Rect x={Q} y="0" width={Q} height={H} fill="#888" opacity="0.08" />
    <Rect x={Q * 3} y="0" width={Q} height={H} fill="#aaa" opacity="0.06" />
    <Polygon points={`${C},15 5,${H - 5} ${V - 5},${H - 5}`} fill="#808080" />
    <Polygon points={`${C},15 ${C - 40},${H - 5} ${C + 30},${H - 5}`} fill="#606060" opacity="0.4" />
    <Polygon points={`${C},15 ${C + 50},${H - 5} ${V - 5},${H - 5}`} fill="#909090" opacity="0.3" />
    {[
      [C,42,60],[C,48,80],[C,55,100],[C,65,130],[C,78,160],[C,95,190],
    ].map(([cx, cy, w]) =>
      <Polygon key={`pk${cy}`}
        points={`${cx - w / 2},${cy} ${cx},${cy - 22} ${cx + w / 2},${cy}`}
        fill="#808080" opacity="0.15" />
    )}
    <Polygon points={`${C},15 ${C + 40},${C - 15} ${C - 40},${C - 15}`} fill="#f0f0f0" />
    <Polygon points={`${C},15 ${C},${C - 15} ${C + 40},${C - 15}`} fill="#ffffff" />
    <Polygon points={`${C},15 ${C - 40},${C - 15} ${C},${C - 15}`} fill="#e0e0e0" />
    <Polygon points={`${C - 25},${C - 25} ${C - 45},${C + 15} ${C - 5},${C + 15}`} fill="#f0f0f0" />
    <Polygon points={`${C + 25},${C - 35} ${C + 5},${C + 5} ${C + 45},${C + 5}`} fill="#e8e8e8" />
    <Circle cx={C} cy={30} r={3} fill="#fff" opacity="0.5" />
    <Circle cx={C - 15} cy={45} r={2} fill="#fff" opacity="0.4" />
    <Circle cx={C + 12} cy={38} r={2.5} fill="#fff" opacity="0.45" />
    {[
      [40,230,12,6],[75,240,10,5],[120,220,14,7],[180,235,11,5.5],[230,225,13,6.5],
      [270,240,9,4.5],[50,260,8,4],[100,250,10,5],[155,260,9,4.5],[210,250,11,5.5],
      [260,260,8,4],[30,275,7,3.5],[90,270,9,4.5],[145,280,8,4],[200,270,10,5],
      [250,280,7,3.5],[285,275,6,3],
    ].map(([x, y, rx, ry]) =>
      <Ellipse key={`re${x}`} cx={x} cy={y} rx={rx} ry={ry} fill="#606060" opacity="0.5" />
    )}
    {[
      [25,205],[65,195],[110,210],[155,200],[200,215],[245,205],[290,195],
      [45,180],[85,185],[135,175],[180,190],[225,180],[270,185],
      [55,155],[100,160],[150,150],[195,165],[240,155],[280,160],
    ].map(([x, y]) => g(x, y, 1.5, '#505050'))}
  </Svg>
);

const DesertTile: React.FC<TileProps> = ({ width, height }) => (
  <Svg width={width} height={height} viewBox={`0 0 ${V} ${H}`} preserveAspectRatio={asp}>
    <Defs>
      <LinearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#f2dba0" />
        <Stop offset="100%" stopColor="#d4b87a" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width={V} height={H} fill="url(#dg)" />
    <Rect x={Q} y="0" width={Q} height={H} fill="#e8d090" opacity="0.1" />
    <Rect x={Q * 4} y="0" width={Q} height={H} fill="#f8e8b0" opacity="0.08" />
    <Rect x="0" y={Q} width={V} height={Q} fill="#dcc080" opacity="0.06" />
    {[
      [-10,140,60,95,C + 30,165,T + 30,C + 60,120,V + 10,140],
      [-10,200,80,160,C - 20,180,T + 40,C + 20,160,V + 10,190],
      [-10,260,C - 60,230,C + 40,250,T + 20,C + 70,240,V + 10,250],
    ].flatMap(([x1, y1, x2, y2, x3, y3, _, x4, y4, x5, y5], i) => [
      <Path key={`d1${i}`}
        d={`M${x1},${y1} Q${x2},${y2} ${x3},${y3} T${x4},${y4} L${x5},${H} L${x1},${H} Z`}
        fill={i === 0 ? '#dcc080' : i === 1 ? '#c8a870' : '#b89868'} />,
    ])}
    {[
      [15,130],[45,140],[78,128],[110,138],[150,132],[190,142],[230,128],[270,140],[295,132],
      [30,180],[68,170],[100,185],[140,175],[180,190],[220,178],[260,185],[290,175],
      [20,230],[55,220],[90,235],[130,225],[170,240],[210,230],[250,235],[280,225],
      [40,270],[75,260],[110,275],[150,265],[190,280],[230,270],[270,275],
      [25,160],[60,150],[95,165],[135,155],[175,170],[215,160],[255,165],
    ].map(([x, y]) => g(x, y, 1.5, '#a08040'))}
    {[
      [32,155,2,'#a08040'],[68,165,1.5,'#a08040'],[105,150,2,'#a08040'],
      [185,155,1.5,'#a08040'],[225,165,2,'#a08040'],[255,150,1.5,'#a08040'],
      [45,210,2,'#a08040'],[85,200,1.5,'#a08040'],[155,210,2,'#a08040'],
      [195,200,1.5,'#a08040'],[245,210,2,'#a08040'],[275,200,1.5,'#a08040'],
      [35,110,1.5,'#a08040'],[125,110,2,'#a08040'],[205,115,1.5,'#a08040'],
      [285,110,2,'#a08040'],
    ].map(([x, y, r, fill]) => g(x, y, r, fill))}
    {[
      [170,125,185,118],[210,120,225,113],[250,128,265,120],
      [60,195,75,188],[140,192,155,185],[180,140,195,133],
    ].map(([x1, y1, x2, y2]) =>
      <Path key={`rip${x1}`} d={`M${x1},${y1} Q${(x1 + x2) / 2},${y1 - 3} ${x2},${y2}`}
        stroke="#a08040" strokeWidth={1} fill="none" opacity="0.4" />
    )}
    {[
      [15,55,6,18],[22,60,18,6],[18,63,4,12],[25,57,12,4],
      [80,52,5,15],[87,55,15,5],[82,58,3,10],[88,53,10,3],
      [275,58,5,15],[282,60,15,5],[278,63,3,10],[284,57,10,3],
    ].map(([x, y, w, h]) => (
      <Rect key={`cac${x}`} x={x} y={y} width={w} height={h} rx={1} fill="#7a6030" opacity="0.5" />
    ))}
  </Svg>
);

const WaterTile: React.FC<TileProps> = ({ width, height }) => (
  <Svg width={width} height={height} viewBox={`0 0 ${V} ${H}`} preserveAspectRatio={asp}>
    <Defs>
      <LinearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#4a9ff5" />
        <Stop offset="100%" stopColor="#2a7fd5" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width={V} height={H} fill="url(#wg)" />
    <Rect x={Q * 2} y="0" width={Q} height={H} fill="#3a8fe5" opacity="0.1" />
    <Rect x="0" y={Q * 2} width={V} height={Q} fill="#5aaff5" opacity="0.06" />
    {[
      [C - 40, V * 0.35, 18, 12, 0.25],
      [C - 90, V * 0.45, 12, 8, 0.2],
      [C + 70, V * 0.4, 14, 9, 0.2],
      [C - 60, V * 0.65, 15, 10, 0.2],
      [C + 50, V * 0.7, 16, 11, 0.2],
      [C - 20, V * 0.25, 10, 6, 0.15],
      [C + 80, V * 0.55, 11, 7, 0.15],
      [C - 100, V * 0.7, 13, 8, 0.15],
      [C + 100, V * 0.3, 9, 5, 0.15],
      [C + 10, V * 0.8, 12, 7, 0.15],
    ].map(([cx, cy, rx, ry, op]) => (
      <Ellipse key={`dp${cx}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="#1a6fc5" opacity={op} />
    ))}
    {[
      [-5, V * 0.22, C - 60, V * 0.16, C - 20, V * 0.22, C + 30, V * 0.18, C + 70, V * 0.22, V + 5, V * 0.22],
      [-5, V * 0.38, C - 80, V * 0.32, C - 30, V * 0.38, C + 20, V * 0.34, C + 80, V * 0.38, V + 5, V * 0.38],
      [-5, V * 0.52, C - 70, V * 0.46, C - 10, V * 0.52, C + 40, V * 0.48, C + 90, V * 0.52, V + 5, V * 0.52],
      [-5, V * 0.62, C - 50, V * 0.57, C + 10, V * 0.62, C + 50, V * 0.58, C + 95, V * 0.62, V + 5, V * 0.62],
      [-5, V * 0.72, C - 90, V * 0.67, C - 20, V * 0.72, C + 30, V * 0.68, C + 75, V * 0.72, V + 5, V * 0.72],
      [-5, V * 0.84, C - 60, V * 0.80, C + 10, V * 0.84, C + 60, V * 0.81, C + 100, V * 0.84, V + 5, V * 0.84],
      [-5, V * 0.95, C - 40, V * 0.92, C + 20, V * 0.95, C + 70, V * 0.93, C + 110, V * 0.95, V + 5, V * 0.95],
    ].flatMap((pts, i) => {
      const pairs: [number, number][] = [];
      for (let j = 0; j < pts.length; j += 2) pairs.push([pts[j], pts[j + 1]]);
      let d = `M${pairs[0][0]},${pairs[0][1]}`;
      for (let j = 1; j < pairs.length; j += 1) {
        const prev = pairs[j - 1];
        const cur = pairs[j];
        const cx = (prev[0] + cur[0]) / 2 + (j % 2 === 0 ? -15 : 15);
        d += ` Q${cx},${prev[1] - (i % 2 === 0 ? 10 : 14)} ${cur[0]},${cur[1]}`;
      }
      return <Path key={`wv${i}`} d={d} stroke="#7abffa" strokeWidth={i % 2 === 0 ? 2.5 : 2}
        fill="none" opacity={0.7 - i * 0.05} />;
    })}
    {[
      [10, V * 0.18, 2],[30, V * 0.25, 1.5],[55, V * 0.2, 2],[80, V * 0.28, 1.5],
      [105, V * 0.22, 1.5],[130, V * 0.18, 2],[160, V * 0.24, 1.5],[185, V * 0.2, 2],
      [210, V * 0.28, 1.5],[235, V * 0.22, 2],[260, V * 0.18, 1.5],[285, V * 0.25, 2],
      [20, V * 0.34, 2],[50, V * 0.4, 1.5],[85, V * 0.36, 2],[115, V * 0.42, 1.5],
      [145, V * 0.38, 1.5],[175, V * 0.34, 2],[205, V * 0.4, 1.5],[240, V * 0.36, 2],
      [270, V * 0.42, 1.5],[290, V * 0.38, 2],
      [15, V * 0.48, 1.5],[40, V * 0.55, 2],[70, V * 0.5, 1.5],[100, V * 0.56, 2],
      [135, V * 0.5, 1.5],[165, V * 0.46, 2],[195, V * 0.52, 1.5],[225, V * 0.48, 2],
      [255, V * 0.54, 1.5],[280, V * 0.5, 2],
      [25, V * 0.58, 2],[60, V * 0.63, 1.5],[95, V * 0.6, 2],[125, V * 0.65, 1.5],
      [155, V * 0.6, 1.5],[185, V * 0.56, 2],[215, V * 0.63, 1.5],[250, V * 0.6, 2],
      [275, V * 0.65, 1.5],
      [10, V * 0.68, 1.5],[35, V * 0.74, 2],[65, V * 0.7, 1.5],[90, V * 0.76, 2],
      [120, V * 0.72, 1.5],[150, V * 0.68, 2],[180, V * 0.74, 1.5],[210, V * 0.7, 2],
      [245, V * 0.76, 1.5],[270, V * 0.72, 2],[295, V * 0.78, 1.5],
      [20, V * 0.8, 2],[55, V * 0.85, 1.5],[85, V * 0.82, 2],[115, V * 0.87, 1.5],
      [145, V * 0.83, 1.5],[175, V * 0.8, 2],[205, V * 0.86, 1.5],[235, V * 0.82, 2],
      [265, V * 0.87, 1.5],[290, V * 0.84, 2],
      [35, V * 0.91, 1.5],[75, V * 0.94, 2],[105, V * 0.92, 1.5],[135, V * 0.95, 2],
      [165, V * 0.93, 1.5],[195, V * 0.9, 2],[225, V * 0.94, 1.5],[255, V * 0.92, 2],
    ].map(([x, y, r]) => g(x, y, r, '#fff', 0.5))}
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
