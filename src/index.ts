import express from 'express'
import dbConnection from './database'
import App from './app'

import { PORT } from './config'

const StartServer = async () => {
    const app = express()

    await dbConnection()
    await App(app)

    app.listen(PORT, () => {
        console.log(`App is listening to http://localhost:${PORT}`)
    })
}

StartServer()
