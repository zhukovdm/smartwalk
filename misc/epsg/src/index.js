/*
 * Project EPSG:4326 coordinates into EPSG:3857.
 * 
 * - https://epsg.io/3857
 * - https://epsg.io/4326
 * 
 * Verify at https://epsg.io/transform.
 */

const BASE_LON = 14.4035264;
const BASE_LAT = 50.0884344;

const R = 6378137.0; // meters

const deg2rad = (deg) => deg * Math.PI / 180.0;

const rad2deg = (rad) => rad * 180.0 / Math.PI;

function project(lon, lat) {

  const sin = Math.sin(deg2rad(lat));
  const eas = R * deg2rad(lon - 0.0);
  const nor = R * 0.5 * Math.log((1.0 + sin) / (1.0 - sin));

  return [eas, nor];
}

function unproject(eas, nor) {

  var lon = rad2deg(eas / R) + 0.0;
  var lat = rad2deg(2.0 * Math.atan(Math.pow(Math.E, nor / R)) - Math.PI / 2.0);

  return [lon, lat];
}

function main() {

  const [eas, nor] = project(BASE_LON, BASE_LAT);

  console.log("EPSG:4326 to EPSG:3857");
  console.log(`  lon = ${BASE_LON} -> eas = ${eas}`);
  console.log(`  lat = ${BASE_LAT} -> nor = ${nor}`);

  const [lon, lat] = unproject(eas, nor);

  console.log("EPSG:3857 to EPSG:4326");
  console.log(`  eas = ${eas} -> lon = ${lon}`);
  console.log(`  nor = ${nor} -> lat = ${lat}`);
}

main();
