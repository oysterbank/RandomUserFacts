"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var API_URL = "https://randomuser.me/api/?results=100";
var INJECTION_POINT = "#random_user_table";
var TABLE_HEADERS = ["First Name", "Last Name", "Country", "Date of Birth", "Birthday"];
var SORT_DIRECTION = {
    asc: "asc",
    desc: "desc"
};

/**
 * Toggles the sorting direction between ascending and descending.
 */
var flipSortDirection = function flipSortDirection(sortDirection) {
    return sortDirection === SORT_DIRECTION.asc ? SORT_DIRECTION.desc : SORT_DIRECTION.asc;
};

/**
 * Given a header index, determine if an up or down carat should display to
 * indicate sort order.
 */
var getSortIconClass = function getSortIconClass(index, selectedHeaderIndex, sortDirection) {
    if (selectedHeaderIndex === index) {
        if (sortDirection === SORT_DIRECTION.desc) {
            return "bi bi-caret-up-fill";
        } else if (sortDirection === SORT_DIRECTION.asc) {
            return "bi bi-caret-down-fill";
        }
    }
    return "";
};

/**
 * Given a string representing a date of birth, determine the appropriate
 * status to display in the table's Birthday column.
 */
var computeBirthdayStatus = function computeBirthdayStatus(dob) {
    if (!dob || !Date.parse(dob)) {
        return "";
    }

    var today = new Date();
    var dateOfBirth = new Date(dob);
    var thisMonth = today.getMonth();
    var thisDate = today.getDate();
    var birthMonth = dateOfBirth.getMonth();
    var birthDate = dateOfBirth.getDate();

    var birthdayStatus = "Today!";
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
};

/**
 * Given a string representing a birthdayStatus, return the CSS class that
 * corresponds to the correct color.
 */
var getBirthdayStatusColor = function getBirthdayStatusColor(birthdayStatus) {
    if (!birthdayStatus) {
        return "";
    }

    switch (birthdayStatus) {
        case "Today!":
            return "badge bg-success";
        case "Passed":
            return "badge bg-danger";
        case "Upcoming":
            return "badge bg-primary";
        default:
            return "";
    }
};

/**
 * Format a given date of birth string to a more readable representation.
 */
var formatDateOfBirth = function formatDateOfBirth(dob) {
    if (!dob || !Date.parse(dob)) {
        return "";
    }

    // Account for timezone when shortening an ISOString
    var birthDate = new Date(dob);
    var offset = birthDate.getTimezoneOffset();
    var birthTime = birthDate.getTime();
    dob = new Date(birthTime - offset * 60 * 1000);

    return dob.toISOString().split('T')[0];
};

/**
 * Build a table row for a given user object.
 */
var renderTableRow = function renderTableRow(user) {
    var color = getBirthdayStatusColor(user.birthday);
    var userProps = [user.firstName, user.lastName, user.country, user.dob, React.createElement(
        "span",
        { className: color },
        user.birthday
    )];
    var tableData = userProps.map(function (userProp) {
        return React.createElement(
            "td",
            null,
            userProp
        );
    });
    return React.createElement(
        "tr",
        null,
        tableData
    );
};

/**
 * Table Rows representing users.
 */
var TableRows = function TableRows(_ref) {
    var userObjects = _ref.userObjects;

    return userObjects.map(function (user) {
        if (user) {
            return renderTableRow(user);
        }
    });
};

/**
 * Header for the User Table.
 */
