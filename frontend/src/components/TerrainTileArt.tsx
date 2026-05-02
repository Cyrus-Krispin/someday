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

const GrasslandTile: React.FC<TileProps> = ({ width, height }) => (
  <Svg width={width} height={height} viewBox={`0 0 ${V} ${V}`} preserveAspectRatio={asp}>
    <Defs>
      <LinearGradient id="gg3" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#7ec97e" />
        <Stop offset="100%" stopColor="#5fa85f" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width={V} height={V} fill="url(#gg3)" />
    <Rect x="0" y="0" width="100" height={V} fill="#6abf6a" opacity="0.15" />
    <Rect x="200" y="0" width="100" height={V} fill="#8fd48f" opacity="0.1" />
    <Rect x="0" y="200" width={V} height="100" fill="#6abf6a" opacity="0.08" />
    <Path d="M30,270 Q20,150 12,30" stroke="#4a8f4a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M80,280 Q75,160 85,25" stroke="#4a8f4a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M140,265 Q150,145 132,35" stroke="#4a8f4a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M190,275 Q180,155 198,28" stroke="#4a8f4a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M250,270 Q260,150 242,32" stroke="#4a8f4a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M50,250 Q40,130 55,20" stroke="#5aaf5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Path d="M110,260 Q120,140 105,22" stroke="#5aaf5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Path d="M170,255 Q160,135 175,18" stroke="#5aaf5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Path d="M230,265 Q240,145 222,25" stroke="#5aaf5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Path d="M290,258 Q280,138 295,20" stroke="#5aaf5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Path d="M20,230 Q10,110 25,10" stroke="#4a8f4a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M65,240 Q75,120 58,12" stroke="#4a8f4a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M125,235 Q115,115 132,8" stroke="#4a8f4a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M185,245 Q195,125 175,14" stroke="#4a8f4a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M245,230 Q235,110 252,10" stroke="#4a8f4a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M280,240 Q290,120 275,12" stroke="#4a8f4a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M35,210 Q25,90 42,8" stroke="#5aaf5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Path d="M95,220 Q105,100 88,10" stroke="#5aaf5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Path d="M155,215 Q145,95 162,8" stroke="#5aaf5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Path d="M215,225 Q225,105 208,12" stroke="#5aaf5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Path d="M270,215 Q260,95 278,10" stroke="#5aaf5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <Circle cx="22" cy="145" r="2.5" fill="#f5d742" />
    <Circle cx="48" cy="158" r="2" fill="#f5d742" />
    <Circle cx="72" cy="142" r="2" fill="#f5d742" />
    <Circle cx="95" cy="155" r="1.5" fill="#f5a742" />
    <Circle cx="118" cy="148" r="2" fill="#f5d742" />
    <Circle cx="142" cy="160" r="1.5" fill="#f5d742" />
    <Circle cx="165" cy="140" r="2" fill="#f5d742" />
    <Circle cx="188" cy="152" r="1.5" fill="#f5a742" />
    <Circle cx="212" cy="145" r="2" fill="#f5d742" />
    <Circle cx="238" cy="158" r="1.5" fill="#f5d742" />
    <Circle cx="262" cy="142" r="2" fill="#f5d742" />
    <Circle cx="285" cy="155" r="1.5" fill="#f5a742" />
    <Circle cx="35" cy="185" r="2" fill="#f5d742" />
    <Circle cx="68" cy="175" r="1.5" fill="#f5a742" />
    <Circle cx="98" cy="190" r="2" fill="#f5d742" />
    <Circle cx="128" cy="180" r="1.5" fill="#f5d742" />
    <Circle cx="158" cy="195" r="2" fill="#f5a742" />
    <Circle cx="188" cy="178" r="1.5" fill="#f5d742" />
    <Circle cx="218" cy="190" r="2" fill="#f5a742" />
    <Circle cx="248" cy="182" r="1.5" fill="#f5d742" />
    <Circle cx="278" cy="195" r="2" fill="#f5a742" />
    <Circle cx="42" cy="120" r="1.5" fill="#f5d742" />
    <Circle cx="82" cy="110" r="2" fill="#f5a742" />
    <Circle cx="112" cy="125" r="1.5" fill="#f5d742" />
    <Circle cx="152" cy="115" r="2" fill="#f5d742" />
    <Circle cx="182" cy="130" r="1.5" fill="#f5a742" />
    <Circle cx="222" cy="115" r="2" fill="#f5d742" />
    <Circle cx="252" cy="125" r="1.5" fill="#f5a742" />
    <Circle cx="282" cy="120" r="2" fill="#f5d742" />
    <Circle cx="55" cy="90" r="1.5" fill="#f5d742" />
    <Circle cx="135" cy="85" r="2" fill="#f5d742" />
    <Circle cx="205" cy="90" r="1.5" fill="#f5a742" />
    <Circle cx="265" cy="88" r="2" fill="#f5d742" />
    <Path d="M-10,270 Q110,220 150,250 T290,280" stroke="#8b7a50" strokeWidth="5" opacity="0.2" fill="none" />
    <Path d="M-10,245 Q160,205 200,235 T310,240" stroke="#8b7a50" strokeWidth="3" opacity="0.12" fill="none" />
  </Svg>
);

