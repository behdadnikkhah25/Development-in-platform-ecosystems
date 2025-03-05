import {
    required,
    validateDate,
    fieldToLabel,
    validateConditions,
    resetConditionState
} from '../../utils/NewInspection';

describe('Required', () => {
    test('Returns undefined for non-empty values', () => {
        expect(required('test')).toBeUndefined();
        expect(required(1)).toBeUndefined();
    });

    test('Returns "Required" for empty or undefined values', () => {
        expect(required('')).toBe('Required');
        expect(required(undefined)).toBe('Required');
        expect(required(null)).toBe('Required');
    });
});

describe('ValidateDate', () => {
    const today = '2024-11-19';

    test('Returns undefined for valid dates', () => {
        expect(validateDate('2024-11-18', today)).toBeUndefined();
        expect(validateDate('2024-11-19', today)).toBeUndefined();
    });

    test('Returns an error message for future dates', () => {
        expect(validateDate('2024-11-20', today)).toBe('Date cannot be in the future');
    });
});

describe('Field to label', () => {
    test('Maps field keys to correct labels', () => {
        expect(fieldToLabel.computerLab).toBe('Computer lab');
        expect(fieldToLabel.electricSupply).toBe('Electricity supply');
        expect(fieldToLabel.handwashing).toBe('Handwashing');
        expect(fieldToLabel.library).toBe('Library');
        expect(fieldToLabel.playground).toBe('Playground');
    });

    test('Returns undefined for unknown keys', () => {
        expect(fieldToLabel.unknownField).toBeUndefined();
    });
});

describe('Validate Conditions', () => {
    test('Returns no errors for valid conditions', () => {
        const conditions = [
            { key: 'computerLab', required: true, condition: 1 },
            { key: 'electricSupply', required: false, condition: null }
        ];
        const result = validateConditions(conditions);

        expect(result.errors).toEqual({ computerLab: false, electricSupply: false });
        expect(result.hasErrors).toBe(false);
        expect(result.errorFields).toEqual([]);
    });

    test('returns errors for missing required conditions', () => {
        const conditions = [
            { key: 'computerLab', required: true, condition: null },
            { key: 'electricSupply', required: false, condition: null }
        ];
        const result = validateConditions(conditions);

        expect(result.errors).toEqual({ computerLab: true, electricSupply: false });
        expect(result.hasErrors).toBe(true);
        expect(result.errorFields).toEqual(['computerLab']);
    });
});

describe('Reset Condition State', () => {
    test('Resets state correctly for a specific key', () => {
        const setStateFunctions = {
            setHasComputerLab: jest.fn(),
            setHasElectricSupply: jest.fn(),
            setHasHandwashing: jest.fn(),
            setHasLibrary: jest.fn(),
            setHasPlayground: jest.fn(),
            setComputerLabCondition: jest.fn(),
            setElectricSupplyCondition: jest.fn(),
            setHandwashingCondition: jest.fn(),
            setLibraryCondition: jest.fn(),
            setPlaygroundCondition: jest.fn(),
        };

        resetConditionState('computerLab', true, setStateFunctions);
        expect(setStateFunctions.setHasComputerLab).toHaveBeenCalledWith(true);
        expect(setStateFunctions.setComputerLabCondition).toHaveBeenCalledWith(null);

        resetConditionState('electricSupply', false, setStateFunctions);
        expect(setStateFunctions.setHasElectricSupply).toHaveBeenCalledWith(false);
        expect(setStateFunctions.setElectricSupplyCondition).toHaveBeenCalledWith(null);
    });

    test('Does not call any functions for an unknown key', () => {
        const setStateFunctions = {
            setHasComputerLab: jest.fn(),
            setHasElectricSupply: jest.fn(),
            setHasHandwashing: jest.fn(),
            setHasLibrary: jest.fn(),
            setHasPlayground: jest.fn(),
            setComputerLabCondition: jest.fn(),
            setElectricSupplyCondition: jest.fn(),
            setHandwashingCondition: jest.fn(),
            setLibraryCondition: jest.fn(),
            setPlaygroundCondition: jest.fn(),
        };

        resetConditionState('unknownKey', true, setStateFunctions);
        Object.values(setStateFunctions).forEach((fn) => {
            expect(fn).not.toHaveBeenCalled();
        });
    });
});
