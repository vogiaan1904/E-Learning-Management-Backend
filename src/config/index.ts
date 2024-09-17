import dotenv from 'dotenv'
import { Secret } from 'jsonwebtoken'
dotenv.config({ path: '.env' })

export const MONGO_URL = process.env.MONGO_URL as string
export const SECRET_KEY = process.env.SECRET_KEY as Secret
export const PORT = process.env.PORT || 3001
