import Dexie from "dexie";

const db = new Dexie("Database");
db.version(1).stores({
    inspections: "++id, orgUnit, orgUnitName, username, eventDate, formValues",
    offlineSchools: '++id, name, clusterId, coordinates, image',
    clusterSearches: '++id, name, amount, timestamp',
    schoolSearches: '++id, name, amount, timestamp',
});

export default db;