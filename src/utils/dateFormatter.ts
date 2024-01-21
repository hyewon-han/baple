// export function formatDate(inputDate: Date | string) {
//   const date = new Date(inputDate);
//   const year = date.getFullYear().toString().slice(2);
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const day = date.getDate().toString().padStart(2, '0');

//   return `${year}-${month}-${day}`;
// }
export function formatDate(inputDate: Date | string) {
  const date = new Date(inputDate);
  const formattedDate = date.toLocaleString('ko').slice(0, 20);
  // const year = date.getFullYear().toString().slice(2);
  // const month = (date.getMonth() + 1).toString().padStart(2, '0');
  // const day = date.getDate().toString().padStart(2, '0');
  // const hour = date.getHours().toString();

  return `${formattedDate}`;
}
