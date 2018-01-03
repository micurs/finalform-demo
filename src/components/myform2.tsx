import * as React from 'react';
import { Form, Field, FormRenderProps, FieldRenderProps } from 'react-final-form';

import Validator from '../common/rxvalidator';
import '../common/rxmapdistinct';

export interface FormData2 {
  first_name: string;
  last_name: string;
  email: string;
}

// const emptyUser = {
//   first_name: '',
//   last_name: '',
//   email: ''
// };

interface MyFormProps {
  onSubmit: ( formData?: {} ) => void;
}

export class MyForm2  extends React.Component<MyFormProps> {

  validator: Validator<string>;
  emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  emailValid: string | undefined;

  constructor( p: MyFormProps ) {
    super(p);
    this.validator = new Validator<string>('Required');
  }

  /**
   * Here we setup the Reactive Validator
   * We use debounceTime() to perform validation only when there are 1.5s of no new value
   */
  componentDidMount() {
    this.validator.observable
    .debounceTime(1500)
    .mapDistinctUntilChanged( (val) => {
      const isValid = this.emailRegex.test(val);
      console.log('validation complete', val, isValid );
      return isValid ? undefined : 'Invalid' ;
    })
    .subscribe( (valid) => {
      this.emailValid = valid ;
      this.validator.resolve(this.emailValid);
    });
  }

  componentWillUnmount() {
    this.validator.unsubscribe();
  }

  validateRequired = ( value: string ) => {
    return value ? undefined : 'Required';
  }

  render() {
    return (
      <Form
        onSubmit={this.props.onSubmit}
      >
        { ( formp: FormRenderProps ) => {
          // console.log('Invalid?', formp.invalid);
          return (
            <form onSubmit={formp.handleSubmit}>
              <h2>🏁 react-final-form with RxJs validation</h2>
              <div className="my-form-field" key="fname" >
                <label>First Name</label>
                <Field name="first_name" validate={this.validateRequired} validateFields={[]}>
                  {({ meta, input }) => {
                    return (
                      <input
                        type="text"
                        className={((!meta.pristine || meta.touched) ? meta.error || 'Valid' : '') as string}
                        {...input}
                      />);
                  }}
                </Field>
              </div>
              <div className="my-form-field" key="lname">
                <label>Last Name</label>
                <Field name="last_name" validate={this.validateRequired} validateFields={[]}>
                  {( { meta, input } ) => (
                    <input
                      type="text"
                      className={(!meta.pristine || meta.touched ? meta.error || 'Valid' : '' ) as string}
                      {...input}
                    />)}
                </Field>
              </div>
              <div className="my-form-field" key="email">
                <label>Email</label>
                <Field name="email" validate={this.validator.validate} validateFields={[]}>
                  {( {meta, input}: FieldRenderProps ) => {
                    // const classval = meta.pristine ? '' : this.emailValid || 'Valid';
                    const classval = (( !formp.validating && (!meta.pristine || meta.touched)) ? meta.error || 'Valid' : '') as string;
                    // console.log('email class=', classval, ' - error=', meta.error);
                    return <input {...input} type="email"  className={classval} />;
                  }}
                </Field>
              </div>
              <div>
                  <p>The form is {formp.validating ? 'Validating...' : formp.invalid ? 'Invalid' : 'Valid'}</p>
                  <input
                    type="submit"
                    disabled={formp.pristine || formp.error || formp.validating || formp.invalid}
                    value={formp.validating ? 'validating...' : 'Submit Form'}
                  />
              </div>
            </form>
          );
      }}
      </Form>
    );
  }
}
