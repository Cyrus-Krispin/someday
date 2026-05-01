export const getTerrainColor = (terrainType) => {
  switch (terrainType) {
    case 'grassland':
      return '#7CFC00'; // Green
    case 'forest':
      return '#228B22'; // Forest green
    case 'mountain':
      return '#808080'; // Gray
    case 'desert':
      return '#F4A460'; // Sandy brown
    case 'water':
      return '#1E90FF'; // Dodger blue
    default:
      return '#FFFFFF';
  }
};
