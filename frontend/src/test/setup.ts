import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import React from 'react';

vi.mock('react-native-svg', () => ({
  default: 'Svg',
  Svg: ({ children }: any) => React.createElement('svg', null, children),
  Path: () => React.createElement('path'),
  Circle: () => React.createElement('circle'),
  Rect: () => React.createElement('rect'),
  Polygon: () => React.createElement('polygon'),
  Ellipse: () => React.createElement('ellipse'),
  Line: () => React.createElement('line'),
  Defs: () => React.createElement('defs'),
  LinearGradient: () => React.createElement('linearGradient'),
  RadialGradient: () => React.createElement('radialGradient'),
  Stop: () => React.createElement('stop'),
}));

afterEach(() => {
  cleanup();
});
