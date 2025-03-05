import React, { useState, useEffect} from "react";
import {useAlert} from "@dhis2/app-runtime";
import { InputField, Button, composeValidators, Checkbox, IconCross24, IconCheckmark24 } from '@dhis2/ui';
import {NumberRow} from "../input/NumberRow";
import {NumberCounter} from "../input/NumberCounter";
import classes from './NewInspection.module.css';
import {Card} from "../Card";
import db from "../../offline/Db";
import {fieldToLabel, resetConditionState, validateConditions, validateDate} from "../../utils/NewInspection";
import {useCreateInspection} from "../../data/InspectionMutate";
import {ClassroomIcon} from "../icons/ClassroomIcon";
import {CleanClassroomIcon} from "../icons/CleanClassroomIcon";
import {ToiletIcon} from "../icons/ToiletIcon";

export function NewInspection({onClose, username, child }) {
    const today = new Date().toISOString().split('T')[0];
    const [ createInspection ] = useCreateInspection();
    const [eventDate, setEventDate] = useState(today);
    const [possibleCleanClassrooms, setPossibleCleanClassrooms] = useState(0);
    const [errors, setErrors] = useState({
        computerLab: false,
        electricSupply: false,
        handwashing: false,
        library: false,
        playground: false,
    });

    const [state, setState] = useState({
        computerLab: { has: false, condition: null },
        electricSupply: { has: false, condition: null },
        handwashing: { has: false, condition: null },
        library: { has: false, condition: null },
        playground: { has: false, condition: null },
        classrooms: 0,
        cleanClassrooms: 0,
        toilets: 0,
    });

    const {show} = useAlert(
        ({message}) => `${message}`, 
        ({type}) => ({success: type === 'success', warning: type === 'error', duration: 1500})
    );
    useEffect(() => {
        setPossibleCleanClassrooms(state.classrooms);
    }, [state.classrooms]);

    const handleConditionChange = (key, value, isCheckbox = false) => {
        if (isCheckbox) {
            resetConditionState(key, value, {
                setHasComputerLab: () => setState((prev) => ({ ...prev, computerLab: { ...prev.computerLab, has: value } })),
                setComputerLabCondition: (val) => setState((prev) => ({ ...prev, computerLab: { ...prev.computerLab, condition: val } })),
                setHasElectricSupply: () => setState((prev) => ({ ...prev, electricSupply: { ...prev.electricSupply, has: value } })),
                setElectricSupplyCondition: (val) => setState((prev) => ({ ...prev, electricSupply: { ...prev.electricSupply, condition: val } })),
                setHasHandwashing: () => setState((prev) => ({ ...prev, handwashing: { ...prev.handwashing, has: value } })),
                setHandwashingCondition: (val) => setState((prev) => ({ ...prev, handwashing: { ...prev.handwashing, condition: val } })),
                setHasLibrary: () => setState((prev) => ({ ...prev, library: { ...prev.library, has: value } })),
                setLibraryCondition: (val) => setState((prev) => ({ ...prev, library: { ...prev.library, condition: val } })),
                setHasPlayground: () => setState((prev) => ({ ...prev, playground: { ...prev.playground, has: value } })),
                setPlaygroundCondition: (val) => setState((prev) => ({ ...prev, playground: { ...prev.playground, condition: val } })),
            });
        } else {
            setState((prev) => ({ ...prev, [key]: { ...prev[key], condition: value } }));
        }
        setErrors((prevErrors) => ({ ...prevErrors, [key]: false }));
    };

    const saveToDexie = async (formValues) => {
        await db.inspections.add({
            orgUnit: child.id,
            orgUnitName: child.name,
            eventDate: eventDate,
            username: username,
            formValues: formValues
        });
    };

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
                if (navigator.onLine) {
                    await createInspection({
                        orgUnit: child.id,
                        orgUnitName: child.name,
                        username: username,
                        eventDate,
                        formValues,
                    });
                    show({message: 'Inspection submitted', type: 'success', duration: 1500});
                } else {
                    try {
                        await saveToDexie(formValues);
                        onClose();
                    } catch (error) {
                        show({message: 'Error saving inspection offline', type: 'error', duration: 1500});
                    }
                    show({message: 'Inspection saved offline', type: 'success', duration: 1500});
                }
            } catch (error) {
                show({message: 'Error creating inspection', type: 'critical', duration: 1500});
            }
            setTimeout(() => {
                onClose();
            }, 1500);
        }
    };

    return (
        <Card onClose={onClose} title={`New inspection for: ${child.name}`} newInspection>
            <form className={classes.inspectionForm}>
                <div className={classes.dateField}>
                    <label
                        htmlFor={"eventDate"}>Inspection date</label>
                    <InputField
                        id={"eventDate"}

                        type="date"
                        value={eventDate}
                        max={today}
                        onChange={({ value }) => setEventDate(value)}
                        inputWidth={"100%"}
                    />
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
                            setSelected={(value) => setState((prev) => ({ ...prev, classrooms: value }))}
                            id={"amountOfClassrooms"}
                            label={"total classrooms"}
                        />
                        <NumberCounter
                            range={[0, possibleCleanClassrooms]}
                            selected={state.cleanClassrooms}
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
                    <Button
                        icon={<IconCheckmark24/>}
                        onClick={onSubmit} primary>Submit</Button>
                </div>
            </form>
        </Card>
    )
}