import {useDataQuery} from "@dhis2/app-runtime";

const query = {
    inspections: {
        resource: 'tracker/events',
        params: ({ username, inspectionPage }) => ({
            fields: ['event', 'orgUnitName', 'occurredAt','updatedAt', 'createdBy', 'updatedBy', 'status', 'dataValues'],
            program: 'UxK2o06ScIe',
            updatedBy: username,
            order: 'updatedAt:desc',
            pageSize: 7,
            page: 1,
        }),
    },
};

export function useInspectionByUser(username, inspectionPage) {
    return useDataQuery(query, { variables: { username, inspectionPage } });
}