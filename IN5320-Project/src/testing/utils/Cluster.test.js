import { addChildrenCount, fetchSearches } from "../../utils/Clusters";
import db from "../../offline/Db";

jest.mock("../../offline/Db");

describe("Adding amount of schools to each cluster", () => {
    test("Adds childrenCount based on the length of children array", () => {
        const organisationUnits = [
            { id: 1, name: "Unit 1", children: [{ id: 2 }, { id: 3 }] },
            { id: 2, name: "Unit 2", children: [] },
            { id: 3, name: "Unit 3" }, // No children property
        ];

        const result = addChildrenCount(organisationUnits);

        expect(result).toEqual([
            { id: 1, name: "Unit 1", children: [{ id: 2 }, { id: 3 }], childrenCount: 2 },
            { id: 2, name: "Unit 2", children: [], childrenCount: 0 },
            { id: 3, name: "Unit 3", childrenCount: 0 }, // childrenCount defaults to 0
        ]);
    });

    test("Handles an empty array gracefully", () => {
        const organisationUnits = [];
        const result = addChildrenCount(organisationUnits);
        expect(result).toEqual([]);
    });
});

describe("Fetching searches for cluster", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Fetches top and recent searches from the database", async () => {
        const mockTopSearches = [
            { id: 1, name: "Search A", amount: 50 },
            { id: 2, name: "Search B", amount: 40 },
        ];
        const mockRecentSearches = [
            { id: 3, name: "Search C", timestamp: 1670000000000 },
            { id: 4, name: "Search D", timestamp: 1660000000000 },
        ];

        db.clusterSearches = {
            orderBy: jest.fn().mockImplementation((key) => ({
                reverse: jest.fn().mockImplementation(() => ({
                    limit: jest.fn().mockImplementation(() => ({
                        toArray: jest.fn(() =>
                            key === "amount"
                                ? Promise.resolve(mockTopSearches)
                                : Promise.resolve(mockRecentSearches)
                        ),
                    })),
                })),
            })),
        };

        const result = await fetchSearches();

        expect(result).toEqual({
            topSearches: mockTopSearches,
            recentSearches: mockRecentSearches,
        });

        expect(db.clusterSearches.orderBy).toHaveBeenCalledWith("amount");
        expect(db.clusterSearches.orderBy).toHaveBeenCalledWith("timestamp");
    });

    test("Returns empty arrays on error", async () => {
        db.clusterSearches = {
            orderBy: jest.fn().mockImplementation((key) => ({
                reverse: jest.fn().mockImplementation(() => ({
                    limit: jest.fn().mockImplementation(() => ({
                        toArray: jest.fn(() =>
                            key === "amount"
                                ? Promise.resolve(mockTopSearches)
                                : Promise.resolve(mockRecentSearches)
                        ),
                    })),
                })),
            })),
        };

        const result = await fetchSearches();

        expect(result).toEqual({
            topSearches: [],
            recentSearches: [],
        });
    });
});
