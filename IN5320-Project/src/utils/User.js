export const areUserDataEqual = (user1, user2) => {
    return (
        user1.username === user2.username &&
        user1.firstName === user2.firstName &&
        user1.surname === user2.surname &&
        user1.email === user2.email &&
        user1.avatar?.id === user2.avatar?.id
    );
};

export const resetUserState = (data) => {
    return {
        username: data?.username || "",
        firstName: data?.firstName || "",
        surname: data?.surname || "",
        avatar: data?.avatar || { id: "" },
        email: data?.email || "",
    };
};