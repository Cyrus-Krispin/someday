import React from 'react';
import { render, screen } from '@testing-library/react-native';
import TileGrid from '../components/TileGrid';

describe('TileGrid Component', () => {
  const mockTiles = [
    { x: 0, y: 0, terrainType: 'grassland', resourceType: 'crops', structureType: null },
    { x: 1, y: 0, terrainType: 'forest', resourceType: 'lumber', structureType: null },
    { x: 2, y: 0, terrainType: 'mountain', resourceType: 'ore', structureType: 'mine' },
  ];

  const mockPlayerPosition = { x: 0, y: 0 };

  it('should render all tiles', () => {
    render(
      <TileGrid
        tiles={mockTiles}
        playerPosition={mockPlayerPosition}
        viewportSize={5}
      />
    );

    // Check that tiles are rendered
    expect(screen.getByTestId('tile-0-0')).toBeTruthy();
    expect(screen.getByTestId('tile-1-0')).toBeTruthy();
    expect(screen.getByTestId('tile-2-0')).toBeTruthy();
  });

  it('should show player indicator on player position', () => {
    render(
      <TileGrid
        tiles={mockTiles}
        playerPosition={mockPlayerPosition}
        viewportSize={5}
      />
    );

    // Player should be on tile 0,0
    const playerTile = screen.getByTestId('tile-0-0');
    expect(playerTile).toBeTruthy();
    // Check for player indicator
    expect(screen.getByTestId('tile-player')).toBeTruthy();
  });

  it('should not show player indicator on non-player tiles', () => {
    const nonPlayerPosition = { x: 1, y: 0 };
    render(
      <TileGrid
        tiles={mockTiles}
        playerPosition={nonPlayerPosition}
        viewportSize={5}
      />
    );

    // Player should be on tile 1,0, not 0,0
    const tile0 = screen.getByTestId('tile-0-0');
    expect(tile0).toBeTruthy();
    // There should be no player indicator on tile 0,0
    const playerIndicators = screen.queryAllByTestId('tile-player');
    expect(playerIndicators).toHaveLength(1); // Only one player indicator total
  });

  it('should apply correct terrain colors', () => {
    render(
      <TileGrid
        tiles={mockTiles}
        playerPosition={mockPlayerPosition}
        viewportSize={5}
      />
    );

    const grasslandTile = screen.getByTestId('tile-0-0');
    const forestTile = screen.getByTestId('tile-1-0');
    const mountainTile = screen.getByTestId('tile-2-0');

    expect(grasslandTile.props.style).toMatchObject({ backgroundColor: '#7CFC00' });
    expect(forestTile.props.style).toMatchObject({ backgroundColor: '#228B22' });
    expect(mountainTile.props.style).toMatchObject({ backgroundColor: '#808080' });
  });

  it('should render terrain type text', () => {
    render(
      <TileGrid
        tiles={mockTiles}
        playerPosition={mockPlayerPosition}
        viewportSize={5}
      />
    );

    expect(screen.getByText('grassland')).toBeTruthy();
    expect(screen.getByText('forest')).toBeTruthy();
    expect(screen.getByText('mountain')).toBeTruthy();
  });
});
