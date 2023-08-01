import consola from "consola";
import { Client } from "@elastic/elasticsearch";
import { getClient, getPlaceCollection } from "./shared.cjs"

/**
 * @param {Client} client
 * @param {*} placeBuf
 */
async function writeBulk(client, placeBuf) {
  const body = placeBuf.flatMap((place) => [{ index: { _index: "place", _id: place._id } }, {
    name: place.name,
    location: place.location,
    keyword: place.keywords,
    description: place.attributes.description,
    image: place.attributes.image ? { } : undefined,
    website: place.attributes.website ? { } : undefined,
    address: place.attributes.address ? { } : undefined,
    email: place.attributes.email ? { } : undefined,
    phone: place.attributes.phone ? { } : undefined,
  }]);

  await client.bulk({ refresh: true, body: body });
}

function reportIndexed(consola, placeCnt, placeTot) {
  consola.info(`> Indexed ${placeCnt} places out of ${placeTot} (${Math.floor(placeCnt * 100 / placeTot)} %)...`);
}

async function search() {

  const logger = consola.create();
  const elastClient = new Client({ node: "http://localhost:9200" });
  const mongoClient = getClient();

  try {
    const placeCol = getPlaceCollection(mongoClient);
    const placeTot = await placeCol.countDocuments();

    consola.info(`Found ${placeTot} documents in the database.`);
    const placeCur = placeCol.find();

    let placeBuf = [], placeCnt = 0;

    while (await placeCur.hasNext()) {
      const place = await placeCur.next();
      placeBuf.push(place);

      if (placeBuf.length >= 1000) {
        placeCnt += placeBuf.length;
        await writeBulk(elastClient, placeBuf);
        placeBuf = [];
        reportIndexed(consola, placeCnt, placeTot);
      }
    }
    await writeBulk(elastClient, placeBuf);
    reportIndexed(consola, placeCnt + placeBuf.length, placeTot);
  }
  catch (ex) { logger.error(ex?.message); }
  finally {
    await elastClient.close();
    await mongoClient.close();
  }
  consola.info(`Places are indexed. Exiting...`);
}

search();
