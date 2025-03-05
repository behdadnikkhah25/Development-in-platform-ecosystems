import { useDataQuery } from '@dhis2/app-runtime';
import { Tooltip, DataTableToolbar, Pagination, DataTable, TableBody, DataTableCell, DataTableColumnHeader, TableHead, DataTableRow, TableRowHead } from '@dhis2/ui';
import {Card} from "../Card";
import {getDate} from "../../utils/Date";
import {capitalizeFirstLetter, getCondition, statusIcon} from "../../utils/PreviousInspections";
import {ToiletIcon} from "../icons/ToiletIcon";
import {PlaygroundIcon} from "../icons/PlaygroundIcon";
import {CleanClassroomIcon} from "../icons/CleanClassroomIcon";
import {HandwashingIcon} from "../icons/HandwashingIcon";
import {LibraryIcon} from "../icons/LibraryIcon";
import {ElectricalSupplyIcon} from "../icons/ElectricalSupplyIcon";
import {ComputerLabIcon} from "../icons/ComputerLabIcon";
import {StatusIcon} from "../icons/StatusIcon";
import {CalendarIcon} from "../icons/CalendarIcon";
import {UserIcon} from "../icons/UserIcon";
import {ActiveStatusIcon} from "../icons/ActiveStatusIcon";
import {CancelledStatusIcon} from "../icons/CancelledStatusIcon";
import {processedInspections, getRatio} from "../../utils/DataElements";
import {programQuery} from "../../data/EventsQuery";
import {Loading} from "../Loading";
import {Error} from "../Error";
import {useState} from "react";

