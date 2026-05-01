const TERRAIN_COSTS: Record<string, number | null> = {
  grassland: 1,
  forest: 2,
  mountain: 3,
  desert: 2,
  water: null,
};

export const getTerrainMovementCost = (terrainType: string): number | null => {
  if (!(terrainType in TERRAIN_COSTS)) {
    throw new Error(`Unknown terrain type: ${terrainType}`);
  }
  return TERRAIN_COSTS[terrainType];
};

interface Position {
  x: number;
  y: number;
}

interface MoveResult {
  valid: boolean;
  cost?: number;
  reason?: string;
}

export const validateMove = (
  from: Position,
  to: Position,
  targetTerrain: string,
  movementRemaining: number
): MoveResult => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);

  if (dx + dy !== 1) {
    return { valid: false, reason: 'Can only move to adjacent orthogonal tiles' };
  }

  if (targetTerrain === 'water') {
    return { valid: false, reason: 'Cannot move to water tile (impassable)' };
  }

  const cost = getTerrainMovementCost(targetTerrain) as number;

  if (cost > movementRemaining) {
    return { valid: false, reason: `Not enough movement points (need ${cost}, have ${movementRemaining})` };
  }

  return { valid: true, cost };
};

export const calculateMovementRemaining = (
  current: number,
  targetTerrain: string
): number => {
  const cost = getTerrainMovementCost(targetTerrain);
  if (cost === null) return current;
  return current - cost;
};
