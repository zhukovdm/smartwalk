import axios from "axios";
import { ValueObject } from "./types";
import { Reporter } from "./reporter";

function queryBuilder(key: string, page: number): string {
  return `https://taginfo.openstreetmap.org/api/4/key/values?key=${key}&page=${page}&rp=100&filter=all&lang=en&sortname=count&sortorder=desc&qtype=value&format=json`;
};

export default async function fetch(key: string, page: number, reporter: Reporter): Promise<ValueObject> {

  let attempt = 0;
  let result: ValueObject | undefined = undefined;

  do {
    ++attempt;
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      result = (await axios.get(queryBuilder(key, page))).data;
    }
    catch (_) {
      reporter.reportFailedFetchAttempt(key, page, attempt);
    }
  } while (result === undefined && attempt < 3);

  return result ?? { data: [] };
}
