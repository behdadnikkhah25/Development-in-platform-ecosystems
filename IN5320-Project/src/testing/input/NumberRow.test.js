import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { NumberRow } from "../../components/input/NumberRow";

describe("NumberRow Component", () => {
    const setSelectedMock = jest.fn();

    beforeEach(() => {
        setSelectedMock.mockClear();
    });

    test("Renders the correct number of boxes based on range", () => {
        render(
            <NumberRow
                range={5}
                selected={0}
                setSelected={setSelectedMock}
                disabled={false}
                error={false}
            />
        );

        const boxes = screen.getAllByTestId("number-box");
        expect(boxes.length).toBe(5);
        boxes.forEach((box, index) => {
            expect(box.textContent).toBe(String(index + 1));
        });
    });

    test("Highlights the selected number", () => {
        render(
            <NumberRow
                range={5}
                selected={3}
                setSelected={setSelectedMock}
                disabled={false}
                error={false}
            />
        );

        const selectedBox = screen.getAllByTestId("number-box")[2]; // Index 2 corresponds to "3"
        expect(window.getComputedStyle(selectedBox).color).toBe("rgb(255, 255, 255)");
    });

    test("Does not highlight any number if none is selected", () => {
        render(
            <NumberRow
                range={5}
                selected={0}
                setSelected={setSelectedMock}
                disabled={false}
                error={false}
            />
        );

        const boxes = screen.getAllByTestId("number-box");
        boxes.forEach((box) => {
            expect(window.getComputedStyle(box).color).not.toBe("rgb(255, 255, 255)");
        });
    });

    test("Calls setSelected when a number is clicked", () => {
        render(
            <NumberRow
                range={5}
                selected={0}
                setSelected={setSelectedMock}
                disabled={false}
                error={false}
            />
        );

        const box = screen.getAllByTestId("number-box")[1]; // Index 1 corresponds to "2"
        fireEvent.click(box);

        expect(setSelectedMock).toHaveBeenCalledWith(2);
    });

    test("Does not call setSelected if disabled", () => {
        render(
            <NumberRow
                range={5}
                selected={0}
                setSelected={setSelectedMock}
                disabled={true}
                error={false}
            />
        );

        const box = screen.getAllByTestId("number-box")[1]; // Index 1 corresponds to "2"
        fireEvent.click(box);

        expect(setSelectedMock).not.toHaveBeenCalled();
    });

    test("Applies correct styles when disabled", () => {
        render(
            <NumberRow
                range={5}
                selected={0}
                setSelected={setSelectedMock}
                disabled={true}
                error={false}
            />
        );

        const container = screen.getByTestId("number-row");
        const styles = window.getComputedStyle(container);

        expect(styles.cursor).toBe("auto");
        expect(styles.opacity).toBe("0.6");
    });

    test("Applies correct styles when error is true", () => {
        render(
            <NumberRow
                range={5}
                selected={0}
                setSelected={setSelectedMock}
                disabled={false}
                error={true}
            />
        );

        const container = screen.getByTestId("number-row");
        const styles = window.getComputedStyle(container);

        expect(styles.backgroundColor).toBe("rgb(183, 28, 28)");
        expect(styles.border).toBe("1px solid #891515");
    });
});
