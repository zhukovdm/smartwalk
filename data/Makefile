COUNTRY_FILE=czech-republic-latest

ASSETS_DIR=${PWD}/assets
EXTRA_DIRS=database routing-engine taginfo

ROUTING_CMD=docker run --rm -t -v $(ASSETS_DIR)/routing-engine:/data osrm/osrm-backend:v5.24.0

# recipes

init:
	@for dir in $(EXTRA_DIRS); do \
		mkdir -p $(ASSETS_DIR)/$$dir; \
	done
	@[ -f $(ASSETS_DIR)/osm-maps/$(COUNTRY_FILE).osm.pbf ] \
		|| { echo "File $(COUNTRY_FILE).osm.pbf has not been found..."; exit 1; }

routing-engine: init
	cp $(ASSETS_DIR)/osm-maps/$(COUNTRY_FILE).osm.pbf $(ASSETS_DIR)/routing-engine
	$(ROUTING_CMD) osrm-extract -p /opt/foot.lua /data/$(COUNTRY_FILE).osm.pbf
	$(ROUTING_CMD) osrm-partition /data/$(COUNTRY_FILE).osrm
	$(ROUTING_CMD) osrm-customize /data/$(COUNTRY_FILE).osrm
	rm $(ASSETS_DIR)/routing-engine/$(COUNTRY_FILE).osm.pbf

clean:
	for dir in $(EXTRA_DIRS) ; do \
		sudo rm -rf $(ASSETS_DIR)/$$dir ; \
	done
