import * as Rx from 'rxjs/Rx';

export default class Validator<T> {
  public observable: Rx.Observable<T>;
  public validationResolve?: ( s: T | undefined ) => void;
  private onEmpty: T | undefined;
  private observer: Rx.Subscriber<T>;

  constructor( onEmpty?: T ) {
    this.onEmpty = onEmpty;
    this.observable = new Rx.Observable<T>( (observer) => this.observer = observer );
  }

  public validate = ( value: T ): Promise<T> | T => {
    if ( this.onEmpty && !value ) {
      return this.onEmpty;
    }
    this.observer.next(value);
    return new Promise<T>( (resolve) => {
      if ( this.validationResolve ) {
        console.log('resolve pending validation');
        this.validationResolve(undefined);
      }
      this.validationResolve = resolve;
    });
  }

  public resolve( valid: T | undefined ) {
    if ( this.validationResolve ) {
      this.validationResolve(valid);
      this.validationResolve = undefined;
    }
  }

  public unsubscribe() {
    this.observer.unsubscribe();
  }
}
