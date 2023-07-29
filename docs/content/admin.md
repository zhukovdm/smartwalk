# Administration guide

## Data ingestion

The goal of the procedure is to prepare data for separate two system components, a database and routing engine.

### Prerequisites

- Ensure that the following programs are available on the target system.
    - `bash`
    - `docker`
    - `dotnet-sdk-6.0`
    - `make`
    - `node v18.x` (can be installed using [nvm](https://github.com/nvm-sh/nvm#install--update-script))

*It is important to preserve proper versions because of the library dependencies.*

*All docker-related commands require the current user to be a member of a `docker` group to avoid using `sudo` repeatedly, see details at [Manage Docker as a non-root user](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user).*

- Clone the repository and navigate to the folder.

```bash
git clone https://github.com/zhukovdm/smartwalk.git
cd ./smartwalk/data/
```

- Decide which part of the world you are interested in, download `pbf`-file at [Geofabrik](https://download.geofabrik.de/), and store it in `./assets/osm-maps/`. Open `Makefile` and set the value of `REGION_FILE` accordingly. Some of the `OSM` dumps are quite large and additional refinement might be necessary. There are four additional variables `REGION_X`, where suffix `X` can be any of `N` (North), `E` (East), `S` (South), or `W` (West), defining a bounding box. Entities outside bounding box are filtered out. To switch off filtering, set `N=85.06`, `E=180.0`, `S=-85.06`, and `W=-180.0` (see [EPSG3857](https://epsg.io/3857) for details).

- Run `make init` to create folders necessary for storing data.

### Data for a routing engine

- Generate data for a routing engine via `make routing-engine`. The command pulls the [docker image](https://hub.docker.com/r/osrm/osrm-backend/) and builds a search structure in several consecutive phases. The results are stored in `./assets/routing-engine/`.

*Note that an instance of OSRM can use only one `osrm`-file at a time. This limitation can be overcome via merging (see [osmosis](https://gis.stackexchange.com/a/242880)). Furthermore, routing data can be extracted for different countries and kept in the same folder as long as original `pbf`-files have distinct names, a particular region can be decided later.*

### Data for a database

- Start up a database instance, create collections and indexes, restore dependencies.

```bash
docker compose -f docker-compose.data.yaml up -d
make database-init
make database-deps
```

- Obtain the most popular `OSM` keys and their frequencies of use from [taginfo](https://taginfo.openstreetmap.org/taginfo/apidoc). Results are stored in `./assets/taginfo/`. A list of tags can be extended by altering `./scripts/taginfo.sh`, but this is not enough to enable their full potential. The [constructor](https://github.com/zhukovdm/smartwalk/blob/fab346ac73f43be063b7e16d4f2c5f060e38ecfc/data/osm/KeywordExtractor.cs#L23-L53) of `KeywordExtractor` shall reflect changes as well. <u>Never remove</u> tags from the list as it may brake things unexpectedly. In general, modifying tag list is not a typical operation and may require deeper knowledge of the system.

```bash
make database-taginfo
```

- Extract data from `pbf`-file. As part of the procedure, the routine makes `GET` request to the [Overpass](https://overpass-api.de/api/interpreter) endpoint. The connection is configured to time out after 100s, but the server usually responds within 10s at most.

```bash
make database-osm
```

- Some of `OSM` entities have a direct link to the corresponding entity within `Wikidata` knowledge base, see `wikidata` tag, but there might be more entities suitable for our purpose. Create entities by the information from Wikidata.

```bash
make ...
```



`wikidata-enrich.sh` ~> `wikidata-create.sh` ~> `dbpedia.sh` ~> `index.sh`.

*Note that `database-osm`, `database-wikidata-enrich` and `database-dbpedia` are [idempotent](https://en.wikipedia.org/wiki/Idempotence#Idempotent_functions) because of the `upsert` database strategy. Failed attempts may be re-run with no consequences for data integrity. `database-wikidata-create` only creates new objects and does not have any impact on already existing.*

### Creating data-rich docker images

Once two previous steps are done, the `./assets/` folder contains all data necessary for running an instance of the application. Create self-contained docker images to optimize and simplify testing.

```bash
docker build -f ./Dockerfile.database -t smartwalk-database
docker build -f ./Dockerfile.routing-engine -t smartwalk-routing-engine
```
