import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { TileData, TurnState } from '../types';
import { TERRAIN, STRUCTURES, getMoveCost, MAX_MOVEMENT, WORLD_SIZE, VIEWPORT_RADIUS } from '../services/gameUtils';
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
  const { queuedActions, movementRemaining, actionsRemaining, queueAction } = useGame();
  const [selectedTile, setSelectedTile] = useState<{ x: number; y: number } | null>(null);

  const simulatedPosition = useMemo(() => {
    let x = playerX;
    let y = playerY;
    for (const action of queuedActions) {
      if (action.type === 'move' && action.targetX !== undefined && action.targetY !== undefined) {
        x = action.targetX;
        y = action.targetY;
      }
    }
    return { x, y };
  }, [playerX, playerY, queuedActions]);

  const tileMap = useMemo(() => {
    const map = new Map<string, TileData>();
    for (const tile of tiles) {
      map.set(`${tile.x},${tile.y}`, tile);
    }
    return map;
  }, [tiles]);

  const viewportMinX = simulatedPosition.x - VIEWPORT_RADIUS;
  const viewportMinY = simulatedPosition.y - VIEWPORT_RADIUS;
  const gridSize = VIEWPORT_RADIUS * 2 + 1; // 15

  const handleTilePress = (gridX: number, gridY: number) => {
    const worldX = viewportMinX + gridX;
    const worldY = viewportMinY + gridY;
    setSelectedTile({ x: worldX, y: worldY });

    const tile = tileMap.get(`${worldX},${worldY}`);
    if (!tile) return;

    // Check if it's adjacent (within 1 tile Manhattan distance)
    const dx = Math.abs(worldX - simulatedPosition.x);
    const dy = Math.abs(worldY - simulatedPosition.y);
    if (dx + dy !== 1) return;

    // Check terrain
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
      return <View key={`${gridX},${gridY}`} style={[styles.tile, styles.tileOob]} />;
    }

    const tile = tileMap.get(`${worldX},${worldY}`);
    if (!tile) {
      return <View key={`${gridX},${gridY}`} style={[styles.tile, styles.tileUnknown]} />;
    }

    const terrain = TERRAIN[tile.terrain_type];
    const isPlayerHere = simulatedPosition.x === worldX && simulatedPosition.y === worldY;
    const isSelected = selectedTile?.x === worldX && selectedTile?.y === worldY;
    const otherPlayerHere = turnState?.players.find(
      p => p.id !== playerId && p.x === worldX && p.y === worldY
    );

    // Calculate movement cost for display
    const dx = Math.abs(worldX - simulatedPosition.x);
    const dy = Math.abs(worldY - simulatedPosition.y);
    const isAdjacent = dx + dy === 1;
    const moveCost = getMoveCost(tile.terrain_type);
    const canMoveHere = isAdjacent && moveCost !== null && movementRemaining >= (moveCost || 999);

    return (
      <TouchableOpacity
        key={`${gridX},${gridY}`}
        style={[
          styles.tile,
          { backgroundColor: terrain?.bgColor || '#333' },
          isPlayerHere && styles.tilePlayerHere,
          isSelected && styles.tileSelected,
          canMoveHere && styles.tileMovable,
        ]}
        onPress={() => handleTilePress(gridX, gridY)}
        activeOpacity={0.7}
        disabled={!canMoveHere && !isAdjacent}
      >
        <Text style={styles.tileEmoji}>
          {isPlayerHere ? '📍' : tile.structure_type ? STRUCTURES[tile.structure_type]?.emoji || '?' : terrain?.emoji || '?'}
        </Text>
        {tile.resource_quantity > 0 && tile.resource_type && (
          <Text style={styles.resourceCount}>{tile.resource_quantity}</Text>
        )}
        {otherPlayerHere && (
          <Text style={styles.playerIndicator}>👤</Text>
        )}
        {moveCost !== null && isAdjacent && (
          <Text style={styles.moveCost}>{moveCost}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapInfo}>
        <Text style={styles.mapInfoText}>
          Position: ({simulatedPosition.x}, {simulatedPosition.y})
        </Text>
        <Text style={styles.mapInfoText}>
          Moves: {movementRemaining}/{MAX_MOVEMENT} | Actions: {actionsRemaining}/2
        </Text>
      </View>
      <View style={styles.grid}>
        {Array.from({ length: gridSize }, (_, y) => (
          <View key={y} style={styles.row}>
            {Array.from({ length: gridSize }, (_, x) => renderTile(x, y))}
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        {Object.entries(TERRAIN).map(([key, t]) => (
          <View key={key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: t.bgColor }]} />
            <Text style={styles.legendText}>
              {t.emoji} {t.moveCost !== null ? `${t.moveCost}pt` : 'x'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  mapInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  mapInfoText: {
    color: '#666',
    fontSize: 11,
  },
  grid: {
    backgroundColor: '#2a2a4e',
    padding: 2,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    width: 30,
    height: 30,
    margin: 1,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tileOob: {
    backgroundColor: '#111',
  },
  tileUnknown: {
    backgroundColor: '#222',
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
    fontSize: 14,
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
    color: '#4ade80',
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
    gap: 8,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    color: '#666',
    fontSize: 10,
  },
});
