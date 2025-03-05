import React, { useEffect, useState } from 'react';
import { DataTableToolbar, Tooltip, Pagination, CircularLoader, IconSearch24, InputField, DataTable, DataTableRow, DataTableColumnHeader, DataTableCell, TableBody, TableHead } from '@dhis2/ui';
import {NewInspection} from "../components/modals/NewInspection";
import {PreviousInspections} from "../components/modals/PreviousInspections";
import {AddSchoolModal} from "../components/modals/AddSchoolModal";
import {Error} from "../components/Error";
import {Loading} from "../components/Loading";
import {NewInspectionIcon} from "../components/icons/NewInspectionIcon";
import {PreviousInspectionIcon} from "../components/icons/PreviousInspectionIcon";
import {CreateInspectionIcon} from "../components/icons/CreateInspectionIcon";
import {SeeInspectionsIcon} from "../components/icons/SeeInspectionsIcon";
import {SchoolIcon} from "../components/icons/SchoolIcon";
import {EditInspection} from "../components/modals/EditInspection";
import {useFetchSchools} from "../data/ClusterQuery";
import { saveSchoolSearch, useDebouncedValue} from "../utils/Search";
import {CalendarIcon} from "../components/icons/CalendarIcon";
import {useInspectionByUser} from "../data/InspectionQuery";
import {PlainInspectionIcon} from "../components/icons/PlainInspectionIcon";
import {AddIcon} from "../components/icons/AddIcon";
import {fetchSchoolSearches} from "../utils/School";
import {getDate} from "../utils/Date";

