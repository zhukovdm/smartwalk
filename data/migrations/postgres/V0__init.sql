-- Smartwalk database schema
-- Executed automatically by the official postgres image on first startup of an
-- empty data directory. Files in /docker-entrypoint-initdb.d run in
-- alphabetical order against the database named by POSTGRES_DB.

CREATE TABLE IF NOT EXISTS places (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            text NOT NULL,
    category        text,
    latitude        double precision NOT NULL,
    longitude       double precision NOT NULL,
    linked_osm      bigint,
    linked_wikidata text,
    created_at      timestamptz NOT NULL DEFAULT now()
);

-- Lookups by linked OSM / Wikidata identifiers.
CREATE INDEX IF NOT EXISTS places_linked_osm_idx
    ON places (linked_osm)
    WHERE linked_osm IS NOT NULL;

CREATE INDEX IF NOT EXISTS places_linked_wikidata_idx
    ON places (linked_wikidata)
    WHERE linked_wikidata IS NOT NULL;

-- Bounding-box / coordinate scans.
CREATE INDEX IF NOT EXISTS places_location_idx
    ON places (latitude, longitude);

CREATE TABLE IF NOT EXISTS routes (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        text NOT NULL,
    distance_m  double precision NOT NULL CHECK (distance_m >= 0),
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS routes_name_idx ON routes (name);
