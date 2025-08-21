export const getCurrentDate = () => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};


export const getDateString = (date: any) => {
  const inputDate = new Date(date);

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, '0');
  const day = String(inputDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};


export const getDateByString = (date:string) => {
   return date ? date.split("T")[0]  :  "";
};


export const getFirstDateOfCurrentWeek = () => {
 
  const today = new Date(); 
  const dayOfWeek = today.getDay();

  const diff = (dayOfWeek + 6) % 7;

  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(today.getDate() - diff);

   return getDateString(firstDayOfWeek);;
};



export const getFirstDateOfLastWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const diffToLastMonday = ((dayOfWeek + 6) % 7) + 7;

  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - diffToLastMonday);

  return getDateString(lastMonday);
};


export const getLastDateOfLastWeek = () => {
  const today = new Date(); 
  const dayOfWeek = today.getDay(); 

  const diffToLastSunday = ((dayOfWeek + 6) % 7) + 1; 

  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - diffToLastSunday);

  return  getDateString(lastSunday);;
};



export const getFirstDateOfCurrentMonth = () => {
  const today = new Date(); 
  const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return getDateString(firstDayOfLastMonth);
};