export function Dashboard({ activeCluster, username }) {
    const [chosenSchool, setChosenSchool] = useState();
    const [inputFromSearchfield, setInputFromSearchfield] = useState('');
    const [sortBy, setSortBy] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [isFormVisible, setIsFormVisible] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [page, setPage] = useState(1);
    const [schools, setSchools] = useState([]);
    const [nextPageData, setNextPageData] = useState([]);
    const searchTerm = useDebouncedValue(inputFromSearchfield);
    const [recentSearches, setRecentSearches] = useState([]);
    const [topSearches, setTopSearches] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const {data: userInspections} = useInspectionByUser(username);
    const [inspections, setInspections] = useState([]);
    
    useEffect(() => {
        const loadSearches = async () => {
            try {
                const { topSearches, recentSearches } = await fetchSchoolSearches();
                setRecentSearches(recentSearches);
                setTopSearches(topSearches);
            } catch (error) {
                console.error("Error loading searches:", error);
            }
        };
        loadSearches();
    }, []);


    useEffect(() => {
        if (userInspections?.inspections) {
            setInspections(userInspections.inspections.instances);
        }
    }, [userInspections]);

    const fetchParams = {
        parent: activeCluster.id,
        name: inputFromSearchfield,
        sortField: sortBy,
        sortDirection,
    };

    const { loading, error, data, refetch } = useFetchSchools({
        ...fetchParams,
        page,
    });

    const { data: prefetchData, refetch: prefetchNextPage } = useFetchSchools({
        ...fetchParams,
        page: page + 1,
    });

    useEffect(() => {
        setPage(1);
        refetch({ page: 1, name: searchTerm, sortField:sortBy, sortDirection });
        setLoadingTable(true);
    }, [searchTerm, sortBy, sortDirection]);

    useEffect(() => {
        if (data?.schools?.organisationUnits) {
            setSchools(data.schools?.organisationUnits);
        }
        if(data?.schools?.pager) {
            setTotal(data?.schools?.pager?.total || 0);
            setTotalPages(data?.schools?.pager?.pageCount || 1);
        }
        setLoadingTable(false);
    }, [data]);

    useEffect(() => {
        if (prefetchData?.schools?.organisationUnits) {
            setNextPageData(prefetchData.schools?.organisationUnits);
        }
    }, [prefetchData]);

    const showForm = (key, school) => {
        saveSchoolSearch(searchTerm);
        setChosenSchool(school);
        setIsFormVisible(key);
    }

    const openEditForm = (inspection) => {
        setSelectedEvent(inspection);
        setChosenSchool({name: inspection.orgUnitName, id: inspection.orgUnitId});
        setIsFormVisible('edit');
    }

    const closeForm = () => {
        setIsFormVisible('');
    }

    const handlePageChange = (newPage) => {
        if (newPage === page + 1 && nextPageData) {
            setSchools(nextPageData);
            if (newPage + 1 <= totalPages) {
                prefetchNextPage({ page: newPage + 1 });
            }
        }
        setPage(newPage);
        refetch({ page: newPage });
    };

    const section = () => {
        if (schools.length > 0 && (!loading || !error)) {
            return null;
        }
        return(
            <TableBody>
                <DataTableRow>
                    <DataTableCell colSpan={3}>
                        {loading ? <Loading message={"Loading schools..."}/> : error ? <Error error={error}/> : null}
                        {schools.length === 0 && !error && !loading ? null : <p>No schools found.</p>}
                    </DataTableCell>
                </DataTableRow>
            </TableBody>
        )
    }

    return (
        <div className={"pageContainer"}>
            <h1>
                Assigned cluster: {activeCluster.name || 'Loading...'}
            </h1>
            <h2>
                Find a school
            </h2>
            <div
                style={{maxWidth: '800px'}}
                className="searchBar">
                <div className={"searchField"}>
                    <InputField type="search"
                                placeholder="Search for a school"
                                value={inputFromSearchfield}
                                onChange={({value}) => setInputFromSearchfield(value)}
                    />
                </div>
                <div className={"searchIcon"}>
                    <IconSearch24/>
                </div>
            </div>
            <div className={"recentSearch"}>
                <p>
                    Recent searches
                </p>
                <ul>
                    {recentSearches.map((search) => (
                        <li key={search.id + search.name} onClick={() => setInputFromSearchfield(search.name)}>
                            {search.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={"recentSearch"}>
                <p>
                    Popular searches
                </p>
                <ul>
                    {topSearches.map((search) => (
                        <li key={search.id + search.amount} onClick={() => setInputFromSearchfield(search.name)}>
                            {search.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="tableContainer">
                <DataTable>
                    <TableHead>
                        <DataTableRow>
                            <DataTableColumnHeader
                                name="name"
                                onSortIconClick={({name, direction}) => {
                                    setSortBy(name);
                                    setSortDirection(direction);
                                }}
                                sortDirection={sortBy === "name" ? sortDirection : "default"}>
                                <SchoolIcon size={20}/>
                                School
                            </DataTableColumnHeader>
                            <DataTableColumnHeader>
                                <NewInspectionIcon size={20}/>
                                New inspection
                            </DataTableColumnHeader>
                            <DataTableColumnHeader>
                                <PreviousInspectionIcon size={20}/>
                                Previous inspections
                            </DataTableColumnHeader>
                        </DataTableRow>
                    </TableHead>
                    {section()}
                    <TableBody>
                        {schools.map((school) => (
                            <DataTableRow key={school.id}>
                                <DataTableCell>
                                    {school.name}</DataTableCell>
                                <DataTableCell
                                    className={"iconCell"}>
                                    <div
                                        onClick={() => showForm('new', school)}
                                    >
                                        <AddIcon size={28}/>
                                    </div>
                                </DataTableCell>
                                <DataTableCell className={"iconCell"}>
                                    <div
                                        onClick={() => showForm('previous', school)}
                                    >
                                        <SeeInspectionsIcon size={28}/>
                                    </div>
                                </DataTableCell>
                            </DataTableRow>
                        ))}
                    </TableBody>
                </DataTable>
                <DataTableToolbar position="bottom">
                    {loadingTable && (
                        <div className="tableStatus"><CircularLoader extrasmall /> Loading schools... </div>
                    )}
                    <Pagination
                        hidePageSizeSelect
                        page={page}
                        pageSize={7}
                        pageCount={totalPages}
                        total={total}
                        onPageChange={handlePageChange}
                    />
                </DataTableToolbar>
            </div>
            <p className="tableUnderText">Cannot find the school? <span
                onClick={() => showForm('add')}>Create a new school.</span></p>

            <h2>
                Your latest school inspections
            </h2>
            <div className="tableContainer">
                <DataTable>
                    <TableHead>
                        <DataTableRow>
                            <DataTableColumnHeader>
                                <SchoolIcon size={20}/>
                                School
                            </DataTableColumnHeader>
                            <DataTableColumnHeader>
                                <PlainInspectionIcon size={20}/>
                                View and edit
                            </DataTableColumnHeader>
                            <DataTableColumnHeader>
                                <CalendarIcon size={20}/>
                                Updated
                            </DataTableColumnHeader>
                        </DataTableRow>
                    </TableHead>
                    <TableBody>
                        {inspections.map((inspection) => (
                            <DataTableRow key={inspection.id}>
                                <DataTableCell>
                                    {inspection.orgUnitName}</DataTableCell>
                                <DataTableCell
                                    className={"iconCell"}>
                                    <div
                                        onClick={() => openEditForm(inspection)}
                                    >
                                        <CreateInspectionIcon size={28}/>
                                    </div>
                                </DataTableCell>
                                <DataTableCell>
                                    <Tooltip content={inspection.updatedAt.split('T')[0]}>
                                        {getDate(inspection.updatedAt)}
                                    </Tooltip>
                                </DataTableCell>
                            </DataTableRow>
                        ))}
                    </TableBody>
                </DataTable>
            </div>
            {isFormVisible === 'new' && <NewInspection onClose={closeForm} child={chosenSchool} username={username}/>}
            {isFormVisible === 'previous' &&
                <PreviousInspections onClose={closeForm} child={chosenSchool} showEdit={() => showForm('edit')}
                                     selectEvent={setSelectedEvent}/>}
            {isFormVisible === 'add' && <AddSchoolModal onClose={closeForm} currentCluster={activeCluster}/>}
            {isFormVisible === 'edit' &&
                <EditInspection onClose={closeForm} inspection={selectedEvent} title={chosenSchool}
                                username={username}/>}
        </div>
    );
}
