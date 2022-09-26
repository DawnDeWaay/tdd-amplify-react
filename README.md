# TDD AWS Amplify React App

![Node CI](https://github.com/pairing4good/tdd-amplify-react/actions/workflows/node-ci.yaml/badge.svg)

In this tutorial we will [test drive](https://en.wikipedia.org/wiki/Test-driven_development) a react app which will use [AWS Amplify](https://aws.amazon.com/amplify) to set up authentication and the backend API.

<details>
  <summary>Approach</summary>
 
## Approach
Test driving an application often starts at the bottom of the [testing pyramid](https://martinfowler.com/bliki/TestPyramid.html) in [unit tests](https://en.wikipedia.org/wiki/Unit_testing). Unit tests focus on testing small units of code in isolation. However, this tutorial will start at the top of the pyramid with user interface (UI) testing. This approach is often called [Acceptance Test Driven Development](https://en.wikipedia.org/wiki/Acceptance_test%E2%80%93driven_development) (ATDD).

There are a few benefits of starting at the top of the testing pyramid:

1. Quick Feedback: Demonstrate a working system to the customer faster
1. Customer Focus: Low level code clearly ties to high level customer value
1. System Focus: The architecture evolves and expands on green.
</details>

<details>
  <summary>Set Up</summary>
  
- Download and install [Visual Studio Code](https://code.visualstudio.com/)
- Open VS Code and set up the ability to [launch VS Code from the terminal](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line) 
- Install [Node Version Manager](https://github.com/nvm-sh/nvm). `nvm` allows you to quickly install and use different versions of node via the command line.
- Run `nvm install node` to install the latest version of node
- Run `nvm use node` to use the latest version of node
  
</details>

<details>
  <summary>First Test</summary>

## First Test

### Why: User Story

```
As a team member
I want to capture a note
So that I can refer back to it later
```

### What: User Acceptance Criteria

```
Given that a note exists
When the user enters a new note title and description
Then a list of two notes are displayed
```

### Red - Acceptance Test

The user story and acceptance criteria above describe a desired customer outcome. The user acceptance test will link this narrative with a high level how. For this tutorial our first application will be a [web application](https://en.wikipedia.org/wiki/Web_application) in [React](https://reactjs.org). The testing framework we will use to test this will be [Cypress](https://www.cypress.io)

- In a terminal window `cd` to the location where you store your git repositories.  I like to store mine under `~/git`.
- Run `npx create-react-app tdd-amplify-react` to create a new react app
- `cd` into `tdd-amplify-react`
- Run `code .` to open the directory in VS Code
- Open a new terminal within VS Code by selecting `Terminal < New Terminal`
- In the new terminal session run `npm start` to start the new react app                   
- Open a second terminal session within VS Code by selecting `Terminal < New Terminal` again
- In this second terminal session run `npm install cypress --save-dev` to install Cypress via [npm](https://www.npmjs.com)
- Run `npx cypress open` to Open Cypress
- Select `E2E Testing` within the Cypress window
- Click `Continue` at the bottom of the page
- Click on your preferred browser for E2E testing
- Click `Start E2E Testing in [Your Preferred Browser]`
- Configure the base url in the `cypress.config.js` file at the root of your repository

```js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
```
- Click `Create new empty spec` in the Cypress window
- Create a new test named `cypress/e2e/note.cy.js`
- Open the `cypress/e2e/note.cy.js` file
- Write your first test with intent revealing names.

```js
beforeEach(() => {
  cy.visit("/");
});

describe("Note Capture", () => {
  it("should create a note when name and description provided", () => {
    expect(true).to.equal(true);
  });
});
```

- Click on the `note.cy.js` test in the Cypress test browser. The test should run and should pass (green).
- Replace `expect(true).to.equal(true)` with the following

```js
cy.get("[data-testid=note-name-field]").type("test note");
cy.get("[data-testid=note-description-field]").type("test note description");
cy.get("[data-testid=note-form-submit]").click();

cy.get("[data-testid=test-name-0]").should("have.text", "test note");
cy.get("[data-testid=test-description-0]").should(
  "have.text",
  "test note description"
);
```

- These commands are looking for elements on a webpage that contains a `data-testid` attribute with the value that follows the `=`. We now have a failing acceptance test.

```
Timed out retrying after 4000ms: Expected to find element: [data-testid=note-name-field], but never found it.
```

- Our objective now is to make this test go green (pass) in as few steps as possible. The goal is not to build a perfectly designed application but rather to make this go green and then [refactor](https://en.wikipedia.org/wiki/Code_refactoring) the architecture through small incremental steps.

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/998cf7a3da2af3b30aed14ccea18e6d546e85e61)

### Failing Test

When you ran `npx create-react-app tdd-amplify-react` it created the react app and added a test that renders the `App` [component](https://reactjs.org/docs/thinking-in-react.html#step-1-break-the-ui-into-a-component-hierarchy) and verifies that it has a "learn react" link. This test is lower in the testing pyramid because it doesn't start up the web application. Instead it uses the [React Testing Library](https://testing-library.com) to render the component hierarchy without starting the web application on http://localhost:3000. I would normally never encourage someone to delete a test but since we didn't write this test and we are starting at the top of the testing pyramid, let's just delete `App.test.js` for now.

### Green - Acceptance Test

Before we proceed let's add a script to run cypress into the `package.json` file in the `scripts` section.

```js
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "cypress:open": "cypress open"
  }
```

- Now you can run `npm run cypress:open` to open cypress

The first step to making this failing test go green is adding an element with one of the `data-testid`'s to the `src/App.js` file.

```js
import "./App.css";

function App() {
  return (
    <div className="App">
      <input data-testid="note-name-field" />
    </div>
  );
}

export default App;
```

- Now the Cypress test fails on the second field

```
Timed out retrying after 4000ms: Expected to find element: [data-testid=note-description-field], but never found it.
```

- Add the next `input` field and rerun the test
- Now the Cypress test fails on the submit button

```
Timed out retrying after 4000ms: Expected to find element: [data-testid=note-form-submit], but never found it.
```

- Add the `button` element with the expected `data-testid`

```js
<input data-testid="note-name-field"/>
<input data-testid="note-description-field"/>
<button data-testid="note-form-submit"/>
```

- Now the Cypress test fails on the missing list of created notes

```
Timed out retrying after 4000ms: Expected to find element: [data-testid=test-name-0], but never found it.
```

In test driven development we do the simplest thing possible to make a test go green. Once it is green then and only then do we go back and refactor it. In this case, the simplest thing that we can do is hard-code the expected values on the screen.

```js
<input data-testid="note-name-field"/>
<input data-testid="note-description-field"/>
<button data-testid="note-form-submit"/>
<p data-testid="test-name-0">test note</p>
```

- Now the Cypress test fails on the note description

```
Timed out retrying after 4000ms: Expected to find element: [data-testid=test-description-0], but never found it.
```

- Add the final element for `test-description-0`

```js
import "./App.css";

function App() {
  return (
    <div className="App">
      <input data-testid="note-name-field" />
      <input data-testid="note-description-field" />
      <button data-testid="note-form-submit" />
      <p data-testid="test-name-0">test note</p>
      <p data-testid="test-description-0">test note description</p>
    </div>
  );
}

export default App;
```

- While this is far from a useful application, this application can be:
  1. refactored on green
  1. used to get feedback from the customer

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/62108fdcb9f7a1a1f5d76b005f05460a149a6535)

### Refactor - Acceptance Test

> Refactoring is a disciplined technique for restructuring an existing body of code, altering its internal structure without changing its external behavior. - Martin Fowler

The key to refactoring is to not change its "external behavior". In other words, after every change we make the test must remain green.

When I look at the existing application a few things pop out.

- The button needs a name
- The inputs need descriptions

We could just make these changes and this high-level test would not break. But these changes have an external impact on how the customer understands and uses this application. Assuming these changes are needed then we must drive them through tests. One "internal structure" change that could help is pulling this form out into a [react component](https://reactjs.org/docs/thinking-in-react.html#step-1-break-the-ui-into-a-component-hierarchy) so that we can drive these changes independently. Eventually `App.js` will have several components:

```js
<div className="App">
  <Header />
  <NoteForm />
  <NoteList />
  <Footer />
</div>
```

So let's pull out a `NoteForm` component.

- Create a new file called `NoteForm.js` in the `src` directory

```js
function NoteForm(props) {
  return <div>//your form goes here</div>;
}

export default NoteForm;
```

- This is a [React functional component](https://reactjs.org/docs/components-and-props.html#function-and-class-components)
- The `export default` is the way to [export](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) only one object in [ES6](https://en.wikipedia.org/wiki/ECMAScript)

- Copy the form from `App.js` and paste it into the `div` in `NoteForm.js`

```js
<div>
  <input data-testid="note-name-field" />
  <input data-testid="note-description-field" />
  <button data-testid="note-form-submit" />
  <p data-testid="test-name-0">test note</p>
  <p data-testid="test-description-0">test note description</p>
</div>
```

- Replace the form contents in `App.js` with `<NoteForm />` and add an import for the `NoteForm`

```js
import "./App.css";
import NoteForm from "./NoteForm";

function App() {
  return (
    <div className="App">
      <NoteForm />
    </div>
  );
}

export default App;
```

- Rerun you Cypress test and it is green

Congratulations, you've successfully made an internal structural change "without changing its external behavior" (Refactoring).

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/e6e28ce004ba0b29e2b0b7bd13adcc67965c1cfa)

</details>

<details>
  <summary>Linting Code</summary>
  In addition to test automation, [linting](https://en.wikipedia.org/wiki/Lint_(software)) your code checks for stylistic consistency, programming errors, security vulnerabilities and common coding mistakes.  Even the best software developer misses coding issues once in a while.  Adding linting feedback to your code will prevent common mistakes and allow you to focus on solving business problems.

  [ESLint](https://eslint.org/) is a pluggable linting utility for JavaScript and JSX.
  - run `npm init @eslint/config`
    - How would you like to use ESLint? · style
    - What type of modules does your project use? · esm
    - Which framework does your project use? · react
    - Does your project use TypeScript? · No
    - Where does your code run? · browser
    - How would you like to define a style for your project? · guide
    - Which style guide do you want to follow? · airbnb
    - What format do you want your config file to be in? · JSON
    - Would you like to install them now? · Yes
    - Which package manager do you want to use? · npm

  ### Set Up Linting Rules
  -  run `npm install eslint-config-prettier eslint-plugin-prettier prettier --save-dev`
  -  run `npm install eslint-plugin-promise --save-dev`
  -  run `npm install eslint-plugin-jest --save-dev`
  -  run `npm install eslint-plugin-react-hooks --save-dev`
  -  run `npm i eslint-plugin-cypress --save-dev`

Add the following to the `.eslintrc.json` file at the root of the repository
```json
{
    ...
    "extends": [
        "plugin:react/recommended",
        "airbnb",
        "plugin:prettier/recommended",
        "plugin:promise/recommended",
        "plugin:jest/recommended",
        "plugin:react-hooks/recommended",
        "plugin:cypress/recommended"
    ],
    ...
    "plugins": [
        "react", "prettier", "promise", "jest", "react-hooks", "cypress"
    ],
    "rules": {
        "react/react-in-jsx-scope": "off",
        "react/jsx-filename-extension": "off"
    }
}
```
At the bottom of the `.eslintrc.json` file `"react/react-in-jsx-scope": "off"` is added to the `rules` section. This linting rule was disabled because it is no longer accurate starting in [React v17](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).

Add the following scripts to the `package.json` file in the `scripts` section.

```js
"scripts": {
    ...
    "cypress:open": "cypress open",
    "lint": "eslint . --ext js,jsx",
    "lint:fix": "eslint . --ext js,jsx --fix"
  }
```

Run `npm run lint:fix`

To run [ESLint](https://eslint.org/) run the command `npm run lint`. [ESLint](https://eslint.org/) can automatically fix problems by running `npm run lint:fix`.

If you are using [VSCode](https://code.visualstudio.com/) adding the ESLint (dbaeumer.vscode-eslint) plugin provides live feedback as you are writing code.  Faster feedback loops help team members learn team style guidelines faster and avoid delays while committing.

  ### Prevent Committing Credentials
  - run `npm install secretlint @secretlint/secretlint-rule-preset-recommend --save-dev`
  - run `npx secretlint --init`

Add the following script to the `package.json` file in the `scripts` section.
```js
"scripts": {
    ...
    "lint:fix": "eslint . --ext js,jsx --fix",
    "secretlint": "npx secretlint '**/*'"
  }
```
  
</details>

<details>
  <summary>Continuous Integration</summary>
  
</details>

<details>
  <summary>NoteForm Test</summary>

## NoteForm Test

Now that we have a high-level Cypress test in place, let's move down the testing pyramid into a component test. This test will use the React Testing Library's [render](https://testing-library.com/docs/react-testing-library/cheatsheet/) function to render the `NoteForm` component and assert its contents.

Before we show this new form to our customer we need to test drive:

- the button's name
- helpful input descriptions

- First create a `test` directory in the `src` directory
- Create a file called `NoteForm.test.js` in the new `test` directory

### Button Test

- In this new test file add a test that will drive the button name

```js
test("should display a create note button", () => {});
```

- The test name should be conversational and intent revealing. It should avoid technical words like "render", "component", and the like. We want a new team member to be able to read this test and understand the customer value. The body of the test will provide the technical HOW but the test name should point to the customer's WHY and WHAT.

- Now we will add a test that renders the component and asserts that the button is labeled "Create Note". For more information on the React Testing Library visit https://testing-library.com/docs
```js
import { render, screen } from "@testing-library/react";
import NoteForm from "../NoteForm";

test("should display a create note button", () => {
  render(<NoteForm />);
  const button = screen.getByTestId("note-form-submit");

  expect(button).toHaveTextContent("Create Note");
});
```

- Run `npm run test` and one test will fail

```
Expected element to have text content:
  Create Note
Received:

```

- In order to make this pass add the expected text content to the button

```js
<button data-testid="note-form-submit">Create Note</button>
```

- The test automatically reruns once the change is saved through jest's [watch](https://jestjs.io/docs/cli) mode.
- **Be sure to always commit on green**. We value working code. `Green Code = Working Code`

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/9fb7f63f4982fa22dc383595e4ac50ad41d02904)

### Name Input Test

- Test drive the label for the name input.

```js
test("should display the name placeholder", () => {
  render(<NoteForm />);
  const input = screen.getByTestId("note-name-field");

  expect(input).toHaveAttribute("placeholder", "Note Name");
});
```

- Make this red test go green

```js
<input data-testid="note-name-field" placeholder="Note Name" />
```

- Commit on Green. And always be looking for ways to refactor your code. Small improvements over time are easier to make than large changes when your code is a mess.

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/b8c8a84a9b70ce70cc2317e09adc15e2f03b8345)

### Description Input Test

- Test drive the label for the description input.

```js
test("should display the description placeholder", () => {
  render(<NoteForm />);
  const input = screen.getByTestId("note-description-field");

  expect(input).toHaveAttribute("placeholder", "Note Description");
});
```

- Make this red test go green

```js
<input data-testid="note-description-field" placeholder="Note Description" />
```

- Commit on Green.

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/0d1712aaf51b52ea20c6c14e5462034dd54a1aa5)

### Refactor

Every test starts with `render(<NoteForm />)`. Let's extract this duplicated set up code and place it in the test setup.

```js
beforeEach(() => {
  render(<NoteForm />);
});

test("should display a create note button", () => {
  const button = screen.getByTestId("note-form-submit");

  expect(button).toHaveTextContent("Create Note");
});
```

- We added a [beforeEach](https://reactjs.org/docs/testing-recipes.html#setup--teardown) set up function.
- Green!
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/cb3fe5136eea727e2db9c52b4a4618e09d3cc1dc)

</details>

<details>
  <summary>Saving A Note</summary>

## Saving A Note

While the application could be demoed to the customer their feedback was limited to format, styling and placement. But the customer actually wants to save notes and view them.

### User Acceptance Criteria

```
Given that no notes are entered
When nothing is saved
Then no notes should be listed
```

```
Given that one note exists
When a note is saved
Then two notes should be listed
```

```
Given a note exists
When the application is opened
Then a note is listed
```

These three user acceptance criteria will drive the need to actually save notes. While this can be achieved through component tests, let's add this to our high-level UI test. These tests are often called end-to-end tests because they follow a few paths through the application. These tests are at the top of the testing pyramid because they tend to be slower and more brittle than tests lower in the pyramid. This translates into these tests tending to cost more to build, run and maintain. Consequently, we try to limit their number to only a few tests that follow typical paths through the system.

- Let's start with the first acceptance criteria. To achieve this we need to add an initial check, in `note.cy.js`, to verify that no notes are listed prior to entering a note.

```js
it("should create a note when name and description provided", () => {
  cy.get("[data-testid=test-name-0]").should("not.exist");
  cy.get("[data-testid=test-description-0]").should("not.exist");

  cy.get("[data-testid=note-name-field]").type("test note");
  cy.get("[data-testid=note-description-field]").type("test note description");
  cy.get("[data-testid=note-form-submit]").click();

  cy.get("[data-testid=test-name-0]").should("have.text", "test note");
  cy.get("[data-testid=test-description-0]").should(
    "have.text",
    "test note description"
  );
});
```

- Now we have a failing test to drive new functionality

There are a number of ways that we could make this go green but React [State Hooks](https://reactjs.org/docs/hooks-state.html) are one of the simplest ways to achieve this outcome.

- Import the `useState` hook at the top of `App.js`

```js
import React, { useState } from "react";
```

- Initialize an empty list of notes inside the `App` function

```js
function App() {
  const [notes] = useState([]);

  return (
    <div className="App">
      <NoteForm />
    </div>
  );
}
```

- Pass the notes as a property to the `NoteForm` component

```js
return (
  <div className="App">
    <NoteForm notes={notes} />
  </div>
);
```

- Now in `NoteForm.js` use the notes property that was passed to it to list the existing notes

```js
return (
  <div>
    <input data-testid="note-name-field" placeholder="Note Name" />
    <input
      data-testid="note-description-field"
      placeholder="Note Description"
    />
    <button data-testid="note-form-submit">Create Note</button>
    {props.notes.map((note, index) => (
      <div>
        <p data-testid={"test-name-" + index}>{note.name}</p>
        <p data-testid={"test-description-" + index}>{note.description}</p>
      </div>
    ))}
  </div>
);
```

While this satisfied the first acceptance criteria, now the second acceptance criteria fails.

```
expected [data-testid=test-name-0] to have text test note, but the text was ''
```

- In order to save notes you must

1. Save the note name and description form data when each field is changed
1. Save the form data once the `Create Note` button is clicked

- To achieve this we will need to add more state hooks

```js
const [notes, setNotes] = useState([]);
const [formData, setFormData] = useState({ name: "", description: "" });
```

- Now we need to pass these hooks to the `NoteForm` component

```js
<div className="App">
  <NoteForm
    notes={notes}
    formData={formData}
    setFormDataCallback={setFormData}
    setNotesCallback={setNotes}
  />
</div>
```

Using these variables and callback functions can be a bit overwhelming so we will look at each element in the `NoteForm` component one at a time.

- Add an `onChange` attribute to the `note-name-field` element

```js
<input
  data-testid="note-name-field"
  onChange={(e) =>
    props.setFormDataCallback({
      ...props.formData,
      name: e.target.value,
    })
  }
  placeholder="Note Name"
/>
```

- The `onChange` function is called every time the name is changed.

  - The `e` is the event which is used to get the target element which contains the value that the user entered.
  - The [=>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) is an arrow function expression which is an alternative to a traditional javascript function expression.
  - The rest of the function is a call to the `setFormData` hook that we passed to the `NoteForm` component. If this were not spread across 3 lines it would read more like this `setFormDataCallback({'name': 'some value'})`. Granted there is one more thing happening in this call, the existing form data is being [spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) with the `...` syntax. Simply put we are creating a new javascript object by opening and closing with curly braces. Add all of the existing form data prior to the change. And finally add the new `name` value which will overwrite the form data that was spread. There is a lot going on in this small function.

- Add an `onChange` attribute to the `note-description-field` element

```js
<input
  data-testid="note-description-field"
  onChange={(e) =>
    props.setFormDataCallback({
      ...props.formData,
      description: e.target.value,
    })
  }
  placeholder="Note Description"
/>
```

- This is exactly the same as the name `onChange` function with the exception of the target value's field name `'description'`.

- Add an `onClick` attribute to the `note-form-submit` element

```js
<button
  data-testid="note-form-submit"
  onClick={() => props.setNotesCallback([...props.notes, props.formData])}
>
  Create Note
</button>
```

- The `onClick` function is called every time the `Create Note` button is clicked
  - The `setNotesCallback` callback is called with a new [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) that contains all of the existing notes pulse the note that we just entered.
- Rerun the Cypress test and it is Green.

- However if you run `npm run test` the non-UI tests are failing.

```
TypeError: Cannot read property 'map' of undefined
```

- The `NoteForm.test.js` component test does not pass any parameters to the component so the `props.notes` is [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined). In order to fix this test we must pass an array of `notes` to the `NoteForm` component.

```js
beforeEach(() => {
  render(<NoteForm notes={[]} />);
});
```

- The simplest thing that you can do is pass an empty array to `NoteForm`. And the tests pass.

- All of our tests are Green!
- Don't forget to commit your changes

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/b9b6171a1ec15809d389d925ecc37aab629bcb1d)

</details>

<details>
  <summary>Refactor - Single Responsibility</summary>

## Refactor - Single Responsibility

> The Single Responsibility Principle (SRP) states that each software module should have one and only one reason to change. - Robert C. Martin

Now it's clear that the `NoteForm` component has more than one responsibility:

```js
function NoteForm(props) {
  return (
    <div>
      // 1. Note Creation
      <input
        data-testid="note-name-field"
        onChange={(e) =>
          props.setFormDataCallback({
            ...props.formData,
            name: e.target.value,
          })
        }
        placeholder="Note Name"
      />
      <input
        data-testid="note-description-field"
        onChange={(e) =>
          props.setFormDataCallback({
            ...props.formData,
            description: e.target.value,
          })
        }
        placeholder="Note Description"
      />
      <button
        data-testid="note-form-submit"
        onClick={() => props.setNotesCallback([...props.notes, props.formData])}
      >
        Create Note
      </button>
      // 2. Note Listing
      {props.notes.map((note, index) => (
        <div>
          <p data-testid={"test-name-" + index}>{note.name}</p>
          <p data-testid={"test-description-" + index}>{note.description}</p>
        </div>
      ))}
    </div>
  );
}
```

If you go up to the `App` component the call to the `NoteForm` component takes 4 arguments. This is a [smell](https://en.wikipedia.org/wiki/Code_smell) pointing to the fact that this component is doing too many things.

```js
<NoteForm
  notes={notes}
  formData={formData}
  setFormDataCallback={setFormData}
  setNotesCallback={setNotes}
/>
```

> Functions should have a small number of arguments. No argument is best, followed by one, two, and three. More than three is very questionable and should be avoided with prejudice. - Robert C. Martin

While components don't look like functions when they are called, they are. React uses [JSX](https://reactjs.org/docs/introducing-jsx.html) which is interpreted into functions.

### Note List Component

Let's pull out a `NoteList.js` component in order to separate these responsibilities.

- Create a new file called `NoteList.js` under the `src` directory.

```js
function NoteList(props) {

  return (

  );
}

export default NoteList;
```

- Cut the JSX, that lists notes in the `NoteForm` component, and paste it into the new component.

```js
function NoteList(props) {
  return (
    <div>
      {props.notes.map((note, index) => (
        <div>
          <p data-testid={"test-name-" + index}>{note.name}</p>
          <p data-testid={"test-description-" + index}>{note.description}</p>
        </div>
      ))}
    </div>
  );
}

export default NoteList;
```

- Now instead of adding the `NoteList` component back into the `NoteForm` component, bring it up a level and place it in the `App` component. This prevents unnecessary [coupling](<https://en.wikipedia.org/wiki/Coupling_(computer_programming)>) between the `NoteForm` component and the `NoteList` component.

```js
import "./App.css";
import NoteForm from "./NoteForm";
import React, { useState } from "react";
import NoteList from "./NoteList";

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });

  return (
    <div className="App">
      <NoteForm
        notes={notes}
        formData={formData}
        setFormDataCallback={setFormData}
        setNotesCallback={setNotes}
      />
      <NoteList notes={notes} />
    </div>
  );
}

export default App;
```

- Run all of your tests including Cypress.
- It's Green!

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/8f8f00cb21ae991a253454a78a6043d38a91adfc)

</details>

<details>
  <summary>Testing NoteList Component</summary>

## Testing NoteList Component

As we refactor we need to remember what level of testing we have written within the testing pyramid. While we have a few far reaching tests at the top of the pyramid, don't think that they adequately test the behavior of each component. The bottom of the testing pyramid is wide because it provides broad test coverage.

Now that `NoteList` is broken out into its own focused component it will be much easier to test.

- Create a new `NoteList.test.js` under the `src/test/` directory.

### Test No Notes

- Write a test that verifies that no notes are rendered when no notes are provided

```js
import { render, screen, getByTestId } from "@testing-library/react";
import NoteList from "../NoteList";

test("should display nothing when no notes are provided", () => {
  render(<NoteList notes={[]} />);
  const firstNoteName = screen.queryByTestId("test-name-0");

  expect(firstNoteName).toBeNull();
});
```

- Write a test that verifies that one note is rendered

```js
test("should display one note when one notes is provided", () => {
  const note = { name: "test name", description: "test description" };
  render(<NoteList notes={[note]} />);

  const firstNoteName = screen.queryByTestId("test-name-0");
  expect(firstNoteName).toHaveTextContent("test name");

  const firstNoteDescription = screen.queryByTestId("test-description-0");
  expect(firstNoteDescription).toHaveTextContent("test description");
});
```

- Write a test that verifies that multiple notes are rendered

```js
test("should display one note when one notes is provided", () => {
  const firstNote = { name: "test name 1", description: "test description 1" };
  const secondNote = { name: "test name 1", description: "test description 1" };
  render(<NoteList notes={[firstNote, secondNote]} />);

  const firstNoteName = screen.queryByTestId("test-name-0");
  expect(firstNoteName).toHaveTextContent("test name");

  const firstNoteDescription = screen.queryByTestId("test-description-0");
  expect(firstNoteDescription).toHaveTextContent("test description");

  const secondNoteName = screen.queryByTestId("test-name-1");
  expect(secondNoteName).toHaveTextContent("test name");

  const secondNoteDescription = screen.queryByTestId("test-description-1");
  expect(secondNoteDescription).toHaveTextContent("test description");
});
```

- Write a test that verifies an exception is thrown when a list is not provided.

This may seem unnecessary but it's important to test negative cases too. Tests not only provide accountability and quick feedback loops for the [application under test](https://en.wikipedia.org/wiki/System_under_test) but it also provides [living documentation](https://en.wikipedia.org/wiki/Living_document) for new and existing team members.

```js
test("should throw an exception the note array is undefined", () => {
  expect(() => {
    render(<NoteList />);
  }).toThrowError();
});
```

- All of your non-UI tests are Green.
- Don't forget to rerun your Cypress tests. Green!
- Commit on Green.

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/8905e6d1e7c40c4ccc912f14bdca83fc19b68b73)

</details>

<details>
  <summary>Usability</summary>

## Usability

Customers rarely ask explicitly for a usable product. In this application rich world that we live in, it's assumed that applications will be delivered with common sense usability baked-in. When I look at the application as it stands, a few things pop out at me.

1. Header - there's no heading telling you what this application does
1. Form Validation - there's no form field validation
1. Reset Form - after a note is created the form fields are not reset

### Header

- Create a new file `Header.js` in the `src` directory

```js
function Header() {

  return (

  );
}

export
```

- Let's test drive this component
- Create a new file `Header.test.js` in the `src/test` directory

```js
import { render, screen } from "@testing-library/react";
import Header from "../Header";

test("should display header", () => {
  render(<Header />);
  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading).toHaveTextContent("My Notes App");
});
```

- We have a failing test.
- Let's make it pass

```js
function Header() {
  return <h1>My Notes App</h1>;
}

export default Header;
```

- It's Green!
- Commit your code!

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/4f4defe7251bc2274b1a348a3c68c3efdb640ceb)

### Hook Up Header

Even though the component is test driven and ready to be used, we have not used it yet outside the test. Let's drive this change through the Cypress test.

- Add a test that asserts the header

```js
it("should have header", () => {
  cy.get("h1").should("have.text", "My Notes App");
});
```

- It fails
- Add the component to the `App` component

```js
return (
  <div className="App">
    <Header />
    <NoteForm
      notes={notes}
      formData={formData}
      setFormDataCallback={setFormData}
      setNotesCallback={setNotes}
    />
    <NoteList notes={notes} />
  </div>
);
```

- It's Green!
- Commit!

You will notice that in the TDD testing cycle we commit very small bits of working code. We commit all the time. While this may seem like overkill, here are some benefits.

1. Our commit messages tell a focused, step-by-step story that explains why we made each change.
1. We are preserving working code. ["Working software is the primary measure of progress."](https://agilemanifesto.org/principles.html)
1. We can [revert](<https://en.wikipedia.org/wiki/Reversion_(software_development)>) our changes back to a known working state without losing very many changes.

This last benefit is worth expounding upon. The TDD testing cycle keeps us laser focused on writing small pieces of working functionality. In fact, the [3 Laws of TDD](http://blog.cleancoder.com/uncle-bob/2014/12/17/TheCyclesOfTDD.html) prevent us from writing more code than is necessary to satisfy a focused test.

#### Three Laws of TDD

1. You must write a failing test before you write any production code.
1. You must not write more of a test than is sufficient to fail, or fail to compile.
1. You must not write more production code than is sufficient to make the currently failing test pass.

These tight feedback loops help software developers avoid going down rabbit holes that lead to [over-engineering](https://en.wikipedia.org/wiki/Overengineering).

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/098c4aa47c4c7c8dd85936288f22afa57eb94da9)

### Form Validation

Let's assume that the note name and description are both required fields. While you want the customer driving decisions about your product, one way to gather customer feedback is to launch-and-learn. Your customers will tell you if they don't like your decision.  As software developers we must be obsessed with our customers. Set up a regular cadence to meet with your customers and demonstrate a working application. Make space for them to let you know what they think.

In order to test drive validation we need to determine where in the testing pyramid to write this test. Remember that the highest-level tests are slow and expensive, so limit these tests to between 3 to 5 tests that walk through the most common user experiences. In order to adequately test all of the combinations of good and bad fields this is not well suited for UI testing.

#### Name and Description Blank

- Add a test to `NoteForm.test.js`

```js
const setNotesCallback = jest.fn();
const formData = {name: '', description: ''}

beforeEach(() => {
    render(<NoteForm notes={[]}
            setNotesCallback={setNotesCallback}
            formData={formData}/>)
});

...

test('should require name and description', () => {
    const button = screen.getByTestId('note-form-submit');

    fireEvent.click(button)

    expect(setNotesCallback.mock.calls.length).toBe(0);
});
```

- **When `...` is on a line by itself, in a code example, it means that I have not provided all of the code from that file. Please be careful to copy each section that is separated by `...`'s and use them in the appropriate part of your files.**

- This test checks to see if the jest [mock function](https://jestjs.io/docs/mock-functions) was called. In this test the note's name and description are blank so a new note should not be created and added to the list of notes.
- We have a failing test.

```js
function NoteForm(props) {
  function createNote() {
    if (!props.formData.name || !props.formData.description) return;
    props.setNotesCallback([...props.notes, props.formData]);
  }

  return (
    <div>
      ...
      <button data-testid="note-form-submit" onClick={createNote}>
        Create Note
      </button>
    </div>
  );
}
```

- Green!
- Rerun your Cypress tests.
- Commit!

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/d1e426596870c78f083c057ef88a7f50f5c6787b)

#### Name And Description Required

```js
test("should require name when description provided", () => {
  formData.description = "test description";
  formData.name = "";

  const button = screen.getByTestId("note-form-submit");

  fireEvent.click(button);

  expect(setNotesCallback.mock.calls.length).toBe(0);
});

test("should require description when name provided", () => {
  formData.description = "";
  formData.name = "test name";

  const button = screen.getByTestId("note-form-submit");

  fireEvent.click(button);

  expect(setNotesCallback.mock.calls.length).toBe(0);
});

test("should add a new note when name and description are provided", () => {
  formData.description = "test description";
  formData.name = "test name";

  const button = screen.getByTestId("note-form-submit");

  fireEvent.click(button);

  expect(setNotesCallback.mock.calls.length).toBe(1);
});
```

- All of these tests go green with no additional production code changes.
- Rerun your Cypress tests.
- Commit!

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/959bafeba3080065bbaa161825d1371b739a3973)

</details>

<details>
  <summary>Reset Form</summary>

## Reset Form

When a note is saved the name and description fields should be reset to empty strings.

- Add a test to `NoteForm.test.js`

```js
test("should add a new note when name and description are provided", () => {
  formData.name = "test name";
  formData.description = "test description";

  const button = screen.getByTestId("note-form-submit");

  fireEvent.click(button);

  expect(formData.name).toBe("");
  expect(formData.description).toBe("");
});
```

- Make this failing test go Green

```js
function createNote() {
  if (!props.formData.name || !props.formData.description) return;
  props.setNotesCallback([...props.notes, props.formData]);
  props.formData.name = "";
  props.formData.description = "";
}
```

- Green
- Run the Cypress tests and it's **Red**.

What happened? Well while this approach worked for a lower level component test it doesn't work when React is managing its own [state](https://reactjs.org/docs/state-and-lifecycle.html). React clearly warns us that we should [not modify state directly](https://reactjs.org/docs/state-and-lifecycle.html#do-not-modify-state-directly). Instead you should use the [setState](https://reactjs.org/docs/hooks-state.html) callback hook.

- Let's update the test to use the `setFormDataCallback` callback.

```js
test("should add a new note when name and description are provided", () => {
  formData.name = "test name";
  formData.description = "test description";

  const button = screen.getByTestId("note-form-submit");

  fireEvent.click(button);

  expect(setFormDataCallback).toHaveBeenCalledWith({
    name: "",
    description: "",
  });
});
```

- This red test drives these code changes

```js
function createNote() {
  if (!props.formData.name || !props.formData.description) return;
  props.setNotesCallback([...props.notes, props.formData]);
  props.setFormDataCallback({ name: "", description: "" });
}
```

- Green!
- The Cypress test is now Green!
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/22b3132d0c71117111d82afc6f30f41d5ce93c00)

</details>

<details>
  <summary>Demo Your Application To Your Customer</summary>

## Demo Your Application To Your Customer

Be sure to start up your application and walk through it with your customers. When I was doing this I noticed that the form is not resetting after a note is created. This is very annoying. In order to test drive this behavior I will add two additional assertions to the end of the UI test to verify that the form is reset.

```js
describe("Note Capture", () => {
  it("should create a note when name and description provided", () => {
    cy.get("[data-testid=test-name-0]").should("not.exist");
    cy.get("[data-testid=test-description-0]").should("not.exist");

    cy.get("[data-testid=note-name-field]").type("test note");
    cy.get("[data-testid=note-description-field]").type(
      "test note description"
    );
    cy.get("[data-testid=note-form-submit]").click();

    cy.get("[data-testid=note-name-field]").should("have.value", "");
    cy.get("[data-testid=note-description-field]").should("have.value", "");

    cy.get("[data-testid=test-name-0]").should("have.text", "test note");
    cy.get("[data-testid=test-description-0]").should(
      "have.text",
      "test note description"
    );
  });
});
```

- This test now fails with

```
get [data-testid=note-name-field]
assert expected <input> to have value '', but the value was test note
```

- To make this pass we need to connect the name and description fields to the form data in `NoteForm.js`

```js
<input data-testid="note-name-field"
    onChange={e => props.setFormDataCallback({
        ...props.formData,
        'name': e.target.value}
    )}
    value={props.formData.name}
    placeholder="Note Name"/>
<input data-testid="note-description-field"
    onChange={e => props.setFormDataCallback({
        ...props.formData,
        'description': e.target.value}
    )}
    value={props.formData.description}
    placeholder="Note Description"/>
```

- Green! Commit!

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/dd2d3f0ef360e5b9a587cfab95ee61b666e6be0f)

</details>

<details>
  <summary>Saving Notes For Real</summary>

## Saving Notes For Real

React creates a [single page web application](https://en.wikipedia.org/wiki/Single-page_application). This means that the React state does not [persist](<https://en.wikipedia.org/wiki/Persistence_(computer_science)>) beyond a web page refresh. In other words, if you refresh your browser page you will lose all of the notes you created.

Since Cypress tests the application in a browser, this is the most logical place to test this user expectation.

```js
it("should load previously saved notes on browser refresh", () => {
  cy.reload();

  cy.get("[data-testid=test-name-0]").should("have.text", "test note");
  cy.get("[data-testid=test-description-0]").should(
    "have.text",
    "test note description"
  );
});
```

- We now have a failing test. In order to save notes between page reloads we will use [localforage](https://www.npmjs.com/package/localforage).

- Run `npm install localforage`
- Add a callback function to `App.js` that will look up notes that are saved in `localforage`

```js
function fetchNotesCallback() {
  localForage.getItem("notes").then(function (value) {
    if (value) setNotes(value);
    else setNotes([]);
  });
}
```

- The `if` check determines if there are any notes in `localforage` and sets the `notes` accordingly.

- Add a callback function to `App.js` that will save newly created notes to `localforage`

```js
function createNote() {
  const updatedNoteList = [...notes, formData];
  setNotes(updatedNoteList);
  localForage.setItem("notes", updatedNoteList);
}
```

- Update the `NoteForm` component in `App.js` to take the new `createNote` callback function instead of the `setNotes` hook.

```js
<NoteForm notes={notes}
  formData={formData}
  setFormDataCallback={setFormData}
  createNoteCallback={createNote}/>
<NoteList notes={notes}/>
```

- Update the `NoteForm.test.js` to use the renamed parameter.

```js
const createNoteCallback = jest.fn();
const setFormDataCallback = jest.fn();
const formData = {name: '', description: ''}

beforeEach(() => {
    render(<NoteForm notes={[]}
            createNoteCallback={createNoteCallback}
            setFormDataCallback={setFormDataCallback}
            formData={formData}/>)
});

...

test('should require name and description', () => {
  ...
  expect(createNoteCallback.mock.calls.length).toBe(0);
});

test('should require name when description provided', () => {
    ...
    expect(createNoteCallback.mock.calls.length).toBe(0);
});

test('should require description when name provided', () => {
    ...
    expect(createNoteCallback.mock.calls.length).toBe(0);
});

test('should add a new note when name and description are provided', () => {
    ...
    expect(createNoteCallback.mock.calls.length).toBe(1);
});
```

- To load the saved notes when the application is loaded, add the [useEffect](https://reactjs.org/docs/hooks-effect.html#example-using-hooks) hook and call the `fetchNotesCallback` in `App.js`.

```js
useEffect(() => {
  fetchNotesCallback();
}, []);
```

- Update `NoteForm.js` to use the new `createNoteCallback` parameter.

```js
function createNote() {
  if (!props.formData.name || !props.formData.description) return;
  props.createNoteCallback();
  props.setFormDataCallback({ name: "", description: "" });
}
```

- Lastly, make sure you clean up the persisted notes after the Cypress test is run.

```js
after(() => {
  localForage.clear().then(() => {});
});
```

- All the tests are Green
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/c73f6db0c02c4b6c12b1397b008d232ede492a98)

</details>

<details>
  <summary>Refactor To Repository</summary>

## Refactor To Repository

The `App` component now has two concerns. React [state management](https://en.wikipedia.org/wiki/State_management) and persistence. State management is concerned with frontend values, where persistence is a backend concern. Persistence and data access concerns are often extracted into a [repository](https://makingloops.com/why-should-you-use-the-repository-pattern).

- Create a `NoteRepository.js` file in the `src` directory.
- Move all the `localForage` calls to this new file.

```js
import localForage from "localforage";

export async function findAll() {
  return await localForage.getItem("notes");
}

export async function save(note) {
  const notes = await localForage.getItem("notes");
  if (notes) await localForage.setItem("notes", [...notes, note]);
  else await localForage.setItem("notes", [note]);
}
```

- Update `App.js` to use the new `NoteRepository` functions

```js
async function fetchNotesCallback() {
  const notes = await findAll();
  if (notes) setNotes(notes);
  else setNotes([]);
}

async function createNote() {
  const updatedNoteList = [...notes, formData];
  setNotes(updatedNoteList);
  await save(formData);
}
```

- Run all of the tests.
- Green
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/b43be5c13819b7f429ac6efb67193e4447639e0b)

</details>

<details>
  <summary>Set Up AWS Amplify</summary>

## Set Up AWS Amplify

We now have a fully functioning task creation application. When we showed this to our customer they provided some feedback. They would like:

- to secure this application with a user login
- notes to show up on their mobile phone browser too

While `localForage` provided a quick way to save notes and get valuable customer feedback, it isn't designed for securing applications or cross-device persistence. [Amazon Web Services](https://aws.amazon.com) does provide services that solve both of these [use cases](https://en.wikipedia.org/wiki/Use_case) and positions our React app for additional possibilities like [notifications](https://aws.amazon.com/sns), backend processing, storing note attachments, and much more. [AWS Amplify](https://aws.amazon.com/amplify) provides a set of tools that significantly simplify connection web and mobile applications to an AWS backend.

- Install the [Install the Amplify CLI](https://docs.amplify.aws/cli/start/install)
- Run `amplify init` at the root of the project

```
Project information
| Name: tddamplifyreact
| Environment: dev
| Default editor: Visual Studio Code
| App type: javascript
| Javascript framework: react
| Source Directory Path: src
| Distribution Directory Path: build
| Build Command: npm run-script build
| Start Command: npm run-script start

Select the authentication method you want to use: AWS profile
Please choose the profile you want to use: default
```

- This command created the following files in your project
  - `amplify/` - This directory contains Amplify configuration files.
  - `src/aws-exports.js` - This file is ignored in [.gitignore](https://git-scm.com/docs/gitignore) and will not be committed to git or pushed up to GitHub. This file will contain AWS credentials and information that should not be shared publicly.
- This command created the following resources on AWS
  - UnauthRole AWS::IAM::Role
  - AuthRole AWS::IAM::Role
  - DeploymentBucket AWS::S3::Bucket
  - amplify-tddamplifyreact-dev-12345

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/67a864c2e51f26aaa95d50abd83510e6c2b52b6c)

</details>

<details>
  <summary>Add Authentication</summary>

## Add Authentication

- Run `npm install aws-amplify @aws-amplify/ui-react`
- Run `amplify add auth` at the root of your project

```
Do you want to use the default authentication and security configuration? Default configuration
How do you want users to be able to sign in? Username
Do you want to configure advanced settings? No, I am done.
```

- Run `amplify push --y`

- This command created the following resources on AWS

  - UpdateRolesWithIDPFunctionRole AWS::IAM::Role
  - SNSRole AWS::IAM::Role
  - UserPool AWS::Cognito::UserPool
  - UserPoolClientWeb AWS::Cognito::UserPoolClient
  - UserPoolClient AWS::Cognito::UserPoolClient
  - UserPoolClientRole AWS::IAM::Role
  - UserPoolClientLambda AWS::Lambda::Function
  - UserPoolClientLambdaPolicy AWS::IAM::Policy
  - UserPoolClientLogPolicy AWS::IAM::Policy
  - UserPoolClientInputs Custom::LambdaCallout
  - IdentityPool AWS::Cognito::IdentityPool
  - IdentityPoolRoleMap AWS::Cognito::IdentityPoolRoleAttachment
  - amplify-tddamplifyreact-dev-12345-authtddamplifyreactxx123x12-1XXXXX1XXX1XX
  - authtddamplifyreactxx123x12 AWS::CloudFormation::Stack
  - UpdateRolesWithIDPFunction AWS::Lambda::Function
  - UpdateRolesWithIDPFunctionOutputs Custom::LambdaCallout
  - amplify-tddamplifyreact-dev-12345 AWS::CloudFormation::Stack

- Add the following just under the imports in the `src/index.js` file

```js
import Amplify from "aws-amplify";
import config from "./aws-exports";

Amplify.configure(config);
```

- Add `import { withAuthenticator } from '@aws-amplify/ui-react'` to the `App` component
- Replace `export default App;` at the bottom of `App.js` with `export default withAuthenticator(App)`
- Run `npm start`

- Open http://localhost:3000
- Click the `Create account` link
- Create and Verify your new account
- Login to your App

- Run all your tests
- While the non-UI tests pass, the Cypress tests are **Red**.

### Cypress Login

The Cypress tests now need to log in to the notes app.

- Run `npm install cypress-localstorage-commands`
- Add the following to the bottom of the `cypress/support/commands.js` file

```js
const Auth = require("aws-amplify").Auth;
import "cypress-localstorage-commands";
const username = Cypress.env("username");
const password = Cypress.env("password");
const userPoolId = Cypress.env("userPoolId");
const clientId = Cypress.env("clientId");

const awsconfig = {
  aws_user_pools_id: userPoolId,
  aws_user_pools_web_client_id: clientId,
};
Auth.configure(awsconfig);

Cypress.Commands.add("signIn", () => {
  cy.then(() => Auth.signIn(username, password)).then((cognitoUser) => {
    const idToken = cognitoUser.signInUserSession.idToken.jwtToken;
    const accessToken = cognitoUser.signInUserSession.accessToken.jwtToken;

    const makeKey = (name) => `CognitoIdentityServiceProvider
        .${cognitoUser.pool.clientId}
        .${cognitoUser.username}.${name}`;

    cy.setLocalStorage(makeKey("accessToken"), accessToken);
    cy.setLocalStorage(makeKey("idToken"), idToken);
    cy.setLocalStorage(
      `CognitoIdentityServiceProvider.${cognitoUser.pool.clientId}.LastAuthUser`,
      cognitoUser.username
    );
  });
  cy.saveLocalStorage();
});
```

- Create a new file at the root of your project named `cypress.env.json` with the following content

```json
{
  "username": "[Login username you just created]",
  "password": "[Login password you just created]",
  "userPoolId": "[The `aws_user_pools_id` value found in your `src/aws-exports.js`]",
  "clientId": "[The `aws_user_pools_web_client_id` value found in your `src/aws-exports.js`]"
}
```

- Add the `cypress.env.json` to `.gitignore` so that it will not be committed and pushed to GitHub

```
#amplify
amplify/\#current-cloud-backend
...
amplifyconfiguration.dart
amplify-build-config.json
amplify-gradle-config.json
amplifytools.xcconfig
.secret-*
cypress.env.json
```

- Add the following setups and teardowns to `cypress/integration/note.cy.js`

```js
before(() => {
  cy.signIn();
});

after(() => {
  cy.clearLocalStorageSnapshot();
  cy.clearLocalStorage();
  localForage.clear();
});

beforeEach(() => {
  cy.restoreLocalStorage();
  cy.visit("/");
});

afterEach(() => {
  cy.saveLocalStorage();
});
```

- Rerun all of your tests.
- Green!
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/61a8a7ea79fe6c044379213669253eae01ae14cc)

</details>

<details>
  <summary>Notes App Deployment</summary>

## Notes App Deployment

Amplify provides the ability to [deploy](https://docs.amplify.aws/guides/hosting/git-based-deployments/q/platform/js), build, run tests and host your application ([Continuous Delivery](https://en.wikipedia.org/wiki/Continuous_delivery))

- If you have not already, [create](https://docs.github.com/en/github/getting-started-with-github/signing-up-for-github/signing-up-for-a-new-github-account) a GitHub account
- Be sure to [push](https://docs.github.com/en/github/importing-your-projects-to-github/importing-source-code-to-github/adding-an-existing-project-to-github-using-the-command-line) your local changes up to your GitHub account

- Log In to your http://console.aws.amazon.com
- Open `AWS Amplify`
- Open the backend that you just pushed up (`amplify push --y`).
- Open the `Frontend environments` tab
- Select `GitHub` and `Connect branch`
- Connect Amplify with your GitHub account
- Select the GitHub repository where your code is stored
- Complete the set up, save and deploy.

- **In order for the Cypress tests to work in the Amplify build you will need to add the same properties that you added to the `cypress.env.json` file because you did not push that file up since you added it to the `.gitignore` file.**
- Each environment variable has a prefix of `cypress_`

  - cypress_username
  - cypress_password
  - cypress_userPoolId
  - cypress_clientId

- On the left navigation within your AWS Amplify Application, select `Environment variables`
- Click the `Manage variables` button
- Click the `Add variable` button
- Type `cypress_username` in the field labeled `Enter variable here`
- Type the corresponding value from your `cypress.env.json` in the field labeled `Enter value here`
- Repeat the previous three steps for `cypress_password`, `cypress_userPoolId`, and `cypress_clientId`
- Click the `Save` button

- Navigate back to your AWS Amplify Application
- Click on your branch name (most likely `main`)
- Click the `Redeploy this version` button

- The `Test` step in the build should pass (Green).

So what does this Amplify build actually do?

- Provision
  - Provisions a [docker image](https://docs.docker.com/get-started/overview) where our React application can be built.
- Build
  - [Clones](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository-from-github/cloning-a-repository) your GitHub repository
  - Builds your backend AWS services with the [CloudFormation](https://aws.amazon.com/cloudformation) scripts that Amplify generated for you.
  - Builds your frontend React application using `npm` commands
- Test
  - Starts the application locally within the Docker image and Tests your application using your Cypress Test
- Deploy
  - If the tests pass it [deploys](https://en.wikipedia.org/wiki/Software_deployment) your React application to a public URL where anyone can access it. **Important: This step automatically prevents broken software from being released to your customers. We value working software and we bake it into our [Deployment Pipeline](https://martinfowler.com/bliki/DeploymentPipeline.html)**
- Verify

  - Generates screenshots of your application's home page to ensure your app renders well on different mobile resolutions.

- This deployment pipeline kicks off every time you push your code up to GitHub.

**At this point Amplify does not support running non-Cypress tests. This is a known limitation of the Amplify build pipeline. In the next section we will set up a [GitHub Action](https://docs.github.com/en/actions) to run unit tests when you push your code up.**

</details>

<details>
  <summary>GitHub Action: Run Non-Cypress Tests</summary>

## GitHub Action: Run Non-Cypress Tests

Since Amplify does not run non-Cypress tests in the deployment pipeline, we will use Github Actions to run `npm test` every time your code is pushed up to GitHub.

- Create a new directory at the root of the project `.github/workflows`
- Create a new file `node-ci.yaml` in the new directory

```yaml
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [10.x, 12.x, 14.x]

    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm install
      - run: npm run test
```

- Commit and Push
- Verify that the `Actions` tab at the top of your GitHub repository ran the new [workflow](https://docs.github.com/en/actions/guides/building-and-testing-nodejs)

- Green!

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/compare/5a3004bbf51ca2eb45db09e2edb8c01fd7f2c421..0aab5724181184a5327e025b0a26400eb722e3dd)

</details>

<details>
  <summary>Log Out</summary>

## Log Out

While users can now log into the notes application they can't log back out.

- Add a Cypress test that will drive the production code changes

```js
it("should have an option to sign out", () => {
  cy.get("[data-testid=sign-out] > .hydrated").click();
  cy.get("amplify-auth-container.hydrated > .hydrated").should("exist");
});
```

- Create a new component called `Footer.js` in the `src` directory

```js
import { AmplifySignOut } from "@aws-amplify/ui-react";

function Footer() {
  return (
    <div data-testid="sign-out">
      <AmplifySignOut />
    </div>
  );
}

export default Footer;
```

- Add the new `Footer` component to the `App` component

```js
<div className="App">
  <Header />
  <NoteForm
    notes={notes}
    formData={formData}
    setFormDataCallback={setFormData}
    createNoteCallback={createNote}
  />
  <NoteList notes={notes} />
  <Footer />
</div>
```

- Run all the tests
- Green!
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/22f23e1bc263d175dc699450e136a58e341b8fa2)

</details>

<details>
  <summary>Backend API</summary>

## Backend API

Now that we have user authentication hooked up, we need to add the ability for customers to get their "notes to show up on their mobile phone browser too". This means that we can't use local storage on the user's computer anymore. Instead we need to build a backend [API](https://en.wikipedia.org/wiki/API) that will store notes independently from the frontend code.

- Run `amplify add api` at the root of your project

```
Please select from one of the below mentioned services: GraphQL
Provide API name: tddamplifyreact
Choose the default authorization type for the API API key
Enter a description for the API key: notes-api-key
After how many days from now the API key should expire (1-365): 7
Do you want to configure advanced settings for the GraphQL API No, I am done.
Do you have an annotated GraphQL schema? No
Choose a schema template: Single object with fields (e.g., “Todo” with ID, name, description)
Do you want to edit the schema now? Yes
```

- [GraphQL](https://graphql.org/) is an alternative to [REST](Representational state transfer). GraphQL APIs are more flexible than REST APIs.
- This command created

  - `amplify/backend/api/`
  - `amplify/backend/backend-config.json`

- Run `amplify push --y`

- This command created/updated the following resources on AWS
  - authtddamplifyreact05a4d123 AWS::CloudFormation::Stack
  - GraphQLAPI AWS::AppSync::GraphQLApi
  - GraphQLAPIKey AWS::AppSync::ApiKey
  - GraphQLSchema AWS::AppSync::GraphQLSchema
  - NoteIAMRole AWS::IAM::Role
  - NoteDataSource AWS::AppSync::DataSource
  - ListNoteResolver AWS::AppSync::Resolver
  - CreateNoteResolver AWS::AppSync::Resolver
  - UpdateNoteResolver AWS::AppSync::Resolver
  - DeleteNoteResolver AWS::AppSync::Resolver
  - GetNoteResolver AWS::AppSync::Resolver
  - NoteTable AWS::DynamoDB::Table
  - amplify-tddamplifyreact-dev-121349-apitddamplifyreact-Z2AW8DQHJ787-Note-1FT5A8I4PYJH1 AWS::CloudFormation::Stack
  - Note AWS::CloudFormation::Stack
  - amplify-tddamplifyreact-dev-151647-apitddamplifyreact-Z2AW8DQHJ787-CustomResourcesjson-GB5TRK4AKZAU AWS::CloudFormation::Stack
  - CustomResourcesjson AWS::CloudFormation::Stack
  - amplify-tddamplifyreact-dev-151647-apitddamplifyreact-Z2AW8DQHJ787 AWS::CloudFormation::Stack
  - apitddamplifyreact AWS::CloudFormation::Stack
  - authtddamplifyreact03a1d234 AWS::CloudFormation::Stack
  - amplify-tddamplifyreact-dev-121349 AWS::CloudFormation::Stack

### Cut Over Repository To Use GraphQL

Now that we have a GraphQL API that is storing our notes in a [DynamoDB](https://aws.amazon.com/dynamodb) table we can replace `localforage` calls with GraphQL API calls.

- Replace `localforage` calls in the `NoteRepository` with GraphQL API calls

```js
import { API } from "aws-amplify";
import { listNotes } from "./graphql/queries";
import { createNote as createNoteMutation } from "./graphql/mutations";

export async function findAll() {
  const apiData = await API.graphql({ query: listNotes });
  return apiData.data.listNotes.items;
}

export async function save(note) {
  const apiData = await API.graphql({
    query: createNoteMutation,
    variables: { input: note },
  });
  return apiData.data.createNote;
}
```

- We do need to call save first in the `createNote` callback function in the `App` component because when GraphQL saves a note it generates a unique `ID` that we want to have access to in our `note` array.

```js
async function createNote() {
  const newNote = await save(formData);
  const updatedNoteList = [...notes, newNote];
  setNotes(updatedNoteList);
}
```

- The final place that we need to remove `localforage` is in the `note.cy.js` Cypress test. GraphQL does not provide an equivalent API endpoint to delete all of the notes so we will not be able to simply replace the `localforage.clear()` function call with a GraphQL one. In a separate commit we will add the ability to delete notes by `ID` through the UI. This is a [mutation](https://graphql.org/learn/queries/#mutations) that GraphQL provides. But for now we will just remove the clean up in the Cypress test.

```js
describe('Note Capture', () => {
  before(() => {
      cy.signIn();
  });

  after(() => {
      cy.clearLocalStorageSnapshot();
      cy.clearLocalStorage();
  });
  ...
```

- Finally remove `localforage` by running `npm uninstall localforage`

- Rerun all of the tests
- Green!
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/f6ee8a279908c49d6d03ccb7f209b4833832c1e6)

</details>

<details>
  <summary>Add Note Deletion</summary>

## Add Note Deletion

In order to add note deletion, let's drive this from the Cypress test. This will help in cleaning up notes that were created during the UI test.

- Add a deletion test to the Cypress test

```js
it("should delete note", () => {
  cy.get("[data-testid=test-button-0]").click();

  cy.get("[data-testid=test-name-0]").should("not.exist");
  cy.get("[data-testid=test-description-0]").should("not.exist");
});
```

- Run the Cypress test and verify that it Fails

- To make it go green, add a new deletion function to `NoteRepository.js`

```js
...
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation} from './graphql/mutations';

...

export async function deleteById( id ) {
  return await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
}
```

- Create a new deletion callback function in `App.js`

```js
async function deleteNoteCallback(id) {
  const newNotesArray = notes.filter((note) => note.id !== id);
  setNotes(newNotesArray);
  await deleteById(id);
}
```

- Pass the `deleteNoteCallback` callback function parameter to the `NoteList` component.

```js
<NoteList notes={notes} deleteNoteCallback={deleteNoteCallback} />
```

- Add a deletion button to the `NoteList` component

```js
<button
  data-testid={"test-button-" + index}
  onClick={() => props.deleteNoteCallback(note.id)}
>
  Delete note
</button>
```

- Run all the tests
- Green
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/c17100754bf3a9edfebfeb8219b87766fb1cde00)

</details>

<details>
  <summary>Note List Component Testing</summary>

## Note List Component Testing

Since we started at the top of the testing pyramid we need to make sure, once we are on green, that we work our way down to lower level tests too.

- Add a test to `NoteList.test.js` to verify the deletion behavior of the `NoteList` component.

```js
import { render, screen, fireEvent } from '@testing-library/react';
import NoteList from '../NoteList';

const deleteNoteCallback = jest.fn();

const defaultProps = {
    notes: [],
    deleteNoteCallback: deleteNoteCallback
 };

const setup = (props = {}) => {
    const setupProps = { ...defaultProps, ...props};
    return render(<NoteList {...setupProps}/>);
};

test('should display nothing when no notes are provided', () => {
    setup();
...
});

test('should display one note when one notes is provided', () => {
    const note = {name: 'test name', description: 'test description'}
    setup({notes: [note]});
...
});

test('should display one note when one notes is provided', () => {
    const firstNote = {name: 'test name 1', description: 'test description 1'}
    const secondNote = {name: 'test name 1', description: 'test description 1'}
    setup({notes: [firstNote, secondNote]});
...
});

test('should delete note when clicked', () => {
    const note = {
        id: 1,
        name: 'test name 1',
        description: 'test description 1'
    }
    const notes = [ note ]
    setup({notes: notes});
    const button = screen.getByTestId('test-button-0');

    fireEvent.click(button)

    expect(deleteNoteCallback.mock.calls.length).toBe(1);
    expect(deleteNoteCallback.mock.calls[0][0]).toStrictEqual(1);
});
```

- I added a mock function for the `deleteNoteCallback` and a `setup` function that has properties that can be overridden for specific test cases. This is a pattern that is often used in this style of tests.

- Run all of the tests
- Green
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/f9c91554f4256a05d7c94756cbf4495edc855e36)

</details>

<details>
  <summary>Unit Testing Note Repository</summary>

## Unit Testing Note Repository

[Unit testing](https://en.wikipedia.org/wiki/Unit_testing) is the lowest level testing that tests out a single function in complete isolation. For the `NoteRepository` this means that amplify and GraphQL imports will need to be [mocked](https://en.wikipedia.org/wiki/Mock_object) out so that we do not hit AWS during our testing.

- Create a new test called `NoteRepository.test.js` file under the `src/test/` directory.

```js
import { save, findAll, deleteById } from "../NoteRepository";
import { API } from "aws-amplify";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "../graphql/mutations";
import { listNotes } from "../graphql/queries";

const mockGraphql = jest.fn();
const id = "test-id";

beforeEach(() => {
  API.graphql = mockGraphql;
});

afterEach(() => {
  jest.clearAllMocks();
});

it("should create a new note", () => {
  const note = { name: "test name", description: "test description" };

  save(note);

  expect(mockGraphql.mock.calls.length).toBe(1);
  expect(mockGraphql.mock.calls[0][0]).toStrictEqual({
    query: createNoteMutation,
    variables: { input: note },
  });
});

it("should findAll notes", () => {
  const note = { name: "test name", description: "test description" };

  findAll(note);

  expect(mockGraphql.mock.calls.length).toBe(1);
  expect(mockGraphql.mock.calls[0][0]).toStrictEqual({ query: listNotes });
});

it("should delete note by id", () => {
  deleteById(id);

  expect(mockGraphql.mock.calls.length).toBe(1);
  expect(mockGraphql.mock.calls[0][0]).toStrictEqual({
    query: deleteNoteMutation,
    variables: { input: { id } },
  });
});
```

- In the `beforeEach` function the real `API.graphql` function is replaced with a mock function. This enables us to test this script in complete isolation. We can determine how many times the mock function was called and what parameters were passed to that function. This also keeps this test from trying to call AWS. This would make the test much slower and more fragile. Remember that unit tests are tests at the bottom of the testing pyramid which are faster and easier to maintain.

- Run all of your tests
- Green!
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/00f9b6c36f94cbf19fe79a6107eccad3b3faa462)

</details>

<details>
  <summary>Refactor Project Structure</summary>

## Refactor Project Structure

It's best to organize your code into a logical [folder structure](https://reactjs.org/docs/faq-structure.html) so that it's easier to understand and navigate.

- Move all of the components into a `note` folder in `src`

- note/

  - App.js
  - Footer.js
  - Header.js
  - NoteForm.js
  - NoteList.js

- Move the `NoteRepository` component to a `common` folder in `src`

- common/

  - NoteRepository.js

- Run all the tests
- Green
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/6a580689ebf3805b1a167efbd2fa510491af2527)

</details>

<details>
  <summary>Styling The App</summary>

## Styling The App

Right now this Notes Application is functional but it is not very pretty. The [Bootstrap](https://getbootstrap.com) library not only provides a simple way to provide a consistent look-and-feel, it also provides a [responsive web](https://en.wikipedia.org/wiki/Responsive_web_design) experience right out-of-the-box.

- Run `npm install react-bootstrap bootstrap@4.6.0` at the root of your project
- The [React Bootstrap](https://react-bootstrap.github.io) library combines [Bootstrap Components](https://getbootstrap.com/docs/5.0/customize/components) with React Components.

- Add the [Cascading Style Sheet](https://en.wikipedia.org/wiki/CSS) provided by Bootstrap's [CDN](https://en.wikipedia.org/wiki/Content_delivery_network) to the `index.js` file.

```js
ReactDOM.render(
  <React.StrictMode>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
      integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
      crossorigin="anonymous"
    />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
```

- Remove all of the contents of `App.css` because it will no longer be used in the application.

- Add a Bootstrap React [Grid System](https://react-bootstrap.github.io/layout/grid) to `App.js`
```js
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

...

return (
<Container>
  <Row>
    <Col md={6}>
      <Header />
    </Col>
  </Row>
  <Row>
    <Col  md={6}>
    <NoteForm notes={notes}  
      formData={formData} 
      setFormDataCallback={setFormData} 
      createNoteCallback={createNote}/>
    </Col>
  </Row>
  <Row>
    <Col md={6}>
      <NoteList notes={notes}
        deleteNoteCallback={deleteNoteCallback}/>
    </Col>
  </Row>
  <Row>
    <Col md={6}>
      <Footer />
    </Col>
  </Row>
</Container>
);
```

- Add a Bootstrap React [Form](https://react-bootstrap.github.io/components/forms) to `NoteForm.js`
```js
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

...

return (
    <Form>
        <Form.Group>
            <Form.Control data-testid="note-name-field" 
                onChange={e => props.setFormDataCallback({ 
                    ...props.formData, 
                    'name': e.target.value}
                )}
                value={props.formData.name}
                placeholder="Note Name"/>
        </Form.Group>
        <Form.Group>
            <Form.Control data-testid="note-description-field" 
                as="textarea" 
                onChange={e => props.setFormDataCallback({ 
                    ...props.formData, 
                    'description': e.target.value}
                )}
                value={props.formData.description}
                placeholder="Note Description"/>
        </Form.Group>
        <Form.Group>
            <Button data-testid="note-form-submit"
                onClick={createNote}>
                Create Note
            </Button>
        </Form.Group> 
    </Form> 
);
```

- Add a Bootstrap React [Card](https://react-bootstrap.github.io/components/cards) to `NoteList.js`
```js
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'

...

return (
  <div>
    {
        props.notes.map((note, index) => (
            <div key={'note-' + index}>
              <Card>
                <Card.Header data-testid={"test-name-" + index}>{note.name}</Card.Header>
                <Card.Body>
                  <Card.Text data-testid={"test-description-" + index}>
                    {note.description}
                  </Card.Text>
                  <Button variant="secondary" 
                    data-testid={'test-button-' + index}
                    onClick={() => props.deleteNoteCallback(note.id)}>
                      Delete note
                  </Button>
                </Card.Body>
              </Card>
              <br />
            </div>
        ))
    } 
  </div>
);
```

- Run all of the tests
- Green
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/2719526b7245d79590ab5b3155e42ae92ce344c6)

</details>

<details>

  <summary>Mobile App: Part 2</summary>

## Mobile App: Part 2
Modern applications are available through the web, mobile apps, Alexa, and so much more.  Our customer wants a [native](https://en.wikipedia.org/wiki/Mobile_app#Native_app) mobile Notes application.  While my first response was, "why?", they insisted on creating a native mobile app instead of just relying on the mobile-friendly web app that we created using Bootstrap.  In order to build native apps you have a couple choices.  First you can build an application for each mobile operating system: [iOS](https://en.wikipedia.org/wiki/IOS), [Android](https://en.wikipedia.org/wiki/Android_(operating_system)).  If you went down this path you would need to write the iOS application in [Swift](https://en.wikipedia.org/wiki/Swift_(programming_language)) or [Objective-C](https://en.wikipedia.org/wiki/Objective-C).  For Android you would need to write the application in [Java](https://en.wikipedia.org/wiki/Java_(programming_language)).  This is a sensible investment if these native applications need to be highly performant or utilize specific low-level device functionality like iOS's [Face ID](https://en.wikipedia.org/wiki/Face_ID).  In the case of our Notes App none of this applies.  Instead, we should use a code-once deploy everywhere solution like [React Native](https://reactnative.dev/) or [Xamarin](https://dotnet.microsoft.com/apps/xamarin).  These frameworks allow you to code once, in a single language, and deploy separate apps for each mobile operating system.

Since we already built this application in React it seems reasonable that we would build the mobile native application in React Native.  While they are different frameworks they use a similar approach and have similar syntax which makes it easier to learn and support.  As for the AWS backend we want to reuse the same Amplify backend for all of the applications: web, iOS, Android, etc.  The reuse of a single backend service is enabled through a [Service-Oriented Architecture](https://en.wikipedia.org/wiki/Service-oriented_architecture).  While each frontend might be different we want the backend logic to be the same.  The backend logic is where our business makes money, so we need to keep it safe, performant and bug free.  This is much easier when our backend logic is not duplicated for every frontend application.

To build this React Native App we will use the [Expo](https://expo.io) framework.  Expo simplifies the creation, testing and deployment of React Native applications.  The code and the tutorial for this second React Native App is available in the following repository: https://github.com/pairing4good/tdd-amplify-react-native.

</details>


