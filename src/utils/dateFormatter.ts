export function formatDate(inputDate: Date | string) {
  const date = new Date(inputDate);
  const formattedDate = new Date(inputDate).toLocaleString('ko');
  if (formattedDate.length === 23) return `${formattedDate.slice(0, 20)}`;
  else if (formattedDate.length === 24) return `${formattedDate.slice(0, 21)}`;
  // const year = date.getFullYear().toString().slice(2);
  // const month = (date.getMonth() + 1).toString().padStart(2, '0');
  // const day = date.getDate().toString().padStart(2, '0');
  // const hour = date.getHours().toString();

  // return `${formattedDate}`;
}
