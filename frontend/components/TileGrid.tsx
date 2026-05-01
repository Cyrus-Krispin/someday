import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Tile {
  x: number;
  y: number;
  terrainType: string;
  resourceType: string;
  structureType: string | null;
}

interface TileGridProps {
  tiles: Tile[];
  playerPosition: { x: number; y: number };
  viewportSize: number;
}

const getTerrainColor = (terrainType: string): string => {
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

const TileGrid: React.FC<TileGridProps> = ({ tiles, playerPosition, viewportSize }) => {
  return (
    <View testID="tile-grid-container" style={styles.container}>
      {tiles.map((tile) => {
        const isPlayerPosition = tile.x === playerPosition.x && tile.y === playerPosition.y;
        const terrainColor = getTerrainColor(tile.terrainType);

        return (
          <View
            key={`${tile.x}-${tile.y}`}
            testID={`tile-${tile.x}-${tile.y}`}
            style={[styles.tile, { backgroundColor: terrainColor }]}
          >
            <Text style={styles.terrainText}>{tile.terrainType}</Text>
            {isPlayerPosition && (
              <View testID="tile-player" style={styles.playerIndicator}>
                <Text style={styles.playerText}>P</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300, // Simplified for test
  },
  tile: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  terrainText: {
    fontSize: 8,
    color: '#000',
  },
  playerIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.7)', // Gold highlight
  },
  playerText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default TileGrid;
