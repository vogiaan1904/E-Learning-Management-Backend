import mongoose, { ConnectOptions } from 'mongoose'
import { MONGO_URL } from './config'

export default async () => {
    await mongoose
        .connect(MONGO_URL)
        .then((result) => {
            console.log('database connected')
        })
        .catch((err) => console.log(`error: ` + err))
}
