# TDD AWS Amplify React App

In this tutorial we will [test drive](https://en.wikipedia.org/wiki/Test-driven_development) a react app. We will use [AWS Amplify](https://aws.amazon.com/amplify) to set up authentication and the backend API.

## Approach

Test driving an application often starts at the bottom of the [testing pyramid](https://martinfowler.com/bliki/TestPyramid.html) in [unit tests](https://en.wikipedia.org/wiki/Unit_testing). Unit tests focus on testing small units of code in isolation. However, this tutorial will start at the top of the pyramid with user interface (UI) testing. This approach is often called [Acceptance Test Driven Development](https://en.wikipedia.org/wiki/Acceptance_test%E2%80%93driven_development) (ATDD).

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
- [Node.js](https://nodejs.org)

### Red - Acceptance Test

The user story and acceptance criteria above describe a desired customer outcome. The user acceptance test will link this narrative with a high level how. For this tutorial our first application will be a [web application](https://en.wikipedia.org/wiki/Web_application) in [React](https://reactjs.org). The testing framework we will use to test this will be [Cypress](https://www.cypress.io)

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
  cy.visit("/");
});

describe("Note Capture", () => {
  it("should create a note when name and description provided", () => {
    expect(true).to.equal(true);
  });
});
```

- Click on the `note.spec.js` test in the Cypress test browser. The test should run and should pass (green).
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

- Now the Cypresss test fails on the note description

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

We could just make these changes and this high-level test would not break. But these changes have external impact on how the customer understands and uses this application. Assuming these changes are needed then we must drive them through tests. One "internal structure" change that could help is pulling this form out into a [react component](https://reactjs.org/docs/thinking-in-react.html#step-1-break-the-ui-into-a-component-hierarchy) so that we can drive these changes independently. Eventually `App.js` will have several components:

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

## NoteForm Test

Now that we have a high-level Cypress test in place, let's move down the testing pyramid into a component test. This test will use the React Testing Library's [render](https://testing-library.com/docs/react-testing-library/cheatsheet/) function to render the `NoteForm` component and assert it's contents.

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

These three user acceptance criteria will drive the need to actually save notes. While this can be achieved through component tests, let's add this to our high-level UI test. These tests are often called end-to-end tests because they follow a few paths through the application. These test are at the top of the testing pyramid because they tend to be slower and more brittle than tests lower in the pyramid. This translates into these tests tending to cost more to build, run and maintain. Consequently, we try to limit their number to only a few tests that follow typical paths through the system.

- Let's start with the first acceptance criteria. To achieve this we need to add an initial check, in `note.spec.js`, to verify that no notes are listed prior to entering a note.

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
<input data-testid="note-name-field" 
  onChange={e => props.setFormDataCallback({ 
      ...props.formData, 
      'name': e.target.value}
  )}
  placeholder="Note Name"/>
```
- The `onChange` function is called every time the name is changed.  
  - The `e` is the event which is used to get the target element which contains the value that the user entered.  
  - The [=>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) is an arrow function expression which is an alternative to a traditional javascript function expression.
  - The rest of the function is a call to the `setFormData` hook that we passed to the `NoteForm` component.  If this were not spread across 3 lines it would read more like this `setFormDataCallback({'name': 'some value'})`.  Granted there is one more thing happening in this call, the existing form data is being [spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) with the `...` syntax.  Simply put we are creating a new javascript object by opening and closing with curly braces.  Add all of the existing form data prior to the change.  And finally add the new `name` value which will overwrite the form data that was spread.  There is a lot going on in this small function.

- Add an `onChange` attribute to the `note-description-field` element
```js 
<input data-testid="note-description-field" 
    onChange={e => props.setFormDataCallback({ 
        ...props.formData, 
        'description': e.target.value}
    )}
    placeholder="Note Description"/>
```
- This is exactly the same as the name `onChange` function with the exception of the targe value's field name `'description'`.

- Add an `onClick` attribute to the `note-form-submit` element
```js
<button data-testid="note-form-submit"
  onClick={() => props.setNotesCallback([ ...props.notes, props.formData ])}>
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
- The `NoteForm.test.js` component test does not pass any parameters to the component so the `props.notes` is [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined).  In order to fix this test we must pass an array of `notes` to the `NoteForm` component.
```js
beforeEach(() => {
    render(<NoteForm notes={[]}/>)
});
```
- The simplest thing that you can do is pass an empty array to `NoteForm`.  And the tests pass.

- All of our tests are Green!
- Don't forget to commit your changes

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/b9b6171a1ec15809d389d925ecc37aab629bcb1d)

## Refactor - Single Responsibility
> The Single Responsibility Principle (SRP) states that each software module should have one and only one reason to change. - Robert C. Martin

Now it's clear that the `NoteForm` component has more than one responsibility:
```js
function NoteForm(props) {
    return (
        <div>
            // 1. Note Creation
            <input data-testid="note-name-field" 
                onChange={e => props.setFormDataCallback({ 
                    ...props.formData, 
                    'name': e.target.value}
                )}
                placeholder="Note Name"/>
            <input data-testid="note-description-field" 
                onChange={e => props.setFormDataCallback({ 
                    ...props.formData, 
                    'description': e.target.value}
                )}
                placeholder="Note Description"/>
            <button data-testid="note-form-submit"
                onClick={() => props.setNotesCallback([ ...props.notes, props.formData ])}>
                Create Note
            </button>
            // 2. Note Listing
            {
                props.notes.map((note, index) => (
                    <div>
                        <p data-testid={"test-name-" + index}>{note.name}</p>
                        <p data-testid={"test-description-" + index}>{note.description}</p>  
                    </div>
                ))
            }  
        </div> 
    );
}
```
If you go up to the `App` component the call to the `NoteForm` component takes 4 arguments.  This is a [smell](https://en.wikipedia.org/wiki/Code_smell) pointing to the fact that this component is doing too many things.
```js
<NoteForm notes={notes}  
  formData={formData} 
  setFormDataCallback={setFormData} 
  setNotesCallback={setNotes}/>
```
> Functions should have a small number of arguments. No argument is best, followed by one, two, and three. More than three is very questionable and should be avoided with prejudice. - Robert C. Martin

While components don't look like functions when they are called but they are.  React uses [JSX](https://reactjs.org/docs/introducing-jsx.html) which is interpreted into functions.

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
- Cut the JSX that lists notes in the `NoteForm` component and paste the in the new component.
```js
function NoteList(props) {

  return (
    <div>
      {
          props.notes.map((note, index) => (
              <div>
                  <p data-testid={"test-name-" + index}>{note.name}</p>
                  <p data-testid={"test-description-" + index}>{note.description}</p>  
              </div>
          ))
      } 
    </div>
  );
}

export default NoteList;
```
- Now instead of adding the `NoteList` component back into the `NoteForm` component, bring it up a level and place it in the `App` component.  This prevents unnecessary [coupling](https://en.wikipedia.org/wiki/Coupling_(computer_programming)) between the `NoteForm` component and the `NoteList` component.
```js
import './App.css';
import NoteForm from './NoteForm';
import React, { useState } from 'react';
import NoteList from './NoteList';

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });

  return (
    <div className="App">
      <NoteForm notes={notes}  
        formData={formData} 
        setFormDataCallback={setFormData} 
        setNotesCallback={setNotes}/>
      <NoteList notes={notes}/>
    </div>
  );
}

export default App;
```
- Run all of your tests including Cypress. 
- It's Green!

[Code for this section](https://github.com/pairing4good/tdd-amplify-react/commit/8f8f00cb21ae991a253454a78a6043d38a91adfc)