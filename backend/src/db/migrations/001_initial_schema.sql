-- Migration 001: Initial schema for Someday game
-- Created: 2026-05-01

-- Enable UUID extension for unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Worlds table
CREATE TABLE IF NOT EXISTS worlds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seed VARCHAR(255) NOT NULL,
    game_day INTEGER NOT NULL DEFAULT 1,
    event_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    join_code VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    world_id UUID REFERENCES worlds(id) ON DELETE SET NULL,
    x INTEGER NOT NULL DEFAULT 0,
    y INTEGER NOT NULL DEFAULT 0,
    tokens INTEGER NOT NULL DEFAULT 20,
    score INTEGER NOT NULL DEFAULT 0,
    movement_remaining INTEGER NOT NULL DEFAULT 6,
    actions_remaining INTEGER NOT NULL DEFAULT 2,
    last_turn_at TIMESTAMP WITH TIME ZONE,
    consecutive_passes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tiles table
CREATE TABLE IF NOT EXISTS tiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    world_id UUID NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    terrain_type VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_quantity INTEGER DEFAULT 0,
    last_harvested_day INTEGER,
    owner_id UUID REFERENCES players(id) ON DELETE SET NULL,
    structure_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(world_id, x, y)
);

-- Turns table
CREATE TABLE IF NOT EXISTS turns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    world_id UUID NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    actions_json JSONB,
    auto_skipped BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(player_id, type)
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    world_id UUID NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    starts_day INTEGER NOT NULL,
    ends_day INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance (IF NOT EXISTS requires PostgreSQL 9.5+)
CREATE INDEX IF NOT EXISTS idx_players_world_id ON players(world_id);
CREATE INDEX IF NOT EXISTS idx_tiles_world_id ON tiles(world_id);
CREATE INDEX IF NOT EXISTS idx_tiles_coords ON tiles(world_id, x, y);
CREATE INDEX IF NOT EXISTS idx_turns_world_id ON turns(world_id);
CREATE INDEX IF NOT EXISTS idx_turns_player_id ON turns(player_id);
CREATE INDEX IF NOT EXISTS idx_resources_player_id ON resources(player_id);
CREATE INDEX IF NOT EXISTS idx_events_world_id ON events(world_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables with that column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_worlds_updated_at') THEN
        CREATE TRIGGER update_worlds_updated_at BEFORE UPDATE ON worlds
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_players_updated_at') THEN
        CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tiles_updated_at') THEN
        CREATE TRIGGER update_tiles_updated_at BEFORE UPDATE ON tiles
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_resources_updated_at') THEN
        CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;
