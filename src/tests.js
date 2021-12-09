mocha.setup("bdd");

let assert = chai.assert;

describe("RandomUserTable tests", function () {
    describe("flipSortDirection()", function () {
        it("returns the opposite sorting direction from what is provided", function () {
            const sortDirection = flipSortDirection("asc");
            assert.equal(sortDirection, "desc");
        });
    });

    describe("computeBirthdayStatus()", function () {
        it("returns an empty string when given null", function () {
            const birthdayStatus = computeBirthdayStatus(null);
            assert.equal(birthdayStatus, "");
        });
        it("returns an empty string when given an empty string", function () {
            const birthdayStatus = computeBirthdayStatus("");
            assert.equal(birthdayStatus, "");
        });
        it("returns an empty string when given an invalid string", function () {
            const birthdayStatus = computeBirthdayStatus("Invalid String");
            assert.equal(birthdayStatus, "");
        });
        it("returns 'Passed' when given the ISOString date for yesterday", function () {
            let date = new Date();
            date.setDate(date.getDate() - 1);
            const yesterday = date.toISOString();
            const birthdayStatus = computeBirthdayStatus(yesterday);
            assert.equal(birthdayStatus, "Passed");
        });
        it("returns 'Upcoming' when given the ISOString date for tomorrow", function () {
            let date = new Date();
            date.setDate(date.getDate() + 1);
            const tomorrow = date.toISOString();
            const birthdayStatus = computeBirthdayStatus(tomorrow);
            assert.equal(birthdayStatus, "Upcoming");
        });
        it("returns 'Today!' when given the ISOString date for today", function () {
            const today = new Date().toISOString();
            const birthdayStatus = computeBirthdayStatus(today);
            assert.equal(birthdayStatus, "Today!");
        });
    });

    describe("getBirthdayStatusColor()", function () {
        it("returns an empty string when given null", function () {
            const color = getBirthdayStatusColor(null);
            assert.equal(color, "");
        });
        it("returns an empty string when given an empty string", function () {
            const color = getBirthdayStatusColor("");
            assert.equal(color, "");
        });
        it("returns an empty string when given an invalid string", function () {
            const color = getBirthdayStatusColor("Invalid String");
            assert.equal(color, "");
        });
        it("returns 'badge bg-success' when given 'Today!'", function () {
            const color = getBirthdayStatusColor("Today!");
            assert.equal(color, "badge bg-success");
        });
        it("returns 'badge bg-danger' when given 'Passed'", function () {
            const color = getBirthdayStatusColor("Passed");
            assert.equal(color, "badge bg-danger");
        });
        it("returns 'badge bg-primary' when given 'Upcoming'", function () {
            const color = getBirthdayStatusColor("Upcoming");
            assert.equal(color, "badge bg-primary");
        });
    });

    describe("formatDateOfBirth()", function () {
        it("returns an empty string when given null", function () {
            const color = formatDateOfBirth(null);
            assert.equal(color, "");
        });
        it("returns an empty string when given an empty string", function () {
            const color = formatDateOfBirth("");
            assert.equal(color, "");
        });
        it("returns an empty string when given an invalid string", function () {
            const color = formatDateOfBirth("Invalid String");
            assert.equal(color, "");
        });
        it("returns a formatted date string when given an ISOString date for a date of birth", function () {
            const birthdayStatus = formatDateOfBirth("1961-12-25T21:53:22.238Z");
            assert.equal(birthdayStatus, "1961-12-25");
        });
    });

    describe("getSortIconClass()", function () {
        it("returns 'bi bi-caret-down-fill' when given the index of ascending-sorted column", function () {
            const sortIconClass = getSortIconClass(0, 0, "asc");
            assert.equal(sortIconClass, "bi bi-caret-down-fill");
        });
    });
});
  
mocha.run();
