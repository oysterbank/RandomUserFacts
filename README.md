# RandomUserFacts

## Description

This project fetches data from the [Random User Generator API](https://randomuser.me), parses it for relevant information, and displays that information (along with a dynamically calculated field) in a sortable table. 

I primarily used [React.js](https://reactjs.org) to build this application. One of the project's requirements was that it should *run in the browser*, so I avoided using JSX with the React code since that would need to be transpiled (Client-side transpiling is possible, but is slow and generally discouraged).

## Requirements

To run this, you'll need:

1. **An internet connection.** I'm using CDN links for React, some simple Bootstrap styling, and the test frameworks (more on those below).
2. **An ES6-compatible browser.**

## Tests

Given the requirement that the project run in the browser, I got the opportunity to leverage some testing tools that I'd never used before! Specifically, [Mocha.js](https://mochajs.org) and [Chai.js](https://www.chaijs.com). Mocha is a testing framework that can run in and display its results in the browser. I used Chai in conjunction with it to write BDD-style test definitions that used TDD-style assertions.

The tests run automatically any time the page loads, and their results are listed next to the table (or under it, if you're using a smaller screen).

## Usage

1. Clone the repository:
```
git clone https://github.com/oysterbank/RandomUserFacts.git
```
2. From inside the cloned directory, open `index.html` in a web browser.

From there, you can:

- View the table of users and their information.
- Sort any of the columns in ascending or descending order.
- View the test results.
- Click on any of the individual tests to see its assertions.
