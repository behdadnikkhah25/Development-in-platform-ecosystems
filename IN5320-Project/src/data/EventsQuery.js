export const programQuery = {
    inspections: {
        resource: 'tracker/events',
        params: ({ orgUnit }) => ({
            orgUnit: orgUnit,
            program: 'UxK2o06ScIe',
        }),
    },
    staff: {
        resource: 'tracker/events',
        params: ({ orgUnit }) => ({
            orgUnit: orgUnit,
            program: 'rmuGQ7kBQBU',
        }),
    },
    students: {
        resource: 'tracker/events',
        params: ({ orgUnit }) => ({
            orgUnit: orgUnit,
            program: 'wQaiD2V27Dp',
        }),
    },
};
