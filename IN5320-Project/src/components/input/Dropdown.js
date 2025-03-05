import { Button } from '@dhis2/ui';
import classes from './Dropdown.module.css';
import {useEffect, useRef, useState} from "react";

export function Dropdown({ value, options, setValue, width, color, icon, textColor, small }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [animating, setAnimating] = useState(false);

    const onSelect = (option) => {
        setValue(option);
        setOpen(false);
    }

    const openDropdown = () => {
        setOpen(!open);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (open) {
            setAnimating(true);
        } else if (!open && animating) {
            const timeout = setTimeout(() => setAnimating(false), 200);
            return () => clearTimeout(timeout);
        }
    }, [open]);

    const size = small ? 28 : 40;

    const dropdownHeight = open
        ? `${options.length > 0 ? (options.length-1) * size : `${size}`}px`
        : '0px';

    return(
        <div className={classes.dropdown}
             onClick={openDropdown}
             style={{width: 'fit-content'}}
             ref={dropdownRef}
             data-testid="dropdown"
        >
            <Button
                icon={icon}
                style={{backgroundColor: color, borderColor: color, color:textColor}}
                placeholder="Select an option"
                value={value}
                onChange={(e) => onChange(e)}
                className={"dropdownButton"}
                small={small}
                data-testid="dropdown-button"
            >
                {value}
                <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px"
                     fill="currentColor"
                     style={{marginRight: '-4px'}}
                >
                    <path
                        d="M480-361q-8 0-15-2.5t-13-8.5L268-556q-11-11-11-28t11-28q11-11 28-11t28 11l156 156 156-156q11-11 28-11t28 11q11 11 11 28t-11 28L508-372q-6 6-13 8.5t-15 2.5Z"/>
                </svg>
            </Button>
            <div
                className={`${classes.dropdownMenu} ${open || animating ? classes.open : ""}`}
                style={{
                    width: width,
                    height: dropdownHeight,
                    opacity: open || animating ? 1 : 0,
                    transition: `height 0.2s ease-in-out, transform ${0.05*options.length-1}s ease-in-out`
                }}
                data-testid="dropdown-menu"
                role={"listbox"}
            >
                {options.length > 0 ? (
                    options.map((option, index) => (
                        option === value ? null : (
                            <Button
                                style={{
                                    transition: `transform ${0.05*(index+1)}s ease-in-out`
                                }}
                                key={index} onClick={() => onSelect(option)}>
                                {option}
                            </Button>
                        )
                    ))
                ) : (
                    <div className={classes.noOptions}>No options found</div>
                )}
            </div>
        </div>
    );
}