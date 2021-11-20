"use strict";

const API_URL = "https://randomuser.me/api/?results=100";
const INJECTION_POINT = "#random_user_table";
const HEADERS = ["First Name", "Last Name", "Country", "Date of Birth", "Birthday"];
const TAGS = {
    div: "div",
    p: "p",
    span: "span",
    table: "table",
    thead: "thead",
    tbody: "tbody",
    tr: "tr",
    th: "th",
    td: "td"
};
const SORT_DIRECTION = {
    asc: "asc",
    desc: "desc"
};
const e = React.createElement;

class RandomUserTable extends React.Component {
    /**
     * Creates an instance of RandomUserTable.
     */
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            error: null,
            userObjects: null,
            userTable: null,
            sortDirection: SORT_DIRECTION.asc,
            selectedHeaderIndex: 0
        };

        this.ascSort = (row1, row2) => row1[Object.keys(row1)[this.state.selectedHeaderIndex]]
            .localeCompare(row2[Object.keys(row2)[this.state.selectedHeaderIndex]]);
        this.descSort = (row1, row2) => row2[Object.keys(row2)[this.state.selectedHeaderIndex]]
            .localeCompare(row1[Object.keys(row1)[this.state.selectedHeaderIndex]]);
    }

    /**
     * Fetch users after the component mounts.
     */
    componentDidMount() {
        this.setState({ isLoading: true });
        this.fetchUsers();
    }

    /**
     * Given the index of a table header, update the sorting-related state and
     * then re-render the table.
     */
    handleSort(index) {
        this.setState({
            sortDirection: this.state.selectedHeaderIndex === index ? this.flipSortDirection() : SORT_DIRECTION.asc,
            selectedHeaderIndex: index
        },
        () => {this.renderTable()});
    }

    /**
     * Toggles the sorting direction between ascending and descending.
     */
    flipSortDirection() {
        return this.state.sortDirection === SORT_DIRECTION.asc ? SORT_DIRECTION.desc : SORT_DIRECTION.asc;
    }

    /**
     * Given a string representing a date of birth, determine the appropriate
     * status to display in the table's Birthday column.
     */
    computeBirthdayStatus(dob) {
        if (!dob) {
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
    getBirthdayStatusColor(birthdayStatus) {
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
        }
    }

    /**
     * Format a given date of birth string to a more readable representation.
     */
    formatDateOfBirth(dob) {
        if (!dob) {
            return "";
        }

        const options = { year: "numeric", month: "long", day: "numeric" };
        const dateOfBirth = new Date(dob);
        return dateOfBirth.toLocaleDateString("en-US", options);
    }

    /**
     * Build the header for the table.
     */
    renderTableHeader() {
        const headers = HEADERS.map((header, index) => {
            return e(TAGS.th, { key: index, onClick: () => {
                this.handleSort(index);
            } }, header);
        });
        const tableRow = e(TAGS.tr, null, headers);
        return e(TAGS.thead, null, tableRow);
    }

    /**
     * Build a table row for a given user object.
     */
    renderTableRow(user, index) {
        const color = this.getBirthdayStatusColor(user.birthday);
        const userProps = [
            user.firstName,
            user.lastName,
            user.country,
            user.dob,
            e(TAGS.span, { className: color }, user.birthday)
        ];
        const tableData = userProps.map((userProp, i) => {
            return e(TAGS.td, { key: i }, userProp);
        });
        return e(TAGS.tr, { key: index }, tableData);
    }

    /**
     * Build the table rows for each user object.
     */
    renderTableRows(userObjects) {
        return userObjects.map((user, index) => {
            if (user) {
                return this.renderTableRow(user, index);
            }
        });
    }

    /**
     * Determines the sort criteria for the list of user objects stored in state.
     * The user objects are then sorted and their data is added to a table.
     * Finally, the table is added to state.
     */
    renderTable() {
        const comparator = this.state.sortDirection === SORT_DIRECTION.asc ? this.ascSort : this.descSort;
        let userList = this.state.userObjects;
        userList.sort(comparator);

        const tableHeader = this.renderTableHeader();
        const tableRows = this.renderTableRows(userList);
        const tableBody = e(TAGS.tbody, null, tableRows);
        const table = e(TAGS.table, { className: TAGS.table }, tableHeader, tableBody);

        this.setState({
            isLoading: false,
            userTable: table
        });
    }

    /**
     * Fetches a JSON list of random users from the API.
     */
    fetchUsers = async() => {
        try {
            await fetch(API_URL)
            .then(results => {
                return results.json();
            })
            .then(data => {
                const userObjects = data.results.map((user) => {
                    return {
                        "firstName": user.name ? user.name.first : "",
                        "lastName": user.name ? user.name.last : "",
                        "country": user.location ? user.location.country : "",
                        "dob": this.formatDateOfBirth(user.dob.date),
                        "birthday": this.computeBirthdayStatus(user.dob.date)
                    };
                });

                this.setState({
                    userObjects: userObjects,
                }, () => {
                    this.renderTable();
                });
            });
        }
        catch(error) {
            this.setState({
                error: error,
                isLoading: false
            });
        }
    }

    /**
     * Render the user table once it has been built.
     */
    render() {
        if (this.state.error) {
            return e(TAGS.p, null, this.state.error.message);
        }

        if (this.state.isLoading) {
            return e(TAGS.p, null, "Loading...");
        }

        return e(TAGS.div, null, this.state.userTable);
    }
}

const domContainer = document.querySelector(INJECTION_POINT);
ReactDOM.render(e(RandomUserTable), domContainer);
