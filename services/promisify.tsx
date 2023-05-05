export function promisify<T extends (...args: any[]) => void, TResult>(
  fn: (callback: (result: TResult) => void) => void,
): (...args: Parameters<T>) => Promise<TResult> {
  return (...args: Parameters<T>) => {
    return new Promise<TResult>((resolve, reject) => {
      const callback = (result: TResult) => {
        resolve(result);
      };

      fn(callback);
    });
  };
}
