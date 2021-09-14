import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import userRoutes from './handlers/users';


const hostAddress = '127.0.0.1';
const portAddress = 3002;

const app: express.Application = express()
const address: string = `${hostAddress}:${portAddress}`;

app.use(bodyParser.json())

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

//handler routes
userRoutes(app);


app.listen(portAddress, function () {
    console.log(`starting app on: ${address}`)
})
