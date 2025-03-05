import { areUserDataEqual, resetUserState } from '../../utils/User';

describe('User Compare Test', () => {
    test('Returns true for identical user objects', () => {
        const user1 = {
            username: 'user123',
            firstName: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            avatar: { id: 'avatar1' },
        };

        const user2 = {
            username: 'user123',
            firstName: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            avatar: { id: 'avatar1' },
        };

        expect(areUserDataEqual(user1, user2)).toBe(true);
    });

    test('Returns false for different user objects', () => {
        const user1 = {
            username: 'user123',
            firstName: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            avatar: { id: 'avatar1' },
        };

        const user2 = {
            username: 'user456',
            firstName: 'Jane',
            surname: 'Smith',
            email: 'jane.smith@example.com',
            avatar: { id: 'avatar2' },
        };

        expect(areUserDataEqual(user1, user2)).toBe(false);
    });

    test('Handles missing avatar objects correctly', () => {
        const user1 = {
            username: 'user123',
            firstName: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            avatar: null,
        };

        const user2 = {
            username: 'user123',
            firstName: 'John',
            surname: 'Doe',
            email: 'john.doe@example.com',
            avatar: null,
        };

        expect(areUserDataEqual(user1, user2)).toBe(true);
    });
});

describe('Reset User State', () => {
    test('Resets user state with complete data', () => {
        const data = {
            username: 'user123',
            firstName: 'John',
            surname: 'Doe',
            avatar: { id: 'avatar1' },
            email: 'john.doe@example.com',
        };

        const expectedState = {
            username: 'user123',
            firstName: 'John',
            surname: 'Doe',
            avatar: { id: 'avatar1' },
            email: 'john.doe@example.com',
        };

        expect(resetUserState(data)).toEqual(expectedState);
    });

    test('Resets user state with partial data', () => {
        const data = {
            username: 'user123',
            email: 'john.doe@example.com',
        };

        const expectedState = {
            username: 'user123',
            firstName: '',
            surname: '',
            avatar: { id: '' },
            email: 'john.doe@example.com',
        };

        expect(resetUserState(data)).toEqual(expectedState);
    });

    test('Resets user state with undefined data', () => {
        const data = undefined;

        const expectedState = {
            username: '',
            firstName: '',
            surname: '',
            avatar: { id: '' },
            email: '',
        };

        expect(resetUserState(data)).toEqual(expectedState);
    });
});
