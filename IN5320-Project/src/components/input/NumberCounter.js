import classes from './NumberCounter.module.css';
import {IconAdd16, Tooltip, IconSubtract16} from '@dhis2/ui';

export function NumberCounter({ selected, range, setSelected, label, id }) {

    const increase = () => {
        if (selected + 1 > range[1]) return;
        setSelected(selected+=1);
    }

    const decrease = () => {
        if (selected - 1 < range[0]) return;
        setSelected(selected-=1);
    }

    const handleInputChange = (e) => {
        const number = e.target.value;
        if (number - 1 < range[0]) setSelected(Number(range[0]));
        else if (number - 1 > range[1]) setSelected(Number(range[1]));
        else setSelected(Number(number));
    }

    return(
        <Tooltip content={"Select or input a number between " + range[0] + " and " + range[1]}>
        <div className={classes.counterContainer}
             data-testid="number-counter">
            <button
                type="button"
                aria-label={"Decrease " + label}
                className={classes.count}
                onClick={decrease}>
                <IconSubtract16/>
            </button>
            <input
                className={classes.inputNumber}
                type={"number"}
                value={selected}
                onChange={handleInputChange}
                id={id}
            />
            <button
                type="button"
                aria-label={"Increase " + label}
                className={classes.count}
                onClick={increase}>
                <IconAdd16/>
            </button>
        </div>
        </Tooltip>
    );
}
