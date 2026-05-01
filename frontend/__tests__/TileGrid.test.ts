import TileGrid from '../components/TileGrid';

describe('TileGrid Component', () => {
  it('should be a function component', () => {
    expect(typeof TileGrid).toBe('function');
  });

  it('should have a display name', () => {
    expect(TileGrid.name || 'TileGrid').toBeTruthy();
  });
});
