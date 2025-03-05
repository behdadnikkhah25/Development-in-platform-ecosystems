import { useDataQuery } from "@dhis2/app-runtime";

const datasetQuery = {
    orgUnits: {
        resource: "organisationUnits",
        params: ({ level, parent, page, name, sortField, sortDirection }) => {
            const filters = [
                `level:eq:${level}`,
                `parent.name:like:${parent}`,
            ]

            if (name && name.trim() !== "") {
                filters.push(`name:ilike:${name}`)
            }

            return {
                fields: [
                    "id",
                    "name",
                    "level",
                    "parent[id, name, level]",
                    "children[id, name, level]",
                ],
                filter: filters,
                page: parseInt(page, 10),
                pageSize: 7,
                order: `${sortField}:${sortDirection}`,
            }
        },
    },
};

export const useFetchDatasets = ({ level = 4, parent = "", page, name, sortField, sortDirection }) => {
    return useDataQuery(datasetQuery, {
        variables: { level, parent, page, name, sortField, sortDirection }
    });
};

const schoolQuery = {
    schools: {
        resource: "organisationUnits",
        params: ({ parent, page, name, sortField, sortDirection }) => {
            const filters = [
                `parent.id:like:${parent}`,
                `programs.id:eq:UxK2o06ScIe`
            ]

            if (name && name.trim() !== "") {
                filters.push(`name:ilike:${name}`)
            }

            return {
                fields: [
                    "id",
                    "name",
                ],
                filter: filters,
                page: parseInt(page, 10),
                pageSize: 7,
                order: `${sortField}:${sortDirection}`,
            }
        },
    },
};

export const useFetchSchools = ({ parent = "", page, name, sortField, sortDirection }) => {
    return useDataQuery(schoolQuery, {
        variables: { parent, page, name, sortField, sortDirection }
    });
};