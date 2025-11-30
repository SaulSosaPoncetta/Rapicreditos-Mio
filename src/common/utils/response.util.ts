export function standardResponse(
  statusCode: number,
  msg: string,
  data: any = null,
) {
  return { statusCode, msg, data };
}
