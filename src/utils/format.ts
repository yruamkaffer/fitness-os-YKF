export const brNumber = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1
});

export function kg(value: number) {
  return `${brNumber.format(value)}kg`;
}

export function optionalKg(value: number | null | undefined) {
  return value === null || value === undefined ? "--" : kg(value);
}

export function minutes(value: number) {
  if (value < 60) return `${value}min`;
  const hours = Math.floor(value / 60);
  const mins = value % 60;
  return mins ? `${hours}h ${mins}min` : `${hours}h`;
}
