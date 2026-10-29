postgres-up:
	docker compose -f docker-compose.postgres.yaml up -d

postgres-down:
	docker compose -f docker-compose.postgres.yaml down

postgres-connect:
	psql --host localhost --port 5432 --user user --dbname smartwalk

################################################################################

# UPDATE REGION FILE WITH YOURS!

#REGION_FILE=andorra-latest
REGION_FILE=czech-republic-latest
#REGION_FILE=luxembourg-latest

# Earth

REGION_W := +180
REGION_N := +90
REGION_E := -180
REGION_S := -90

# Prague (prod)

# REGION_W=14.18
# REGION_N=50.20
# REGION_E=14.80
# REGION_S=49.90

# Prague (perf)

# REGION_W=14.18
# REGION_N=50.20
# REGION_E=14.80
# REGION_S=49.90

# Brno (perf)

# REGION_W=16.52
# REGION_N=49.27
# REGION_E=16.72
# REGION_S=49.12

# Ostrava (perf)

# REGION_W=18.14
# REGION_N=49.88
# REGION_E=18.36
# REGION_S=49.75

# Plzen (perf)

# REGION_W=13.29
# REGION_N=49.79
# REGION_E=13.44
# REGION_S=49.69

# Liberec (perf)

# REGION_W=14.99
# REGION_N=50.81
# REGION_E=15.11
# REGION_S=50.68

# Olomouc (perf)

# REGION_W=16.96
# REGION_N=49.78
# REGION_E=17.54
# REGION_S=49.40

# Ceske Budejovice (perf)

# REGION_W=14.18
# REGION_N=49.17
# REGION_E=14.76
# REGION_S=48.78

# Hradec Kralove (perf)

# REGION_W=15.54
# REGION_N=50.40
# REGION_E=16.12
# REGION_S=50.02

# Pardubice (perf)

# REGION_W=15.49
# REGION_N=50.22
# REGION_E=16.07
# REGION_S=49.85

# Usti nad Labem (perf)

# REGION_W=13.74
# REGION_N=50.85
# REGION_E=14.32
# REGION_S=50.48

################################################################################

.PHONY: advice check-clean dump init-data restore routing taginfo

A_DIR=${PWD}/assets

NODE_DIRS := shared advice dbpedia dump init restore taginfo wikidata-create wikidata-enrich

OSRM_IMAGE := ghcr.io/project-osrm/osrm-backend:26.10.0-debian
R_CMD := docker run --rm -t -v $(A_DIR)/routing/osrm:/data $(OSRM_IMAGE)

MONGO_CONNECTION_STRING=mongodb://localhost:27017

# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# init-data
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

init-node-dirs:
	@for dir in $(NODE_DIRS); do (cd ./$$dir && npm ci); done

check-region-file:
	@[ -f $(A_DIR)/maps/osm/$(REGION_FILE).osm.pbf ] \
		|| { echo "File $(REGION_FILE).osm.pbf has not been found!"; exit 1; }

init-data: init-node-dirs check-region-file

# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# routing
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

osrm-extract:
	docker run --rm -t \
		-v $(A_DIR)/maps/osm/$(REGION_FILE).osm.pbf:/data/$(REGION_FILE).osm.pbf:ro \
		-v $(A_DIR)/routing/osrm:/data \
		$(OSRM_IMAGE) \
		osrm-extract -p /opt/foot.lua /data/$(REGION_FILE).osm.pbf

osrm-partition:
	$(R_CMD) osrm-partition /data/$(REGION_FILE).osrm

osrm-customize:
	$(R_CMD) osrm-customize /data/$(REGION_FILE).osrm

# running order matters!
routing: osrm-extract osrm-partition osrm-customize

# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# taginfo
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

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
		military \
		natural \
		office \
		playground \
		public_transport \
		rental \
		shop \
		social_facility \
		sport \
		theatre:genre \
		tourism \
		vending

# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# init-database
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

init-database:
	@cd ./init && npm run build && npm run start -- \
		--conn $(MONGO_CONNECTION_STRING)

# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# database-osm
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

PBF_NCNT = $(shell osmium fileinfo -e -g data.count.nodes $(A_DIR)/maps/osm/$(REGION_FILE).osm.pbf)
PBF_WCNT = $(shell osmium fileinfo -e -g data.count.ways  $(A_DIR)/maps/osm/$(REGION_FILE).osm.pbf)

database-osm:
	cd ./osm/ && dotnet run -- \
		--file $(REGION_FILE).osm.pbf \
		--bbox $(REGION_W) $(REGION_N) $(REGION_E) $(REGION_S) \
		--ncnt $(PBF_NCNT) \
		--wcnt $(PBF_WCNT) \
		--rows 2 \
		--cols 2 \
		--conn $(MONGO_CONNECTION_STRING)

# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# database-wikidata-create
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

database-wikidata-create:
	@./wikidata-create.sh $(REGION_W) $(REGION_N) $(REGION_E) $(REGION_S) $(MONGO_CONNECTION_STRING)

# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# database-wikidata-enrich
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

database-wikidata-enrich:
	@cd ./wikidata-enrich && npm run build && npm run start -- \
		--conn $(MONGO_CONNECTION_STRING)

database-dbpedia:
	@cd ./dbpedia && npm run build && npm run start -- \
		--conn $(MONGO_CONNECTION_STRING)

advice:
	@cd ./advice && npm run build && npm run start -- \
		--conn $(MONGO_CONNECTION_STRING)

dump:
	@cd ./dump && npm run build && npm run start -- \
		--conn $(MONGO_CONNECTION_STRING)

check-restore-files:
	@for file in keywords places ; do \
		[ -f $(A_DIR)/dump/$$file.txt ] || { echo "File $$file.txt has not been found..."; exit 1; } \
	done

init-restore: init-data-dirs init-node-dirs check-restore-files

restore:
	@cd ./restore && npm run build && npm run start -- \
		--conn $(MONGO_CONNECTION_STRING)

check-clean:
	@echo -n "Are you sure? [y/N] " && read ans && [ $${ans:-N} = y ]

clean: check-clean
	@for dir in $(EXTRA_DIRS); do sudo rm -rf $(A_DIR)/$$dir ; done
