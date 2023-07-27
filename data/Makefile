REGION_FILE=czech-republic-latest

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
	cp $(A_DIR)/osm-maps/$(REGION_FILE).osm.pbf $(A_DIR)/routing-engine && \
	$(R_CMD) osrm-extract -p /opt/foot.lua /data/$(REGION_FILE).osm.pbf && \
	$(R_CMD) osrm-partition /data/$(REGION_FILE).osrm && \
	$(R_CMD) osrm-customize /data/$(REGION_FILE).osrm && \
	rm $(A_DIR)/routing-engine/$(REGION_FILE).osm.pbf

database-deps:
	cd $(S_DIR) && npm ci

database-init:
	cd $(S_DIR) && ./init.sh

database-taginfo:
	cd $(S_DIR) && ./taginfo.sh

clean:
	@for dir in $(EXTRA_DIRS) ; do \
		sudo rm -rf $(A_DIR)/$$dir ; \
	done
