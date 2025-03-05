import classes from './Profile.module.css';
import React, {useState} from "react";
import { UserAvatar, Tooltip, InputField, Button, IconCopy24, IconUndo24, IconCheckmark24 } from "@dhis2/ui";
import {FileInput} from "../components/input/FileInput";
import {handleUploadImage} from "../utils/Image";
import {useProfileManagement} from "../utils/Profile";

export function Profile({ user, setUser, onUpdateUser, removeChanges }) {
    const [profilePicture, setProfilePicture] = useState(null);
    const { updateProfile } = useProfileManagement();

    const [errorFirst, setErrorFirst] = useState();
    const [errorLast, setErrorLast] = useState();

    const undoChanges = () => {
        removeChanges();
        setProfilePicture(null);
    }

    const validateName = (value) => {
        if (!value) {
            return 'Name is required!';
        } else if (value.length < 2) {
            return 'Name must be at least 2 characters';
        }
        else if (value.length > 20) {
            return 'Max length is 20 characters!';
        }
        else {
            return null;
        }
    };

    const inputHandler = (key, value) => {
        const errorMsg = validateName(value);
        if (key === 'firstName') {
            setErrorFirst(errorMsg);
        }       
        else {
            setErrorLast(errorMsg);
        }

        setUser({ ...user, [key]: value }); 
    };

    return (
        <div className="pageContainer">
            <h1>Your profile</h1>

            <div className={classes.profileBackground}>

            </div>
            <div className={classes.header}>
                <div className={classes.icon}>
                    {profilePicture ? <img
                            className={classes.avatar}
                            src={URL.createObjectURL(profilePicture)} alt="Profile picture"/>
                        :
                        <UserAvatar name={user.firstName + ' ' + user.surname}
                                    className={classes.avatar} avatarId={user.avatar?.id || ""}/>}
                </div>
                <div className={classes.buttons}>
                    <Button
                        icon={<IconUndo24/>}
                        destructive secondary
                        onClick={undoChanges}
                    >
                        Undo changes
                    </Button>
                    <Button
                        icon={<IconCheckmark24/>}
                        primary onClick={() => updateProfile(profilePicture, setUser, onUpdateUser)}>
                        Save changes
                    </Button>
                </div>
            </div>
            <form>
                <div className={classes.field}>
                    <div className={classes.label}>
                        <label
                            htmlFor="username">
                            Username
                        </label>
                        <div className={classes.labelDescription}><p>
                            Share to let others find you.
                        </p>
                        </div>
                    </div>
                    <div className={classes.inputSection}>
                        <div
                            id="username"
                            className={classes.username}>
                            <div className={classes.usernamePrefix}>
                                @
                            </div>
                            <div>
                                {user.username}
                            </div>
                            <div className={classes.copyUsername}>
                                <span>
                                <Tooltip content="Copy username">
                                    <IconCopy24/>
                                </Tooltip>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.field}>
                    <div className={classes.label}>
                        <label
                            htmlFor="firstName">
                            First name*
                        </label>
                        <div className={classes.labelDescription}><p>
                            <i>Required</i>
                        </p>
                        </div>
                    </div>
                    <div className={classes.inputSection}>
                        <InputField
                            className={classes.inputField}
                            type='text' 
                            value={user.firstName}
                            name='firstName'
                            required
                            helpText={errorFirst}
                            onChange={({name, value}) => inputHandler(name, value)}
                        />
                    </div>
                </div>
                <div className={classes.field}>
                    <div className={classes.label}>
                        <label htmlFor="surname">
                            Last name*
                        </label>
                        <div className={classes.labelDescription}><p>
                            <i>Required</i>
                        </p>
                        </div>
                    </div>
                    <div className={classes.inputSection}>
                        <div className={classes.inputSection}>
                            <InputField
                                name={"surname"}
                                className={classes.inputField}
                                type={"text"} 
                                value={user.surname}
                                helpText={errorLast}
                                onChange={(e) => inputHandler('surname', e.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className={classes.field}>
                    <div className={classes.label}>
                        <label>
                            Profile picture
                        </label>
                        <div className={classes.labelDescription}>
                            <p>
                                Upload a new picture.
                                Accepted file formats are: .jpeg, .png and .webp.
                            </p>
                        </div>
                    </div>
                    <div className={classes.inputSection} style={{paddingTop: '5px', paddingBottom: '5px'}}>
                        <FileInput
                            accept={".jpg, .jpeg, .png, .webp"}
                            onChange={(e) => handleUploadImage(e, setProfilePicture)}
                            selectedFile={profilePicture}
                        />
                    </div>
                </div>
            </form>
</div>
)
    ;
}