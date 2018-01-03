import * as React from 'react';
import { Form, Field, FormRenderProps, FieldRenderProps } from 'react-final-form';

export interface FormData1 {
  first_name: string;
  last_name: string;
  email: string;
}

interface MyForm1Props {
  onSubmit: ( formData?: {} ) => void;
}

export class MyForm1  extends React.Component<MyForm1Props> {

  emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  constructor( p: MyForm1Props ) {
    super(p);
  }

  validateRequired = ( value: string ) => {
    return value ? undefined : 'Required';
  }

  handleValidateEmail = ( value: string ): Promise<string> | string  => {
    console.log('validating email...');
    if ( !value ) {
      return 'Required';
    } else {
      return new Promise<string> ( (resolve, reject) => {
        const isValid = this.emailRegex.test(value);
        setTimeout( () => resolve( isValid ? undefined : 'Invalid' ), 500 );
      });
    }
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
              <h2>🏁 react-final-form with async validation</h2>
              <Field name="first_name" validate={this.validateRequired} validateFields={[]}>
                {({ meta, input }) => (
                  <div className="my-form-field" key="fname" >
                    <label>First Name</label>
                    <input
                        type="text"
                        placeholder="Your given name here"
                        className={(!meta.pristine || meta.touched ? meta.error || 'Valid' : '') as string}
                        {...input}
                    />
                  </div>
                )}
              </Field>
              <Field name="last_name" validate={this.validateRequired} validateFields={[]}>
                {( { meta, input }) => (
                  <div className="my-form-field" key="lname">
                    <label>Last Name</label>
                    <input
                        type="text"
                        placeholder="Your last name here"
                        className={(!meta.pristine || meta.touched ? meta.error || 'Valid' : '') as string}
                        {...input}
                    />
                  </div>
                )}
              </Field>
              <Field name="email" validate={this.handleValidateEmail}  validateFields={[]}>
                {( {meta, input}: FieldRenderProps ) => {
                  const classval = (!meta.pristine || meta.touched ? meta.error || 'Valid' : '') as string;
                  // console.log('email class=', classval, ' - error=', meta.error);
                  return (
                  <div className="my-form-field" key="email">
                    <label>Email</label>
                    <input {...input} type="email" placeholder="your email here" className={classval} />
                  </div>);
                }}
              </Field>
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
