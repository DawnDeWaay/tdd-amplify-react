# TDD AWS Amplify React App

In this tutorial we will [test drive](https://en.wikipedia.org/wiki/Test-driven_development) a react app. We will use [AWS Amplify](https://aws.amazon.com/amplify) to set up authentication and the backend API.

## Approach
Test driving an application often starts at the bottom of the [testing pyramid](https://martinfowler.com/bliki/TestPyramid.html) in [unit tests](https://en.wikipedia.org/wiki/Unit_testing).  Unit tests focus on testing small units of code in isolation.  However, this tutorial will start at the top of the pyramid with user interface (UI) testing.  This approach is often called [Acceptance Test Driven Development](https://en.wikipedia.org/wiki/Acceptance_test%E2%80%93driven_development) (ATDD).

There are a few benefits of starting at the top of the testing pyramid:
1. Quick Feedback: Demonstrate a working system to the customer faster
1. Customer Focus: Low level code clearly ties to high level customer value
1. System Focus: The architecture evolves and expands on green.

## First Test
### Why: User Story
```
As a team member
I want to capture a note
So that I can refer back to it later
```
### What: User Accceptance Criteria
```
Given that a note exists
When the user enters a new note title and description
Then a list of two notes are displayed
```
### Prerequisites
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](Node.jshttps://nodejs.org)

### Red - Acceptance Test
The user story and acceptance criteria above describe a desired customer outcome.  The user acceptance test will link this narrative with a high level how.  For this tutorial our first application will be a [web application](https://en.wikipedia.org/wiki/Web_application) in [React](https://reactjs.org).  The testing framework we will use to test this will be [Cypress](https://www.cypress.io)

- In a terminal window run `npx create-react-app tdd-amplify-react` to create a new react app
- `cd` into `tdd-amplify-react`
- Run `npm start` to start the new react app
- In a new terminal window run `npm install cypress --save-dev` to install Cypress via [npm](https://www.npmjs.com):
- Configure the base url in the `cypress.json` file
```js
{
    "baseUrl": "http://localhost:3000"
}
```
- Run `npx cypress open` to Open Cypress
- Create a new test called `note.spec.js` under the `cypress\integration\` directory in your project
- Write your first test with intent revealing names.
```js
beforeEach(() => {
    cy.visit('/');
  });

describe('Note Capture', () => {
    it('should create a note when name and description provided', () => {
        expect(true).to.equal(true)
    });
});
```
- Click on the `note.spec.js` test in the Cypress test browser.  The test should run and should pass (green).
- Replace `expect(true).to.equal(true)` with the following
```js
cy.get('[data-testid=note-name-field]').type('test note');
cy.get('[data-testid=note-description-field]').type('test note description');
cy.get('[data-testid=note-form-submit]').click();

cy.get('[data-testid=test-name-0]').should('have.text', 'test note');
cy.get('[data-testid=test-description-0]').should('have.text', 'test note description');
```
- These commands are looking for elements on a webpage that contains a `data-testid` attribute with the value that follows the `=`.  We now have a failing acceptance test.
```
Timed out retrying after 4000ms: Expected to find element: [data-testid=note-name-field], but never found it.
```
- Our objective now is to make this test go green (pass) in as few steps as possible.  The goal is not to build a perfectly designed application but rather to make this go green and then [refactor](https://en.wikipedia.org/wiki/Code_refactoring) the architecture through small incremental steps.

[Code for this section]()

### Green - Acceptance Test

