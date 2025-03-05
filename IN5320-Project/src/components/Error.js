import CircularLoader from '@dhis2/ui';

export const Error = ({message}) => {
    return (
        <div className="error">
            <h1>
                {message}
            </h1>
        </div>
    );
}