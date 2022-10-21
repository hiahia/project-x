import EventEmitter from 'event-emitter';
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
  let _o: Observer<number>;
  const observable: Observable<number> = create((observer) => {
    let count = 0;
    timer = setInterval(() => {
      observer.next(count++);
    }, period);
    _o = observer;
  });
  const _subscribe = observable.subscribe;
  observable.subscribe = (o: Subscriber<number>) => {
    const subscription = _subscribe(o);
    return {
      unsubscribe: () => {
        subscription.unsubscribe();
        clearInterval(timer);
        _o.complete();
      }
    }
  }
  return observable;
};

export const fromEvent = (
  emitter: EventEmitter,
  eventName: string
): Observable<Event> => {
  let listener: (value: any) => void;
  let _o: Observer<Event>;
  const observable: Observable<Event> = create((observer) => {
    _o = observer;
    listener = observer.next;
    emitter.on(eventName, listener);
  });
  const _subscribe = observable.subscribe;
  observable.subscribe = (o: Subscriber<Event>) => {
    const subscription = _subscribe(o);
    return {
      unsubscribe: () => {
        _o.complete();
        emitter.off(eventName, listener);
        subscription.unsubscribe();
      }
    }
  }
  
  return observable;
};