export function PreviousInspections({onClose, child, showEdit, selectEvent}) {
    const orgUnit = child.id;
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const { loading, error, data } = useDataQuery(programQuery, {
        variables: { orgUnit: orgUnit },
    });

    const students = data?.students?.instances || [];
    const staff = data?.staff?.instances || [];
    const inspectionsRaw = data?.inspections?.instances || [];

    if (inspectionsRaw.length === 0) {
        return (
            <Card title={`School inspections for ${child.name}`} onClose={onClose}>
                <div style={{padding: '1rem'}}>
                    No inspections found for this school
                </div>
            </Card>
        )
    }

    const inspections = processedInspections(inspectionsRaw);

    const section = () => {
        if (inspectionsRaw.length > 0 && (!loading || !error)) {
            return null;
        }
        return(
            <TableBody>
                <DataTableRow>
                    <DataTableCell colSpan={'10'}>
                        {loading ? <Loading message={"Loading inspections..."}/> : error ? <Error error={error}/> : null}
                        {inspectionsRaw.length === 0 && !error && !loading ? <p>No inspections found.</p> : null}
                    </DataTableCell>
                </DataTableRow>
            </TableBody>
        )
    }

    const openEditInspection = (event) => {
        selectEvent(event);
        showEdit();
    }

    return (
        <Card title={`School inspections for ${child.name}`} onClose={onClose} dynamic>
            <div
                className="dashboardTableLabel">
                <label>
                    Click on an inspection with status <ActiveStatusIcon size={20}/> <b>Active</b> or <CancelledStatusIcon size={20}/> <b>Cancelled</b> to view and change the inspection.
                </label>
            </div>
            <div className="inspectionTable">
                <DataTable>
                    <TableHead>
                        <TableRowHead>
                            <DataTableColumnHeader>
                                <CalendarIcon size={20}/>
                                <p className="">Updated</p>
                            </DataTableColumnHeader>
                            <DataTableColumnHeader>
                                <StatusIcon size={20}/>
                                <p className="">Status</p>
                            </DataTableColumnHeader>
                            <DataTableColumnHeader className="screen-field">
                                <ComputerLabIcon size={20}/>
                                <p className="tableHeadText">Computer lab</p>
                            </DataTableColumnHeader>
                            <DataTableColumnHeader className="screen-field">
                                <ElectricalSupplyIcon size={20}/>
                                <p className="tableHeadText">Electrical supply</p>
                            </DataTableColumnHeader>
                            <DataTableColumnHeader className="screen-field">
                                <HandwashingIcon size={20}/>
                                <p className="tableHeadText">Handwashing</p>
                            </DataTableColumnHeader>
                            <DataTableColumnHeader className="screen-field">
                                <LibraryIcon size={20}/>
                                <p className="tableHeadText">Library</p>
                            </DataTableColumnHeader>
                            <DataTableColumnHeader className="screen-field">
                                <PlaygroundIcon size={20}/>
                                <p className="tableHeadText">Playground</p>
                            </DataTableColumnHeader>
                            <DataTableColumnHeader className="screen-field">
                                <CleanClassroomIcon size={20}/>
                                <p className="tableHeadText">Clean classrooms</p>
                            </DataTableColumnHeader>
                            <DataTableColumnHeader className="screen-field">
                                <ToiletIcon size={20}/>
                                <p className="tableHeadText">Toilets</p>
                            </DataTableColumnHeader>
                            <DataTableColumnHeader>
                                <UserIcon size={20}/>
                                <p className="">User</p>
                            </DataTableColumnHeader>
                        </TableRowHead>
                    </TableHead>
                    {section()}
                    <TableBody>
                        {inspections.map(inspection => (
                            <DataTableRow key={inspection.event}>
                                <DataTableCell>
                                    <Tooltip content={inspection.updatedAt.split('T')[0]}>
                                        {getDate(inspection.updatedAt)}
                                    </Tooltip>
                                </DataTableCell>
                                <DataTableCell
                                >
                                    <div
                                        style={{cursor: inspection.status.toLowerCase() === 'completed' ? 'default' : 'pointer'}}
                                        onClick={() => {
                                        if (inspection.status.toLowerCase() === 'active' || 'skipped') {
                                            openEditInspection(inspection);
                                        }
                                    }}>
                                    <Tooltip
                                        openDelay={500} closeDelay={50}
                                        content={inspection.status === 'SKIPPED' ? 'Cancelled' : capitalizeFirstLetter(inspection.status)}>
                                        <p className="iconInTable">{statusIcon(inspection.status === 'SKIPPED' ? 'cancelled' : inspection.status.toLowerCase())}</p>
                                    </Tooltip>
                                    </div>
                                </DataTableCell>
                                <DataTableCell className="screen-field">
                                    {getCondition(
                                        inspection.dataValueMap.computerLabCondition,
                                        inspection.dataValueMap.computerLab
                                    )}
                                </DataTableCell>
                                <DataTableCell className="screen-field">
                                    {getCondition(
                                    inspection.dataValueMap.electricSupplyCondition,
                                    inspection.dataValueMap.electricSupply
                                )}
                                </DataTableCell>
                                <DataTableCell className="screen-field"
                                >
                                    {getCondition(
                                        inspection.dataValueMap.handwashingCondition,
                                        inspection.dataValueMap.handwashing
                                    )}
                                </DataTableCell>
                                <DataTableCell className="screen-field"
                                >
                                    {getCondition(
                                        inspection.dataValueMap.libraryCondition,
                                        inspection.dataValueMap.library
                                    )}
                                </DataTableCell>
                                <DataTableCell className="screen-field"
                                >
                                    {getCondition(
                                        inspection.dataValueMap.playgroundCondition,
                                        inspection.dataValueMap.playground
                                    )}
                                </DataTableCell>
                                <DataTableCell className="screen-field"
                                       style={{
                                           color: `${inspection.dataValueMap.classrooms && getRatio(students.length, inspection.dataValueMap.classrooms) <= 53 ? 'green' : 'red'}`,
                                       }}
                                >
                                    <Tooltip
                                        openDelay={500} closeDelay={50}
                                        content={`Current ratio: ${inspection.dataValueMap.classrooms ? `${getRatio(students.length, inspection.dataValueMap.classrooms)}:${students.length === 0 ? '0' : '1'}` : 'none'
                                        }`}
                                    >
                                    {inspection.dataValueMap.cleanClassrooms || 0}
                                    <span style={{ margin: '2px' }}>/</span>
                                    {inspection.dataValueMap.classrooms || 0}
                                    </Tooltip>
                                </DataTableCell>
                                <DataTableCell
                                    className="screen-field"
                                    style={{
                                        color: `${inspection.dataValueMap.toilets && getRatio(students.length, inspection.dataValueMap.toilets) <= 25 ? 'green' : 'red'}`,
                                    }}
                                >
                                    <Tooltip
                                        openDelay={500} closeDelay={50}
                                        content={`Current ratio: ${inspection.dataValueMap.toilets ? `${getRatio(students.length, inspection.dataValueMap.toilets)}:${students.length === 0 ? '0' : '1'}` : 'none'
                                        }`}
                                    >
                                        {inspection.dataValueMap.toilets || 0}
                                    </Tooltip>
                                </DataTableCell>
                                <DataTableCell>{inspection.updatedBy.username}</DataTableCell>
                            </DataTableRow>
                        ))}
                    </TableBody>
                </DataTable>
                <DataTableToolbar position="bottom">
                    <Pagination
                        hidePageSizeSelect
                        page={currentPage}
                        pageSize={pageSize}
                        pageCount={Math.ceil(inspections.length / pageSize)}
                        total={inspections.length}
                        onPageChange={setCurrentPage}
                    />
                </DataTableToolbar>
            </div>
        </Card>
    )
}