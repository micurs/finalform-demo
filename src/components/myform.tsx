// /// <reference types="../../node_modules/react-final-form/dist" />
// import * as _ from 'lodash';
import * as React from 'react';
import { Form, Field, FormRenderProps, FieldRenderProps } from 'react-final-form';
import * as Rx from 'rxjs/Rx';

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

  observableStream: Rx.Subscriber<string>;
  emailSubscription: Rx.Subscription;
  emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  emailValid: string | undefined;
  emailValidationResolve: (( s: string | undefined ) => void) | undefined;

  constructor( p: MyFormProps ) {
    super(p);
  }

  /**
   * Here we setup the Observable subscription for email validation.
   * We use debounceTime() to perform validation only when there are 1.5s of no new value
   * Note: the observableStream is a wrapper around the subscriber; we use it to inject values
   * in the stream when a new validation is required (see handleValidateEmail()).
   */
  componentDidMount() {
    this.emailSubscription = new Rx.Observable<string>( (observer) => this.observableStream = observer )
    .debounceTime(1500)
    .subscribe( (val) => {
      const isValid = this.emailRegex.test(val);
      console.log('validation complete', val, isValid );
      this.emailValid = isValid ? undefined : 'Invalid' ;
      if ( this.emailValidationResolve ) {
        this.emailValidationResolve(this.emailValid);
        this.emailValidationResolve = undefined;
      }
      }
    );
  }

  componentWillUnmount() {
    this.emailSubscription.unsubscribe();
  }

  validateRequired = ( value: string ) => {
    return value ? undefined : 'Required';
  }

  handleValidateEmail = ( value: string ) => {
    if ( !value ) {
      return 'Required';
    }
    if ( this.observableStream ) {
      this.observableStream.next(value);  // Push the value into the Observable stream
    }
    return new Promise( ( resolve, reject ) => {
      if ( this.emailValidationResolve ) {
        console.log('abort previous validation ...');
        this.emailValidationResolve('Invalid'); // Complete the previous promise without validation
      }
      this.emailValidationResolve = resolve;
    });
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
              <h2>🏁 Here is my final-form</h2>
              <div className="my-form-field" key="fname" >
                <label>First Name</label>
                <Field name="first_name" validate={this.validateRequired} >
                  {(fp: FieldRenderProps) => {
                    return (
                      <input
                        type="text"
                        className={fp.meta.touched ? fp.meta.error || 'Valid' : ''}
                        {...fp.input}
                      />);
                  }}
                </Field>
              </div>
              <div className="my-form-field" key="lname">
                <label>Last Name</label>
                <Field name="last_name" validate={this.validateRequired}>
                  {(fp: FieldRenderProps) => (
                    <input
                      type="text"
                      className={fp.meta.touched ? fp.meta.error || 'Valid' : ''}
                      {...fp.input}
                    />)}
                </Field>
              </div>
              <div className="my-form-field" key="email">
                <label>Email</label>
                <Field name="email" validate={this.handleValidateEmail} >
                  {( {meta, invalid, input}: FieldRenderProps ) => {
                    const classval = meta.pristine ? '' : this.emailValid || 'Valid';
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