const ForestTile: React.FC<TileProps> = ({ width, height }) => (
  <Svg width={width} height={height} viewBox={`0 0 ${V} ${V}`} preserveAspectRatio={asp}>
    <Defs>
      <LinearGradient id="fg3" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#3d7a3d" />
        <Stop offset="100%" stopColor="#2a5f2a" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width={V} height={V} fill="url(#fg3)" />
    <Rect x="100" y="0" width="100" height={V} fill="#357535" opacity="0.1" />
    <Rect x="0" y="200" width={V} height="100" fill="#256f25" opacity="0.08" />
    <Rect x="200" y="50" width="100" height="100" fill="#357535" opacity="0.06" />
    <Rect x="38" y="176" width="5" height="22" rx="1" fill="#4a2a0a" />
    <Circle cx="40" cy="160" r="26" fill="#1a4a1a" />
    <Circle cx="35" cy="155" r="18" fill="#286828" />
    <Rect x="138" y="166" width="5" height="24" rx="1" fill="#4a2a0a" />
    <Circle cx="140" cy="150" r="28" fill="#1f551f" />
    <Circle cx="135" cy="145" r="20" fill="#2d752d" />
    <Rect x="238" y="156" width="5" height="22" rx="1" fill="#4a2a0a" />
    <Circle cx="240" cy="140" r="24" fill="#1a4a1a" />
    <Circle cx="235" cy="135" r="16" fill="#286828" />
    <Rect x="88" y="210" width="4" height="18" rx="1" fill="#4a2a0a" />
    <Circle cx="90" cy="195" r="20" fill="#1f551f" />
    <Circle cx="86" cy="190" r="14" fill="#2d752d" />
    <Rect x="188" y="218" width="4" height="18" rx="1" fill="#4a2a0a" />
    <Circle cx="190" cy="200" r="22" fill="#1a4a1a" />
    <Circle cx="186" cy="195" r="15" fill="#286828" />
    <Rect x="278" y="200" width="4" height="18" rx="1" fill="#4a2a0a" />
    <Circle cx="280" cy="185" r="20" fill="#1f551f" />
    <Circle cx="276" cy="180" r="14" fill="#2d752d" />
    <Rect x="63" y="108" width="4" height="16" rx="1" fill="#4a2a0a" />
    <Circle cx="65" cy="95" r="18" fill="#1a4a1a" />
    <Circle cx="61" cy="90" r="12" fill="#286828" />
    <Rect x="163" y="98" width="4" height="16" rx="1" fill="#4a2a0a" />
    <Circle cx="165" cy="85" r="18" fill="#1f551f" />
    <Circle cx="161" cy="80" r="12" fill="#2d752d" />
    <Rect x="258" y="105" width="4" height="16" rx="1" fill="#4a2a0a" />
    <Circle cx="260" cy="90" r="18" fill="#1a4a1a" />
    <Circle cx="256" cy="85" r="12" fill="#286828" />
    <Rect x="18" y="248" width="4" height="14" rx="1" fill="#4a2a0a" />
    <Circle cx="20" cy="235" r="16" fill="#1f551f" />
    <Circle cx="17" cy="231" r="11" fill="#2d752d" />
    <Rect x="128" y="252" width="4" height="14" rx="1" fill="#4a2a0a" />
    <Circle cx="130" cy="238" r="18" fill="#1a4a1a" />
    <Circle cx="127" cy="234" r="12" fill="#286828" />
    <Rect x="218" y="258" width="4" height="14" rx="1" fill="#4a2a0a" />
    <Circle cx="220" cy="245" r="16" fill="#1f551f" />
    <Circle cx="217" cy="241" r="11" fill="#2d752d" />
    <Rect x="293" y="238" width="3" height="12" rx="1" fill="#4a2a0a" />
    <Circle cx="295" cy="225" r="14" fill="#1a4a1a" />
    <Circle cx="292" cy="221" r="10" fill="#286828" />
    <Rect x="15" y="68" width="3" height="12" rx="1" fill="#4a2a0a" />
    <Circle cx="16" cy="55" r="14" fill="#1f551f" />
    <Circle cx="13" cy="51" r="10" fill="#2d752d" />
    <Rect x="203" y="68" width="3" height="12" rx="1" fill="#4a2a0a" />
    <Circle cx="205" cy="55" r="14" fill="#1a4a1a" />
    <Circle cx="202" cy="51" r="10" fill="#286828" />
    <Rect x="103" y="280" width="3" height="12" rx="1" fill="#4a2a0a" />
    <Circle cx="105" cy="268" r="14" fill="#1f551f" />
    <Circle cx="102" cy="264" r="10" fill="#2d752d" />
    <Rect x="273" y="262" width="3" height="12" rx="1" fill="#4a2a0a" />
    <Circle cx="275" cy="250" r="14" fill="#1a4a1a" />
    <Circle cx="272" cy="246" r="10" fill="#286828" />
    <Circle cx="45" cy="220" r="4" fill="#357535" />
    <Circle cx="65" cy="210" r="3" fill="#3a803a" />
    <Circle cx="95" cy="230" r="3.5" fill="#357535" />
    <Circle cx="120" cy="215" r="3" fill="#3a803a" />
    <Circle cx="145" cy="225" r="4" fill="#357535" />
    <Circle cx="170" cy="210" r="3" fill="#3a803a" />
    <Circle cx="200" cy="230" r="3.5" fill="#357535" />
    <Circle cx="225" cy="215" r="3" fill="#3a803a" />
    <Circle cx="250" cy="225" r="4" fill="#357535" />
    <Circle cx="275" cy="210" r="3" fill="#3a803a" />
    <Circle cx="15" cy="240" r="2.5" fill="#357535" />
    <Circle cx="85" cy="245" r="3" fill="#3a803a" />
    <Circle cx="155" cy="240" r="2.5" fill="#357535" />
    <Circle cx="215" cy="250" r="3" fill="#3a803a" />
    <Circle cx="285" cy="245" r="2" fill="#357535" />
    <Circle cx="35" cy="270" r="3" fill="#3a803a" />
    <Circle cx="110" cy="265" r="2.5" fill="#357535" />
    <Circle cx="175" cy="270" r="3" fill="#3a803a" />
    <Circle cx="245" cy="260" r="2.5" fill="#357535" />
    <Circle cx="55" cy="285" r="2" fill="#3a803a" />
    <Circle cx="135" cy="280" r="2.5" fill="#357535" />
    <Circle cx="195" cy="290" r="2" fill="#3a803a" />
    <Circle cx="265" cy="285" r="2.5" fill="#357535" />
    <Circle cx="30" cy="95" r="2.5" fill="#357535" />
    <Circle cx="100" cy="90" r="3" fill="#3a803a" />
    <Circle cx="170" cy="95" r="2.5" fill="#357535" />
    <Circle cx="235" cy="90" r="3" fill="#3a803a" />
    <Circle cx="290" cy="95" r="2" fill="#357535" />
    <Circle cx="75" cy="60" r="2" fill="#3a803a" />
    <Circle cx="160" cy="55" r="2.5" fill="#357535" />
    <Circle cx="225" cy="60" r="2" fill="#3a803a" />
  </Svg>
);

