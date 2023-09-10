import axios from "axios";
import { ValueObject } from "./types";
import { Logger } from "./logger";

function queryBuilder(key: string, page: number): string {
  return `https://taginfo.openstreetmap.org/api/4/key/values?key=${key}&page=${page}&rp=100&filter=all&lang=en&sortname=count&sortorder=desc&qtype=value&format=json`;
};

export default async function fetch(key: string, page: number, reporter: Logger): Promise<ValueObject> {

  let attempt = 0;
  let result: ValueObject | undefined = undefined;

  do {
    ++attempt;
    try {
      result = (await axios.get(queryBuilder(key, page))).data;
    }
    catch (ex) {
      reporter.logFailedFetchAttempt(key, page, attempt, ex);
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  } while (result === undefined && attempt < 3);

  return result ?? { data: [] };
}
