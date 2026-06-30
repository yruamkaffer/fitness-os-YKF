export const brNumber = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1
});

export function kg(value: number) {
  return `${brNumber.format(value)}kg`;
}

export function liters(value: number) {
  return `${brNumber.format(value)}L`;
}

export function minutes(value: number) {
  if (value < 60) return `${value}min`;
  const hours = Math.floor(value / 60);
  const mins = value % 60;
  return mins ? `${hours}h ${mins}min` : `${hours}h`;
}
