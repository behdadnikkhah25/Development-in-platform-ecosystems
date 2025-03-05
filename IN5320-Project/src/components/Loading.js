import {CircularLoader} from '@dhis2/ui';

export const Loading = ({message}) => {
    return (
        <div className="loading">
            <h1>
                {message}
            </h1>
            <CircularLoader />
        </div>
    );
}