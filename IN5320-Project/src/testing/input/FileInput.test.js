import React from 'react';
import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import { FileInput } from '../../components/input/FileInput'; // Adjust the path as needed

describe('FileInput Component', () => {
    const mockOnChange = jest.fn();
    const file = new File(['test'], 'test-file.png', { type: 'image/png' });

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    test('Renders the FileInput component correctly', () => {
        render(<FileInput label="Upload File" accept="image/*" onChange={mockOnChange} width="300px" />);
        const fileInput = screen.getByTestId('file-input');
        expect(fileInput).toBeTruthy();
        expect(window.getComputedStyle(fileInput).width).toBe('300px');
    });

    test('Allows selecting a file using the file input', () => {
        render(<FileInput label="Upload File" accept="image/*" onChange={mockOnChange} />);
        const fileInputElement = document.querySelector('[data-test="dhis2-uicore-fileinput-input"]');
        fireEvent.change(fileInputElement, { target: { files: [file] } });

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ target: { files: [file] } }));
    });

    test('Displays the selected file name', () => {
        render(<FileInput label="Upload File" accept="image/*" currentFile={file} />);
        const fileLabel = screen.getByText('test-file.png');
        expect(fileLabel).toBeTruthy();
    });

    test('Allows removing a selected file', () => {
        render(<FileInput label="Upload File" accept="image/*" currentFile={file} onChange={mockOnChange} />);
        const removeButton = document.querySelector('[data-test="dhis2-uicore-filelistitem-remove"]');
        fireEvent.click(removeButton);
        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ target: { files: [] } }));
    });

    test('Handles drag-and-drop file selection', () => {
        render(<FileInput label="Upload File" accept="image/*" onChange={mockOnChange} />);
        const dropZone = screen.getByTestId('file-dropzone');

        fireEvent.dragOver(dropZone);
        fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ target: { files: [file] } }));
    });

    test('Displays a visual change when a file is dragged over', () => {
        render(<FileInput label="Upload File" accept="image/*" />);
        const dropZone = screen.getByTestId('file-dropzone');

        fireEvent.dragOver(dropZone);
        expect(dropZone.classList.contains('dragOver')).toBe(true);
        fireEvent.dragLeave(dropZone);
        waitFor(() => {
            expect(dropZone.classList.contains('dragOver')).not.toBe(true);
        });
    });

    test('Handles clicking on the drop zone to open file selector', () => {
        render(<FileInput label="Upload File" accept="image/*" />);
        const dropZone = screen.getByTestId('file-dropzone');
        const fileInput = document.querySelector(`input[type="file"]`);

        const inputSpy = jest.spyOn(fileInput, 'click');
        fireEvent.click(dropZone);

        expect(inputSpy).toHaveBeenCalled();
    });
});
