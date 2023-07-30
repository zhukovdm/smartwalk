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

EXTRA_DIRS=database routing-engine taginfo

R_CMD=docker run --rm -t -v $(A_DIR)/routing-engine:/data osrm/osrm-backend:v5.24.0

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
	@cd $(S_DIR) && node taginfo.js \
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
	@cd $(S_DIR) && npm ci && node init.mjs

database-osm: init
	@cd ./osm/ && dotnet run \
		--file $(REGION_FILE).osm.pbf \
		--bbox $(REGION_W) $(REGION_N) $(REGION_E) $(REGION_S) \
		--conn mongodb://localhost:27017

database-wikidata-create:
	@cd $(S_DIR) && node wikidata-create.mjs \
		--w $(REGION_W) \
		--n $(REGION_N) \
		--e $(REGION_E) \
		--s $(REGION_S)

database-wikidata-enrich:
	@cd $(S_DIR) && node wikidata-enrich.mjs

database-dbpedia:
	@cd $(S_DIR) && node dbpedia.cjs

search-index:
	@cd $(S_DIR) && node search-index.mjs

clean:
	@for dir in $(EXTRA_DIRS) ; do \
		sudo rm -rf $(A_DIR)/$$dir ; \
	done
