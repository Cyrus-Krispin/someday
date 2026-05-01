export interface Viewport {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export const calculateViewport = (
  playerPos: { x: number; y: number },
  mapSize: number,
  viewportRadius: number = 7
): Viewport => {
  let xMin = playerPos.x - viewportRadius;
  let xMax = playerPos.x + viewportRadius;
  let yMin = playerPos.y - viewportRadius;
  let yMax = playerPos.y + viewportRadius;

  if (xMin < 0) {
    xMin = 0;
    xMax = Math.min(2 * viewportRadius, mapSize - 1);
  }
  if (xMax >= mapSize) {
    xMax = mapSize - 1;
    xMin = Math.max(0, mapSize - 1 - 2 * viewportRadius);
  }
  if (yMin < 0) {
    yMin = 0;
    yMax = Math.min(2 * viewportRadius, mapSize - 1);
  }
  if (yMax >= mapSize) {
    yMax = mapSize - 1;
    yMin = Math.max(0, mapSize - 1 - 2 * viewportRadius);
  }

  return { xMin, xMax, yMin, yMax };
};
