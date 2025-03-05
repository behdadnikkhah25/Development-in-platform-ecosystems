import React, { useState, useEffect } from "react";
import { Card } from "../Card";
import classes from "./NewInspection.module.css";
import { IconDelete24, SplitButton, InputField, Button, composeValidators, Checkbox, IconCross24, IconCheckmark24 } from "@dhis2/ui";
import { ClassroomIcon } from "../icons/ClassroomIcon";
import { CleanClassroomIcon } from "../icons/CleanClassroomIcon";
import { ToiletIcon } from "../icons/ToiletIcon";
import { NumberRow } from "../input/NumberRow";
import { NumberCounter } from "../input/NumberCounter";
import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import {ActiveStatusIcon} from "../icons/ActiveStatusIcon";
import {CancelledStatusIcon} from "../icons/CancelledStatusIcon";
import {Dropdown} from "../input/Dropdown";
import {CompletedStatusIcon} from "../icons/CompletedStatusIcon";
import {UpdateInspectionIcon} from "../icons/UpdateInspectionIcon";
import {capitalizeFirstLetter} from "../../utils/PreviousInspections";
import {ConfirmModal} from "./ConfirmModal";
import {DATA_ELEMENT_MAP} from "../../utils/DataElements";
import {useUpdateInspection} from "../../data/InspectionMutate";
import {fieldToLabel, validateConditions} from "../../utils/NewInspection";

const dataMutationQuery = {
    resource: 'events',
    type: 'delete',
    id: ({ id }) => id,
};

