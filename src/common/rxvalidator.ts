import * as Rx from 'rxjs/Rx';

export default class Validator<T> {
  private validationResolve?: ( s: T | undefined ) => void;
  private _observable: Rx.Observable<T>;
  private onEmpty: T | undefined;
  private observer: Rx.Subscriber<T>;

  constructor( onEmpty?: T ) {
    this.onEmpty = onEmpty;
  }

  public get observable() {
    this._observable = new Rx.Observable<T>( (observer) => this.observer = observer );
    return this._observable;
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
