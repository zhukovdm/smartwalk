import axios from "axios";
import * as smartwalk from "../smartwalk";
import { getExtendedPlace, getPath, getPlace } from "../testData";
import { PlacesRequest, RoutesRequest } from "../../domain/types";

/**
 * Note that `axios` throws a network error in case the targeted resource
 * is unreachable. smartwalkFetch does not catch this kind of errors, but
 * UI components do.
 */

// jest.mock("axios");

describe("smartwalk", () => {

  describe("fetchAdviceKeywords", () => {

    it("should get a list of items", async () => {
      axios.get = jest.fn().mockResolvedValueOnce({
        status: 200, // !
        data: [
          {
            keyword: "museum",
            attributeList: [
              "image"
            ],
            numericBounds: {},
            collectBounds: {}
          }
        ]
      });
      await expect(smartwalk.fetchAdviceKeywords("m")).resolves.toBeTruthy();
      expect(axios.get).toHaveBeenCalled();
    });

    it("should throw upon server internal error", async () => {
      axios.get = jest.fn().mockResolvedValueOnce({
        status: 500
      });
      await expect(smartwalk.fetchAdviceKeywords("m")).rejects.toThrow();
      expect(axios.get).toHaveBeenCalled();
    });
  });

  describe("fetchEntityPlace", () => {

    it("should get a value object", async () => {
      axios.get = jest.fn().mockResolvedValueOnce({
        status: 200,
        data: getExtendedPlace()
      });
      await expect(smartwalk.fetchEntityPlaces("A")).resolves.toBeTruthy();
      expect(axios.get).toHaveBeenCalled();
    });

    it("should throw if an invalid smartId is provided", async () => {
      axios.get = jest.fn().mockResolvedValueOnce({
        status: 400
      });
      await expect(smartwalk.fetchEntityPlaces("!")).rejects.toThrow();
      expect(axios.get).toHaveBeenCalled();
    });

    it("should return undefined if resource does not exist", async () => {
      axios.get = jest.fn().mockResolvedValueOnce({
        status: 404
      });
      await expect(smartwalk.fetchEntityPlaces("A")).resolves.toBeFalsy();
      expect(axios.get).toHaveBeenCalled();
    });

    it("should throw upon server internal error", async () => {
      axios.get = jest.fn().mockResolvedValueOnce({
        status: 500
      });
      await expect(smartwalk.fetchEntityPlaces("A")).rejects.toThrow();
      expect(axios.get).toHaveBeenCalled();
    });
  });

  describe("fetchSearchDirecs", () => {

    it("should get a value object", async () => {
      axios.get = jest.fn().mockResolvedValueOnce({
        status: 200,
        data: Array(3).fill(undefined).map(() => ({
          ...getPath(),
          distance: 3100
        }))
      });
      const waypoints = Array(3).fill(undefined).map(() => (getPlace()));
      await expect(smartwalk.fetchSearchDirecs(waypoints)).resolves.toBeTruthy();
      expect(axios.get).toHaveBeenCalled();
    });

    it("should throw if an invalid query is provided", async () => {
      axios.get = jest.fn().mockResolvedValueOnce({
        status: 400
      });
      const waypoints = Array(3).fill(true);
      await expect(smartwalk.fetchSearchDirecs(waypoints)).rejects.toThrow();
      expect(axios.get).toHaveBeenCalled();
    });

    it("should throw upon server internal error", async () => {
      axios.get = jest.fn().mockResolvedValueOnce({
        status: 500
      });
      const waypoints = Array(3).fill(undefined).map(() => (getPlace()));
      await expect(smartwalk.fetchSearchDirecs(waypoints)).rejects.toThrow();
      expect(axios.get).toHaveBeenCalled();
    });
  });

  describe("fetchSearchPlaces", () => {

    const getRequest = (): PlacesRequest => ({
      center: getPlace(),
      radius: 3.1,
      categories: ["castle", "museum"].map((keyword) => ({
        keyword,
        filters: {}
      }))
    });

    it("should get a value object", async () => {
      axios.get = jest.fn().mockResolvedValueOnce({
        status: 200,
        data: Array(3).fill(undefined).map(() => ({
          ...getPath(),
          distance: 3100
        }))
      });
      await expect(smartwalk.fetchSearchPlaces(getRequest())).resolves.toBeTruthy();
      expect(axios.get).toHaveBeenCalled();
    });

    it("should throw if an invalid query is provided", async () => {
      axios.get = jest.fn().mockResolvedValueOnce({
        status: 400
      });
      const request = {
        ...getRequest(),
        categories: undefined
      };
      await expect(smartwalk.fetchSearchPlaces(request as any)).rejects.toThrow();
      expect(axios.get).toHaveBeenCalled();
    });

    it("should throw upon server internal error", async () => {
      axios.get = jest.fn().mockResolvedValueOnce({
        status: 500
      });
      await expect(smartwalk.fetchSearchPlaces(getRequest())).rejects.toThrow();
      expect(axios.get).toHaveBeenCalled();
    });
  });

  describe("fetchSearchRoutes", () => {

    const getRequest = (): RoutesRequest => ({
      source: getPlace(),
      target: getPlace(),
      maxDistance: 3.1,
      categories: ["castle", "museum"].map((keyword) => ({
        keyword,
        filters: {}
      })),
      precedence: []
    });

    it("should get a value object", async () => {
      axios.get = jest.fn().mockResolvedValueOnce({
        status: 200,
        data: Array(3).fill(undefined).map(() => ({
          path: getPath(),
          places: ["A", "B", "C"].map((handle, i) => ({
            ...getPlace(),
            smartId: handle,
            name: `Place ${handle}`,
            keywords: [handle.toLocaleLowerCase()],
            categories: [i]
          })),
          waypoints: [
            { smartId: "A", category: 0 },
            { smartId: "B", category: 1 },
            { smartId: "C", category: 2 }
          ]
        }))
      });
      await expect(smartwalk.fetchSearchRoutes(getRequest())).resolves.toBeTruthy();
      expect(axios.get).toHaveBeenCalled();
    });

    it("should throw if source and target are too far from each other", async () => {
      axios.get = jest.fn();
      await expect(smartwalk.fetchSearchRoutes({
        ...getRequest(),
        source: { ...getRequest().source, location: { lon: 0, lat: 0 } },
        target: { ...getRequest().target, location: { lon: 1, lat: 1 } }
      })).rejects.toThrow();
      expect(axios.get).not.toHaveBeenCalled();
    });

    it("should throw if an invalid query is provided", async () => {
      axios.get = jest.fn().mockResolvedValueOnce({
        status: 400
      });
      const request = {
        ...getRequest(),
        categories: undefined
      };
      await expect(smartwalk.fetchSearchRoutes(request as any)).rejects.toThrow();
      expect(axios.get).toHaveBeenCalled();
    });

    it("should throw upon server internal error", async () => {
      axios.get = jest.fn().mockResolvedValueOnce({
        status: 500
      });
      await expect(smartwalk.fetchSearchRoutes(getRequest())).rejects.toThrow();
      expect(axios.get).toHaveBeenCalled();
    });
  });
});
