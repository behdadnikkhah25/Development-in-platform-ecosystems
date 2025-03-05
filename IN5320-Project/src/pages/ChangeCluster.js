import React, { useEffect, useState } from "react";
import {
    DataTable,
    TableBody,
    DataTableCell,
    DataTableColumnHeader,
    TableHead,
    DataTableRow,
    TableRowHead,
    InputField,
    Button,
    IconSearch24,
    Pagination,
    DataTableToolbar,
    CircularLoader
} from "@dhis2/ui";
import { useAlert } from "@dhis2/app-runtime";
import {useFetchDatasets} from "../data/ClusterQuery";
import {
    addChildrenCount,
    fetchSearches,
} from "../utils/Clusters";
import { ConfirmModal } from "../components/modals/ConfirmModal";
import { Error } from "../components/Error";
import { Loading } from "../components/Loading";
import {ClusterIcon} from "../components/icons/ClusterIcon";
import {ParentIcon} from "../components/icons/ParentIcon";
import {SchoolIcon} from "../components/icons/SchoolIcon";
import {SwapIcon} from "../components/icons/SwapIcon";
import {saveClusterSearch, useDebouncedValue} from "../utils/Search";


export function ChangeCluster({ activeClusterHandler, activePageHandler }) {
    const [isCardVisible, setIsCardVisible] = useState(false);
    const [chosenCluster, setChosenCluster] = useState(null);
    const [sortBy, setSortBy] = useState("");
    const [sortDirection, setSortDirection] = useState("default");
    const [inputFromSearchfield, setInputFromSearchfield] = useState("");
    const [page, setPage] = useState(1);
    const [recentSearches, setRecentSearches] = useState([]);
    const [topSearches, setTopSearches] = useState([]);
    const [organisationUnits, setOrganisationUnits] = useState([]);
    const [nextPageData, setNextPageData] = useState(null);
    const searchTerm = useDebouncedValue(inputFromSearchfield);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingTable, setLoadingTable] = useState(false);

    const { show } = useAlert(({ message }) => `${message}`, ({ type }) => ({
        success: type === "success",
        warning: type === "error",
    }));

    const fetchParams = {
        level: 4,
        parent: "Kanifing",
        name: searchTerm,
        sortField: sortBy,
        sortDirection,
    };

    const { loading, error, data, refetch } = useFetchDatasets({
        ...fetchParams,
        page,
    });

    const { data: prefetchData, refetch: prefetchNextPage } = useFetchDatasets({
        ...fetchParams,
        page: page + 1,
    });

    useEffect(() => {
        setPage(1);
        refetch({ page: 1, name: searchTerm, sortField:sortBy, sortDirection });
        setLoadingTable(true)
    }, [searchTerm, sortBy, sortDirection]);

    useEffect(() => {
        if (data?.orgUnits?.organisationUnits) {
            setOrganisationUnits(addChildrenCount(data.orgUnits.organisationUnits));
        }
        if(data?.orgUnits?.pager) {
            setTotal(data.orgUnits.pager.total);
            setTotalPages(data.orgUnits.pager.pageCount);
        }
        setLoadingTable(false);
    }, [data]);

    useEffect(() => {
        if (prefetchData?.orgUnits?.organisationUnits) {
            setNextPageData(addChildrenCount(prefetchData.orgUnits.organisationUnits));
        }
    }, [prefetchData]);

    const selectCluster = (cluster) => {
        setChosenCluster(cluster);
        show({ message: `Cluster ${cluster.name} selected` });
        saveClusterSearch(searchTerm);
    };

    const openChangeCard = () => {
        if (!chosenCluster) {
            show({ message: "Select a cluster first", type: "warning" });
        } else {
            setIsCardVisible(true);
        }
    };

    const onClickHandleStateChange = async () => {
        if (chosenCluster) {
            activeClusterHandler(chosenCluster);
            activePageHandler("Dashboard");
        }
    };

    useEffect(() => {
        const loadSearches = async () => {
            try {
                const { topSearches, recentSearches } = await fetchSearches();
                setRecentSearches(recentSearches);
                setTopSearches(topSearches);
            } catch (error) {
                console.error("Error loading searches:", error);
            }
        };
        loadSearches();
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage === page + 1 && nextPageData) {
            setOrganisationUnits(nextPageData);
            if (newPage + 1 <= totalPages) {
                prefetchNextPage({ page: newPage + 1 });
            }
        }
        setPage(newPage);
        refetch({ page: newPage });
    };

    const section = () => {
        if (organisationUnits.length > 0 && (!loading || !error)) {
            return null;
        }
        return(
            <TableBody>
                <DataTableRow>
                    <DataTableCell colSpan={3}>
                        {loading ? <Loading message={"Loading clusters..."}/> : error ? <Error error={error}/> : null}
                        {organisationUnits.length === 0 && !error && !loading ? null : <p>No clusters found.</p>}
                    </DataTableCell>
                </DataTableRow>
            </TableBody>
        )
    }

    return (
        <div className="pageContainer">
            <h1>School clusters</h1>
            <div
                style={{maxWidth: '800px'}}
                className="searchBar">
                <div className={"searchField"}>
                    <InputField type="search"
                                placeholder="Search for a cluster"
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
                        <li key={search.id} onClick={() => setInputFromSearchfield(search.name)}>
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
                        <li key={search.id} onClick={() => setInputFromSearchfield(search.name)}>
                            {search.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div
                className="tableLabel">
                <label>
                    Click to select a cluster. <br/>
                    Currently selected: <b>{chosenCluster ? chosenCluster.name : "None"}</b>
                </label>
                <Button primary
                        onClick={openChangeCard}
                        icon={
                            <SwapIcon size={24}/>}
                >Change cluster</Button>
            </div>
            <div className="tableContainer">
                <DataTable>
                    <TableHead>
                        <TableRowHead>
                            <DataTableColumnHeader
                                name="name"
                                onSortIconClick={({name, direction}) => {
                                    setSortBy(name);
                                    setSortDirection(direction);
                                }}
                                sortDirection={sortBy === "name" ? sortDirection : "default"}
                            >
                                <ClusterIcon size={20}/>
                                Cluster
                            </DataTableColumnHeader>
                            <DataTableColumnHeader>
                                <ParentIcon size={20}/>
                                Parent
                            </DataTableColumnHeader>
                            <DataTableColumnHeader
                                name="amount"
                            >
                                <SchoolIcon size={20}/>
                                Schools
                            </DataTableColumnHeader>
                        </TableRowHead>
                    </TableHead>
                    {section()}
                    <TableBody>
                        {organisationUnits.map((cluster) => (
                            <DataTableRow
                                key={cluster.id} onClick={() => selectCluster(cluster)}>
                                <DataTableCell>{cluster.name}</DataTableCell>
                                <DataTableCell>{cluster.parent?.name}</DataTableCell>
                                <DataTableCell
                                    align="center"
                                >{cluster.childrenCount}</DataTableCell>
                            </DataTableRow>
                        ))}
                    </TableBody>
                </DataTable>
                <DataTableToolbar position="bottom">
                    {loadingTable && (
                        <div className="tableStatus"><CircularLoader extrasmall /> Loading clusters... </div>
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
            {isCardVisible && chosenCluster &&
                <ConfirmModal onClose={() => setIsCardVisible(false)} onConfirm={onClickHandleStateChange}
                              title={`Change your assigned cluster to ${chosenCluster.name}`}/>}
        </div>

    );
}