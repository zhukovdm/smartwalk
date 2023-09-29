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

    def get_place_count(self) -> int:
        return self.__placeColl.count_documents({})

    def get_place_on_offset(self, offset: int):
        return list(self.__placeColl.find({}).skip(offset).limit(1))[0]

    def get_places_within(self, bbox: Tuple[float, float, float, float]) -> List[dict]:
        (w, n, e, s) = bbox
        return list(self.__placeColl.find({ "location": { "$within": { "$box": [[w, s], [e, n]] } } }, { "_id": 0, "location": 1 }))

    def get_keywords(self) -> List[dict]:
        return list(self.__keywdColl.find())
