import express, { Request, Response } from 'express';
import jwt, { Jwt } from 'jsonwebtoken';
import { User, UserStore } from "../models/user";
import { AuthStore } from "../middleware/auth";

const userStore = new UserStore;
const auth = new AuthStore;

const index = async(req: Request, res: Response) => {
    try {
        const users = await userStore.index();
        res.json(users);
    } catch (err) {
        res.status(400);
        res.json(err);

    }
}


const show = async(req: Request, res: Response) => {
    try {
        console.log('users.ts id', req.params.id);
        const user = await userStore.show(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

// async authenticate(username: string, password: string): Promise<String> {
//     try {
//         const result = auth.authenticate(username, password)
//         return result;
//     } catch (err) {
//         throw new Error('Unable to authenticate ${username}, error: ${err}');
//     }
// }

const create = async(req: Request, res: Response) => {
    try {
        const user: User = {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password
        }
        console.log('users.ts: user value', user);
        
        
        const newUser = await userStore.create(user);
        console.log('users.ts: newUser ', newUser);
        res.send(newUser);


    } catch (err) {
        res.status(400);
        res.json(err);
    }
}



const authenticate = async (req: Request, res: Response) => {
    try {
        const username = req.body.username; 
        const password = req.body.password;

        // try {
        //     jwt.verify(req.body.token, process.env.TOKEN_SECRET!);
        // } catch (err) {
        //     res.status(401);
        //     res.send('Invalid Token ${err}');
        //     return; //exit authentication prcess
        // }
        const userAuth = await auth.authenticate(username, password);
        res.send(userAuth);

    } catch (err) {
        res.status(400);
        res.send(err);
    }
}

const userRoutes = (app: express.Application) => {
    app.get('/users', index);
    app.get('/users/:id', show);
    app.post('/users/create', create);
    app.post('/users/authenticate', authenticate);
}

export default userRoutes;