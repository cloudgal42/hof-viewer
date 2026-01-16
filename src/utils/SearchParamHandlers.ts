export function handleSetSearchParams(searchParams: URLSearchParams, newKey: string, newValue: string) {
  const newSearchParams = new URLSearchParams(searchParams.toString());
  newSearchParams.set(newKey, newValue);
  return newSearchParams;
}