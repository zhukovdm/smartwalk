EXTRA_DIRS=dataset indexer routing

# dataset

# indexer

# routing

ROUTING_COUNTRY=czech-republic
ROUTING_CMD=docker run --rm -t -v
ROUTING_DIR=${PWD}/assets/routing
ROUTING_VOL=$(ROUTING_DIR):/data
ROUTING_IMG=osrm/osrm-backend:v5.24.0
ROUTING_FIL=$(ROUTING_COUNTRY)-latest
ROUTING_DAT=/data/$(ROUTING_FIL)

start:
	for dir in $(EXTRA_DIRS) ; do \
		mkdir -p ${PWD}/assets/$$dir ; \
	done

dataset: start
	echo "dataset"

indexer: start
	echo "indexer"

routing: start
	cp ${PWD}/assets/maps/$(ROUTING_FIL).osm.pbf $(ROUTING_DIR)
	$(ROUTING_CMD) $(ROUTING_VOL) $(ROUTING_IMG) osrm-extract -p /opt/foot.lua $(ROUTING_DAT).osm.pbf
	$(ROUTING_CMD) $(ROUTING_VOL) $(ROUTING_IMG) osrm-partition $(ROUTING_DAT).osrm
	$(ROUTING_CMD) $(ROUTING_VOL) $(ROUTING_IMG) osrm-customize $(ROUTING_DAT).osrm

clean:
	for dir in $(EXTRA_DIRS) ; do \
		sudo rm -rf ${PWD}/assets/$$dir ; \
	done
