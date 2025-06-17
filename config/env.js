import { config } from 'dotenv';

config({path:`.env.${process.env.NODE_ENV || 'development'}.local`});

export const PORT = process.env.PORT || 3000;

export const { NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRY, ARCJET_KEY, ARCJET_ENV } = process.env; 