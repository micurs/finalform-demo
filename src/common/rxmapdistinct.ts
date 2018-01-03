
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

export type MapDistinct<T> = <R>( project: (value: T) => R,
                                  compare?: (a: T, b: T) => boolean ) => Observable<R>;

/**
 * Custom operator for Observable.
 * Skip the project function if the value is the same as the last one
 * and produce the same result (saved) for the same value mapped before.
 * @param this is the Observable
 * @param project is the mapping function that computes R
 */
function mapDistinctUntilChanged<T, R>(
  this: Observable<T>,
  project: (value: T) => R,
  compare?: (a: T, b: T) => boolean
) {
  return Observable.create( (subscriber: Subscriber<R>) => {
    const source = this;
    let lastValue: T;
    let lastResult: R;
    const subscription = source.subscribe(
      ( value: T ) => {
        try {
          if ( compare !== undefined ) {
            lastResult = compare(value, lastValue) ? lastResult : project(value);
          } else {
            lastResult = value === lastValue ? lastResult : project(value);
          }
          subscriber.next( lastResult );
          lastValue = value;
        } catch ( err ) {
          subscriber.error(err);
        }
      },
      ( err ) => subscriber.error(err),
      () => subscriber.complete()
    );
    return subscription;
  });
}

// Patch Observable.prototype directly adding the new operator
Observable.prototype.mapDistinctUntilChanged = mapDistinctUntilChanged;

// Patch the Observable interface with the new operator definition
declare module 'rxjs/Observable' {
  // tslint:disable-next-line:no-shadowed-variable
  interface Observable<T> {
    mapDistinctUntilChanged: MapDistinct<T>;
  }
}