export const EditInspection = ({ onClose, inspection }) => {
    const {show} = useAlert(({message}) => `${message}`, ({type}) => ({success: type === 'success', warning: type === 'error'}));
    const [selectedOption, setSelectedOption] = useState('Update');
    const [selectedStatus, setSelectedStatus] = useState('Active');
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [ updateInspection ] = useUpdateInspection();
    const [mutate, { loading, error }] = useDataMutation(dataMutationQuery);
    const [cleanClassrooms, setCleanClassrooms] = useState(0);
    const [errors, setErrors] = useState({
        computerLab: false,
        electricSupply: false,
        handwashing: false,
        library: false,
        playground: false,
    });

    const initializeState = () => {
        const newState = {
            computerLab: { has: false, condition: null },
            electricSupply: { has: false, condition: null },
            handwashing: { has: false, condition: null },
            library: { has: false, condition: null },
            playground: { has: false, condition: null },
            classrooms: null,
            cleanClassrooms: null,
            toilets: null,
        };

        inspection.dataValues.forEach(({ dataElement, value }) => {
            for (const [key, elementId] of Object.entries(DATA_ELEMENT_MAP)) {
                if (dataElement === elementId) {
                    console.log(key, value);
                    console.log("Inlucdes condition: " + key.includes("Condition"));
                    if(key === "classrooms" || key === "cleanClassrooms" || key === "toilets") {
                        newState[key] = Number(value) || null;
                        if(key === "cleanClassrooms") setCleanClassrooms(Number(value) || null);
                    }
                    else if (key.includes("Condition")) {
                        const parentKey = key.replace("Condition", "");
                        newState[parentKey].condition = value ? Number(value) : null;
                    } else if (typeof newState[key] === "object") {
                        newState[key].has = value === "true";
                    } else {
                        newState[key] = Number(value) || null;
                    }
                }
            }
        });

        return newState;
    };

    const [state, setState] = useState(initializeState());

    useEffect(() => {
        if (inspection) {
            setSelectedStatus(inspection.status === 'SKIPPED' ? 'Cancelled' : capitalizeFirstLetter(inspection.status));
        }
    }, [inspection]);

    const handleConditionChange = (field, value, isCheckbox = false) => {
        setState((prev) => {
            if (isCheckbox) {
                return {
                    ...prev,
                    [field]: {
                        ...prev[field],
                        has: value,
                    },
                };
            }
            return {
                ...prev,
                [field]: {
                    ...prev[field],
                    condition: value,
                },
            };
        });
    };

    const handleDelete = async (eid) => {
        try {
            await mutate({
                id: eid
            })
        }
        catch (error) {
            console.error('Mutation error:', error);
        }
        onClose(false);
    };

    const dropdownMenu = (
        <div className="splitDropdown">
            <Button
                primary
                destructive={selectedOption === 'Update'}
                onClick={() => setSelectedOption(selectedOption === 'Update' ? 'Delete' : 'Update')}
                icon={selectedOption === 'Update' ?<IconDelete24 /> :  <UpdateInspectionIcon size={24} /> }
            >
                {selectedOption === 'Update' ? 'Delete' : 'Update'}
            </Button>
        </div>
    );

    const getIcon = (status) => {
        switch (status) {
            case "Active":
                return <ActiveStatusIcon size={18} />;
            case "Cancelled":
                return <CancelledStatusIcon size={18} />;
            default:
                return <CompletedStatusIcon size={18} />;
        }
    }

    const statusArray = ["Active", "Cancelled", "Completed"];

    const onConfirm = () => {
        if(selectedOption === 'Delete') {
            handleDelete(inspection.event).then(r => show({message: `Inspection for ${inspection.orgUnitName} has been deleted`, type: 'success'}));
        }
        setIsConfirmModalVisible(false);
    }

    const handleSubmit = () => {
        if(selectedOption === 'Delete') {
            setIsConfirmModalVisible(true);
        } else {
            onSubmit();
        }
    }

    const onSubmit = async () => {
        const conditions = [
            {
                key: "computerLab",
                required: state.computerLab.has,
                condition: state.computerLab.condition,
            },
            {
                key: "electricSupply",
                required: state.electricSupply.has,
                condition: state.electricSupply.condition,
            },
            {
                key: "handwashing",
                required: state.handwashing.has,
                condition: state.handwashing.condition,
            },
            {
                key: "library",
                required: state.library.has,
                condition: state.library.condition,
            },
            {
                key: "playground",
                required: state.playground.has,
                condition: state.playground.condition,
            },
        ];

        const { errors: tempErrors, hasErrors, errorFields } = validateConditions(conditions);

        if (hasErrors) {
            setErrors(tempErrors);
            show({
                type: "error",
                message: `Please fill out conditions for: ${errorFields
                    .map((key) => fieldToLabel[key])
                    .join(", ")}`,
            });
        } else {
            const formValues = {
                computerLab: state.computerLab.has,
                computerLabCondition: state.computerLab.condition,
                electricSupply: state.electricSupply.has,
                electricSupplyCondition: state.electricSupply.condition,
                handwashing: state.handwashing.has,
                handwashingCondition: state.handwashing.condition,
                library: state.library.has,
                libraryCondition: state.library.condition,
                playground: state.playground.has,
                playgroundCondition: state.playground.condition,
                classrooms: state.classrooms,
                cleanClassrooms: state.cleanClassrooms,
                toilets: state.toilets,
            };
            try {
                await updateInspection({
                    event: inspection.event,
                    orgUnit: inspection.orgUnit,
                    orgUnitName: inspection.orgUnitName,
                    formValues,
                    status: selectedStatus === 'Cancelled' ? 'SKIPPED' : selectedStatus.toUpperCase(),
                    occurredAt: inspection.occurredAt,
                });
                show({ message: "Inspection updated", type: "success", duration: 1500 });
            } catch (error) {
                show({ message: "Error updating inspection", type: "critical", duration: 1500 });
            }
            onClose();
        }
    };

    return (
        <div>
        <Card onClose={onClose} title={`Edit inspection for ${inspection.orgUnitName}`} newInspection>
            <div className="labelDescription">
                by @{inspection?.createdBy?.username}
            </div>
            <form className={classes.inspectionForm}>
                <div className={classes.statusField}>
                    Status
                    <Dropdown
                        value={selectedStatus}
                        className="select"
                        setValue={setSelectedStatus}
                        color={selectedStatus === "Active" ? "#bb460d" : selectedStatus === "Cancelled" ? "#891515" : "#1b5e20"}
                        options={statusArray}
                        textColor={"#FFFFFF"}
                        small
                        icon={getIcon(selectedStatus)}
                    >
                    </Dropdown>
                </div>
                <div className={classes.fields}>
                    <div className={classes.labels}>
                        <h3>Necessity</h3>
                        <Checkbox
                            className={classes.checkbox}
                            checked={state.computerLab.has}
                            onChange={(e) => handleConditionChange("computerLab", e.checked, true)}
                            label={"Computer lab"}
                        />
                        <Checkbox
                            className={classes.checkbox}
                            checked={state.electricSupply.has}
                            onChange={(e) => handleConditionChange("electricSupply", e.checked, true)}
                            label={"Electricity supply"}
                        />
                        <Checkbox
                            className={classes.checkbox}
                            label={"Handwashing"}
                            checked={state.handwashing.has}
                            onChange={(e) => handleConditionChange("handwashing", e.checked, true)}
                        />
                        <Checkbox
                            className={classes.checkbox}
                            label={"Library"}
                            checked={state.library.has}
                            onChange={(e) => handleConditionChange("library", e.checked, true)}
                        />
                        <Checkbox
                            className={classes.checkbox}
                            label={"Playground"}
                            checked={state.playground.has}
                            onChange={(e) => handleConditionChange("playground", e.checked, true)}
                        />
                        <h3 className={classes.other}>Other</h3>
                        <label className={classes.label}
                               htmlFor={"amountOfClassrooms"}>
                            <ClassroomIcon size={24}/>
                            <span>Classrooms</span>
                        </label>
                        <label className={classes.label}
                               htmlFor={"amountOfCleanClassrooms"}
                        >
                            <CleanClassroomIcon size={24}/>
                            <span>Clean ones</span>
                        </label>
                        <label className={classes.label}
                               htmlFor={"amountOfToiletsTeacher"}
                        >
                            <ToiletIcon size={24}/>
                            <span>Toilets</span>
                        </label>
                    </div>
                    <div className={classes.inputs}>
                        <h3>Condition</h3>
                        <NumberRow
                            error={errors.computerLab}
                            range={5}
                            selected={state.computerLab.condition}
                            setSelected={(value) =>
                                handleConditionChange("computerLab", value)
                            }
                            disabled={!state.computerLab.has}
                        />
                        <NumberRow
                            error={errors.electricSupply}
                            range={5}
                            selected={state.electricSupply.condition}
                            setSelected={(value) => handleConditionChange("electricSupply", value)}
                            disabled={!state.electricSupply.has}
                        />
                        <NumberRow
                            error={errors.handwashing}
                            range={5}
                            selected={state.handwashing.condition}
                            setSelected={(value) => handleConditionChange("handwashing", value)}
                            disabled={!state.handwashing.has}
                        />
                        <NumberRow
                            error={errors.library}
                            range={5}
                            selected={state.library.condition}
                            setSelected={(value) => handleConditionChange("library", value)}
                            disabled={!state.library.has}
                        />
                        <NumberRow
                            error={errors.playground}
                            range={5}
                            selected={state.playground.condition}
                            setSelected={(value) => handleConditionChange("playground", value)}
                            disabled={!state.playground.has}
                        />
                        <div className={classes.emptyDiv} ></div>
                        <NumberCounter
                            range={[0, 999]}
                            selected={state.classrooms}
                            setSelected={(value) => {
                                setState((prev) => ({ ...prev, classrooms: value }));
                                setCleanClassrooms(value);
                            }}
                            id={"amountOfClassrooms"}
                            label={"total classrooms"}
                        />
                        <NumberCounter
                            range={[1, state.cleanClassrooms]}
                            selected={cleanClassrooms}
                            setSelected={(value) => setState((prev) => ({ ...prev, cleanClassrooms: value }))}
                            id={"amountOfCleanClassrooms"}
                            label={"clean classrooms"}
                        />
                        <NumberCounter
                            range={[0, 999]}
                            selected={state.toilets}
                            setSelected={(value) => setState((prev) => ({ ...prev, toilets: value }))}
                            id={"amountOfToiletsTeacher"}
                            label={"toilets for teachers"}
                        />
                    </div>

                </div>
                <div className={classes.buttons}>
                    <Button
                        icon={<IconCross24/>}
                        onClick={() => onClose()} destructive secondary>Cancel</Button>
                    <SplitButton
                        className="splitButton"
                        component={dropdownMenu}
                        primary
                        destructive={selectedOption === 'Delete'}
                        onClick={handleSubmit}
                        icon={selectedOption === 'Update' ? <UpdateInspectionIcon size={24} /> : <IconDelete24 />}
                    >
                        {selectedOption}
                    </SplitButton>
                </div>
            </form>
        </Card>
            {isConfirmModalVisible &&
                <ConfirmModal onClose={() => setIsConfirmModalVisible(false)} onConfirm={onConfirm}
                              title={`Are you sure you want to ${selectedOption.toLowerCase()} the inspection for ${inspection.orgUnitName}?`}/>}
        </div>
    );
}