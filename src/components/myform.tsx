// /// <reference types="../../node_modules/react-final-form/dist" />
// import * as _ from 'lodash';
import * as React from 'react';
import { Form, Field, FormRenderProps, FieldRenderProps } from 'react-final-form';

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

export class MyForm  extends React.Component<MyFormProps> {

  emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  constructor( p: MyFormProps ) {
    super(p);
  }

  validateRequired = ( value: string ) => {
    console.log('validating required field ...');
    return value ? undefined : 'Required';
  }

  handleValidateEmail = ( value: string ): Promise<string> | string  => {
    console.log('validating email...');
    if ( !value ) {
      return 'Required';
    } else {
      return new Promise<string> ( (resolve, reject) => {
        const isValid = this.emailRegex.test(value);
        console.log('validation complete', value, isValid );
        setTimeout( () => resolve( isValid ? undefined : 'Invalid' ), 500 );
      });
    }
  }

  render() {
    return (
      <Form
        initialValue={emptyUser}
        onSubmit={this.props.onSubmit}
        validateOnBlurr={false}
      >
        { ( formp: FormRenderProps ) => {
          // console.log('Invalid?', formp.invalid);
          return (
            <form onSubmit={formp.handleSubmit}>
              <h2>🏁 final-form with async validation</h2>
              <div className="my-form-field" key="fname" >
                <label>First Name</label>
                <Field name="first_name" validate={this.validateRequired} validateFields={[ 'first_name' ]}>
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
                  {( { meta, input }) => (
                    <input
                      type="text"
                      className={!meta.pristine || meta.touched ? meta.error || 'Valid' : ''}
                      {...input}
                    />)}
                </Field>
              </div>
              <div className="my-form-field" key="email">
                <label>Email</label>
                <Field name="email" validate={this.handleValidateEmail}  validateFields={[]}>
                  {( {meta, invalid, input}: FieldRenderProps ) => {
                    const classval = !meta.pristine || meta.touched ? meta.error || 'Valid' : '';
                    // console.log('email class=', classval, ' - error=', meta.error);
                    return <input {...input} type="email"  className={classval} />;
                  }}
                </Field>
              </div>
              <div>
                  <p>The form is {formp.invalid ? 'Invalid' : 'Valid'} {formp.validating ? 'and validating ...' : ''}</p>
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
