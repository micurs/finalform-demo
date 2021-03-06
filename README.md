# Testing react-final-form with TypeScript

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).


## Available Scripts

In the project directory, you can run:

`npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

`npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

`npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

`npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## About Final-Form

`final-form` and `react-final-form` are two libraries developed by Erik Rasmussen, the same developer that built `redux-form`.

The new library was developed to overcome the main problems people have encountered with `redux-form`:

1 - works without React (the base library ...)
2 - does not use Redux to monitor the form state
3 - can use inline render function a-la React-Router-4
4 - smaller and faster

The new library `final-form` is based on the Observer Pattern. The companion library `react-final-form` is a thin layer
providing basic React support.

In `final-form` the state of the form is managed by the library and not deferred to Redux.

In `react-final-form` we can render the components using inline render functions.

This part is being pretty much copied from Formik (as admitted by the author himself [here](https://codeburst.io/final-form-the-road-to-the-checkered-flag-cd9b75c25fe).

## Use with Typescript

The library comes with type definitions for TypeScript (along with typedefinition for Flow ). However the author did not put the type directive in the package.json.
So, when trying to import the `final-form` in a TypeScript code we get an error:

```
(2,88): error TS7016: Could not find a declaration file for module 'final-form'.
```

To solve this we need to set `"noImplicitAny": false` in tsconfig.json.

The library is very young and the author is introducing breaking changes on a daily basis.
In the past 7 days at the time of this writing 2 major breaking changes were introduced moving the version from 1.3.5 to 3.0.0 !

### Form and Field

When using `react-final-form` we use the `<Form>` element to control a regular `<form>`:

```typescript
export function MyForm() {
  return (
    <Form
        initialValues{initValueObj}
        onSubmit={submitFunction}
        validate={validateFunction}>
      {(p: FormProps) =>(
        <form onSubmit={p.handleSubmit}>
          ...
        </form>
      )}
    </Form>
  );
}
```

Inside the form we can use the `<Field>` component to wrap input elements that contribute to the form data:

```typescript
<Field name="email" validate={required}>
  {( fp: FieldProps ) => (<input type="email" {...fp.input} /> )}
</Field>
```

## Overall

The `Form` component accepts a propriety called mutators that can be used to validate single Field.

The validate function is called on first rendering (this is different than Formik).

To enable the submit of the form the conditions are the same as in Formik, since the rendering function
do receive 3 variables defining the submittability of the form: `!pristine && !error && !invalid`:

```typescript
export function MyForm() {
  return (
    <Form ...>
      {( {pristine, error, invalid}: FormProps) =>(
        <form ...>
          ...
          <input type="submit" disabled={pristine || error || invalid} value="Submit Form" />
        </form>
      )}
    </Form>
  );
}
```

## Single field validation

The `<Field>` component offers a very convenient Sync and Async `validate` property that can be used to link the
filed to a validation function to perform check on a single field.

This is a nice plus in comparison with Formik.

The `Field` even accepts a [validateFields property](https://github.com/final-form/react-final-form#validatefields-string) that can contain an array of fields to validate when this one change. When the array is empty only the current field should be validated when changed.

This feature *seems to work* in the most recent version of the library (while it was not working on an earlier version).
But the use of the props is upsetting the tsc compiler because of a missing typedef in the library.

## Negatives

This is perhaps the most negative element on this library: the type definitions do not seems to be complete,
so the editor support is sometime compromised and your code may just not compile at all.

However, the author is fixing these problems quickly, we could also submit PR to add some fix ourselves.

As of now I had to set `"noImplicitAny": false` to be able to compile without errors using this library.
Hopefully this will be fixed soon with updated type definitions.

This is a pretty young library.
As mentioned, the authors have been committing frequent breaking changes and have been releasing multiple major versions of the library within just few days.

I do expect the code will stabilize soon and the major issues have been addressed.
