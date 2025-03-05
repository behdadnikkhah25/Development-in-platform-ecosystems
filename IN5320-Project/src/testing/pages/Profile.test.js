import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Profile } from '../../pages/Profile';
import { useProfileManagement } from '../../utils/Profile';
import { handleUploadImage } from '../../utils/Image';

jest.mock('../../utils/Profile');
jest.mock('../../utils/Image');

describe('Profile page testing', () => {
    let mockSetUser, mockOnUpdateUser, mockRemoveChanges, mockUpdateProfile;

    beforeEach(() => {
        mockSetUser = jest.fn();
        mockOnUpdateUser = jest.fn();
        mockRemoveChanges = jest.fn();
        mockUpdateProfile = jest.fn();

        useProfileManagement.mockReturnValue({
            updateProfile: mockUpdateProfile,
        });

        handleUploadImage.mockImplementation((e, setProfilePicture) => {
            const file = e.target.files[0];
            setProfilePicture(file);
        });
    });

    const renderComponent = (props = {}) => {
        const defaultProps = {
            user: {
                firstName: 'John',
                surname: 'Doe',
                username: 'johndoe',
                avatar: { id: 'avatar123' },
            },
            setUser: mockSetUser,
            onUpdateUser: mockOnUpdateUser,
            removeChanges: mockRemoveChanges,
        };

        return render(<Profile {...defaultProps} {...props} />);
    };

    test('Renders profile component with initial user data', () => {
        renderComponent();

        expect(screen.getByLabelText(/First name*/i).value).toBe('John');
        expect(screen.getByLabelText(/Last name*/i).value).toBe('Doe');
        expect(screen.getByText('johndoe')).not.toBe(null);
        expect(screen.getByRole('img', { name: /user avatar/i })).not.toBe(null);
    });

    test('Calls updateProfile on Save Changes button click', async () => {
        renderComponent();

        const saveButton = screen.getByRole('button', { name: /save changes/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockUpdateProfile).toHaveBeenCalledWith(
                null, // No profile picture uploaded
                mockSetUser,
                mockOnUpdateUser
            );
        });
    });

    test('Resets changes on Undo Changes button click', () => {
        renderComponent();

        const undoButton = screen.getByRole('button', { name: /undo changes/i });
        fireEvent.click(undoButton);

        expect(mockRemoveChanges).toHaveBeenCalled();
        expect(mockSetUser).not.toHaveBeenCalled();
    });
});
