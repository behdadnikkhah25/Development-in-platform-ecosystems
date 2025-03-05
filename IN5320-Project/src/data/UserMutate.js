import { useDataMutation } from "@dhis2/app-runtime";

const userMutation = {
    resource: "me",
    type: "update",
    data: ({ firstName, surname, avatar }) => ({
        firstName,
        surname,
        avatar,
    }),
};

export const useUpdateUser = () => useDataMutation(userMutation);
