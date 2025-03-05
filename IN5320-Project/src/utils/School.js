import db from "../offline/Db";

export const handleSchoolSubmission = async ({
                                                 schoolName,
                                                 coordinates,
                                                 cluster,
                                                 image,
                                                 createSchool,
                                                 uploadImage,
                                                 updateSchoolImage,
                                                 associateSchoolToProgram,
                                             }) => {
    try {
        const coordinatesString = coordinates.join(" ");

        const schoolId = await createSchool({
            name: schoolName,
            cluster,
            coordinates: coordinatesString,
        });

        if(image) {
            const imageId = await uploadImage(image);

            await updateSchoolImage(schoolId, imageId);
        }

        await associateSchoolToProgram(schoolId);
    } catch (error) {
        console.error("Error during school submission:", error);
        throw error;
    }
};

export const handleCoordinateChange = (e, type, setCoordinates) => {
    const value = parseFloat(e.value).toFixed(6);
    setCoordinates(type === 'lat' ? prev => [value, prev[1]] : prev => [prev[0], value]);
};

export const fetchSchoolSearches = async () => {
    try {
        const topSearches = await db.schoolSearches
            .orderBy("amount")
            .reverse()
            .limit(5)
            .toArray();

        const recentSearches = await db.schoolSearches
            .orderBy("timestamp")
            .reverse()
            .limit(5)
            .toArray();

        return { topSearches, recentSearches };
    } catch (error) {
        return { topSearches: [], recentSearches: [] };
    }
};
