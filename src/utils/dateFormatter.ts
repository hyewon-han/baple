// export function formatDate(inputDate: Date | string) {
//   const date = new Date(inputDate);
//   const year = date.getFullYear().toString().slice(2);
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const day = date.getDate().toString().padStart(2, '0');

//   return `${year}-${month}-${day}`;
// }
export function formatDate(inputDate: Date | string) {
  const date = new Date(inputDate);
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}. ${month}. ${day} ${hours}:${minutes}`;
}
