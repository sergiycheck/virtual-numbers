export const formatPhoneNumber = (value: string | number) => {
  const regex = /\D*(\d{3})\D*(\d{4})\D*(\d{4})\D*/
  if(typeof value == 'number') {
    return String(value).replace(regex, "$1 $2 $3");
  }
  return value.replace(regex, "$1 $2 $3");
}