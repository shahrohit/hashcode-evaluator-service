import dotenv from "dotenv";

import { DEV_ENV } from "@utils/strings";

dotenv.config();

export const PORT = +(process.env.PORT || 4004);
export const NODE_ENV = process.env.NODE_ENV || DEV_ENV;
export const RABBITMQ_URL = process.env.RABBITMQ_URL!;
