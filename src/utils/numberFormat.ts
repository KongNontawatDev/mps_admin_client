export const parseValue = (value: any) => {
  return value.replace(/\$\s?|(,*)/g, '')
}

export const formatterDecimal = (value: any) => {
  return !Number.isNaN(parseFloat(value))
    ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : '0'
}

export function formatNumberWithSpaces(value: string): string {
  const stringValue = value.toString();
  const formattedValue = stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return formattedValue;
}

export const numberFormat = (x:any) => {
  x = String(x)
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export function centimetersToMeters(centimeters: number | null | undefined): string {
  // Check if the input is null or empty
  if (centimeters === null || centimeters === undefined) {
    return '';
  }

  // Parse the input to a number
  const cmValue = centimeters;

  // Check if it is a valid number
  if (isNaN(cmValue)) {
    return '';
  }

  // Check if the value is less than 100 cm
  if (cmValue < 100) {
    return `${cmValue} ซม.`;
  }

  // Convert centimeters to meters
  const meters = cmValue / 100;

  // Display the value in meters
  return `${meters} ม.`;
}
