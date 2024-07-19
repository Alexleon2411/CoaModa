
// el siguiente helper es para darle la expresion de presios a los precios
export const formatCurrency = amount => Number(amount).toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD'
})

//el siguiente helper es para tomar la referencia de las fecha como dia mes y año 
export const getCurrentDate = () => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return  `${day}/${month}/${year}`;
}