const MountainTile: React.FC<TileProps> = ({ width, height }) => (
  <Svg width={width} height={height} viewBox={`0 0 ${V} ${V}`} preserveAspectRatio={asp}>
    <Defs>
      <LinearGradient id="mg3" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#9a9a9a" />
        <Stop offset="100%" stopColor="#707070" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width={V} height={V} fill="url(#mg3)" />
    <Rect x="50" y="0" width="100" height={V} fill="#888" opacity="0.08" />
    <Rect x="200" y="0" width="100" height={V} fill="#aaa" opacity="0.06" />
    <Polygon points={`150,15 5,295 ${V - 5},295`} fill="#808080" />
    <Polygon points={`150,15 110,295 180,295`} fill="#606060" opacity="0.4" />
    <Polygon points={`150,15 200,295 ${V - 5},295`} fill="#909090" opacity="0.3" />
    <Polygon points={`150,15 190,85 110,85`} fill="#f0f0f0" />
    <Polygon points={`150,15 150,85 190,85`} fill="#ffffff" />
    <Polygon points={`150,15 110,85 150,85`} fill="#e0e0e0" />
    <Polygon points={`125,75 105,115 145,115`} fill="#f0f0f0" />
    <Polygon points={`175,65 155,105 195,105`} fill="#e8e8e8" />
    <Circle cx={150} cy={30} r={3} fill="#fff" opacity={0.5} />
    <Circle cx={135} cy={45} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={162} cy={38} r={2.5} fill="#fff" opacity={0.5} />
    <Circle cx={145} cy={22} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={158} cy={28} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={140} cy={35} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={165} cy={45} r={2} fill="#fff" opacity={0.5} />
    <Ellipse cx={40} cy={230} rx={12} ry={6} fill="#606060" opacity={0.5} />
    <Ellipse cx={75} cy={240} rx={10} ry={5} fill="#606060" opacity={0.5} />
    <Ellipse cx={120} cy={220} rx={14} ry={7} fill="#606060" opacity={0.5} />
    <Ellipse cx={180} cy={235} rx={11} ry={5.5} fill="#606060" opacity={0.5} />
    <Ellipse cx={230} cy={225} rx={13} ry={6.5} fill="#606060" opacity={0.5} />
    <Ellipse cx={270} cy={240} rx={9} ry={4.5} fill="#606060" opacity={0.5} />
    <Ellipse cx={50} cy={260} rx={8} ry={4} fill="#606060" opacity={0.5} />
    <Ellipse cx={100} cy={250} rx={10} ry={5} fill="#606060" opacity={0.5} />
    <Ellipse cx={155} cy={260} rx={9} ry={4.5} fill="#606060" opacity={0.5} />
    <Ellipse cx={210} cy={250} rx={11} ry={5.5} fill="#606060" opacity={0.5} />
    <Ellipse cx={260} cy={260} rx={8} ry={4} fill="#606060" opacity={0.5} />
    <Ellipse cx={30} cy={275} rx={7} ry={3.5} fill="#606060" opacity={0.5} />
    <Ellipse cx={90} cy={270} rx={9} ry={4.5} fill="#606060" opacity={0.5} />
    <Ellipse cx={145} cy={280} rx={8} ry={4} fill="#606060" opacity={0.5} />
    <Ellipse cx={200} cy={270} rx={10} ry={5} fill="#606060" opacity={0.5} />
    <Ellipse cx={250} cy={280} rx={7} ry={3.5} fill="#606060" opacity={0.5} />
    <Ellipse cx={285} cy={275} rx={6} ry={3} fill="#606060" opacity={0.5} />
    <Circle cx={25} cy={205} r={1.5} fill="#505050" />
    <Circle cx={65} cy={195} r={1.5} fill="#505050" />
    <Circle cx={110} cy={210} r={1.5} fill="#505050" />
    <Circle cx={155} cy={200} r={1.5} fill="#505050" />
    <Circle cx={200} cy={215} r={1.5} fill="#505050" />
    <Circle cx={245} cy={205} r={1.5} fill="#505050" />
    <Circle cx={290} cy={195} r={1.5} fill="#505050" />
    <Circle cx={45} cy={180} r={1.5} fill="#505050" />
    <Circle cx={85} cy={185} r={1.5} fill="#505050" />
    <Circle cx={135} cy={175} r={1.5} fill="#505050" />
    <Circle cx={180} cy={190} r={1.5} fill="#505050" />
    <Circle cx={225} cy={180} r={1.5} fill="#505050" />
    <Circle cx={270} cy={185} r={1.5} fill="#505050" />
    <Circle cx={55} cy={155} r={1.5} fill="#505050" />
    <Circle cx={100} cy={160} r={1.5} fill="#505050" />
    <Circle cx={150} cy={150} r={1.5} fill="#505050" />
    <Circle cx={195} cy={165} r={1.5} fill="#505050" />
    <Circle cx={240} cy={155} r={1.5} fill="#505050" />
    <Circle cx={280} cy={160} r={1.5} fill="#505050" />
  </Svg>
);

