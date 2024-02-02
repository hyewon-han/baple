export function formatDate(inputDate: Date | string) {
  const formattedDate = new Date(inputDate).toLocaleString('ko');
  if (formattedDate.length === 22) return `${formattedDate.slice(0, 19)}`;
  else if (formattedDate.length === 23) return `${formattedDate.slice(0, 20)}`;
  else if (formattedDate.length === 24) return `${formattedDate.slice(0, 21)}`;
}

export function formatDateNoTime(inputDate: Date | string) {
  const date = new Date(inputDate);
  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(date);

  const trimmedDate = formattedDate.slice(0, -1);
  return trimmedDate;
}
