import db from "../offline/Db";
import { useEffect, useState } from 'react';

export const saveClusterSearch = async (searchName) => {
    try {
        const existingSearch = await db.clusterSearches.get({ name: searchName });

        if (existingSearch) {
            await db.clusterSearches.update(existingSearch.id, {
                amount: existingSearch.amount + 1,
                timestamp: new Date().toISOString(),
            });
        } else {
            await db.clusterSearches.add({
                name: searchName,
                amount: 1,
                timestamp: new Date().toISOString(),
            });

            const totalCount = await db.clusterSearches.count();
            if (totalCount > 50) {
                const oldestEntries = await db.clusterSearches
                    .orderBy("timestamp")
                    .limit(totalCount - 50)
                    .toArray();
                const oldestIds = oldestEntries.map((entry) => entry.id);
                await db.clusterSearches.bulkDelete(oldestIds);
            }
        }
        console.log(`Search "${searchName}" saved or updated in clusterSearches.`);
    } catch (error) {
        console.error("Error saving search to clusterSearches in Dexie:", error);
    }
};

export const saveSchoolSearch = async (searchName) => {
    try {
        const existingSearch = await db.schoolSearches.get({ name: searchName });

        if (existingSearch) {
            await db.schoolSearches.update(existingSearch.id, {
                amount: existingSearch.amount + 1,
                timestamp: new Date().toISOString(),
            });
        } else {
            await db.schoolSearches.add({
                name: searchName,
                amount: 1,
                timestamp: new Date().toISOString(),
            });

            const totalCount = await db.schoolSearches.count();
            if (totalCount > 50) {
                const oldestEntries = await db.schoolSearches
                    .orderBy("timestamp")
                    .limit(totalCount - 50)
                    .toArray();
                const oldestIds = oldestEntries.map((entry) => entry.id);
                await db.schoolSearches.bulkDelete(oldestIds);
            }
        }
        console.log(`Search "${searchName}" saved or updated in schoolSearches.`);
    } catch (error) {
        console.error("Error saving search to schoolSearches in Dexie:", error);
    }
}

export function useDebouncedValue(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);

        return () => clearTimeout(handler); // Cleanup timeout
    }, [value, delay]);

    return debouncedValue;
}
