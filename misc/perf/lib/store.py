from typing import Any, List, Tuple
import numpy as np
import pymongo
from scipy import stats

class Store:

    def __init__(self):
        self.__client = None

    def __enter__(self):
        self.__client = pymongo.MongoClient("localhost", 27017)
        db = self.__client.get_database("smartwalk")

        self.__placeColl = db.get_collection("place")
        self.__keywdColl = db.get_collection("keyword")

        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if self.__client is not None:
            self.__client.close()

    def get_place_identifiers(self) -> List[str]:
        return list(map(lambda obj: str(obj["_id"]), self.__placeColl.find({}, { "_id": 1 })))

    def get_locations_within(self, bbox: Tuple[float, float, float, float]) -> List[dict]:
        (w, n, e, s) = bbox
        return list(self.__placeColl.find({ "location": { "$within": { "$box": [[w, s], [e, n]] } } }, { "_id": 0, "location": 1 }))

    def get_keywords(self) -> (List[str], Any):
        objects = list(self.__keywdColl.find())

        keywords = list(map(lambda object: object["keyword"], objects))
        counts = list(map(lambda object: object["count"], objects))

        total = sum(counts)
        pmf = list(map(lambda count: count / total, counts))

        rv = stats.rv_discrete(values=(np.arange(len(counts)), pmf))

        return (keywords, rv)
