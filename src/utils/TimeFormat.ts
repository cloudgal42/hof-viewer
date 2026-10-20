export function fromDecimalTime(time: number) {
  const hour = Math.floor(time);
  const minutes = Math.round((time - hour) * 60);
  const initialFormat = `${hour}:${minutes}`;
  
  return new Date(
    new Date().toDateString() + " " + initialFormat,
  ).toLocaleTimeString(undefined, {timeStyle: "short"})
}