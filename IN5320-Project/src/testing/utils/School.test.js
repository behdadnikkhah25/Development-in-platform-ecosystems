import db from "../../offline/Db";
import {
    handleSchoolSubmission,
    handleCoordinateChange,
    fetchSchoolSearches,
} from "../../utils/School";

jest.mock("../../offline/Db");

describe("School management features handle submissions, coordinate changes, and search history retrieval", () => {
    describe("Submitting a school with optional image upload and program association", () => {
        let mockCreateSchool;
        let mockUploadImage;
        let mockUpdateSchoolImage;
        let mockAssociateSchoolToProgram;

        beforeEach(() => {
            mockCreateSchool = jest.fn();
            mockUploadImage = jest.fn();
            mockUpdateSchoolImage = jest.fn();
            mockAssociateSchoolToProgram = jest.fn();
        });

        test("Submits school with all required data and image", async () => {
            mockCreateSchool.mockResolvedValue("mockSchoolId");
            mockUploadImage.mockResolvedValue("mockImageId");

            await handleSchoolSubmission({
                schoolName: "Test School",
                coordinates: [10.123456, 20.654321],
                cluster: "Cluster A",
                image: "imageData",
                createSchool: mockCreateSchool,
                uploadImage: mockUploadImage,
                updateSchoolImage: mockUpdateSchoolImage,
                associateSchoolToProgram: mockAssociateSchoolToProgram,
            });

            expect(mockCreateSchool).toHaveBeenCalledWith({
                name: "Test School",
                cluster: "Cluster A",
                coordinates: "10.123456 20.654321",
            });
            expect(mockUploadImage).toHaveBeenCalledWith("imageData");
            expect(mockUpdateSchoolImage).toHaveBeenCalledWith("mockSchoolId", "mockImageId");
            expect(mockAssociateSchoolToProgram).toHaveBeenCalledWith("mockSchoolId");
        });

        test("Submits school without an image", async () => {
            mockCreateSchool.mockResolvedValue("mockSchoolId");

            await handleSchoolSubmission({
                schoolName: "Test School",
                coordinates: [10.123456, 20.654321],
                cluster: "Cluster B",
                image: null,
                createSchool: mockCreateSchool,
                uploadImage: mockUploadImage,
                updateSchoolImage: mockUpdateSchoolImage,
                associateSchoolToProgram: mockAssociateSchoolToProgram,
            });

            expect(mockCreateSchool).toHaveBeenCalledWith({
                name: "Test School",
                cluster: "Cluster B",
                coordinates: "10.123456 20.654321",
            });
            expect(mockUploadImage).not.toHaveBeenCalled();
            expect(mockUpdateSchoolImage).not.toHaveBeenCalled();
            expect(mockAssociateSchoolToProgram).toHaveBeenCalledWith("mockSchoolId");
        });

        test("Handles errors during school submission", async () => {
            mockCreateSchool.mockRejectedValue(new Error("Create school error"));

            await expect(
                handleSchoolSubmission({
                    schoolName: "Test School",
                    coordinates: [10.123456, 20.654321],
                    cluster: "Cluster A",
                    image: null,
                    createSchool: mockCreateSchool,
                    uploadImage: mockUploadImage,
                    updateSchoolImage: mockUpdateSchoolImage,
                    associateSchoolToProgram: mockAssociateSchoolToProgram,
                })
            ).rejects.toThrow("Create school error");

            expect(mockCreateSchool).toHaveBeenCalledWith({
                name: "Test School",
                cluster: "Cluster A",
                coordinates: "10.123456 20.654321",
            });
            expect(mockUploadImage).not.toHaveBeenCalled();
            expect(mockUpdateSchoolImage).not.toHaveBeenCalled();
            expect(mockAssociateSchoolToProgram).not.toHaveBeenCalled();
        });
    });

    describe("Updating latitude and longitude coordinates based on user input", () => {
        let mockSetCoordinates;

        beforeEach(() => {
            mockSetCoordinates = jest.fn();
        });

        test("Updates latitude correctly", () => {
            const event = { value: "15.987654" };

            handleCoordinateChange(event, "lat", mockSetCoordinates);

            expect(mockSetCoordinates).toHaveBeenCalledWith(expect.any(Function));
            const updateFn = mockSetCoordinates.mock.calls[0][0];
            expect(updateFn([0, 0])).toEqual(['15.987654', 0]);
        });

        test("Updates longitude correctly", () => {
            const event = { value: "-75.123456" };

            handleCoordinateChange(event, "lng", mockSetCoordinates);

            expect(mockSetCoordinates).toHaveBeenCalledWith(expect.any(Function));
            const updateFn = mockSetCoordinates.mock.calls[0][0];
            expect(updateFn([0, 0])).toEqual([0, '-75.123456']);
        });
    });

    describe("Retrieving top and recent school searches from the database", () => {
        test("Fetches top and recent school searches", async () => {
            const mockTopSearches = [
                { id: 1, name: "Search A", amount: 50 },
                { id: 2, name: "Search B", amount: 40 },
            ];
            const mockRecentSearches = [
                { id: 3, name: "Search C", timestamp: 1670000000000 },
                { id: 4, name: "Search D", timestamp: 1660000000000 },
            ];

            db.schoolSearches = {
                orderBy: jest.fn().mockImplementation((key) => ({
                    reverse: jest.fn().mockImplementation(() => ({
                        limit: jest.fn().mockImplementation(() => ({
                            toArray: jest.fn(() =>
                                key === "amount" ? Promise.resolve(mockTopSearches) : Promise.resolve(mockRecentSearches)
                            ),
                        })),
                    })),
                })),
            };

            const result = await fetchSchoolSearches();

            expect(result).toEqual({
                topSearches: mockTopSearches,
                recentSearches: mockRecentSearches,
            });

            expect(db.schoolSearches.orderBy).toHaveBeenCalledWith("amount");
            expect(db.schoolSearches.orderBy).toHaveBeenCalledWith("timestamp");
        });

        test("Returns empty arrays on error", async () => {
            db.schoolSearches = {
                orderBy: jest.fn().mockImplementation(() => ({
                    reverse: jest.fn().mockImplementation(() => ({
                        limit: jest.fn().mockImplementation(() => ({
                            toArray: jest.fn().mockRejectedValue(new Error("DB Error")),
                        })),
                    })),
                })),
            };

            const result = await fetchSchoolSearches();

            expect(result).toEqual({
                topSearches: [],
                recentSearches: [],
            });
        });
    });
});
