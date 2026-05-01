export const getTerrainColor = (terrainType: string): string => {
  switch (terrainType) {
    case 'grassland':
      return '#7CFC00';
    case 'forest':
      return '#228B22';
    case 'mountain':
      return '#808080';
    case 'desert':
      return '#F4A460';
    case 'water':
      return '#1E90FF';
    default:
      return '#FFFFFF';
  }
};
