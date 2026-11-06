import config from "@payload-config";
import { getPayload } from "payload";

export const getClient = () => getPayload({ config });
