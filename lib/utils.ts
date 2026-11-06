import { ReadonlyURLSearchParams } from "next/navigation";

export const baseUrl =
  process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://localhost:3001";

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};
