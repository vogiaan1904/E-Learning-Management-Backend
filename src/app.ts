import express, { Application } from 'express'
import { userRoutes } from './routes'
import { ErrorMiddleware } from './middlewares'
import morgan from 'morgan'
export default async (app: Application) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(morgan('dev'))
    app.use('/user', userRoutes)

    app.use(ErrorMiddleware)

    return app
}
