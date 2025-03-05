import { useDataMutation } from "@dhis2/app-runtime";

export const useUpdateInspection = () => {
    return useDataMutation({
        resource: "tracker",
        type: "create",
        data: ({ orgUnit, orgUnitName, formValues, event, status, occurredAt }) => ({
            events: [
                {
                    event,
                    status: status,
                    program: "UxK2o06ScIe",
                    programStage: "eJiBjm9Rl7E",
                    orgUnit,
                    orgUnitName,
                    occurredAt: occurredAt,
                    dataValues: [
                        { dataElement: "Nvp4hIbXrzF", value: formValues.computerLab },
                        { dataElement: "gzhjCMe7OyS", value: formValues.computerLabCondition },
                        { dataElement: "IKiSAA19Xvl", value: formValues.electricSupply },
                        { dataElement: "MH2eDd7qWxR", value: formValues.electricSupplyCondition },
                        { dataElement: "n9KwS4rY2HC", value: formValues.handwashing },
                        { dataElement: "ie3bFiVatHT", value: formValues.handwashingCondition },
                        { dataElement: "Y6DQqwTdhiZ", value: formValues.library },
                        { dataElement: "IAomDvMcUDr", value: formValues.libraryCondition },
                        { dataElement: "ya5SyA5hej4", value: formValues.classrooms },
                        { dataElement: "XIgpDhDC4Ol", value: formValues.cleanClassrooms },
                        { dataElement: "XThfmg6f2oC", value: formValues.playground },
                        { dataElement: "JzZfwXtdL6G", value: formValues.playgroundCondition },
                        { dataElement: "I13NTyLrHBm", value: formValues.toilets },
                    ],
                },
            ],
        }),
    });
};

export const useCreateInspection = () => {
    return useDataMutation({
        resource: "tracker",
        type: "create",
        data: ({ orgUnit, orgUnitName, eventDate, username, formValues }) => ({
            events: [
                {
                    status: "ACTIVE",
                    program: "UxK2o06ScIe",
                    programStage: "eJiBjm9Rl7E",
                    orgUnit,
                    orgUnitName,
                    occurredAt: eventDate,
                    storedBy: username,
                    dataValues: [
                        { dataElement: "Nvp4hIbXrzF", value: formValues.computerLab },
                        { dataElement: "gzhjCMe7OyS", value: formValues.computerLabCondition },
                        { dataElement: "IKiSAA19Xvl", value: formValues.electricSupply },
                        { dataElement: "MH2eDd7qWxR", value: formValues.electricSupplyCondition },
                        { dataElement: "n9KwS4rY2HC", value: formValues.handwashing },
                        { dataElement: "ie3bFiVatHT", value: formValues.handwashingCondition },
                        { dataElement: "Y6DQqwTdhiZ", value: formValues.library },
                        { dataElement: "IAomDvMcUDr", value: formValues.libraryCondition },
                        { dataElement: "ya5SyA5hej4", value: formValues.classrooms },
                        { dataElement: "XIgpDhDC4Ol", value: formValues.cleanClassrooms },
                        { dataElement: "XThfmg6f2oC", value: formValues.playground },
                        { dataElement: "JzZfwXtdL6G", value: formValues.playgroundCondition },
                        { dataElement: "I13NTyLrHBm", value: formValues.toilets },
                    ],
                },
            ],
        }),
    });
};

