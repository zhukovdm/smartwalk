from typing import List, Tuple
import pymongo

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

    # def get_keywords(self) -> List[dict]:
    #     return list(self.__keywdColl.find())
