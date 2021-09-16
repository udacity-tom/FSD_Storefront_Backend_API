import express, { Request, Response } from 'express';
import jwt, { Jwt } from 'jsonwebtoken';
import { User, UserStore } from "../models/user";
import { AuthStore } from "../middleware/auth";
// import { nextTick } from 'process';

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

const create = async(req: Request, res: Response) => {
    try {
        const user: User = {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password_hash: req.body.password
        }
        console.log('users.ts: user value', user);
        const newUser = await userStore.create(user);
        console.log('users.ts: newUser ', newUser);
        
        let jwtPayloadData: User = {
            username: newUser.username,
            firstname: newUser.firstname,
            lastname: '',
            password_hash: ''
        }        
        const token = await auth.createToken(jwtPayloadData);
        console.log('users.ts: token returned', token);
        res.send([newUser, token]);

    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

const authenticate = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body;
        console.log('users.ts: username', username);
        const userAuth = await auth.authenticate(username, password);
        console.log('users.ts: userAuth', userAuth);
        console.log('users.ts: userAuth[1]', userAuth);
        res.send(userAuth);//returns jwt

    } catch (err) {
        res.status(400);
        res.send(err);
    }
}

const destroy = async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id;
        const userDelete = userStore.delete(idToDelete);
        res.send(userDelete);
    } catch (err) {
        res.status(400).send(err);
    }
}

const userRoutes = (app: express.Application) => {
    app.get('/users', index);
    app.get('/users/:id', show);
    app.post('/users/create', create);// == login
    app.post('/users/authenticate', authenticate);
    // app.post('/users/authenticate', authenticate);
    app.delete('/users/delete/:id', auth.verifyAuthToken, destroy);
}

export default userRoutes;