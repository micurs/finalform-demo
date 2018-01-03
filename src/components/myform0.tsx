import * as React from 'react';
import * as finalForm from 'final-form';

interface FormState<T> {
  active?: string;
  error?: Error;
  dirty?: boolean;
  errors?: object; // { [ fieldName: string ]: string | undefined }; // object;
  initialValues?: object;
  invalid?: boolean;
  pristine?: boolean;
  submitError?: Error;
  submitErrors?: object;
  submitFailed?: boolean;
  submitSucceeded?: boolean;
  submitting?: boolean;
  valid?: boolean;
  validating?: boolean;
  values?: T;
}

export interface FormData0 {
  first_name?: string;
  last_name?: string;
  email?: string;
}

interface MyForm0Props {
  onSubmit: ( formData?: {} ) => void;
}

const initialFormValue: FormData0 = {
  first_name: '',
  last_name: '',
  email: ''
};

interface MyForm0State {
  formState?: FormState<FormData0>; // // cannot use finalForm.InternalFormState !!
  first_name?: finalForm.FieldState;
  last_name?: finalForm.FieldState;
  email?: finalForm.FieldState;
}

export class MyForm0 extends React.Component<MyForm0Props, MyForm0State> {

  emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  formApi: finalForm.FormApi;
  unsubscribe: finalForm.Unsubscribe;
  unsubscribeFields: finalForm.Unsubscribe[];

  constructor( p: MyForm0Props ) {
    super(p);
    this.state = {};
    this.formApi = finalForm.createForm({
      initialValues: initialFormValue,
      onSubmit: p.onSubmit
    });
  }

  componentDidMount() {

    // subscribe to form changes
    this.unsubscribe = this.formApi.subscribe(
      ( newState ) => {
        const newFormState: FormState<FormData0> = {
          ...newState,
          error: newState.error as Error,
          submitError: newState.submitError as Error,
          values: { ...newState.values }
        };
        this.setState({ formState: newFormState });
      },
      { active: true, pristine: true, submitting: true, values: true, errors: true }
    );

    // subscribe to fields changes
    this.unsubscribeFields = Object.keys(initialFormValue)
      .map( fieldName => {
        return this.formApi.registerField(
          fieldName,
          // Update field UI
          fieldState => {
            // const { value } = fieldState;
            this.setState( (state) => ({
              ...state,
              [fieldName]: {
                ...fieldState,
                error: fieldState.value ? undefined : 'Required'
              }
            }));
          },
          // FieldSubscription: the list of values you want to be updated about
          { value: true, error: true },
          {}
       );
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribeFields.forEach( u => u() );
  }

  handleSubmit = event => {
    event.preventDefault();
    this.formApi.submit();
  }

  render() {
    const { first_name, last_name, email } = this.state;
    return <form onSubmit={this.handleSubmit}>
      <h2>🏁 final-form with Observer validation</h2>
      <div className="my-form-field" key="fname" >
        <label>First Name</label>
        <input
            type="text"
            placeholder="Your given name here"
            className={first_name && first_name.error}
            value={first_name && first_name.value}
            onChange={event => this.formApi.change( 'first_name', event.target.value )}
        />
      </div>
      <div className="my-form-field" key="lname">
        <label>Last Name</label>
        <input
            type="text"
            placeholder="Your last name here"
            className={last_name && last_name.error}
            value={last_name && last_name.value}
            onChange={event => this.formApi.change( 'last_name', event.target.value )}
        />
      </div>
      <div className="my-form-field" key="email">
        <label>Email</label>
        <input
          type="email"
          placeholder="your email here"
          className={email && email.error}
          value={email && email.value}
          onChange={event => this.formApi.change( 'email', event.target.value )}
        />
      </div>
      <div>
        <p>The form is {'status here'} {'validating here'}</p>
          <input
            type="submit"
            disabled={false}
            value={'Submit Form'}
          />
      </div>
    </form>;
  }
}
