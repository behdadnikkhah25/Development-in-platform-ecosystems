// NumberRow.js
import React from 'react';
import classes from './NumberRow.module.css';

export function NumberRow({ range, selected, setSelected, disabled, error }) {
    const handleSelection = (index) => {
        if(disabled) return;
        setSelected(index);
    };

    return (
        <div
            className={classes.numberContainer}
            style={{
                cursor: disabled ? 'auto' : 'pointer',
                opacity: disabled ? '0.6' : '1',
                backgroundColor: error ? '#b71c1c' : 'var(--primary200)',
                border: error ? '1px solid #891515' : '1px solid var(--grey500)',
            }}
            data-testid="number-row"
        >
            {!disabled && (
                <div
                    className={classes.selectedBox}
                    style={{
                        left: `${(selected - 1) * 32}px`,
                        opacity: selected > 0 ? '1' : '0',
                    }}
                ></div>
            )}
            {Array.from({ length: range }).map((_, index) => (
                <div
                    data-testid="number-box"
                    style={{
                        color: selected === index + 1 && !disabled ? '#ffffff' : '',
                        opacity: disabled ? '0.6' : '1',
                    }}
                    onClick={() => handleSelection(index + 1)}
                    key={index}
                    className={classes.box}
                >
                    {index + 1}
                </div>
            ))}
        </div>
    );
}
