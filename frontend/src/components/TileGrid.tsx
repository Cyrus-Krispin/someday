import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import type { TileData, TurnState } from '../types';
import { TERRAIN, getMoveCost, VIEWPORT_RADIUS, getTerrainAt } from '../services/gameUtils';
import { useGame } from '../contexts/GameContext';
import { TerrainTileArt } from './TerrainTileArt';
import { StructureArt } from './StructureArt';
import { PlayerMarker } from './PlayerMarker';

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
  const gridSize = VIEWPORT_RADIUS * 2 + 1;
  const worldSize = world?.worldSize ?? 30;

  const TILE_W = Math.ceil(width / gridSize);
  const TILE_H = Math.ceil(height / gridSize);
  const minDim = Math.min(TILE_W, TILE_H);

  const seed = world?.seed ?? '';

  const tileMap = useMemo(() => {
    const map = new Map<string, TileData>();
    for (const tile of tiles) {
      map.set(`${tile.x},${tile.y}`, tile);
    }
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
        <View style={styles.tileArtContainer}>
          <TerrainTileArt terrainType={tile.terrain_type} width={TILE_W} height={TILE_H} />
        </View>

        {isPlayerHere && (
          <View style={styles.centerOverlay}>
            <PlayerMarker size={Math.round(minDim * 0.65)} />
          </View>
        )}

        {!isPlayerHere && tile.structure_type && (
          <View style={styles.centerOverlay}>
            <View style={styles.structureBg}>
              <StructureArt type={tile.structure_type} size={Math.round(minDim * 0.5)} />
            </View>
          </View>
        )}

        {tile.resource_quantity > 0 && tile.resource_type && (
          <View style={styles.resourceBadge}>
            <Text style={styles.resourceText}>{tile.resource_quantity}</Text>
          </View>
        )}

        {otherPlayerHere && !isPlayerHere && (
          <View style={styles.otherPlayerBadge}>
            <Text style={styles.otherPlayerText}>
              {(turnState?.players.findIndex(p => p.id === otherPlayerHere.id) ?? 0) + 1}
            </Text>
          </View>
        )}

        {moveCost !== null && isAdjacent && (
          <View style={[styles.moveCostBadge, { backgroundColor: canMoveHere ? 'rgba(74,222,128,0.85)' : 'rgba(233,69,96,0.85)' }]}>
            <Text style={styles.moveCostText}>{moveCost}</Text>
          </View>
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
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.18)',
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
    zIndex: 2,
  },
  tileSelected: {
    borderWidth: 2,
    borderColor: '#facc15',
  },
  tileMovable: {
    borderWidth: 2,
    borderColor: '#4ade80',
  },
  tileArtContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  centerOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  structureBg: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 6,
    padding: 2,
  },
  resourceBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  resourceText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  otherPlayerBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(233,69,96,0.8)',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otherPlayerText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
  moveCostBadge: {
    position: 'absolute',
    top: 2,
    left: 2,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  moveCostText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
});
