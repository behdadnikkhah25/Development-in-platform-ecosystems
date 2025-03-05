import React, { useEffect, useState } from "react";
import { useDataMutation } from "@dhis2/app-runtime";
import db from "./Db";

const deleteFromDexie = async () => {
    try {
        await db.inspections.clear();
        await db.offlineSchools.clear();
        console.log("Offline data cleared from Dexie.");
    } catch (error) {
        console.error("Error clearing Dexie data:", error);
    }
};

const dataMutationQuery = {
    resource: 'tracker',
    type: 'create',
    data: ({orgUnit, orgUnitName, eventDate, formValues}) => ({
        events: [
            {
                status: "ACTIVE",
                program: "UxK2o06ScIe",
                programStage: "eJiBjm9Rl7E",
                orgUnit: orgUnit,
                orgUnitName: orgUnitName,
                occurredAt: eventDate,
                storedBy: "admin",
                dataValues: [
                    { dataElement: "Nvp4hIbXrzF", value: formValues.computerLab },
                    { dataElement: "gzhjCMe7OyS", value: formValues.computerLabCondition },
                    { dataElement: "IKiSAA19Xvl", value: formValues.electricSupply },
                    { dataElement: "MH2eDd7qWxR", value: formValues.electricSupplyCondition },
                    { dataElement: "n9KwS4rY2HC", value: formValues.handwashing },
                    { dataElement: "ie3bFiVatHT", value: formValues.handwashingCondition },
                    { dataElement: "Y6DQqwTdhiZ", value: formValues.library },
                    { dataElement: "ya5SyA5hej4", value: formValues.classrooms },
                    { dataElement: "XIgpDhDC4Ol", value: formValues.cleanClassrooms },
                    { dataElement: "XThfmg6f2oC", value: formValues.playground },
                    { dataElement: "JzZfwXtdL6G", value: formValues.playgroundCondition },
                    { dataElement: "I13NTyLrHBm", value: formValues.toilets },
                ]
            }
        ]
    })
};

const schoolMutationQuery = {
    resource: "organisationUnits",
    type: "create",
    data: ({ name, cluster, coordinates }) => ({
        name,
        shortName: name,
        openingDate: new Date().toISOString().split("T")[0],
        parent: { id: cluster },
        coordinates: coordinates.join(" "),
        featureType: "POINT",
    }),
};

const mutateImageQuery = {
    resource: 'fileResources',
    type: 'create',
    params: {
        domain: 'ORG_UNIT',
    },
    data: ({ image }) => ({
        file: image,
    }),
};

const mutateSchoolImageQuery = {
    resource: 'organisationUnits',
    type: 'json-patch',
    id: ({ id }) => id,
    data: ({ imageId }) => [
        {
            op: 'replace',
            path: '/image',
            value: { id: imageId }
        }
    ],
};

const mutateSchoolToProgramQuery = {
    resource: 'programs/UxK2o06ScIe',
    type: 'json-patch',
    data: ({ id }) => [
        {
            op: 'add',
            path: '/organisationUnits/-',
            value: {id}
        }
    ],
};

export function SyncManager() {
    const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' && navigator.onLine);
    const [mutate] = useDataMutation(dataMutationQuery);
    const [mutateSchool] = useDataMutation(schoolMutationQuery);
    const [mutateImage] = useDataMutation(mutateImageQuery);
    const [mutateSchoolImage] = useDataMutation(mutateSchoolImageQuery);
    const [mutateSchoolToProgram] = useDataMutation(mutateSchoolToProgramQuery);

    useEffect(() => {
        const handleOnlineStatus = () => setIsOnline(typeof navigator !== 'undefined' && navigator.onLine);
        window.addEventListener("online", handleOnlineStatus);
        window.addEventListener("offline", handleOnlineStatus);

        return () => {
            window.removeEventListener("online", handleOnlineStatus);
            window.removeEventListener("offline", handleOnlineStatus);
        };
    }, []);

    useEffect(() => {
        if (isOnline) {
            const syncData = async () => {
                try {
                    const offlineData = await db.inspections.toArray();
                    if (offlineData.length > 0) {
                        for (const record of offlineData) {
                            try {
                                await mutate({
                                    orgUnit: record.orgUnit,
                                    orgUnitName: record.orgUnitName,
                                    eventDate: record.eventDate,
                                    formValues: record.formValues
                                });
                            } catch (error) {
                                console.error(`Error syncing ${record.orgUnitName}:`, error);
                                break;
                            }
                        }
                        //await deleteFromDexie(); // Clear only after complete sync

                    }
                    
                    const offlineSchools = await db.offlineSchools.toArray();
                    if (offlineSchools.length > 0) {
                        for (const school of offlineSchools) {
                            try {
                                console.log("offline db data", school.schoolName, school.clusterId, school.coordinates)
                                const schoolResponse = await mutateSchool({
                                    name: school.schoolName,
                                    cluster: school.clusterId,
                                    coordinates: school.coordinates,
                                });
                                const schoolId =  schoolResponse.response?.uid;

                                const imageResponse = await mutateImage({ image: school.image });

                                const fileResourceId = imageResponse.response?.fileResource?.id;
                                await mutateSchoolImage({
                                    id: schoolId,
                                    imageId: fileResourceId,
                                });
                
                                await mutateSchoolToProgram({id: schoolId});
                            } catch (error) {
                                console.error(
                                    `Error syncing school ${school.name}:`,
                                    error
                                );
                                break;
                            }
                        }
                    }
                    await deleteFromDexie();
                } catch (error) {
                    console.error("Error accessing Dexie data:", error);
                }
            };
            syncData();
        }
    }, [isOnline, mutate]);

    return null;
}