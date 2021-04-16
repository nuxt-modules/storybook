// ~/server/object.ts
import express from 'express'

const app = express()

// some express middleware settings

app.use('/', (req, res) => {
    res.write("Works")
    res.end()
})

export default {
    path: '/express2',
    handler: app
}