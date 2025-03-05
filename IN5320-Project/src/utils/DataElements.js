export const DATA_ELEMENT_MAP = {
    computerLab: "Nvp4hIbXrzF",
    computerLabCondition: "gzhjCMe7OyS",
    electricSupply: "IKiSAA19Xvl",
    electricSupplyCondition: "MH2eDd7qWxR",
    handwashing: "n9KwS4rY2HC",
    handwashingCondition: "ie3bFiVatHT",
    library: "Y6DQqwTdhiZ",
    libraryCondition: "IAomDvMcUDr",
    classrooms: "ya5SyA5hej4",
    cleanClassrooms: "XIgpDhDC4Ol",
    playground: "XThfmg6f2oC",
    playgroundCondition: "JzZfwXtdL6G",
    toilets: "I13NTyLrHBm",
};

export const processedInspections = (inspections) => {
    console.log(inspections);
    return inspections.map(inspection => {
        const dataValueMap = {};
        inspection.dataValues.forEach(dataValue => {
            const key = Object.keys(DATA_ELEMENT_MAP).find(
                key => DATA_ELEMENT_MAP[key] === dataValue.dataElement
            );
            if (key) {
                dataValueMap[key] = dataValue.value;
            }
        });

        return {
            ...inspection,
            dataValueMap,
        };
    });
};

export const getRatio = (numerator, denominator) => {
    if(numerator === 0) {
        return denominator;
    }

    if (!denominator) {
        return null;
    }
    return (numerator / denominator).toFixed(0);
};
