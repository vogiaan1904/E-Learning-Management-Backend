import express from 'express'
import { test } from '../controllers'

const route = express.Router()

route.get('/', test)

export { route as userRoutes }
