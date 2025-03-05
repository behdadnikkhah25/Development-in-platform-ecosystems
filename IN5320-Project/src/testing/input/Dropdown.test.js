import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Dropdown } from "../../components/input/Dropdown";

describe("Dropdown Component", () => {
    const options = [
        "Option 1",
        "Option 2",
        "Option 3",
    ];
    const setValueMock = jest.fn();

    beforeEach(() => {
        setValueMock.mockClear();
    });

    test("Renders correctly with initial value", () => {
        render(
            <Dropdown
                value={options[0]}
                options={options}
                setValue={setValueMock}
                width="200px"
                filterBy="name"
            />
        );

        const button = screen.getByTestId("dropdown-button");
        expect(button).not.toBeNull();
        expect(button.textContent).toBe("Option 1");
    });

    test("Opens the dropdown when clicked", () => {
        render(
            <Dropdown
                label="Test Label"
                value="Select an option"
                options={options}
                setValue={setValueMock}
                width="200px"
                filterBy="name"
            />
        );

        const button = screen.getByTestId("dropdown-button");
        fireEvent.click(button);

        options.forEach(option => {
            const optionElement = screen.getByText(option);
            expect(optionElement).toBeTruthy();
        });
    });

    test("Closes the dropdown when an option is selected", async () => {
        render(
            <Dropdown
                label="Test Label"
                value=""
                options={options}
                setValue={setValueMock}
                width="200px"
                filterBy="name"
            />
        );

        const button = screen.getByTestId("dropdown-button");
        fireEvent.click(button);

        const option = screen.getByText("Option 2");
        fireEvent.click(option);

        expect(setValueMock).toHaveBeenCalledWith("Option 2");

        // Wait for the dropdown to close
        await waitFor(() => {
            const dropdownMenu = screen.queryByRole("listbox");
            expect(window.getComputedStyle(dropdownMenu).opacity).toBe("0");
        });
    });

    test("Closes the dropdown when clicking outside", async () => {
        render(
            <div>
                <Dropdown
                    label="Test Label"
                    value=""
                    options={options}
                    setValue={setValueMock}
                    width="200px"
                    filterBy="name"
                />
                <div data-testid="outside">Outside</div>
            </div>
        );

        const dropdown = screen.getByTestId("dropdown");
        fireEvent.click(dropdown);

        const outsideElement = screen.getByTestId("outside");
        fireEvent.mouseDown(outsideElement);

        // Wait for the dropdown to close
        await waitFor(() => {
            const dropdownMenu = screen.queryByRole("listbox");
            expect(window.getComputedStyle(dropdownMenu).opacity).toBe("0");
        });
    });

    test("Displays 'No options found' when no matches exist", () => {
        render(
            <Dropdown
                label="Test Label"
                value=""
                options={[]}
                setValue={setValueMock}
                width="200px"
                filterBy="name"
            />
        );

        const button = screen.getByTestId("dropdown-button");
        fireEvent.click(button);

        const noOptionsMessage = screen.getByText(/no options found/i);
        expect(noOptionsMessage).toBeTruthy();
    });
});
