################################################################################

# Do not forget to set up these vars based on your preferences!

REGION_FILE=czech-republic-latest

REGION_N=50.20
REGION_E=14.80
REGION_S=49.90
REGION_W=14.18

################################################################################

A_DIR=${PWD}/assets
S_DIR=${PWD}/scripts

EXTRA_DIRS=database routing-engine search-engine taginfo

# routing engine
R_CMD=docker run --rm -t -v $(A_DIR)/routing-engine:/data osrm/osrm-backend:v5.24.0

# entity store
M_URL=mongodb://localhost:27017

# entity index
I_URL=http://localhost:9200

################################################################################

.PHONY: init check-clean

init:
	@for dir in $(EXTRA_DIRS); do \
		mkdir -p $(A_DIR)/$$dir; \
	done
	@[ -f $(A_DIR)/osm-maps/$(REGION_FILE).osm.pbf ] \
		|| { echo "File $(REGION_FILE).osm.pbf has not been found..."; exit 1; }

routing-engine: init
	@cp $(A_DIR)/osm-maps/$(REGION_FILE).osm.pbf $(A_DIR)/routing-engine && \
	$(R_CMD) osrm-extract -p /opt/foot.lua /data/$(REGION_FILE).osm.pbf && \
	$(R_CMD) osrm-partition /data/$(REGION_FILE).osrm && \
	$(R_CMD) osrm-customize /data/$(REGION_FILE).osrm && \
	rm $(A_DIR)/routing-engine/$(REGION_FILE).osm.pbf

taginfo: init
	@cd ./taginfo/ && npm ci && npm run build && npm run start -- \
		aerialway \
		aeroway \
		amenity \
		artwork_type \
		attraction \
		building \
		building:architecture \
		building_type \
		business \
		clothes \
		club \
		craft \
		cuisine \
		denomination \
		emergency \
		hazard \
		healthcare \
		historic \
		leisure \
		natural \
		office \
		public_transport \
		rental \
		shop \
		sport \
		theatre:genre \
		tourism
# man_made

database-init:
	@cd ./init/ && npm ci && npm run build && npm run start -- \
		--conn $(M_URL)

database-osm: init
	@cd ./osm/ && dotnet run \
		--file $(REGION_FILE).osm.pbf \
		--bbox $(REGION_W) $(REGION_N) $(REGION_E) $(REGION_S) \
		--rows 2 \
		--cols 2 \
		--conn $(M_URL)

database-wikidata-create:
	@./wikidata-create.sh $(REGION_W) $(REGION_N) $(REGION_E) $(REGION_S) $(M_URL)

database-wikidata-enrich:
	@cd ./wikidata-enrich/ && npm ci && npm run build && npm run start -- \
		--conn $(M_URL)

database-dbpedia:
	@cd ./dbpedia/ && npm ci && npm run build && npm run start -- \
		--conn $(M_URL)

advice:
	@cd ./advice/ && npm ci && npm run build && npm run start -- \
		--conn $(M_URL)

check-clean:
	@echo -n "Are you sure? [y/N] " && read ans && [ $${ans:-N} = y ]

clean: check-clean
	@for dir in $(EXTRA_DIRS) ; do \
		sudo rm -rf $(A_DIR)/$$dir ; \
	done
