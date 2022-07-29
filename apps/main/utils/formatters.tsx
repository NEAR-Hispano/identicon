
export function prettyDatetime(ts: string) {
  /**
   * Formats a ISODatetime to pretty
   * @ts: format 
   * @returns: yyyy-mm-dd hh:mm
   */
  let datetime = ts.split(' ');
  let hhmmss = datetime[1].split(':');
  return `${datetime[0]} ${hhmmss[0]}:${hhmmss[1]}`
}
