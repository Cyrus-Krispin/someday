interface Tile {
  terrainType: string;
  resourceType: string | null;
  resourceQuantity: number;
  structureType: string | null;
}

interface ResourceYield {
  resourceType: string;
  quantity: number;
}

interface WorkResult {
  resources: ResourceYield[];
}

const WORKABLE_STRUCTURES = new Set(['mine', 'farm', 'market']);

export const canGather = (tile: Tile): boolean => {
  if (tile.terrainType === 'water') return false;
  if (!tile.resourceType) return false;
  return tile.resourceQuantity > 0;
};

export const getGatherYield = (tile: Tile, worldEvent: string | null): ResourceYield => {
  const baseQuantity = 1;
  let quantity = baseQuantity;

  if (worldEvent === 'drought' && tile.resourceType === 'crops') {
    quantity = Math.floor(baseQuantity / 2);
  }

  return { resourceType: tile.resourceType as string, quantity };
};

export const canWork = (tile: Tile): boolean => {
  if (!tile.structureType) return false;
  return WORKABLE_STRUCTURES.has(tile.structureType);
};

export const getWorkYield = (structureType: string, worldEvent: string | null): WorkResult => {
  switch (structureType) {
    case 'mine': {
      let oreQuantity = 2;
      if (worldEvent === 'token_rush') oreQuantity *= 3;
      return { resources: [{ resourceType: 'ore', quantity: oreQuantity }] };
    }
    case 'farm': {
      let cropQuantity = 3;
      if (worldEvent === 'drought') cropQuantity = Math.floor(cropQuantity / 2);
      return { resources: [{ resourceType: 'crops', quantity: cropQuantity }] };
    }
    case 'market':
      return { resources: [] };
    default:
      return { resources: [] };
  }
};

export const getResourceValue = (resourceType: string): number => {
  const values: Record<string, number> = {
    crops: 1,
    fish: 2,
    lumber: 2,
    ore: 3,
    gems: 10,
    rare_gems: 10,
  };
  return values[resourceType] ?? 0;
};
