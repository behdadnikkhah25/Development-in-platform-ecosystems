import { DATA_ELEMENT_MAP, processedInspections, getRatio } from "../../utils/DataElements";

describe("Process inspections and map data values", () => {
    test("Processes inspections and maps dataValues correctly", () => {
        const inspections = [
            {
                id: "inspection1",
                dataValues: [
                    { dataElement: "Nvp4hIbXrzF", value: "Good" },
                    { dataElement: "IKiSAA19Xvl", value: "Yes" },
                ],
            },
            {
                id: "inspection2",
                dataValues: [
                    { dataElement: "Y6DQqwTdhiZ", value: "Present" },
                    { dataElement: "MH2eDd7qWxR", value: "Bad" },
                ],
            },
        ];

        const result = processedInspections(inspections);

        expect(result).toEqual([
            {
                id: "inspection1",
                dataValues: [
                    { dataElement: "Nvp4hIbXrzF", value: "Good" },
                    { dataElement: "IKiSAA19Xvl", value: "Yes" },
                ],
                dataValueMap: {
                    computerLab: "Good",
                    electricSupply: "Yes",
                },
            },
            {
                id: "inspection2",
                dataValues: [
                    { dataElement: "Y6DQqwTdhiZ", value: "Present" },
                    { dataElement: "MH2eDd7qWxR", value: "Bad" },
                ],
                dataValueMap: {
                    library: "Present",
                    electricSupplyCondition: "Bad",
                },
            },
        ]);
    });

    test("Handles empty inspections array", () => {
        const inspections = [];
        const result = processedInspections(inspections);
        expect(result).toEqual([]);
    });

    test("Handles dataValues with no matching dataElement", () => {
        const inspections = [
            {
                id: "inspection1",
                dataValues: [
                    { dataElement: "UnknownElement", value: "Unknown" }, // No match
                ],
            },
        ];

        const result = processedInspections(inspections);

        expect(result).toEqual([
            {
                id: "inspection1",
                dataValues: [
                    { dataElement: "UnknownElement", value: "Unknown" },
                ],
                dataValueMap: {}, // No matches
            },
        ]);
    });
    test("DATA_ELEMENT_MAP values are unique", () => {
        const values = Object.values(DATA_ELEMENT_MAP);
        const uniqueValues = new Set(values);
        expect(uniqueValues.size).toBe(values.length);
    });
});

describe("Getting ratio", () => {
    test("Returns the ratio of numerator to denominator rounded to 0 decimal places", () => {
        const result = getRatio(3, 4);
        expect(result).toBe("1"); // 3 / 4 = 0.75, rounded to 1
    });

    test("Returns null if denominator is 0 or falsy", () => {
        const result = getRatio(5, 0);
        expect(result).toBe(null);

        const resultFalsy = getRatio(5, null);
        expect(resultFalsy).toBe(null);
    });

    test("Returns the denominator if numerator is 0", () => {
        const result = getRatio(0, 10);
        expect(result).toBe(10);
    });

    test("Handles edge cases with negative numbers", () => {
        const result = getRatio(-3, 6);
        expect(result).toBe("-1"); // -3 / 6 = -0.5, rounded to -1
    });

    test("Handles very large numbers", () => {
        const result = getRatio(1000000, 3);
        expect(result).toBe("333333");
    });
});