const DesertTile: React.FC<TileProps> = ({ width, height }) => (
  <Svg width={width} height={height} viewBox={`0 0 ${V} ${V}`} preserveAspectRatio={asp}>
    <Defs>
      <LinearGradient id="dg3" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#f2dba0" />
        <Stop offset="100%" stopColor="#d4b87a" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width={V} height={V} fill="url(#dg3)" />
    <Rect x="50" y="0" width="100" height={V} fill="#e8d090" opacity="0.1" />
    <Rect x="200" y="0" width="100" height={V} fill="#f8e8b0" opacity="0.08" />
    <Rect x="0" y="50" width={V} height="100" fill="#dcc080" opacity="0.06" />
    <Path d={`M-10,140 Q60,95 150,165 T310,140 L310,${V} L-10,${V} Z`} fill="#dcc080" />
    <Path d={`M-10,200 Q80,160 150,180 T300,190 L310,${V} L-10,${V} Z`} fill="#c8a870" />
    <Path d={`M-10,260 Q50,230 150,250 T280,240 L310,${V} L-10,${V} Z`} fill="#b89868" />
    <Circle cx={15} cy={130} r={1.5} fill="#a08040" />
    <Circle cx={45} cy={140} r={1.5} fill="#a08040" />
    <Circle cx={78} cy={128} r={1.5} fill="#a08040" />
    <Circle cx={110} cy={138} r={1.5} fill="#a08040" />
    <Circle cx={150} cy={132} r={1.5} fill="#a08040" />
    <Circle cx={190} cy={142} r={1.5} fill="#a08040" />
    <Circle cx={230} cy={128} r={1.5} fill="#a08040" />
    <Circle cx={270} cy={140} r={1.5} fill="#a08040" />
    <Circle cx={295} cy={132} r={1.5} fill="#a08040" />
    <Circle cx={30} cy={180} r={1.5} fill="#a08040" />
    <Circle cx={68} cy={170} r={1.5} fill="#a08040" />
    <Circle cx={100} cy={185} r={1.5} fill="#a08040" />
    <Circle cx={140} cy={175} r={1.5} fill="#a08040" />
    <Circle cx={180} cy={190} r={1.5} fill="#a08040" />
    <Circle cx={220} cy={178} r={1.5} fill="#a08040" />
    <Circle cx={260} cy={185} r={1.5} fill="#a08040" />
    <Circle cx={290} cy={175} r={1.5} fill="#a08040" />
    <Circle cx={20} cy={230} r={1.5} fill="#a08040" />
    <Circle cx={55} cy={220} r={1.5} fill="#a08040" />
    <Circle cx={90} cy={235} r={1.5} fill="#a08040" />
    <Circle cx={130} cy={225} r={1.5} fill="#a08040" />
    <Circle cx={170} cy={240} r={1.5} fill="#a08040" />
    <Circle cx={210} cy={230} r={1.5} fill="#a08040" />
    <Circle cx={250} cy={235} r={1.5} fill="#a08040" />
    <Circle cx={280} cy={225} r={1.5} fill="#a08040" />
    <Circle cx={40} cy={270} r={1.5} fill="#a08040" />
    <Circle cx={75} cy={260} r={1.5} fill="#a08040" />
    <Circle cx={110} cy={275} r={1.5} fill="#a08040" />
    <Circle cx={150} cy={265} r={1.5} fill="#a08040" />
    <Circle cx={190} cy={280} r={1.5} fill="#a08040" />
    <Circle cx={230} cy={270} r={1.5} fill="#a08040" />
    <Circle cx={270} cy={275} r={1.5} fill="#a08040" />
    <Circle cx={25} cy={160} r={1.5} fill="#a08040" />
    <Circle cx={60} cy={150} r={1.5} fill="#a08040" />
    <Circle cx={95} cy={165} r={1.5} fill="#a08040" />
    <Circle cx={135} cy={155} r={1.5} fill="#a08040" />
    <Circle cx={175} cy={170} r={1.5} fill="#a08040" />
    <Circle cx={215} cy={160} r={1.5} fill="#a08040" />
    <Circle cx={255} cy={165} r={1.5} fill="#a08040" />
    <Circle cx={32} cy={155} r={2} fill="#a08040" />
    <Circle cx={68} cy={165} r={1.5} fill="#a08040" />
    <Circle cx={105} cy={150} r={2} fill="#a08040" />
    <Circle cx={185} cy={155} r={1.5} fill="#a08040" />
    <Circle cx={225} cy={165} r={2} fill="#a08040" />
    <Circle cx={255} cy={150} r={1.5} fill="#a08040" />
    <Circle cx={45} cy={210} r={2} fill="#a08040" />
    <Circle cx={85} cy={200} r={1.5} fill="#a08040" />
    <Circle cx={155} cy={210} r={2} fill="#a08040" />
    <Circle cx={195} cy={200} r={1.5} fill="#a08040" />
    <Circle cx={245} cy={210} r={2} fill="#a08040" />
    <Circle cx={275} cy={200} r={1.5} fill="#a08040" />
    <Circle cx={35} cy={110} r={1.5} fill="#a08040" />
    <Circle cx={125} cy={110} r={2} fill="#a08040" />
    <Circle cx={205} cy={115} r={1.5} fill="#a08040" />
    <Circle cx={285} cy={110} r={2} fill="#a08040" />
    <Path d="M170,125 Q177,122 185,118" stroke="#a08040" strokeWidth="1" fill="none" opacity="0.4" />
    <Path d="M210,120 Q217,117 225,113" stroke="#a08040" strokeWidth="1" fill="none" opacity="0.4" />
    <Path d="M250,128 Q257,124 265,120" stroke="#a08040" strokeWidth="1" fill="none" opacity="0.4" />
    <Path d="M60,195 Q67,192 75,188" stroke="#a08040" strokeWidth="1" fill="none" opacity="0.4" />
    <Path d="M140,192 Q147,189 155,185" stroke="#a08040" strokeWidth="1" fill="none" opacity="0.4" />
    <Path d="M180,140 Q187,137 195,133" stroke="#a08040" strokeWidth="1" fill="none" opacity="0.4" />
    <Rect x="15" y="55" width="6" height="18" rx="1" fill="#7a6030" opacity="0.5" />
    <Rect x="22" y="60" width="18" height="6" rx="1" fill="#7a6030" opacity="0.5" />
    <Rect x="18" y="63" width="4" height="12" rx="1" fill="#7a6030" opacity="0.5" />
    <Rect x="25" y="57" width="12" height="4" rx="1" fill="#7a6030" opacity="0.5" />
    <Rect x="80" y="52" width="5" height="15" rx="1" fill="#7a6030" opacity="0.5" />
    <Rect x="87" y="55" width="15" height="5" rx="1" fill="#7a6030" opacity="0.5" />
    <Rect x="82" y="58" width="3" height="10" rx="1" fill="#7a6030" opacity="0.5" />
    <Rect x="88" y="53" width="10" height="3" rx="1" fill="#7a6030" opacity="0.5" />
    <Rect x="275" y="58" width="5" height="15" rx="1" fill="#7a6030" opacity="0.5" />
    <Rect x="282" y="60" width="15" height="5" rx="1" fill="#7a6030" opacity="0.5" />
    <Rect x="278" y="63" width="3" height="10" rx="1" fill="#7a6030" opacity="0.5" />
    <Rect x="284" y="57" width="10" height="3" rx="1" fill="#7a6030" opacity="0.5" />
  </Svg>
);

