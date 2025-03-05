import { statusIcon, getCondition } from '../../utils/PreviousInspections';
import { render } from '@testing-library/react';

describe('Rendering correct status icon', () => {
    test('Renders COMPLETED icon', () => {
        const { container } = render(statusIcon('completed'));
        const svg = container.querySelector('svg');
        expect(svg).not.toBeNull();
        expect(svg.getAttribute('fill')).toBe("#1b5e20");
    });

    test('Renders ACTIVE icon', () => {
        const { container } = render(statusIcon('active'));
        const svg = container.querySelector('svg');
        expect(svg).not.toBeNull();
        expect(svg.getAttribute('fill')).toBe("#bb460d");
    });

    test('Renders CANCELLED icon', () => {
        const { container } = render(statusIcon('cancelled'));
        const svg = container.querySelector('svg');
        expect(svg).not.toBeNull();
        expect(svg.getAttribute('fill')).toBe("#891515");
    });

    test('Returns null for unknown status', () => {
        const result = statusIcon('UNKNOWN');
        expect(result).toBeUndefined();
    });
});

describe('Getting condition from value', () => {
    test('Returns "Not Present" if exists is false', () => {
        const result = getCondition('3', 'false');
        expect(result).toBe('Not Present');
    });

    test('Returns "Very Poor" for condition 1', () => {
        const result = getCondition('1', 'true');
        expect(result).toBe('Very Poor');
    });

    test('Returns "Poor" for condition 2', () => {
        const result = getCondition('2', 'true');
        expect(result).toBe('Poor');
    });

    test('Returns "Acceptable" for condition 3', () => {
        const result = getCondition('3', 'true');
        expect(result).toBe('Acceptable');
    });

    test('Returns "Good" for condition 4', () => {
        const result = getCondition('4', 'true');
        expect(result).toBe('Good');
    });

    test('Returns "Excellent" for condition 5', () => {
        const result = getCondition('5', 'true');
        expect(result).toBe('Excellent');
    });

    test('Returns "Unknown" for invalid condition', () => {
        const result = getCondition('6', 'true');
        expect(result).toBe('Unknown');
    });

    test('Returns "Unknown" for undefined condition', () => {
        const result = getCondition(undefined, 'true');
        expect(result).toBe('Unknown');
    });
});
