interface Observable<T> {
  subscribe: (o: Subscriber<T>) => Subscription;
}

interface Subscription {
  unsubscribe: () => void;
}

interface Subscriber<T> {
  onNext?: (value: T) => void;
  onComplete?: () => void;
  onError?: () => void;
}

interface Observer<T> {
  next: (value: T) => void;
  complete: () => void;
  error: () => void;
}

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
        error: () => {
          if (isComplete) return;
          isComplete = true;
          s.onError?.();
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

export function of(numbers) {
  const observable = create((observer) => {
    numbers.forEach((value) => {
      observer.next(value);
    });
    observer.complete();
  });
  return observable;
}

async function get(api) {
  const response = await fetch(api);
  const result = await response.json();
  return result;
}
export function ajax(api) {
  const observable = create((observer) => {
    get(api).then((data) => {
      observer.next(data)
      observer.complete();
    })
    .catch(() => {
      observer.error();
    })
  });
  return observable;
}
// const observalbe = ajax('http://studio-dev.wzhxlx.com/zx/course/list?keyword=&courseId=&startTime=&endTime=&studioId=&consultantId=&status=&sortColumn=&sortDesc=0&specialStatus=&type=&online=&pageNo=1&pageSize=50&fuckIE=5073724956780086');
// observalbe.subscribe({
//   onNext(value) {console.log("===", value)},
//   onComplete() {console.log('complete')},
// })
// of([1,2,3]).subscribe({
//   onNext() {},
//   onComplete() {},
// })