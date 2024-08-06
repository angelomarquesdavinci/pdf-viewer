function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getDefaultDateFormat(date: Date) {
  const res = `${date.toLocaleString("pt-BR", {
    month: "long",
  })}/${date.getFullYear()}`;

  return capitalizeFirstLetter(res);
}

export function getFullDateFormat(date: Date) {
  const res = `${date.getDate()} de ${date.toLocaleString("pt-BR", {
    month: "long",
  })} de ${date.getFullYear()}`;

  return capitalizeFirstLetter(res);
}
