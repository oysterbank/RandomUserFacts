"use strict";

const e = React.createElement;

class RandomUserTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            error: null,
            users: null
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.fetchUsers();
    }

    computeBirthdayMessage(dob) {
        if (!dob) {
            return e("span", null, ""); 
        }

        const today  = new Date();
        const dateOfBirth = new Date(dob);
        const thisMonth = today.getMonth();
        const thisDate = today.getDate();
        const birthMonth = dateOfBirth.getMonth();
        const birthDate = dateOfBirth.getDate();

        let birthdayMessage = "Today!";
        let color = "badge bg-success";
        if (birthMonth == thisMonth) {
            if (birthDate < thisDate) {
                birthdayMessage = "Passed";
                color = "badge bg-danger";
            } else if (birthDate > thisDate) {
                birthdayMessage = "Upcoming";
                color = "badge bg-primary";
            }
        } else if (birthMonth < thisMonth) {
            birthdayMessage = "Passed";
            color = "badge bg-danger";
        } else {
            birthdayMessage = "Upcoming";
            color = "badge bg-primary";
        }
        return e("span", { className: color }, birthdayMessage);
    }

    formatDateOfBirth(dob) {
        if (!dob) {
            return "";
        }

        const options = { year: "numeric", month: "long", day: "numeric" };
        const dateOfBirth = new Date(dob);
        return dateOfBirth.toLocaleDateString("en-US", options);
    }

    renderTableHeader() {
        const headerNames = ["First Name", "Last Name", "Country", "Date of Birth", "Birthday"];
        const headers = headerNames.map((header, index) => {
            return e("th", { key: index }, header);
        });
        const tableRow = e("tr", null, headers);
        return e("thead", null, tableRow);
    }

    renderTableRow(user, index) {
        const formattedDateOfBirth = this.formatDateOfBirth(user.dob.date);
        const birthday = this.computeBirthdayMessage(user.dob.date);

        const userProps = [
            user.name ? user.name.first : "",
            user.name ? user.name.last : "",
            user.location ? user.location.country : "",
            formattedDateOfBirth,
            birthday
        ];
        const tableData = userProps.map((userProp, i) => {
            return e("td", { key: i }, userProp);
        });
        return e("tr", { key: index }, tableData);
    }

    renderTableRows(data) {
        return data.results.map((user, index) => {
            if (user) {
                return this.renderTableRow(user, index);
            }
        });
    }

    renderTable(data) {
        const tableHeader = this.renderTableHeader();
        const tableRows = this.renderTableRows(data);
        const tableBody = e("tbody", null, tableRows);
        return e("table", { className: "table" }, tableHeader, tableBody);
    }

    fetchUsers = async() => {
        try {
            await fetch("https://randomuser.me/api/?results=100")
            .then(results => {
                return results.json();
            })
            .then(data => {
                const users = this.renderTable(data);
                this.setState({
                    isLoading: false,
                    users: users
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

    render() {
        const { isLoading, error, users } = this.state;

        if (error) {
            return e("p", null, error.message);
        }

        if (isLoading) {
            return e("p", null, "Loading...");
        }

        return e("div", null, users);
    }
}

const domContainer = document.querySelector("#random_user_table");
ReactDOM.render(e(RandomUserTable), domContainer);
