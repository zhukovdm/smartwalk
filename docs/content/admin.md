# Administration guide

## Data ingestion

The goal of the procedure is to prepare data for separate two system components, a database and routing engine.

### Prerequisites

- Ensure that `bash`, `docker`, `make`, `node v18.x` (can be installed using [nvm](https://github.com/nvm-sh/nvm#install--update-script)), `dotnet-sdk-?` are available on the target system before any other activities take place.

*It is important to preserve proper versions because of the library dependencies.*

*All docker-related commands require the current user to be a member of a `docker` group to avoid using `sudo` repeatedly, see details at [Manage Docker as a non-root user](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user).*

- Clone the repository and navigate to the folder.

```bash
git clone https://github.com/zhukovdm/smartwalk.git
cd ./smartwalk/data/
```

- Decide which part of the world you are interested in, download `pbf`-file at [Geofabrik](https://download.geofabrik.de/), and store it in `./assets/osm-maps/`. Open `Makefile` and set the value of `REGION_FILE` accordingly.

- Run `make init` to create folders necessary for storing structured data.

### Data for a routing engine

Generate data for a routing engine via `make routing-engine`. The command pulls the [docker image](https://hub.docker.com/r/osrm/osrm-backend/) and builds a search structure in several phases. The results are stored in `./assets/routing-engine/`.

*Note that an instance of OSRM can handle/use only one `pbf`-file. This limitation can be overcome via merging (see [osmosis](https://gis.stackexchange.com/a/242880)). Furthermore, routing data can be extracted for different countries and kept in the same folder as long as original `pbf`-files have distinct names, a particular region can be decided later.*

### Data for a database

TBA

- Start a database instance.

```bash
docker compose -f docker-compose.data.yaml up -d
```

7. Restore dependencies for .

```bash
make database-deps
```

8. Create collections and indexes in the database.

```bash
make database-init
```

9. Extract the most popular `OSM` tags and frequencies of use from [taginfo](https://taginfo.openstreetmap.org/taginfo/apidoc). Results are stored in `./assets/taginfo/`.

```bash
make database-taginfo
```

`osm` ~> `wikidata-enrich.sh` ~> `wikidata-create.sh` ~> `dbpedia.sh` ~> `index.sh`.

```console
dotnet run --file czech-republic-latest.osm.pbf --bbox 14.18 50.20 14.80 49.90
```

### Creating data-rich docker images

Once two previous steps are done, the `./assets/` folder contains all data necessary for running an instance of the application. Create self-contained docker images to optimize and simplify testing.

```bash
docker build -f ./Dockerfile.database -t smartwalk-database
docker build -f ./Dockerfile.routing-engine -t smartwalk-routing-engine
```
