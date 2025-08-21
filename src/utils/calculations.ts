export const getArrears = (
  prevDateValue: string,
  collectionDateValue: string,
  collectionAmount: number,
  prevArrearsAmount:number,
  installment: number,
  repaymentTerm: string,
  balance: number,
  isEdit:boolean,
  previousCollectionAmount : number
) => {
  const millisecondsPerDay = 86400000;

  if (isEdit){
        return (
          prevArrearsAmount - (collectionAmount - previousCollectionAmount)
        );;
  } 

  const prevDate = new Date(prevDateValue);
  const collectionDate = new Date(collectionDateValue);

  const differenceInMilliseconds =
    collectionDate.getTime() - prevDate.getTime();
  const dateDiff = Math.round(differenceInMilliseconds / millisecondsPerDay);

  let devideValue = 0;

  switch (repaymentTerm) {
    case 'Daily':
      devideValue = 1;
      break;
    case 'Weekly':
      devideValue = 7;
      break;
    case 'Biweekly':
      devideValue = 14;
      break;
    case 'Monthly':
      devideValue = 30;
      break;
    default:
      devideValue = 1;
      break;
  }

  const datesMargin = Math.floor(dateDiff / devideValue);
  const calculatedArrears = prevArrearsAmount + (installment * datesMargin - collectionAmount);

  const arrears =
    calculatedArrears > balance
      ? balance - collectionAmount
      : calculatedArrears;

      return arrears;
};


