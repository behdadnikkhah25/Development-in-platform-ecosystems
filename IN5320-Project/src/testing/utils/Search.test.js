import { saveClusterSearch, saveSchoolSearch, useDebouncedValue } from "../../utils/Search";
import db from "../../offline/Db";
import { renderHook, act } from "@testing-library/react-hooks";

jest.mock("../../offline/Db");

describe("Search management and debounced value utility", () => {
    describe("Saving searches to Dexie database", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("Saves or updates a cluster search", async () => {
            db.clusterSearches = {
                get: jest.fn().mockResolvedValue(null), // Simulate no existing search
                add: jest.fn().mockResolvedValue(),
                update: jest.fn().mockResolvedValue(),
                count: jest.fn().mockResolvedValue(40),
                orderBy: jest.fn(),
                bulkDelete: jest.fn(),
            };

            await saveClusterSearch("Test Cluster Search");

            expect(db.clusterSearches.get).toHaveBeenCalledWith({ name: "Test Cluster Search" });
            expect(db.clusterSearches.add).toHaveBeenCalledWith({
                name: "Test Cluster Search",
                amount: 1,
                timestamp: expect.any(String),
            });
            expect(db.clusterSearches.count).toHaveBeenCalled();
            expect(db.clusterSearches.bulkDelete).not.toHaveBeenCalled(); // No deletion since total count <= 50
        });

        test("Updates an existing cluster search", async () => {
            db.clusterSearches = {
                get: jest.fn().mockResolvedValue({ id: 1, amount: 5 }),
                update: jest.fn().mockResolvedValue(),
                count: jest.fn().mockResolvedValue(40),
                orderBy: jest.fn(),
                bulkDelete: jest.fn(),
            };

            await saveClusterSearch("Existing Cluster Search");

            expect(db.clusterSearches.get).toHaveBeenCalledWith({ name: "Existing Cluster Search" });
            expect(db.clusterSearches.update).toHaveBeenCalledWith(1, {
                amount: 6,
                timestamp: expect.any(String),
            });
        });

        test("Handles excessive cluster searches and deletes old entries", async () => {
            db.clusterSearches = {
                get: jest.fn().mockResolvedValue(null),
                add: jest.fn().mockResolvedValue(),
                count: jest.fn().mockResolvedValue(60),
                orderBy: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                        toArray: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
                    }),
                }),
                bulkDelete: jest.fn().mockResolvedValue(),
            };

            await saveClusterSearch("Overflow Cluster Search");

            expect(db.clusterSearches.count).toHaveBeenCalled();
            expect(db.clusterSearches.orderBy).toHaveBeenCalledWith("timestamp");
            expect(db.clusterSearches.bulkDelete).toHaveBeenCalledWith([1, 2]);
        });

        test("Saves or updates a school search", async () => {
            db.schoolSearches = {
                get: jest.fn().mockResolvedValue(null),
                add: jest.fn().mockResolvedValue(),
                update: jest.fn().mockResolvedValue(),
                count: jest.fn().mockResolvedValue(40),
                orderBy: jest.fn(),
                bulkDelete: jest.fn(),
            };

            await saveSchoolSearch("Test School Search");

            expect(db.schoolSearches.get).toHaveBeenCalledWith({ name: "Test School Search" });
            expect(db.schoolSearches.add).toHaveBeenCalledWith({
                name: "Test School Search",
                amount: 1,
                timestamp: expect.any(String),
            });
            expect(db.schoolSearches.count).toHaveBeenCalled();
            expect(db.schoolSearches.bulkDelete).not.toHaveBeenCalled(); // No deletion since total count <= 50
        });

        test("Handles errors during saving a school search", async () => {
            const error = new Error("Database error");
            db.schoolSearches = {
                get: jest.fn().mockRejectedValue(error),
            };

            console.error = jest.fn();

            await saveSchoolSearch("Error School Search");

            expect(console.error).toHaveBeenCalledWith(
                "Error saving search to schoolSearches in Dexie:",
                error
            );
        });
    });

    describe("Debouncing values with useDebouncedValue hook", () => {
        test("Returns the initial value immediately", () => {
            const { result } = renderHook(() => useDebouncedValue("initial", 500));
            expect(result.current).toBe("initial");
        });

        test("Updates the value after the specified delay", async () => {
            jest.useFakeTimers();
            const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 500), {
                initialProps: { value: "initial" },
            });

            rerender({ value: "updated" });
            expect(result.current).toBe("initial");

            act(() => {
                jest.advanceTimersByTime(500);
            });

            expect(result.current).toBe("updated");
            jest.useRealTimers();
        });

        test("Cancels the timeout if the value changes before the delay", () => {
            jest.useFakeTimers();
            const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 500), {
                initialProps: { value: "initial" },
            });

            rerender({ value: "updated once" });
            act(() => {
                jest.advanceTimersByTime(250);
            });

            rerender({ value: "updated twice" });
            act(() => {
                jest.advanceTimersByTime(250);
            });

            expect(result.current).toBe("initial");

            act(() => {
                jest.advanceTimersByTime(250);
            });

            expect(result.current).toBe("updated twice");
            jest.useRealTimers();
        });
    });
});
