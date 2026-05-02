import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import type { TileData, TurnState } from '../types';
import { TERRAIN, STRUCTURES, getMoveCost, WORLD_SIZE, VIEWPORT_RADIUS } from '../services/gameUtils';
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
  const { movementRemaining, actionsRemaining, queueAction, simulatedPosition } = useGame();
  const [selectedTile, setSelectedTile] = useState<{ x: number; y: number } | null>(null);

  const { width, height } = useWindowDimensions();
  const HUD_HEIGHT = 130;
  const PANEL_HEIGHT = 130;
  const available = Math.min(width, height - HUD_HEIGHT - PANEL_HEIGHT);
  const gridSize = VIEWPORT_RADIUS * 2 + 1; // 15
  const TILE_SIZE = Math.max(20, Math.floor((available - 4) / gridSize));
  const EMOJI_SIZE = Math.max(10, TILE_SIZE - 16);

  const tileMap = new Map<string, TileData>();
  for (const tile of tiles) {
    tileMap.set(`${tile.x},${tile.y}`, tile);
  }

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
    const outOfBounds = worldX < 0 || worldX >= WORLD_SIZE || worldY < 0 || worldY >= WORLD_SIZE;

    if (outOfBounds) {
      return (
        <View
          key={`${gridX},${gridY}`}
          style={[styles.tileBase, { width: TILE_SIZE, height: TILE_SIZE, backgroundColor: '#080810' }]}
        />
      );
    }

    const tile = tileMap.get(`${worldX},${worldY}`);
    if (!tile) {
      return (
        <View
          key={`${gridX},${gridY}`}
          style={[styles.tileBase, { width: TILE_SIZE, height: TILE_SIZE, backgroundColor: '#111' }]}
        />
      );
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
          { width: TILE_SIZE, height: TILE_SIZE, backgroundColor: terrain?.bgColor || '#333' },
          isPlayerHere && styles.tilePlayerHere,
          isSelected && styles.tileSelected,
          canMoveHere && styles.tileMovable,
        ]}
        onPress={() => handleTilePress(gridX, gridY)}
        activeOpacity={0.7}
        disabled={!canMoveHere && !isAdjacent}
      >
        <Text style={[styles.tileEmoji, { fontSize: EMOJI_SIZE }]}>
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
      <View style={styles.grid}>
        {Array.from({ length: gridSize }, (_, y) => (
          <View key={y} style={styles.row}>
            {Array.from({ length: gridSize }, (_, x) => renderTile(x, y))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    backgroundColor: '#050510',
    padding: 2,
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
  },
  tileBase: {
    margin: 1,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  tilePlayerHere: {
    borderWidth: 2,
    borderColor: '#e94560',
  },
  tileSelected: {
    borderWidth: 2,
    borderColor: '#facc15',
  },
  tileMovable: {
    borderWidth: 1,
    borderColor: '#4ade80',
  },
  tileEmoji: {
    // fontSize set inline
  },
  resourceCount: {
    position: 'absolute',
    bottom: 1,
    right: 2,
    fontSize: 8,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4,
    paddingHorizontal: 2,
  },
  playerIndicator: {
    position: 'absolute',
    top: 1,
    right: 2,
    fontSize: 8,
  },
  moveCost: {
    position: 'absolute',
    top: 1,
    left: 2,
    fontSize: 8,
    fontWeight: 'bold',
  },
});
