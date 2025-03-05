import { useDataMutation } from "@dhis2/app-runtime";

// Create a school (organisation unit) and return its ID
export const useSchoolCreator = () => {
    const [mutateSchool, { loading, error }] = useDataMutation({
        resource: 'organisationUnits',
        type: 'create',
        data: ({ name, cluster, coordinates }) => ({
            name,
            shortName: name,
            openingDate: new Date().toISOString().split('T')[0],
            parent: { id: cluster },
            coordinates,
            featureType: 'POINT',
        }),
    });

    const createSchool = async (schoolData) => {
        const response = await mutateSchool(schoolData);
        return response.response?.uid;
    };

    return { createSchool, loading, error };
};

export const useProgramAssociation = () => {
    const [mutateInspection] = useDataMutation({
        resource: 'programs/UxK2o06ScIe',
        type: 'json-patch',
        data: ({ id }) => [
            { op: 'add', path: '/organisationUnits/-', value: { id } },
        ],
    });
/*
    const [mutateStaff] = useDataMutation({
        resource: 'programs/rmuGQ7kBQBU',
        type: 'json-patch',
        data: ({ id }) => [
            { op: 'add', path: '/organisationUnits/-', value: { id } },
        ],
    });

    const [mutateStudent] = useDataMutation({
        resource: 'programs/wQaiD2V27Dp',
        type: 'json-patch',
        data: ({ id }) => [
            { op: 'add', path: '/organisationUnits/-', value: { id } },
        ],
    });
*/
    const associateSchoolToProgram = async (schoolId) => {
       /* await mutateStudent({ id: schoolId });
        await mutateStaff({ id: schoolId });*/
        await mutateInspection({ id: schoolId });
    };

    return { associateSchoolToProgram };
};

export const useSchoolImageUpdater = () => {
    const [mutate, { loading, error }] = useDataMutation({
        resource: 'organisationUnits',
        type: 'json-patch',
        id: ({ id }) => id,
        data: ({ imageId }) => [
            { op: 'replace', path: '/image', value: { id: imageId } },
        ],
    });

    const updateSchoolImage = async (schoolId, imageId) => {
        await mutate({ id: schoolId, imageId });
    };

    return { updateSchoolImage, loading, error };
};
