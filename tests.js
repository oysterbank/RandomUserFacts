mocha.setup("bdd");

var assert = chai.assert;

describe("RandomUserTable tests", function () {
    describe("flipSortDirection()", function () {
        it("returns the opposite sorting direction from what is provided", function () {
            var sortDirection = flipSortDirection("asc");
            assert.equal(sortDirection, "desc");
        });
    });

    describe("computeBirthdayStatus()", function () {
        it("returns an empty string when given null", function () {
            var birthdayStatus = computeBirthdayStatus(null);
            assert.equal(birthdayStatus, "");
        });
        it("returns an empty string when given an empty string", function () {
            var birthdayStatus = computeBirthdayStatus("");
            assert.equal(birthdayStatus, "");
        });
        it("returns an empty string when given an invalid string", function () {
            var birthdayStatus = computeBirthdayStatus("Invalid String");
            assert.equal(birthdayStatus, "");
        });
        it("returns 'Passed' when given the ISOString date for yesterday", function () {
            var date = new Date();
            date.setDate(date.getDate() - 1);
            var yesterday = date.toISOString();
            var birthdayStatus = computeBirthdayStatus(yesterday);
            assert.equal(birthdayStatus, "Passed");
        });
        it("returns 'Upcoming' when given the ISOString date for tomorrow", function () {
            var date = new Date();
            date.setDate(date.getDate() + 1);
            var tomorrow = date.toISOString();
            var birthdayStatus = computeBirthdayStatus(tomorrow);
            assert.equal(birthdayStatus, "Upcoming");
        });
        it("returns 'Today!' when given the ISOString date for today", function () {
            var today = new Date().toISOString();
            var birthdayStatus = computeBirthdayStatus(today);
            assert.equal(birthdayStatus, "Today!");
        });
    });

    describe("getBirthdayStatusColor()", function () {
        it("returns an empty string when given null", function () {
            var color = getBirthdayStatusColor(null);
            assert.equal(color, "");
        });
        it("returns an empty string when given an empty string", function () {
            var color = getBirthdayStatusColor("");
            assert.equal(color, "");
        });
        it("returns an empty string when given an invalid string", function () {
            var color = getBirthdayStatusColor("Invalid String");
            assert.equal(color, "");
        });
        it("returns 'badge bg-success' when given 'Today!'", function () {
            var color = getBirthdayStatusColor("Today!");
            assert.equal(color, "badge bg-success");
        });
        it("returns 'badge bg-danger' when given 'Passed'", function () {
            var color = getBirthdayStatusColor("Passed");
            assert.equal(color, "badge bg-danger");
        });
        it("returns 'badge bg-primary' when given 'Upcoming'", function () {
            var color = getBirthdayStatusColor("Upcoming");
            assert.equal(color, "badge bg-primary");
        });
    });

    describe("formatDateOfBirth()", function () {
        it("returns an empty string when given null", function () {
            var color = formatDateOfBirth(null);
            assert.equal(color, "");
        });
        it("returns an empty string when given an empty string", function () {
            var color = formatDateOfBirth("");
            assert.equal(color, "");
        });
        it("returns an empty string when given an invalid string", function () {
            var color = formatDateOfBirth("Invalid String");
            assert.equal(color, "");
        });
        it("returns a formatted date string when given an ISOString date for a date of birth", function () {
            var birthdayStatus = formatDateOfBirth("1961-12-25T21:53:22.238Z");
            assert.equal(birthdayStatus, "1961-12-25");
        });
    });

    describe("getSortIconClass()", function () {
        it("returns 'bi bi-caret-down-fill' when given the index of ascending-sorted column", function () {
            var sortIconClass = getSortIconClass(0, 0, "asc");
            assert.equal(sortIconClass, "bi bi-caret-down-fill");
        });
    });
});

mocha.run();