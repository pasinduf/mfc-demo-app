export const getTime = (value:string) => {
  const date = new Date(value);

 const hours = date.getUTCHours(); 
 const minutes = date.getUTCMinutes(); 

 // Format as HH:MM
 const formattedTime = `${String(hours).padStart(2, '0')}:${String(
   minutes,
 ).padStart(2, '0')}`;

 return formattedTime;
};


