export const wait = (timer: number) =>
  new Promise((resolve) => setTimeout(resolve, timer));
