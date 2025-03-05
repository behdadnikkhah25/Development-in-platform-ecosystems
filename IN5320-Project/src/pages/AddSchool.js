import React, { useState } from 'react'
import { InputField, Button, IconCross24 } from "@dhis2/ui";
import classes from "./AddSchool.module.css";
import {MapInput} from "../components/input/MapInput";
import {FileInput} from "../components/input/FileInput";
import {useImageManagement} from "../data/ImageMutate";
import {useProgramAssociation, useSchoolCreator, useSchoolImageUpdater} from "../data/SchoolMutate";
import {handleCoordinateChange, handleSchoolSubmission} from "../utils/School";
import {AddSchoolIcon} from "../components/icons/AddSchoolIcon";
import {ResetIcon} from "../components/icons/ResetIcon";
import {handleUploadImage} from "../utils/Image";
import {useAlert} from "@dhis2/app-runtime";
import db from "../offline/Db";

export function AddSchool({currentCluster, goChangeCluster}){
    const [schoolName, setSchoolName] = useState('');
    const [coordinates, setCoordinates] = useState([9.0820, 8.6753]);
    const [image, setImage] = useState(null);
    const { updateSchoolImage } = useSchoolImageUpdater();
    const { uploadImage } = useImageManagement();
    const { createSchool } = useSchoolCreator();
    const { associateSchoolToProgram } = useProgramAssociation();
    const {show} = useAlert(({message}) => `${message}`, ({type}) => ({success: type === 'success', warning: type === 'error'}));
    const clusterId = currentCluster.id;

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
            <div className="pageContainer">
                <h1>Create school</h1>
                <form className="form">
                    <div className={classes.field}>
                        <div className={classes.label}>
                            <label htmlFor="upload-image">
                                Image of the school
                            </label>
                            <div className={classes.labelDescription}><p>
                                Accepted file formats are: .jpeg, .png and .webp.
                            </p>
                            </div>
                        </div>
                        <div className={classes.inputSection}>
                            <div className={classes.inputSection} style={{paddingTop: '5px', paddingBottom: '5px'}}>
                                {image ? (
                                    <div className="currentImageContainer">
                                    <img
                                        className="currentImage"
                                        src={URL.createObjectURL(image)} alt="Chosen image"/>
                                        <Button name={"Remove image"} destructive icon={<IconCross24/>}
                                                onClick={() => setImage(null)}/>
                                    </div>
                                ) : (
                                <FileInput
                                    id="upload-image"
                                    accept={".jpg, .jpeg, .png, .webp"}
                                    onChange={(e) => handleUploadImage(e, setImage)}
                                    selectedFile={image}
                                />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={classes.field}>
                        <div className={classes.label}>
                            <label htmlFor="schoolName">
                                School name*
                            </label>
                            <div className={classes.labelDescription}><p>
                                <i>Required</i>
                            </p>
                            </div>
                        </div>
                        <div className={classes.inputSection}
                        >
                            <InputField
                                className={classes.inputField}
                                type={"text"}
                                name='schoolName'
                                value={schoolName}
                                onChange={({value}) => setSchoolName(value)}
                            />
                        </div>
                    </div>
                    <div className={classes.field}>
                        <div className={classes.label}>
                            <label
                                htmlFor="cluster"
                            >
                                Belongs to cluster
                            </label>
                            <div
                                onClick={goChangeCluster}
                                className={classes.labelDescriptionLink}><p>
                                Change cluster.
                            </p>
                            </div>
                        </div>
                        <div className={classes.inputSection}>
                            <InputField
                                className={classes.inputField}
                                type={"text"}
                                value={currentCluster.name}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className={classes.field}>
                        <div className={classes.label}>
                            <label htmlFor="schoolLocation">
                                Location
                            </label>
                            <div className={classes.labelDescription}>
                                <p>
                                    Click on the map to select
                                    and drag to move.
                                </p>
                                <p className={classes.line2}>
                                    Use the + and - to zoom in
                                    and out.
                                </p>
                            </div>
                        </div>
                        <div className={classes.mapSection}
                        >
                            <div className={classes.mapInput}>
                            <MapInput
                                id="schoolLocation"
                                coordinates={coordinates}
                                onLatitudeChange={setCoordinates}
                                onLongitudeChange={setCoordinates}
                            />
                            </div>
                            <div className={classes.locationInput}>
                                <div className={classes.coordinate}>
                                    <label
                                        htmlFor="latitude"
                                        className={classes.coordinatePrefix}>
                                        Lat:
                                    </label>
                                    <div>
                                        <InputField
                                            name="latitude"
                                            type={"text"}
                                            value={'' + coordinates[0]}
                                            onChange={(e) => handleCoordinateChange(e, 'lat', setCoordinates)}
                                        />
                                    </div>
                                </div>
                                <div className={classes.coordinate}>
                                    <label
                                        htmlFor="longitude"
                                        className={classes.coordinatePrefix}>
                                        Long:
                                    </label>
                                    <div>
                                        <InputField
                                            name={"longitude"}
                                            type={"text"}
                                            value={'' + coordinates[1]}
                                            onChange={(e) => handleCoordinateChange(e, 'long', setCoordinates)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.buttons}>
                        <Button
                            icon={
                                <ResetIcon size={24}/>
                            }
                            destructive secondary
                        >
                            Reset form
                        </Button>
                        <Button
                            icon={
                                <AddSchoolIcon/>
                            }
                            primary
                            onClick={handleSubmit}
                        >
                            Create school
                        </Button>
                    </div>
                </form>
            </div>
)
    ;
}
