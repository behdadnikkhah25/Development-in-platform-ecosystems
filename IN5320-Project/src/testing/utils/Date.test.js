import { getDate } from "../../utils/Date";

describe("getDate", () => {
    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2023-11-01T00:00:00Z")); // Mock current date
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    test("Returns 'Today' for the current date", () => {
        const result = getDate("2023-11-01");
        expect(result).toBe("Today");
    });

    test("Returns '1 day ago' for one day in the past", () => {
        const result = getDate("2023-10-31");
        expect(result).toBe("1 day ago");
    });

    test("Returns '2 days ago' for two days in the past", () => {
        const result = getDate("2023-10-30");
        expect(result).toBe("2 days ago");
    });

    test("Returns formatted date for more than 7 days in the past", () => {
        const result = getDate("2023-10-20");
        expect(result).toBe("20. Oct. 2023");
    });

    test("Returns 'In 1 day' for one day in the future", () => {
        const result = getDate("2023-11-02");
        expect(result).toBe("In 1 day");
    });

    test("Returns 'In 2 days' for two days in the future", () => {
        const result = getDate("2023-11-03");
        expect(result).toBe("In 2 days");
    });

    test("Returns formatted date for more than 7 days in the future", () => {
        const result = getDate("2023-11-10");
        expect(result).toBe("10. Nov. 2023");
    });

    test("Handles invalid date inputs gracefully", () => {
        const result = getDate("Invalid Date");
        expect(result).toBe("Invalid date");
    });
});
