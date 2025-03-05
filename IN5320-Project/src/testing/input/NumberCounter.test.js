import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { NumberCounter } from '../../components/input/NumberCounter';

describe('NumberCounter Component', () => {
    let setSelectedMock;

    beforeEach(() => {
        setSelectedMock = jest.fn();
    });

    test('Renders with the correct initial value', () => {
        render(
            <NumberCounter
                selected={5}
                range={[1, 10]}
                setSelected={setSelectedMock}
                label="Counter"
                id="test-counter"
            />
        );

        const inputElement = document.querySelector('input');
        expect(inputElement).not.toBeNull();
        expect(inputElement.value).toBe('5');
    });

    test('Increases the value when the increase button is clicked', () => {
        render(
            <NumberCounter
                selected={5}
                range={[1, 10]}
                setSelected={setSelectedMock}
                label="Counter"
                id="test-counter"
            />
        );

        const increaseButton = screen.getByLabelText('Increase Counter');
        fireEvent.click(increaseButton);

        expect(setSelectedMock).toHaveBeenCalledWith(6);
    });

    test('Decreases the value when the decrease button is clicked', () => {
        render(
            <NumberCounter
                selected={5}
                range={[1, 10]}
                setSelected={setSelectedMock}
                label="Counter"
                id="test-counter"
            />
        );

        const decreaseButton = screen.getByLabelText('Decrease Counter');
        fireEvent.click(decreaseButton);

        expect(setSelectedMock).toHaveBeenCalledWith(4);
    });

    test('Does not increase beyond the maximum range', () => {
        render(
            <NumberCounter
                selected={10}
                range={[1, 10]}
                setSelected={setSelectedMock}
                label="Counter"
                id="test-counter"
            />
        );

        const increaseButton = screen.getByLabelText('Increase Counter');
        fireEvent.click(increaseButton);

        expect(setSelectedMock).not.toHaveBeenCalled();
    });

    test('Does not decrease below the minimum range', () => {
        render(
            <NumberCounter
                selected={1}
                range={[1, 10]}
                setSelected={setSelectedMock}
                label="Counter"
                id="test-counter"
            />
        );

        const decreaseButton = screen.getByLabelText('Decrease Counter');
        fireEvent.click(decreaseButton);

        expect(setSelectedMock).not.toHaveBeenCalled();
    });

    test('Sets the value through input within the range', () => {
        render(
            <NumberCounter
                selected={5}
                range={[1, 10]}
                setSelected={setSelectedMock}
                label="Counter"
                id="test-counter"
            />
        );

        const inputElement = document.querySelector('input');
        fireEvent.change(inputElement, { target: { value: '7' } });

        expect(setSelectedMock).toHaveBeenCalledWith(7);
    });

    test('Does not set the value below the minimum range through input', () => {
        render(
            <NumberCounter
                selected={5}
                range={[1, 10]}
                setSelected={setSelectedMock}
                label="Counter"
                id="test-counter"
            />
        );

        const inputElement = document.querySelector('input');
        fireEvent.change(inputElement, { target: { value: '0' } });

        expect(setSelectedMock).toHaveBeenCalledWith(1);
    });

    test('Does not set the value above the maximum range through input', () => {
        render(
            <NumberCounter
                selected={5}
                range={[1, 10]}
                setSelected={setSelectedMock}
                label="Counter"
                id="test-counter"
            />
        );

        const inputElement = document.querySelector('input');
        fireEvent.change(inputElement, { target: { value: '15' } });

        expect(setSelectedMock).toHaveBeenCalledWith(10);
    });
});
