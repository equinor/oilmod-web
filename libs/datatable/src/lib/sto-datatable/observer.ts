import { Observable } from 'rxjs';

export const observeWidth = (el: HTMLElement) => {
  return new Observable<number>((subscriber) => {
    const cb = (entries: ResizeObserverEntry[]) => {
      const entry = entries.find((e) => e.contentRect);
      const rect = entry?.contentRect;
      subscriber.next(rect?.width ?? 0);
    };
    const observer = new ResizeObserver(cb);
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  });
};
