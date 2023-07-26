ASSETS_DIR=${PWD}/assets
EXTRA_DIRS=dataset indexer routing

# indexer

# routing

ROUTING_COUNTRY=czech-republic
ROUTING_CMD=docker run --rm -t -v
ROUTING_DIR=$(ASSETS_DIR)/routing
ROUTING_VOL=$(ROUTING_DIR):/data
ROUTING_IMG=osrm/osrm-backend:v5.24.0
ROUTING_FIL=$(ROUTING_COUNTRY)-latest
ROUTING_DAT=/data/$(ROUTING_FIL)

init-dirs:
	for dir in $(EXTRA_DIRS) ; do \
		mkdir -p $(ASSETS_DIR)/$$dir ; \
	done

dataset: init-dirs
	echo "dataset"

indexer: init-dirs
	docker run --rm -t -v $(ASSETS_DIR)/indexer:/usr/share/elasticsearch/data -p 3003:9200 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:8.9.0

routing: init-dirs
	cp /maps/$(ROUTING_FIL).osm.pbf $(ROUTING_DIR)
	$(ROUTING_CMD) $(ROUTING_VOL) $(ROUTING_IMG) osrm-extract -p /opt/foot.lua $(ROUTING_DAT).osm.pbf
	$(ROUTING_CMD) $(ROUTING_VOL) $(ROUTING_IMG) osrm-partition $(ROUTING_DAT).osrm
	$(ROUTING_CMD) $(ROUTING_VOL) $(ROUTING_IMG) osrm-customize $(ROUTING_DAT).osrm

clean:
	for dir in $(EXTRA_DIRS) ; do \
		sudo rm -rf $(ASSETS_DIR)/$$dir ; \
	done
