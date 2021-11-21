mocha.setup("bdd");

let assert = chai.assert;

describe("RandomUserTable tests", function () {
    const usersTable = new RandomUserTable();
    describe("The RandomUserTable class", function () {
        it("can be instantiated", function () {
            assert.isObject(usersTable);
        });
        it("has the expected initial state", function () {
            assert.equal(usersTable.state.error, null);
            assert.equal(usersTable.state.isLoading, false);
            assert.equal(usersTable.state.selectedHeaderIndex, 0);
            assert.equal(usersTable.state.sortDirection, "asc");
            assert.equal(usersTable.state.userObjects, null);
            assert.equal(usersTable.state.userTable, null);
        });
    });

    describe("RandomUserTable.renderTableRow()", function () {
        it("returns a <tr> with expected information about a user", function () {
            const today = new Date().toISOString().split('T')[0];
            const user = {
                firstName: "Jonathan",
                lastName: "Benitez",
                country: "Spain",
                dob: today,
                birthday: "Today!"
            };
            const tableRow = usersTable.renderTableRow(user, 0);

            assert.equal(tableRow.type, "tr");

            assert.exists(tableRow.props);
            assert.exists(tableRow.props.children);
            assert.equal(tableRow.props.children.length, 5);

            assert.equal(tableRow.props.children[0].type, "td");
            assert.equal(tableRow.props.children[0].props.children, "Jonathan");
            assert.equal(tableRow.props.children[1].props.children, "Benitez");
            assert.equal(tableRow.props.children[2].props.children, "Spain");
            assert.equal(tableRow.props.children[3].props.children, today);
            assert.equal(tableRow.props.children[4].props.children.type, "span");
            assert.equal(tableRow.props.children[4].props.children.props.children, "Today!");
        });
    });

    describe("RandomUserTable.flipSortDirection()", function () {
        it("returns the opposite sorting direction from what is in state", function () {
            assert.equal(usersTable.state.sortDirection, "asc");
            const sortDirection = usersTable.flipSortDirection();
            assert.equal(sortDirection, "desc");
        });
    });

    describe("RandomUserTable.computeBirthdayStatus()", function () {
        it("returns an empty string when given null", function () {
            const birthdayStatus = usersTable.computeBirthdayStatus(null);
            assert.equal(birthdayStatus, "");
        });
        it("returns an empty string when given an empty string", function () {
            const birthdayStatus = usersTable.computeBirthdayStatus("");
            assert.equal(birthdayStatus, "");
        });
        it("returns an empty string when given an invalid string", function () {
            const birthdayStatus = usersTable.computeBirthdayStatus("Invalid String");
            assert.equal(birthdayStatus, "");
        });
        it("returns 'Passed' when given the ISOString date for yesterday", function () {
            let date = new Date();
            date.setDate(date.getDate() - 1);
            const yesterday = date.toISOString();
            const birthdayStatus = usersTable.computeBirthdayStatus(yesterday);
            assert.equal(birthdayStatus, "Passed");
        });
        it("returns 'Upcoming' when given the ISOString date for tomorrow", function () {
            let date = new Date();
            date.setDate(date.getDate() + 1);
            const tomorrow = date.toISOString();
            const birthdayStatus = usersTable.computeBirthdayStatus(tomorrow);
            assert.equal(birthdayStatus, "Upcoming");
        });
        it("returns 'Today!' when given the ISOString date for today", function () {
            const today = new Date().toISOString();
            const birthdayStatus = usersTable.computeBirthdayStatus(today);
            assert.equal(birthdayStatus, "Today!");
        });
    });

    describe("RandomUserTable.getBirthdayStatusColor()", function () {
        it("returns an empty string when given null", function () {
            const color = usersTable.getBirthdayStatusColor(null);
            assert.equal(color, "");
        });
        it("returns an empty string when given an empty string", function () {
            const color = usersTable.getBirthdayStatusColor("");
            assert.equal(color, "");
        });
        it("returns an empty string when given an invalid string", function () {
            const color = usersTable.getBirthdayStatusColor("Invalid String");
            assert.equal(color, "");
        });
        it("returns 'badge bg-success' when given 'Today!'", function () {
            const color = usersTable.getBirthdayStatusColor("Today!");
            assert.equal(color, "badge bg-success");
        });
        it("returns 'badge bg-danger' when given 'Passed'", function () {
            const color = usersTable.getBirthdayStatusColor("Passed");
            assert.equal(color, "badge bg-danger");
        });
        it("returns 'badge bg-primary' when given 'Upcoming'", function () {
            const color = usersTable.getBirthdayStatusColor("Upcoming");
            assert.equal(color, "badge bg-primary");
        });
    });

    describe("RandomUserTable.formatDateOfBirth()", function () {
        it("returns an empty string when given null", function () {
            const color = usersTable.formatDateOfBirth(null);
            assert.equal(color, "");
        });
        it("returns an empty string when given an empty string", function () {
            const color = usersTable.formatDateOfBirth("");
            assert.equal(color, "");
        });
        it("returns an empty string when given an invalid string", function () {
            const color = usersTable.formatDateOfBirth("Invalid String");
            assert.equal(color, "");
        });
        it("returns a formatted date string when given an ISOString date for a date of birth", function () {
            const birthdayStatus = usersTable.formatDateOfBirth("1961-12-25T21:53:22.238Z");
            assert.equal(birthdayStatus, "1961-12-25");
        });
    });

    describe("RandomUserTable.getSortIconClass()", function () {
        it("returns 'bi bi-caret-down-fill' when given the index of ascending-sorted column", function () {
            assert.equal(usersTable.state.sortDirection, "asc");
            const sortIconClass = usersTable.getSortIconClass(0);
            assert.equal(sortIconClass, "bi bi-caret-down-fill");
        });
    });
});
  
mocha.run();
