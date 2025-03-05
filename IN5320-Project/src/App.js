import React, { useEffect, useState } from "react";
import "./styles.css";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./pages/Dashboard";
import { ChangeCluster } from "./pages/ChangeCluster";
import { Profile } from "./pages/Profile";
import { AddSchool } from "./pages/AddSchool";
import { useUpdateUser } from "./data/UserMutate";
import { areUserDataEqual, resetUserState } from "./utils/User";
import { SyncManager } from './offline/SyncManager';
import {Loading} from "./components/Loading";
import {Error} from "./components/Error";
import {ConfirmModal} from "./components/modals/ConfirmModal";
import {useAlert, useDataQuery} from "@dhis2/app-runtime";

const query = {
    user: {
        resource: "me",
        fields: ["displayName", "username", "firstName", "surname", "created", "avatar", "email"],
    }
}
function MyApp() {
    const [activePage, setActivePage] = useState("Dashboard");
    const [activeCluster, setActiveCluster] = useState({name: 'AA Jambalaya Cluster (Kanifing)', id: "jsMCjWAivIc"});
    const [updateUser] = useUpdateUser();
    const { data, loading, error, refetch } = useDataQuery(query);
    const [newUserData, setNewUserData] = useState(resetUserState(null));
    const [showModal, setShowModal] = useState(false);
    const [requestedPage, setRequestedPage] = useState("Dashboard");
    const {show} = useAlert(({message}) => `${message}`, ({type}) => ({success: type === 'success', warning: type === 'error'}));

    useEffect(() => {
        if (data) {
            setNewUserData(resetUserState(data.user));
        }
    }, [data]);

    const handleUserUpdate = async (newUserData) => {
        try {
            await updateUser({
                firstName: newUserData.firstName,
                surname: newUserData.surname,
                avatar: newUserData.avatar,
            });
            await refetch();
        } catch (updateError) {
            show({message: 'Failed to update user', type: 'critical'});
        }
    };

    const undoChanges = () => {
        setNewUserData(resetUserState(data.user));
    };

    const activePageHandler = (page) => {
        if (
            activePage === "Profile" &&
            page !== "Profile" &&
            !areUserDataEqual(newUserData, resetUserState(data.user))
        ) {
            setRequestedPage(page);
            setShowModal(true);
            return;
        }
        setActivePage(page);
    };

    const activeClusterHandler = (cluster) => {
        setActiveCluster({name:cluster.name, id:cluster.id});
    };

    if (loading){
        return (
            <Loading message={"Loading components..."} />
        );
    }

    if (error){
        return (
            <Error message={'Something went wrong when loading components. ' +
                'Please check your internet connection, and refresh to try again. ' +
                'If the problem persists, please contact an adminstrator.'}/>
        );
    }

    return (
        <div className={"app"}>
            <div className={"navigation"}>
                <Navigation activePage={activePage} activePageHandler={activePageHandler} />
            </div>
            <div className={"application"}>
                {activePage === "Profile" && (
                    <Profile
                        user={newUserData}
                        setUser={setNewUserData}
                        removeChanges={undoChanges}
                        onUpdateUser={handleUserUpdate}
                    />
                )}
                {activePage === "Dashboard" && (
                    <Dashboard
                        username={data.user?.username}
                        activeCluster={activeCluster}
                        activeClusterHandler={activeClusterHandler} />
                )}
                {activePage === "ChangeCluster" && (
                    <ChangeCluster
                        activeCluster={activeCluster}
                        activeClusterHandler={activeClusterHandler}
                        activePageHandler={activePageHandler}
                    />
                )}
                {activePage === "AddSchool" && <AddSchool
                        currentCluster={activeCluster}
                        goChangeCluster={() => activePageHandler("ChangeCluster")}
                />}
                {typeof navigator !== "undefined" && <SyncManager />}
            </div>
            {showModal && (
                <ConfirmModal
                    title={"Unsaved changes"}
                    message={"You have unsaved changes. Are you sure you want to leave?"}
                    onConfirm={() => {
                        setActivePage(requestedPage);
                        setShowModal(false);
                        setNewUserData(resetUserState(data.user));
                    }}
                    onCancel={() => {
                        setRequestedPage("");
                        setShowModal(false)
                    }}

                    onClose={() => {
                        setShowModal(false)
                        setRequestedPage("");
                    }
                }
                />
            )}
        </div>
    );
}

export default MyApp;