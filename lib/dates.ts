export function readDate(formData: FormData, prefix = "") {
  const year = Number(formData.get(`${prefix}year`));
  const month = Number(formData.get(`${prefix}month`));
  const day = Number(formData.get(`${prefix}day`));
  const hour = Number(formData.get(`${prefix}hour`));
  const minute = Number(formData.get(`${prefix}minute`));
  if (![year, month, day, hour, minute].every((part) => Number.isFinite(part))) return null;
  const date = new Date(year, month - 1, day, hour, minute, 0, 0);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute
  ) {
    return null;
  }
  return date.toISOString();
}

export function dateParts(value?: string | null) {
  const date = value ? new Date(value) : new Date();
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}
