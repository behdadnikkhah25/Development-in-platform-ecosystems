export const required = (value) => (value ? undefined : "Required");

export const validateDate = (value, today) =>
    value > today ? "Date cannot be in the future" : undefined;

export const fieldToLabel = {
    computerLab: "Computer lab",
    electricSupply: "Electricity supply",
    handwashing: "Handwashing",
    library: "Library",
    playground: "Playground",
};

export const validateConditions = (conditions) => {
    const errors = {};

    conditions.forEach(({ key, required, condition }) => {
        errors[key] = required && !condition;
    });

    return {
        errors,
        hasErrors: Object.values(errors).some((error) => error),
        errorFields: Object.keys(errors).filter((key) => errors[key]),
    };
};

export const resetConditionState = (key, value, setStateFunctions) => {
    const {
        setHasComputerLab,
        setHasElectricSupply,
        setHasHandwashing,
        setHasLibrary,
        setHasPlayground,
        setComputerLabCondition,
        setElectricSupplyCondition,
        setHandwashingCondition,
        setLibraryCondition,
        setPlaygroundCondition,
    } = setStateFunctions;

    switch (key) {
        case "computerLab":
            setHasComputerLab(value);
            setComputerLabCondition(null);
            break;
        case "electricSupply":
            setHasElectricSupply(value);
            setElectricSupplyCondition(null);
            break;
        case "handwashing":
            setHasHandwashing(value);
            setHandwashingCondition(null);
            break;
        case "library":
            setHasLibrary(value);
            setLibraryCondition(null);
            break;
        case "playground":
            setHasPlayground(value);
            setPlaygroundCondition(null);
            break;
        default:
            break;
    }
};
