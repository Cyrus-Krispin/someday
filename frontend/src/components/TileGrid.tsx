import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import type { TileData, TurnState } from '../types';
import { TERRAIN, STRUCTURES, getMoveCost, VIEWPORT_RADIUS, getTerrainAt } from '../services/gameUtils';
import { useGame } from '../contexts/GameContext';

interface TileGridProps {
  tiles: TileData[];
  playerId: string;
  playerX: number;
  playerY: number;
  turnState: TurnState | null;
}

export const TileGrid: React.FC<TileGridProps> = ({
  tiles,
  playerId,
  playerX,
  playerY,
  turnState,
}) => {
  const { movementRemaining, queueAction, simulatedPosition, world } = useGame();
  const [selectedTile, setSelectedTile] = useState<{ x: number; y: number } | null>(null);

  const { width, height } = useWindowDimensions();
  const gridSize = VIEWPORT_RADIUS * 2 + 1; // 15
  const worldSize = world?.worldSize ?? 30;

  // Tiles fill the full screen — non-square is fine for terrain grids
  const TILE_W = Math.ceil(width / gridSize);
  const TILE_H = Math.ceil(height / gridSize);
  const EMOJI_SIZE = Math.max(10, Math.min(TILE_W, TILE_H) - 10);

  const seed = world?.seed ?? '';

  const tileMap = useMemo(() => {
    const map = new Map<string, TileData>();
    for (const tile of tiles) {
      map.set(`${tile.x},${tile.y}`, tile);
    }
    // Fill missing viewport tiles from seed for instant rendering
    if (seed) {
      const vpMinX = simulatedPosition.x - VIEWPORT_RADIUS;
      const vpMinY = simulatedPosition.y - VIEWPORT_RADIUS;
      for (let gy = 0; gy < gridSize; gy++) {
        for (let gx = 0; gx < gridSize; gx++) {
          const wx = vpMinX + gx;
          const wy = vpMinY + gy;
          if (wx < 0 || wx >= worldSize || wy < 0 || wy >= worldSize) continue;
          const key = `${wx},${wy}`;
          if (!map.has(key)) {
            const terrainType = getTerrainAt(wx, wy, seed);
            map.set(key, {
              id: `gen_${wx}_${wy}`,
              world_id: '',
              x: wx,
              y: wy,
              terrain_type: terrainType,
              resource_type: '',
              resource_quantity: 0,
              last_harvested_day: null,
              owner_id: null,
              structure_type: null,
            });
          }
        }
      }
    }
    return map;
  }, [tiles, seed, simulatedPosition, gridSize, worldSize]);

  const viewportMinX = simulatedPosition.x - VIEWPORT_RADIUS;
  const viewportMinY = simulatedPosition.y - VIEWPORT_RADIUS;

  const handleTilePress = (gridX: number, gridY: number) => {
    const worldX = viewportMinX + gridX;
    const worldY = viewportMinY + gridY;
    setSelectedTile({ x: worldX, y: worldY });

    const tile = tileMap.get(`${worldX},${worldY}`);
    if (!tile) return;

    const dx = Math.abs(worldX - simulatedPosition.x);
    const dy = Math.abs(worldY - simulatedPosition.y);
    if (dx + dy !== 1) return;

    const cost = getMoveCost(tile.terrain_type);
    if (cost === null) return;
    if (movementRemaining < cost) return;

    queueAction({ type: 'move', targetX: worldX, targetY: worldY });
  };

  const renderTile = (gridX: number, gridY: number) => {
    const worldX = viewportMinX + gridX;
    const worldY = viewportMinY + gridY;
    const outOfBounds = worldX < 0 || worldX >= worldSize || worldY < 0 || worldY >= worldSize;

    const tileStyle = { width: TILE_W, height: TILE_H };

    if (outOfBounds) {
      return <View key={`${gridX},${gridY}`} style={[styles.tileBase, tileStyle, styles.tileOob]} />;
    }

    const tile = tileMap.get(`${worldX},${worldY}`);
    if (!tile) {
      return <View key={`${gridX},${gridY}`} style={[styles.tileBase, tileStyle, styles.tileUnknown]} />;
    }

    const terrain = TERRAIN[tile.terrain_type];
    const isPlayerHere = simulatedPosition.x === worldX && simulatedPosition.y === worldY;
    const isSelected = selectedTile?.x === worldX && selectedTile?.y === worldY;
    const otherPlayerHere = turnState?.players.find(
      p => p.id !== playerId && p.x === worldX && p.y === worldY
    );

    const dx = Math.abs(worldX - simulatedPosition.x);
    const dy = Math.abs(worldY - simulatedPosition.y);
    const isAdjacent = dx + dy === 1;
    const moveCost = getMoveCost(tile.terrain_type);
    const canMoveHere = isAdjacent && moveCost !== null && movementRemaining >= moveCost;

    return (
      <TouchableOpacity
        key={`${gridX},${gridY}`}
        style={[
          styles.tileBase,
          tileStyle,
          { backgroundColor: terrain?.bgColor || '#333' },
          isPlayerHere && styles.tilePlayerHere,
          isSelected && styles.tileSelected,
          canMoveHere && styles.tileMovable,
        ]}
        onPress={() => handleTilePress(gridX, gridY)}
        activeOpacity={0.7}
        disabled={!canMoveHere && !isAdjacent}
      >
        <Text style={{ fontSize: EMOJI_SIZE }}>
          {isPlayerHere
            ? '📍'
            : tile.structure_type
            ? STRUCTURES[tile.structure_type]?.emoji || '?'
            : terrain?.emoji || '?'}
        </Text>
        {tile.resource_quantity > 0 && tile.resource_type && (
          <Text style={styles.resourceCount}>{tile.resource_quantity}</Text>
        )}
        {otherPlayerHere && <Text style={styles.playerIndicator}>👤</Text>}
        {moveCost !== null && isAdjacent && (
          <Text style={[styles.moveCost, { color: canMoveHere ? '#4ade80' : '#e94560' }]}>
            {moveCost}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: gridSize }, (_, y) => (
        <View key={y} style={styles.row}>
          {Array.from({ length: gridSize }, (_, x) => renderTile(x, y))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  tileBase: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  tileOob: {
    backgroundColor: '#060610',
  },
  tileUnknown: {
    backgroundColor: '#0d0d20',
  },
  tilePlayerHere: {
    borderWidth: 3,
    borderColor: '#e94560',
  },
  tileSelected: {
    borderWidth: 2,
    borderColor: '#facc15',
  },
  tileMovable: {
    borderWidth: 2,
    borderColor: '#4ade80',
  },
  resourceCount: {
    position: 'absolute',
    bottom: 2,
    right: 3,
    fontSize: 9,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 3,
    paddingHorizontal: 2,
  },
  playerIndicator: {
    position: 'absolute',
    top: 2,
    right: 3,
    fontSize: 9,
  },
  moveCost: {
    position: 'absolute',
    top: 2,
    left: 3,
    fontSize: 9,
    fontWeight: 'bold',
  },
});
