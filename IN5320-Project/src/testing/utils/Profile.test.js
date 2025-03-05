import { renderHook, act } from "@testing-library/react-hooks";
import { useProfileManagement, validateName } from "../../utils/Profile";
import { useImageManagement } from "../../data/ImageMutate";
import { useAlert } from "@dhis2/app-runtime";

jest.mock("../../data/ImageMutate");
jest.mock("@dhis2/app-runtime");

describe("Handles profile updates and validation correctly", () => {
    let mockUploadImage;
    let mockShow;
    let mockSetUser;
    let mockOnUpdateUser;

    beforeEach(() => {
        mockUploadImage = jest.fn();
        mockShow = jest.fn();
        mockSetUser = jest.fn();
        mockOnUpdateUser = jest.fn();

        useImageManagement.mockReturnValue({
            uploadImage: mockUploadImage,
            loading: false,
            error: null,
        });

        useAlert.mockReturnValue({
            show: mockShow,
        });
    });

    test("Validates name correctly", () => {

        expect(validateName("")).toBe("Name is required!");
        expect(validateName("A")).toBe("Name must be at least 2 characters long!");
        expect(validateName("A very long name exceeding twenty characters")).toBe(
            "Name must not exceed 20 characters!"
        );
        expect(validateName("Valid Name")).toBeNull();
    });

    test("Updates profile successfully with valid data", async () => {
        const { result } = renderHook(() => useProfileManagement());
        mockUploadImage.mockResolvedValue("mockImageId");

        const mockProfilePicture = "profilePic.jpg";
        const mockUser = { firstName: "John", surname: "Doe", avatar: { id: "oldAvatarId" } };

        mockSetUser.mockImplementation((callback) => {
            const updatedUser = callback(mockUser);
            expect(updatedUser.avatar.id).toBe("mockImageId");
        });

        await act(async () => {
            await result.current.updateProfile(mockProfilePicture, mockSetUser, mockOnUpdateUser);
        });

        expect(mockUploadImage).toHaveBeenCalledWith(mockProfilePicture);
        expect(mockSetUser).toHaveBeenCalled();
        expect(mockShow).toHaveBeenCalledWith({
            message: "Profile updated",
            type: "success",
            duration: 1500,
        });
        expect(mockOnUpdateUser).toHaveBeenCalledWith({
            ...mockUser,
            avatar: { id: "mockImageId" },
        });
    });


    test("Handles error during image upload", async () => {
        const { result } = renderHook(() => useProfileManagement());
        mockUploadImage.mockRejectedValue(new Error("Upload error"));

        const mockProfilePicture = "profilePic.jpg";

        await act(async () => {
            result.current.updateProfile(mockProfilePicture, mockSetUser, mockOnUpdateUser);
        });

        expect(mockUploadImage).toHaveBeenCalledWith(mockProfilePicture);
        expect(mockShow).toHaveBeenCalledWith({
            message: "Error uploading profile picture",
            type: "critical",
            duration: 1500,
        });
        expect(mockSetUser).not.toHaveBeenCalled();
    });

    test("Handles validation errors during profile update", async () => {
        const { result } = renderHook(() => useProfileManagement());

        const invalidUser = { firstName: "A", surname: "" };

        mockSetUser.mockImplementation((callback) => {
            callback(invalidUser);
        });

        await act(async () => {
            result.current.updateProfile(null, mockSetUser, mockOnUpdateUser);
        });

        expect(mockShow).toHaveBeenCalledWith({
            message: "Error: Name must be at least 2 characters long!Name is required!",
            type: "critical",
            duration: 1500,
        });
        expect(mockOnUpdateUser).not.toHaveBeenCalled();
    });

    test("Handles errors during profile update operation", async () => {
        const { result } = renderHook(() => useProfileManagement());

        const mockProfilePicture = null;
        const mockUser = { firstName: "John", surname: "Doe", avatar: { id: "oldAvatarId" } };

        mockSetUser.mockImplementation((callback) => {
            callback(mockUser);
        });

        mockOnUpdateUser.mockImplementation(() => {
            throw new Error("Update error");
        });

        await act(async () => {
            result.current.updateProfile(mockProfilePicture, mockSetUser, mockOnUpdateUser);
        });

        expect(mockShow).toHaveBeenCalledWith({
            message: "Error updating profile",
            type: "critical",
            duration: 1500,
        });
        expect(mockOnUpdateUser).toHaveBeenCalled();
    });
});