import { handleUploadImage } from '../../utils/Image';

describe('Image Utility Test', () => {
    let setImageMock;

    beforeEach(() => {
        setImageMock = jest.fn();
    });

    test('Should set image to null if no file is selected', () => {
        const mockEvent = { target: { files: [] } };

        handleUploadImage(mockEvent, setImageMock);

        expect(setImageMock).toHaveBeenCalledWith(null);
    });

    test('Should alert and not set image if file type is invalid', () => {
        const mockEvent = {
            target: {
                files: [
                    {
                        type: 'application/pdf',
                    },
                ],
            },
        };

        global.alert = jest.fn(); // Mock global alert

        handleUploadImage(mockEvent, setImageMock);

        expect(alert).toHaveBeenCalledWith('Invalid file type. Only JPEG, PNG, and WEBP are allowed.');
        expect(setImageMock).not.toHaveBeenCalled();

        global.alert.mockRestore(); // Restore the original alert function
    });

    test('Should set image if file type is valid', () => {
        const mockImage = { type: 'image/png' };
        const mockEvent = { target: { files: [mockImage] } };

        handleUploadImage(mockEvent, setImageMock);

        expect(setImageMock).toHaveBeenCalledWith(mockImage);
    });
});
