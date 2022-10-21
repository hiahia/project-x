interface Observable<T> {
  subscribe: (o: Subscriber<T>) => Subscription;
}

interface Subscription {
  unsubscribe: () => void;
}

interface Subscriber<T> {
  onNext?: (value: T) => void;
  onComplete?: () => void;
}

interface Observer<T> {
  next: (value: T) => void;
  complete: () => void;
}

// #1 Create function
export function create<T>(f: (o: Observer<T>) => void): Observable<T> {
  const observable:Observable<T> = {
    subscribe: (s: Subscriber<T>) => {
      let isComplete:boolean = false;
      const observer: Observer<T> = {
        next: (value) => {
          if (isComplete) return;
          s.onNext?.(value);
        },
        complete: () => {
          if (isComplete) return;
          isComplete = true;
          s.onComplete?.();
        },
      };
      f(observer)
      const subscription: Subscription = {
        unsubscribe: () => {
          isComplete = true;
        }
      }
      return subscription;
    }
  }
  return observable;
}
// #2 Basic observables creation
export function of<T>(...xs: T[]): Observable<T> {
  const observable: Observable<T> = create((observer) => {
    xs.forEach((value) => {
      observer.next(value);
    });
    observer.complete();
  });
  return observable;
}

export function empty<T>(): Observable<T> {
  const observable: Observable<T> = create((observer) => {
    observer.complete();
  });
  return observable;
}

export const interval = (period: number): Observable<number> => {
  let timer: NodeJS.Timer;
  const observable: Observable<number> = create((observer) => {
    let count = 0;
    timer = setInterval(() => {
      observer.next(count++);
    }, period);
  });
  const _subscribe = observable.subscribe;
  observable.subscribe = (o: Subscriber<number>) => {
    const subscription = _subscribe(o);
    return {
      unsubscribe: () => {
        subscription.unsubscribe();
        clearInterval(timer);
      }
    }
  }
  return observable;
};
// #3 premier operators
export type Operator<T, R> = (o: Observable<T>) => Observable<R>;

// 
// const observable: Observable<number> = of(1,2,3);
// const newO = map((value: number)=> value * 2)(observable);
// newO.subscribe({})
export function map<T, R>(f: (x: T) => R): Operator<T, R> {
  return (observable: Observable<T>): Observable<R> => {
    const observable2: Observable<R> = create(observer => {
      observable.subscribe({
        onNext(value: T) {
          observer.next(f(value));
        },
        onComplete() {
          observer.complete();
        }
      })
    })
    
    return observable2;
  };
}
// const observable: Observable<number> = of(1,2,3);
// const newO = filter((value: number)=> value * 2)(observable);
// newO.subscribe({})
export function filter<T>(f: (x: T) => boolean): Operator<T, T> {
  return (observable: Observable<T>): Observable<T> => {
    const observable2: Observable<T> = create(observer => {
      observable.subscribe({
        onNext(value: T) {
          if (f(value)) { observer.next(value)}
        },
        onComplete() {
          observer.complete();
        }
      })
    })
    
    return observable2;
  };
}
// const observable: Observable<number> = of(1,2,3);
// const newO = reduce((acc, x) => (acc + x), 0)(observable);
// newO.subscribe({})
export function reduce<T, R>(f: (acc: R, x: T) => R, seed: R): Operator<T, R> {
  return (observable: Observable<T>): Observable<R> => {
    let result: R = seed;
    const observable2: Observable<R> = create(observer => {
      observable.subscribe({
        onNext(value: T) {
          result = f(result, value);
        },
        onComplete() {
          observer.next(result);
          observer.complete();
        }
      })
    })
    
    return observable2;
  };
}
