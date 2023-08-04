# Administration guide

## Data preparation

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

- Generate data for a routing engine via `make routing-engine`. The command pulls the [docker image](https://hub.docker.com/r/osrm/osrm-backend/) and builds a search structure in several consecutive phases. The results are stored in the `./assets/routing-engine/`.

*An instance of OSRM can use [only one](https://help.openstreetmap.org/questions/64867/osrm-routed-for-multiple-countries) `osrm`-file at a time. This limitation can be overcome via merging (see [osmosis](https://gis.stackexchange.com/a/242880)). Furthermore, routing data can be extracted for different countries and kept in the same folder as long as original `pbf`-files have distinct names, a particular region can be decided later.*

### Dataset ingestion

- Obtain the most popular `OSM` keys and their frequencies of use from [taginfo](https://taginfo.openstreetmap.org/taginfo/apidoc). Results are stored in `./assets/taginfo/`. A list of tags can be extended by altering `Makefile`, although this is not enough to enable their full potential. The [constructor](https://github.com/zhukovdm/smartwalk/blob/fab346ac73f43be063b7e16d4f2c5f060e38ecfc/data/osm/KeywordExtractor.cs#L23-L53) of `KeywordExtractor` shall reflect changes as well. <u>Never remove</u> tags from the list as it may brake things unexpectedly. Modifying tag list is not a typical operation and may require deeper knowledge of the system.

```bash
make taginfo
```

- Start up a database instance, restore dependencies, create collections and indexes.

```bash
docker compose -f docker-compose.data.yaml up -d
make database-init
```

- Extract data from a `pbf`-file. As part of the procedure, the routine makes a `GET` request to the [Overpass](https://overpass-api.de/api/interpreter) endpoint. The connection is configured to time out after 100s, but the server usually responds within 10s at most.

```bash
make database-osm
```

- Create entities that exist in the [Wikidata](https://www.wikidata.org/wiki/Wikidata:Main_Page) knowledge graph but do not exist in the database. The script attempts to fetch data from the SPARQL endpoint. The file `wikidata-create.mjs` defines an extendable list of categories with upper bounds on number of objects to be retrieved. The script handles items sequentially in a given order.

```bash
make database-wikidata-create
```

*Requests may time out after one minute. Large regions or too general categories are more likely to result in failures. Hence, the numeric constants were specifically chosen for the test setup and may not be suitable for other cases.*

- Enrich existing entities by information from `Wikidata`. Only those with `wikidata` attribute will be updated. Then, do the same for `DBPedia` knowledge graph.

```bash
make database-wikidata-enrich
make database-dbpedia
```

*`database-osm`, `database-wikidata-enrich` and `database-dbpedia` are [idempotent](https://en.wikipedia.org/wiki/Idempotence#Idempotent_functions). Failed attempts may be re-run with no consequences for data integrity. `database-wikidata-create` only creates new objects and does not have any impact on already existing.*

- Collect supporting data to aid autocomplete functionality.

```bash
make advice
```

- Finally, stop the database instance. All relevant data are stored in the `./assets/database`.

```bash
docker compose -f docker-compose.data.yaml down
```

### Creating data-rich docker images

Once two previous phases are done, the `./assets/` folder contains all data necessary for running an instance of the application. Create self-contained docker images to optimize and simplify testing.

```bash
docker build -f ./Dockerfile.database -t smartwalk-database
docker build -f ./Dockerfile.routing-engine -t smartwalk-routing-engine
```

## Test environment

### Environment variables

`SMARTWALK_MONGO_CONN_STR`, `SMARTWALK_OSRM_BASE_URL`,

http://localhost:5017/swagger/index.html
