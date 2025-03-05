import { useAlert } from "@dhis2/app-runtime";
import { useImageManagement } from "../data/ImageMutate";

export const useProfileManagement = () => {
    const { uploadImage, loading, error } = useImageManagement();
    const {show} = useAlert(({message}) => `${message}`, ({type}) => ({success: type === 'success', warning: type === 'error'}));

    const updateProfile = async (profilePicture, setUser, onUpdateUser) => {
        try {
            let imageId = null;
            try {
                if (profilePicture !== null) {
                    imageId = await uploadImage(profilePicture);
                }
            } catch (uploadError) {
                console.error("Error uploading profile picture:", uploadError);
                show({message: "Error uploading profile picture", type: "critical", duration:1500});
                return;
            }

            Promise.resolve().then(() => {
                setUser((prevState) => {
                    if (!prevState) {
                        show({message: "Error updating profile", type: "critical", duration:1500});
                        return prevState; 
                    }
    
                    const { firstName, surname } = prevState;
                    const firstNameError = validateName(firstName);
                    const lastNameError = validateName(surname);
    
                    if (firstNameError || lastNameError) {
                        show({message: "Error: " + firstNameError + lastNameError, type: "critical", duration:1500});
                        return prevState; 
                    }
    
                    const updatedUserData = {
                        ...prevState,
                        avatar: { id: imageId || prevState.avatar.id },
                    };
    
                    try {
                        onUpdateUser(updatedUserData);
                    } catch (updateError) {
                        show({message: "Error updating profile", type: "critical", duration:1500});
                        return prevState;
                    }
    
                    show({message: "Profile updated", type: "success", duration:1500});
                    return updatedUserData;
                });
            }).catch((setUserError) => {
                show({message: "Profile updated", type: "success", duration:1500});
            });
    
        } catch (error) {
            show({message: "Error updating profile", type: "error", duration:1500});
        }
    };
    
    return { updateProfile, loading, error };
};

export const validateName = (name) => {
    if (!name) {
        return "Name is required!";
    } else if (name.length < 2) {
        return "Name must be at least 2 characters long!";
    } else if (name.length > 20) {
        return "Name must not exceed 20 characters!";
    }
    return null;
};