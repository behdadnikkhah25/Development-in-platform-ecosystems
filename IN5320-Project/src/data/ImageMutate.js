import { useDataMutation } from "@dhis2/app-runtime";

const imageMutation = {
    resource: "fileResources",
    type: "create",
    params: { domain: "ORG_UNIT" },
    data: ({ image }) => ({ file: image }),
};

export const useImageManagement = () => {
    const [mutateImage, { loading, error }] = useDataMutation(imageMutation);

    const uploadImage = async (image) => {
        try {
            const response = await mutateImage({ image });
            return response.response?.fileResource?.id;
        } catch (err) {
            throw new Error("Image upload failed");
        }
    };

    return { uploadImage, loading, error };
};
