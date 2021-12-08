"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var API_URL = "https://randomuser.me/api/?results=100";
var INJECTION_POINT = "#random_user_table";
var TABLE_HEADERS = ["First Name", "Last Name", "Country", "Date of Birth", "Birthday"];
var SORT_DIRECTION = {
    asc: "asc",
    desc: "desc"
};

var RandomUserTable = function (_React$Component) {
    _inherits(RandomUserTable, _React$Component);

    /**
     * Creates an instance of RandomUserTable.
     */
    function RandomUserTable(props) {
        _classCallCheck(this, RandomUserTable);

        var _this = _possibleConstructorReturn(this, (RandomUserTable.__proto__ || Object.getPrototypeOf(RandomUserTable)).call(this, props));

        _this.fetchUsers = function () {
            try {
                fetch(API_URL).then(function (results) {
                    return results.json();
                }).then(function (data) {
                    var userObjects = data.results.map(function (user) {
                        return {
                            "firstName": user.name ? user.name.first : "",
                            "lastName": user.name ? user.name.last : "",
                            "country": user.location ? user.location.country : "",
                            "dob": _this.formatDateOfBirth(user.dob.date),
                            "birthday": _this.computeBirthdayStatus(user.dob.date)
                        };
                    });

                    _this.setState({
                        userObjects: userObjects
                    }, function () {
                        _this.renderTable();
                    });
                });
            } catch (error) {
                _this.setState({
                    error: error,
                    isLoading: false
                });
            }
        };

        _this.state = {
            isLoading: false,
            error: null,
            userObjects: null,
            userTable: null,
            sortDirection: SORT_DIRECTION.asc,
            selectedHeaderIndex: 0
        };

        _this.ascSort = function (row1, row2) {
            return row1[Object.keys(row1)[_this.state.selectedHeaderIndex]].localeCompare(row2[Object.keys(row2)[_this.state.selectedHeaderIndex]]);
        };
        _this.descSort = function (row1, row2) {
            return row2[Object.keys(row2)[_this.state.selectedHeaderIndex]].localeCompare(row1[Object.keys(row1)[_this.state.selectedHeaderIndex]]);
        };
        return _this;
    }

    /**
     * Fetch users after the component mounts.
     */


    _createClass(RandomUserTable, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.setState({ isLoading: true });
            this.fetchUsers();
        }

        /**
         * Given the index of a table header, update the sorting-related state and
         * then re-render the table.
         */

    }, {
        key: "handleSort",
        value: function handleSort(index) {
            var _this2 = this;

            this.setState({
                sortDirection: this.state.selectedHeaderIndex === index ? this.flipSortDirection() : SORT_DIRECTION.asc,
                selectedHeaderIndex: index
            }, function () {
                _this2.renderTable();
            });
        }

        /**
         * Toggles the sorting direction between ascending and descending.
         */

    }, {
        key: "flipSortDirection",
        value: function flipSortDirection() {
            return this.state.sortDirection === SORT_DIRECTION.asc ? SORT_DIRECTION.desc : SORT_DIRECTION.asc;
        }

        /**
         * Given a header index, determine if an up or down carat should display to
         * indicate sort order.
         */

    }, {
        key: "getSortIconClass",
        value: function getSortIconClass(index) {
            if (this.state.selectedHeaderIndex === index) {
                if (this.state.sortDirection === SORT_DIRECTION.desc) {
                    return "bi bi-caret-up-fill";
                } else if (this.state.sortDirection === SORT_DIRECTION.asc) {
                    return "bi bi-caret-down-fill";
                }
            }
            return "";
        }

        /**
         * Given a string representing a date of birth, determine the appropriate
         * status to display in the table's Birthday column.
         */

    }, {
        key: "computeBirthdayStatus",
        value: function computeBirthdayStatus(dob) {
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
        }

        /**
         * Given a string representing a birthdayStatus, return the CSS class that
         * corresponds to the correct color.
         */

    }, {
        key: "getBirthdayStatusColor",
        value: function getBirthdayStatusColor(birthdayStatus) {
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
        }

        /**
         * Format a given date of birth string to a more readable representation.
         */

    }, {
        key: "formatDateOfBirth",
        value: function formatDateOfBirth(dob) {
            if (!dob || !Date.parse(dob)) {
                return "";
            }

            // Account for timezone when shortening an ISOString
            var birthDate = new Date(dob);
            var offset = birthDate.getTimezoneOffset();
            var birthTime = birthDate.getTime();
            dob = new Date(birthTime - offset * 60 * 1000);

            return dob.toISOString().split('T')[0];
        }

        /**
         * Build the header for the table.
         */

    }, {
        key: "renderTableHeader",
        value: function renderTableHeader() {
            var _this3 = this;

            var headers = TABLE_HEADERS.map(function (header, index) {
                var sortIconClass = _this3.getSortIconClass(index);
                var sortIcon = React.createElement("i", { className: sortIconClass });

                return React.createElement(
                    "th",
                    { onClick: function onClick() {
                            return _this3.handleSort(index);
                        } },
                    header,
                    " ",
                    sortIcon
                );
            });
            var tableRow = React.createElement(
                "tr",
                null,
                headers
            );
            return React.createElement(
                "thead",
                null,
                tableRow
            );
        }

        /**
         * Build a table row for a given user object.
         */

    }, {
        key: "renderTableRow",
        value: function renderTableRow(user, index) {
            var color = this.getBirthdayStatusColor(user.birthday);
            var userProps = [user.firstName, user.lastName, user.country, user.dob, React.createElement(
                "span",
                { className: color },
                user.birthday
            )];
            var tableData = userProps.map(function (userProp, i) {
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
        }

        /**
         * Build the table rows for each user object.
         */

    }, {
        key: "renderTableRows",
        value: function renderTableRows(userObjects) {
            var _this4 = this;

            return userObjects.map(function (user, index) {
                if (user) {
                    return _this4.renderTableRow(user, index);
                }
            });
        }

        /**
         * Determines the sort criteria for the list of user objects stored in state.
         * The user objects are then sorted and their data is added to a table.
         * Finally, the table is added to state.
         */

    }, {
        key: "renderTable",
        value: function renderTable() {
            var sortComparator = this.state.sortDirection === SORT_DIRECTION.asc ? this.ascSort : this.descSort;
            var userList = this.state.userObjects;
            userList.sort(sortComparator);

            var tableHeader = this.renderTableHeader();
            var tableRows = this.renderTableRows(userList);
            var tableBody = React.createElement(
                "tbody",
                null,
                tableRows
            );
            var table = React.createElement(
                "table",
                { className: "table" },
                tableHeader,
                tableBody
            );

            this.setState({
                isLoading: false,
                userTable: table
            });
        }

        /**
         * Fetches a JSON list of random users from the API.
         */

    }, {
        key: "render",


        /**
         * Render the user table once it has been built.
         */
        value: function render() {
            if (this.state.error) {
                return React.createElement(
                    "p",
                    null,
                    this.state.error.message
                );
            }

            if (this.state.isLoading) {
                return React.createElement(
                    "p",
                    null,
                    "Loading..."
                );
            }

            return React.createElement(
                "div",
                null,
                this.state.userTable
            );
        }
    }]);

    return RandomUserTable;
}(React.Component);

var domContainer = document.querySelector(INJECTION_POINT);
ReactDOM.render(React.createElement(RandomUserTable, null), domContainer);