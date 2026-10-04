export const faNumber = (n: number | string): string => {
  if (typeof n === 'number') {
    return n.toLocaleString('fa-IR')
  }
  return String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)])
}
