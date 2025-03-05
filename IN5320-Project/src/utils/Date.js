export const getDate = (date) => {
    const now = new Date();
    const inputDate = new Date(date);

    if (isNaN(inputDate.getTime())) {
        return "Invalid date";
    }

    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inputMidnight = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());

    const diffTime = inputMidnight - nowMidnight;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today';
    }

    if (diffDays < 0 && Math.abs(diffDays) <= 7) {
        return `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} ago`;
    }

    if (diffDays > 0 && diffDays <= 7) {
        return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }

    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return inputDate.toLocaleDateString('en-GB', options).replace(/ /g, '. ');
};
