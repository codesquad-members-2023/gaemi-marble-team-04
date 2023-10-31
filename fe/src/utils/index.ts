export function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function addCommasToNumber(number: number) {
  return `${number.toLocaleString('ko')}`;
}
