import React, {useEffect, useState} from 'react';
import { FileInputField, Tooltip, FileListItem } from '@dhis2/ui';
import classes from './FileInput.module.css';

export function FileInput({ accept, onChange, tabIndex, width, currentFile }) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isHovering, setIsHovering] = useState(false);
    const dragTimer = React.useRef(null);

    useEffect(() => {
        setSelectedFile(currentFile);
    }, [currentFile]);

    const handleDragOver = (event) => {
        event.preventDefault();
        if (!isDragging) {
            setIsDragging(true);
        }
        if (dragTimer.current) {
            clearTimeout(dragTimer.current);
        }
    };

    const handleDragLeave = () => {
        dragTimer.current = setTimeout(() => {
            setIsDragging(false);
        }, 100);
    };

    const uploadFile = (file) => {
        if (file) {
            setSelectedFile(file);
            if (onChange) {
                onChange({ target: { files: [file] } });
            }
        }
    }

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        uploadFile(file);
    };

    const handleFileChange = (event) => {
        const file = event.files[0];
        uploadFile(file);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (onChange) {
            onChange({ target: { files: [] } });
        }
    };

    const handleDropZoneClick = (event) => {
        document.querySelector(`input[type="file"]`).click();
    };

    return (
        <div
            className={classes.fileInput}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{ width }}
            data-testid="file-input"
        >
            <FileInputField
                className={classes.inputField}
                accept={accept}
                onChange={handleFileChange}
                tabIndex={tabIndex}
                placeholder="No image selected yet"
                multiple={false}
                name={"Upload image"}
                buttonLabel={<p>Choose or drag a file here</p>}
            >
                {selectedFile && (
                    <FileListItem
                        className={classes.fileListItem}
                        cancelText="Cancel"
                        label={selectedFile.name}
                        onRemove={handleRemoveFile}
                        removeText={
                            <Tooltip content="Remove file">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"
                                 width="20px" fill="currentColor" className={classes.removeSvg}>
                                <path
                                    d="M480-429 316-265q-11 11-25 10.5T266-266q-11-11-11-25.5t11-25.5l163-163-164-164q-11-11-10.5-25.5T266-695q11-11 25.5-11t25.5 11l163 164 164-164q11-11 25.5-11t25.5 11q11 11 11 25.5T695-644L531-480l164 164q11 11 11 25t-11 25q-11 11-25.5 11T644-266L480-429Z"/>
                            </svg>
                            </Tooltip>
                        }
                    />
                )}
            </FileInputField>

            <div
                data-testid="file-dropzone"
                className={`${classes.dropZone} ${isDragging ? classes.dragOver : ''}`}
                onClick={handleDropZoneClick}
                style={{backgroundColor: isHovering ? 'rgba(168, 207, 228, 0.3)' : 'rgba(168, 207, 228, 0.10)'}}
            >
            </div>
        </div>
    );
}