var TableHeader = function TableHeader(_ref2) {
    var onHeaderIndexUpdate = _ref2.onHeaderIndexUpdate,
        headerIndex = _ref2.headerIndex,
        onDirectionUpdate = _ref2.onDirectionUpdate,
        direction = _ref2.direction;

    var handleSort = function handleSort(index) {
        // Given the index of a table header, update the sorting-related state and
        // then re-render the table.
        onDirectionUpdate(headerIndex === index ? flipSortDirection(direction) : SORT_DIRECTION.asc);
        onHeaderIndexUpdate(index);
    };

    var headers = TABLE_HEADERS.map(function (header, index) {
        var sortIconClass = getSortIconClass(index, headerIndex, direction);

        return React.createElement(
            "th",
            { onClick: function onClick() {
                    return handleSort(index);
                } },
            header,
            " ",
            React.createElement("i", { className: sortIconClass })
        );
    });
    return React.createElement(
        "thead",
        null,
        React.createElement(
            "tr",
            null,
            headers
        )
    );
};

/**
 * Render the RandomUserTable.
 */
var RandomUserTable = function RandomUserTable() {
    // Initialize state.
    var _React$useState = React.useState(false),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        isLoading = _React$useState2[0],
        setIsLoading = _React$useState2[1];

    var _React$useState3 = React.useState(null),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        error = _React$useState4[0],
        setError = _React$useState4[1];

    var _React$useState5 = React.useState(null),
        _React$useState6 = _slicedToArray(_React$useState5, 2),
        userObjects = _React$useState6[0],
        setUserObjects = _React$useState6[1];

    var _React$useState7 = React.useState(null),
        _React$useState8 = _slicedToArray(_React$useState7, 2),
        userTable = _React$useState8[0],
        setUserTable = _React$useState8[1];

    var _React$useState9 = React.useState(SORT_DIRECTION.asc),
        _React$useState10 = _slicedToArray(_React$useState9, 2),
        sortDirection = _React$useState10[0],
        setSortDirection = _React$useState10[1];

    var _React$useState11 = React.useState(0),
        _React$useState12 = _slicedToArray(_React$useState11, 2),
        selectedHeaderIndex = _React$useState12[0],
        setSelectedHeaderIndex = _React$useState12[1];

    var isFirstRender = React.useRef(true);

    var ascSort = function ascSort(row1, row2) {
        return row1[Object.keys(row1)[selectedHeaderIndex]].localeCompare(row2[Object.keys(row2)[selectedHeaderIndex]]);
    };
    var descSort = function descSort(row1, row2) {
        return row2[Object.keys(row2)[selectedHeaderIndex]].localeCompare(row1[Object.keys(row1)[selectedHeaderIndex]]);
    };

    // Fetch users (only once!) after the component mounts.
    React.useEffect(function () {
        setIsLoading(true);
        fetchUsers();
    }, []);

    // Re-render the table when certain state variables are updated, but not on first render.
    React.useEffect(function () {
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
    var renderTable = function renderTable() {
        var sortComparator = sortDirection === SORT_DIRECTION.asc ? ascSort : descSort;
        var userList = userObjects;
        userList.sort(sortComparator);

        var table = React.createElement(
            "table",
            { className: "table" },
            React.createElement(TableHeader, {
                onHeaderIndexUpdate: setSelectedHeaderIndex,
                headerIndex: selectedHeaderIndex,
                onDirectionUpdate: setSortDirection,
                direction: sortDirection }),
            React.createElement(
                "tbody",
                null,
                React.createElement(TableRows, { userObjects: userList })
            )
        );

        setIsLoading(false);
        setUserTable(table);
    };

    /**
     * Fetches a JSON list of random users from the API.
     */
    var fetchUsers = function fetchUsers() {
        try {
            fetch(API_URL).then(function (results) {
                return results.json();
            }).then(function (data) {
                var uObjects = data.results.map(function (user) {
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
        } catch (error) {
            setError(error);
            setIsLoading(false);
        }
    };

    if (error) {
        return React.createElement(
            "p",
            null,
            error.message
        );
    } else if (isLoading) {
        return React.createElement(
            "p",
            null,
            "Loading..."
        );
    }
    return React.createElement(
        "div",
        null,
        userTable
    );
};

var domContainer = document.querySelector(INJECTION_POINT);
ReactDOM.render(React.createElement(RandomUserTable, null), domContainer);