"use strict";

const API_URL = "https://randomuser.me/api/?results=100";
const INJECTION_POINT = "#random_user_table";
const TABLE_HEADERS = ["First Name", "Last Name", "Country", "Date of Birth", "Birthday"];
const SORT_DIRECTION = {
    asc: "asc",
    desc: "desc"
};

/**
 * Toggles the sorting direction between ascending and descending.
 */
const flipSortDirection = (sortDirection) => {
    return sortDirection === SORT_DIRECTION.asc ? SORT_DIRECTION.desc : SORT_DIRECTION.asc;
}

/**
 * Given a header index, determine if an up or down carat should display to
 * indicate sort order.
 */
const getSortIconClass = (index, selectedHeaderIndex, sortDirection) => {
    if (selectedHeaderIndex === index) {
        if (sortDirection === SORT_DIRECTION.desc) {
            return "bi bi-caret-up-fill"
        } else if (sortDirection === SORT_DIRECTION.asc) {
            return "bi bi-caret-down-fill"
        }
    }
    return ""
}

/**
 * Given a string representing a date of birth, determine the appropriate
 * status to display in the table's Birthday column.
 */
const computeBirthdayStatus = (dob) => {
    if (!dob || !Date.parse(dob)) {
        return ""; 
    }

    const today  = new Date();
    const dateOfBirth = new Date(dob);
    const thisMonth = today.getMonth();
    const thisDate = today.getDate();
    const birthMonth = dateOfBirth.getMonth();
    const birthDate = dateOfBirth.getDate();

    let birthdayStatus = "Today!";
    if (birthMonth == thisMonth) {
        if (birthDate < thisDate) {
            birthdayStatus = "Passed";
        } else if (birthDate > thisDate) {
            birthdayStatus = "Upcoming";
        }
    } else if (birthMonth < thisMonth) {
        birthdayStatus = "Passed";
    } else if (birthMonth > thisMonth) {
        birthdayStatus = "Upcoming";
    }
    return birthdayStatus;
}

/**
 * Given a string representing a birthdayStatus, return the CSS class that
 * corresponds to the correct color.
 */
const getBirthdayStatusColor = (birthdayStatus) => {
    if (!birthdayStatus) {
        return ""
    }

    switch(birthdayStatus) {
        case "Today!":
            return "badge bg-success";
        case "Passed":
            return "badge bg-danger";
        case "Upcoming":
            return "badge bg-primary";
        default:
            return "";
    }
}

/**
 * Format a given date of birth string to a more readable representation.
 */
const formatDateOfBirth = (dob) => {
    if (!dob || !Date.parse(dob)) {
        return "";
    }

    // Account for timezone when shortening an ISOString
    const birthDate = new Date(dob);
    const offset = birthDate.getTimezoneOffset();
    const birthTime = birthDate.getTime();
    dob = new Date(birthTime - (offset*60*1000));

    return dob.toISOString().split('T')[0];
}

/**
 * Build a table row for a given user object.
 */
const renderTableRow = (user) => {
    const color = getBirthdayStatusColor(user.birthday);
    const userProps = [
        user.firstName,
        user.lastName,
        user.country,
        user.dob,
        <span className={color}>{user.birthday}</span>
    ];
    const tableData = userProps.map((userProp) => {
        return <td>{userProp}</td>;
    });
    return <tr>{tableData}</tr>;
}

/**
 * Table Rows representing users.
 */
const TableRows = ({ userObjects }) => {
    return userObjects.map((user) => {
        if (user) {
            return renderTableRow(user);
        }
    });
}

/**
 * Header for the User Table.
 */
const TableHeader = ({ onHeaderIndexUpdate, headerIndex, onDirectionUpdate, direction }) => {
    const handleSort = (index) => {
        // Given the index of a table header, update the sorting-related state and
        // then re-render the table.
        onDirectionUpdate(headerIndex === index ? flipSortDirection(direction) : SORT_DIRECTION.asc,);
        onHeaderIndexUpdate(index);
    }

    const headers = TABLE_HEADERS.map((header, index) => {
        const sortIconClass = getSortIconClass(index, headerIndex, direction);

        return (
            <th onClick={() => handleSort(index) }>
                {header} <i className={sortIconClass}></i>
            </th>
        );
    });
    return (
        <thead>
            <tr>{headers}</tr>
        </thead>
    );
}

/**
 * Render the RandomUserTable.
 */
const RandomUserTable = () => {
    // Initialize state.
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [userObjects, setUserObjects] = React.useState(null);
    const [userTable, setUserTable] = React.useState(null);
    const [sortDirection, setSortDirection] = React.useState(SORT_DIRECTION.asc);
    const [selectedHeaderIndex, setSelectedHeaderIndex] = React.useState(0);
    const isFirstRender = React.useRef(true);

    const ascSort = (row1, row2) => row1[Object.keys(row1)[selectedHeaderIndex]]
        .localeCompare(row2[Object.keys(row2)[selectedHeaderIndex]]);
    const descSort = (row1, row2) => row2[Object.keys(row2)[selectedHeaderIndex]]
        .localeCompare(row1[Object.keys(row1)[selectedHeaderIndex]]);

    // Fetch users (only once!) after the component mounts.
    React.useEffect(() => {
        setIsLoading(true);
        fetchUsers();
    }, []);

    // Re-render the table when certain state variables are updated, but not on first render.
    React.useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        renderTable();
    }, [userObjects, sortDirection, selectedHeaderIndex]);

    /**
     * Determines the sort criteria for the list of user objects stored in state.
     * The user objects are then sorted and their data is added to a table.
     * Finally, the table is added to state.
     */
    const renderTable = () => {
        const sortComparator = sortDirection === SORT_DIRECTION.asc ? ascSort : descSort;
        const userList = userObjects;
        userList.sort(sortComparator);

        const table = (
            <table className="table">
                <TableHeader 
                    onHeaderIndexUpdate={setSelectedHeaderIndex}
                    headerIndex={selectedHeaderIndex}
                    onDirectionUpdate={setSortDirection}
                    direction={sortDirection} />
                <tbody>
                    <TableRows userObjects={userList} />
                </tbody>
            </table>
        );

        setIsLoading(false);
        setUserTable(table);
    }

    /**
     * Fetches a JSON list of random users from the API.
     */
    const fetchUsers = () => {
        try {
            fetch(API_URL)
            .then(results => {
                return results.json();
            })
            .then(data => {
                const uObjects = data.results.map((user) => {
                    return {
                        "firstName": user.name ? user.name.first : "",
                        "lastName": user.name ? user.name.last : "",
                        "country": user.location ? user.location.country : "",
                        "dob": formatDateOfBirth(user.dob.date),
                        "birthday": computeBirthdayStatus(user.dob.date)
                    };
                });

                setUserObjects(uObjects);
            });
        }
        catch(error) {
            setError(error);
            setIsLoading(false);
        }
    }

    if (error) {
        return <p>{error.message}</p>;
    } else if (isLoading) {
        return <p>Loading...</p>;
    }
    return <div>{userTable}</div>;
}

const domContainer = document.querySelector(INJECTION_POINT);
ReactDOM.render(<RandomUserTable />, domContainer);
