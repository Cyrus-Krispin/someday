-- Migration 002: Add tile_state for sparse world storage
-- Created: 2026-05-02
-- Replaces the need to store all tiles; only stores mutated/dynamic tile data.
-- Terrain is computed on-the-fly from seed.

-- Tile state: only rows for tiles that have been modified (resource gathered, structure built, etc.)
CREATE TABLE IF NOT EXISTS tile_state (
    world_id UUID NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    resource_type VARCHAR(50),
    resource_quantity INTEGER NOT NULL DEFAULT 0,
    last_harvested_day INTEGER,
    owner_id UUID REFERENCES players(id) ON DELETE SET NULL,
    structure_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (world_id, x, y)
);

CREATE INDEX IF NOT EXISTS idx_tile_state_world_id ON tile_state(world_id);
CREATE INDEX IF NOT EXISTS idx_tile_state_bbox ON tile_state(world_id, x, y);
CREATE INDEX IF NOT EXISTS idx_tile_state_structure ON tile_state(world_id, structure_type) WHERE structure_type IS NOT NULL;

-- Trigger for tile_state updated_at
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tile_state_updated_at') THEN
        CREATE TRIGGER update_tile_state_updated_at BEFORE UPDATE ON tile_state
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- Add world_size column to worlds (default 30 for backwards compat, 1000 for new worlds)
ALTER TABLE worlds ADD COLUMN IF NOT EXISTS world_size INTEGER NOT NULL DEFAULT 30;
ALTER TABLE worlds ALTER COLUMN world_size SET DEFAULT 1000;
