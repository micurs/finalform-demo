import * as React from 'react';
import { Form, Field, FormRenderProps, FieldRenderProps } from 'react-final-form';
// import * as Rx from 'rxjs/Rx';

import Validator from './rxValidator';

export interface FormData {
  first_name: string;
  last_name: string;
  email: string;
}

// interface FormDataErrors {
//   first_name?: string;
//   last_name?: string;
//   email?: string;
// }
const emptyUser: FormData = {
  first_name: '',
  last_name: '',
  email: ''
};

interface MyFormProps {
  onSubmit: ( formData?: FormData ) => void;
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
    .map( (val) => {
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
        initialValue={emptyUser}
        onSubmit={this.props.onSubmit}
      >
        { ( formp: FormRenderProps ) => {
          // console.log('Invalid?', formp.invalid);
          return (
            <form onSubmit={formp.handleSubmit}>
              <h2>🏁 final-form with RxJs validation</h2>
              <div className="my-form-field" key="fname" >
                <label>First Name</label>
                <Field name="first_name" validate={this.validateRequired} validateFields={[]}>
                  {({ meta, input }) => {
                    return (
                      <input
                        type="text"
                        className={!meta.pristine || meta.touched ? meta.error || 'Valid' : ''}
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
                      className={!meta.pristine || meta.touched ? meta.error || 'Valid' : ''}
                      {...input}
                    />)}
                </Field>
              </div>
              <div className="my-form-field" key="email">
                <label>Email</label>
                <Field name="email" validate={this.validator.validate} validateFields={[]}>
                  {( {meta, invalid, input}: FieldRenderProps ) => {
                    // const classval = meta.pristine ? '' : this.emailValid || 'Valid';
                    const classval = ( !formp.validating && (!meta.pristine || meta.touched)) ? meta.error || 'Valid' : '';
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

// function validateEmail( value: string ): Promise<string> {
//   return new Promise<string>( (resolve, reject) => {
//     if (!value) {
//       resolve('Required');
//     } else {
//       const result = Rx.Observable.of(value)
//                        .debounceTime(1000);
//       result.subscribe(
//           (v) => {
//             return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(v) ?
//               resolve('Invalid') :
//               resolve(undefined);
//           }
//         );
//     }
//   });
// }

// function validate( formData: FormData ): Promise<FormDataErrors> {
//   return new Promise<FormDataErrors>( (resolve, reject) => {
//     setTimeout(
//       () => {
//         const errors: FormDataErrors = {};
//         if ( !formData.first_name ) {
//           errors.first_name = 'Required';
//         }
//         if ( !formData.last_name ) {
//           errors.last_name = 'Required';
//         }
//         if ( !formData.email ) {
//           errors.email = 'Required';
//         } else if ( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email) ) {
//           errors.email = 'Invalid';
//         }
//         resolve(errors);
//       },
//       3000 );
//   });
// }
