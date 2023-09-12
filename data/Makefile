################################################################################

# Do not forget to set up these variables based on your preferences!

REGION_FILE=czech-republic-latest

REGION_N=50.20
REGION_E=14.80
REGION_S=49.90
REGION_W=14.18

################################################################################

A_DIR=${PWD}/assets

NODE_DIRS=advice dbpedia init taginfo wikidata-create wikidata-enrich
DATA_DIRS=database routing-engine taginfo

# routing engine
R_CMD=docker run --rm -t -v $(A_DIR)/routing-engine:/data osrm/osrm-backend:v5.24.0

# entity store
M_URL=mongodb://localhost:27017

# entity index
I_URL=http://localhost:9200

################################################################################

.PHONY: advice check-clean init taginfo

init-data-dirs:
	@for dir in $(DATA_DIRS); do mkdir -p $(A_DIR)/$$dir; done

init-node-dirs:
	@for dir in $(NODE_DIRS); do (cd ./$$dir && npm ci); done

check-region-file:
	@[ -f $(A_DIR)/osm-maps/$(REGION_FILE).osm.pbf ] \
		|| { echo "File $(REGION_FILE).osm.pbf has not been found..."; exit 1; }

init: init-data-dirs init-node-dirs check-region-file

routing-engine:
	@cp $(A_DIR)/osm-maps/$(REGION_FILE).osm.pbf $(A_DIR)/routing-engine && \
	$(R_CMD) osrm-extract -p /opt/foot.lua /data/$(REGION_FILE).osm.pbf && \
	$(R_CMD) osrm-partition /data/$(REGION_FILE).osrm && \
	$(R_CMD) osrm-customize /data/$(REGION_FILE).osrm && \
	rm $(A_DIR)/routing-engine/$(REGION_FILE).osm.pbf

taginfo:
	@cd ./taginfo && npm run build && npm run start -- \
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
	@cd ./init && npm run build && npm run start -- \
		--conn $(M_URL)

database-osm:
	@cd ./osm && dotnet run \
		--file $(REGION_FILE).osm.pbf \
		--bbox $(REGION_W) $(REGION_N) $(REGION_E) $(REGION_S) \
		--rows 2 \
		--cols 2 \
		--conn $(M_URL)

database-wikidata-create:
	@./wikidata-create.sh $(REGION_W) $(REGION_N) $(REGION_E) $(REGION_S) $(M_URL)

database-wikidata-enrich:
	@cd ./wikidata-enrich && npm run build && npm run start -- \
		--conn $(M_URL)

database-dbpedia:
	@cd ./dbpedia && npm run build && npm run start -- \
		--conn $(M_URL)

advice:
	@cd ./advice && npm run build && npm run start -- \
		--conn $(M_URL)

check-clean:
	@echo -n "Are you sure? [y/N] " && read ans && [ $${ans:-N} = y ]

clean: check-clean
	@for dir in $(EXTRA_DIRS) ; do sudo rm -rf $(A_DIR)/$$dir ; done
