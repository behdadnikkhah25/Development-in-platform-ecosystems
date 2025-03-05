import React, { useState } from 'react';
import { IconCross24, Button, InputField} from '@dhis2/ui';
import 'leaflet/dist/leaflet.css';
import classes from './AddSchoolModal.module.css';
import { MapInput } from "../input/MapInput";
import {Card} from "../Card";
import {FileInput} from "../input/FileInput";
import {useProgramAssociation, useSchoolCreator, useSchoolImageUpdater} from "../../data/SchoolMutate";
import {useImageManagement} from "../../data/ImageMutate";
import {handleSchoolSubmission} from "../../utils/School";
import {AddSchoolIcon} from "../icons/AddSchoolIcon";
import {handleUploadImage} from "../../utils/Image";
import {useAlert} from "@dhis2/app-runtime";
import db from "../../offline/Db";

export function AddSchoolModal({ onClose, currentCluster }) {
    const [coordinates, setCoordinates] = useState([9.0820, 8.6753]);
    const [schoolName, setSchoolName] = useState('');
    const [image, setImage] = useState(null);
    const { uploadImage } = useImageManagement();
    const { createSchool } = useSchoolCreator();
    const { updateSchoolImage } = useSchoolImageUpdater();
    const { associateSchoolToProgram } = useProgramAssociation();
    const {show} = useAlert(({message}) => `${message}`, ({type}) => ({success: type === 'success', warning: type === 'error'}));
    const clusterId = currentCluster.id;

    const handleCoordinateChange = (e, type) => {
        const value = parseFloat(e.value).toFixed(6);
        setCoordinates(type === 'lat' ? prev => [value, prev[1]] : prev => [prev[0], value]);
    };

    const handleSubmit = async () => {
        try{
            if (navigator.onLine) {
                await handleSchoolSubmission({
                    schoolName,
                    coordinates,
                    cluster: clusterId,
                    image,
                    createSchool,
                    uploadImage,
                    updateSchoolImage,
                    associateSchoolToProgram,
                });
                show({message: 'School created successfully', type: 'success', duration:1500});
            }
            else {
                await db.offlineSchools.add({ schoolName, clusterId, coordinates, image });
                show({message: 'School saved offline and will sync when online', type: 'success', duration:1500});
            }
        } catch (e) {
            show({message: e.message, type: 'error'});
        }
    };

    return (
        <Card onClose={onClose} title={'Create new school'}>
            <form className={classes.addSchoolForm} onSubmit={handleSubmit}>
                <div className={classes.fields}>
                    <div className={classes.label}>
                        <label>
                            Image of the school
                        </label>
                        <div className={classes.labelDescription}><p>
                            Accepted file formats are: .jpeg, .png and .webp.
                        </p>
                        </div>
                    </div>
                    {image ? (
                        <div className="currentImageContainer">
                            <img
                                className="currentImage"
                                src={URL.createObjectURL(image)} alt="Chosen image"/>
                            <Button name={"Delete image"} destructive icon={<IconCross24/>}
                                    onClick={() => setImage(null)}/>
                        </div>
                    ) : (
                    <FileInput
                        label="Upload an image for the school"
                        accept="image/*"
                        width="100%"
                        onChange={(e) => handleUploadImage(e, setImage)}
                    />
                        )}
                    <div className={classes.twoFields}>
                        <div className={classes.schoolName}>
                        <InputField
                            type={"text"}
                            label="Name"
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.value)}
                            inputWidth={'100%'}
                        />
                        </div>
                        <div className={classes.schoolName}>
                        <InputField
                            label={"Cluster"}
                            type={"text"}
                            value={currentCluster.name}
                            readOnly
                        />
                        </div>
                    </div>
                    <div className={classes.label}>
                        <label>
                            Location
                        </label>
                        <div className={classes.labelDescription}><p>
                            Click to set location, drag to move.
                        </p>
                        </div>
                    </div>
                    <div className={classes.mapSection}>
                        <div className={classes.mapInput}>
                            <MapInput
                                coordinates={coordinates}
                                setCoordinates={setCoordinates}
                            />
                        </div>
                    </div>
                    <div className={classes.locationInput}>
                        <div className={classes.coordinate}>
                            <div className={classes.coordinatePrefix}>
                                Lat:
                            </div>
                            <div>
                                <InputField
                                    type={"text"}
                                    value={coordinates[0]}
                                    onChange={(e) => handleCoordinateChange(e, 'long', setCoordinates)}
                                />
                            </div>
                        </div>
                        <div className={classes.coordinate}>
                            <div className={classes.coordinatePrefix}>
                                Long:
                            </div>
                            <div>
                                <InputField
                                    type={"text"}
                                    value={coordinates[1]}
                                    onChange={(e) => handleCoordinateChange(e, 'lat', setCoordinates)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.buttons}>
                    <Button
                        icon={<IconCross24/>}
                        onClick={onClose}
                        destructive secondary
                    >Cancel</Button>
                    <Button
                        type="submit"
                        primary
                        icon={
                            <AddSchoolIcon />
                        }
                    >Create school</Button>
                </div>
            </form>
        </Card>
);
}