const WaterTile: React.FC<TileProps> = ({ width, height }) => (
  <Svg width={width} height={height} viewBox={`0 0 ${V} ${V}`} preserveAspectRatio={asp}>
    <Defs>
      <LinearGradient id="wg3" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#4a9ff5" />
        <Stop offset="100%" stopColor="#2a7fd5" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width={V} height={V} fill="url(#wg3)" />
    <Rect x="100" y="0" width="100" height={V} fill="#3a8fe5" opacity="0.1" />
    <Rect x="0" y="100" width={V} height="100" fill="#5aaff5" opacity="0.06" />
    <Ellipse cx={150} cy={105} rx={18} ry={12} fill="#1a6fc5" opacity={0.25} />
    <Ellipse cx={60} cy={135} rx={12} ry={8} fill="#1a6fc5" opacity={0.2} />
    <Ellipse cx={220} cy={120} rx={14} ry={9} fill="#1a6fc5" opacity={0.2} />
    <Ellipse cx={90} cy={195} rx={15} ry={10} fill="#1a6fc5" opacity={0.2} />
    <Ellipse cx={200} cy={210} rx={16} ry={11} fill="#1a6fc5" opacity={0.2} />
    <Ellipse cx={150} cy={75} rx={10} ry={6} fill="#1a6fc5" opacity={0.15} />
    <Ellipse cx={230} cy={165} rx={11} ry={7} fill="#1a6fc5" opacity={0.15} />
    <Ellipse cx={50} cy={210} rx={13} ry={8} fill="#1a6fc5" opacity={0.15} />
    <Ellipse cx={250} cy={90} rx={9} ry={5} fill="#1a6fc5" opacity={0.15} />
    <Ellipse cx={160} cy={240} rx={12} ry={7} fill="#1a6fc5" opacity={0.15} />
    <Path d={`M-5,66 Q40,48 90,66 T195,54 T300,66 T${V + 5},66`} stroke="#7abffa" strokeWidth="2.5" fill="none" opacity="0.7" />
    <Path d={`M-5,114 Q20,96 70,114 T180,102 T290,114 T${V + 5},114`} stroke="#7abffa" strokeWidth="2.5" fill="none" opacity="0.65" />
    <Path d={`M-5,156 Q50,138 110,156 T220,144 T${V + 5},156`} stroke="#7abffa" strokeWidth="2" fill="none" opacity="0.6" />
    <Path d={`M-5,186 Q30,171 80,186 T190,174 T${V + 5},186`} stroke="#7abffa" strokeWidth="2" fill="none" opacity="0.55" />
    <Path d={`M-5,216 Q60,201 120,216 T230,204 T${V + 5},216`} stroke="#7abffa" strokeWidth="2" fill="none" opacity="0.5" />
    <Path d={`M-5,252 Q40,240 90,252 T200,243 T${V + 5},252`} stroke="#7abffa" strokeWidth="2" fill="none" opacity="0.45" />
    <Path d={`M-5,285 Q70,276 130,285 T240,279 T${V + 5},285`} stroke="#7abffa" strokeWidth="1.5" fill="none" opacity="0.4" />
    <Circle cx={10} cy={54} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={30} cy={66} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={55} cy={60} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={80} cy={72} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={105} cy={66} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={130} cy={60} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={160} cy={72} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={185} cy={66} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={210} cy={66} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={235} cy={66} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={260} cy={60} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={285} cy={66} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={20} cy={102} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={50} cy={110} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={85} cy={108} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={115} cy={114} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={145} cy={108} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={175} cy={102} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={205} cy={110} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={240} cy={108} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={270} cy={114} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={290} cy={108} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={15} cy={144} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={40} cy={150} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={70} cy={145} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={100} cy={156} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={135} cy={150} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={165} cy={144} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={195} cy={150} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={225} cy={146} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={255} cy={150} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={280} cy={144} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={25} cy={174} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={60} cy={180} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={95} cy={178} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={125} cy={186} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={155} cy={180} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={185} cy={174} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={215} cy={180} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={250} cy={178} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={275} cy={186} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={10} cy={204} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={35} cy={210} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={65} cy={206} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={90} cy={216} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={120} cy={210} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={150} cy={204} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={180} cy={210} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={210} cy={206} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={245} cy={216} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={270} cy={210} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={295} cy={216} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={20} cy={240} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={55} cy={246} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={85} cy={244} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={115} cy={252} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={145} cy={248} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={175} cy={240} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={205} cy={246} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={235} cy={244} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={265} cy={252} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={290} cy={248} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={35} cy={273} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={75} cy={278} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={105} cy={276} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={135} cy={285} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={165} cy={280} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={195} cy={273} r={2} fill="#fff" opacity={0.5} />
    <Circle cx={225} cy={278} r={1.5} fill="#fff" opacity={0.5} />
    <Circle cx={255} cy={276} r={2} fill="#fff" opacity={0.5} />
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
