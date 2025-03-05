import db from "../offline/Db";

export const addChildrenCount = (organisationUnits) => {
    return organisationUnits.map((unit) => ({
        ...unit,
        childrenCount: unit.children?.length || 0,
    }));
};

export const fetchSearches = async () => {
    try {
        const topSearches = await db.clusterSearches
            .orderBy("amount")
            .reverse()
            .limit(5)
            .toArray();

        const recentSearches = await db.clusterSearches
            .orderBy("timestamp")
            .reverse()
            .limit(5)
            .toArray();

        return { topSearches, recentSearches };
    } catch (error) {
        return { topSearches: [], recentSearches: [] };
    }
};


