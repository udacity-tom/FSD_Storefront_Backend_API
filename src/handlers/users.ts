import express, { Request, Response } from 'express';
import { User, UserStore } from "../models/user";
import { AuthStore } from "../middleware/auth";
import checkUserName from '../middleware/checkUserName';
// import { nextTick } from 'process';

const userStore = new UserStore;
const auth = new AuthStore;

const index = async(req: Request, res: Response) => {
    try {
        const users = await userStore.index();
        res.json(users);
    } catch (err) {
        res.status(400).json(err);
    }
}


const show = async(req: Request, res: Response) => {
    try {
        // console.log('users.ts id', req.params.id);
        const user = await userStore.show(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(400).json(err);
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
        // console.log('users.ts: user value', user);
        const newUser = await userStore.create(user);
        // console.log('users.ts: newUser ', newUser);
        
        let jwtPayloadData: User = {
            username: newUser.username,
            firstname: newUser.firstname,
            lastname: '',
            password_hash: ''
        }        
        const token = await auth.createToken(jwtPayloadData);
        // console.log('users.ts: token returned', token);
        res.send([newUser, token]);

    } catch (err) {
        res.status(400).json(err);
    }
}

const authenticate = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body;
        // console.log('users.ts: username', username);
        const userAuth = await auth.authenticate(username, password);
        // console.log('users.ts: userAuth', userAuth);
        // console.log('users.ts: userAuth[1]', userAuth);
        res.send(userAuth);//returns jwt

    } catch (err) {
        res.status(400).json(err);
    }
}


const update = async (req: Request, res: Response) => {
    try {
        const currentUserDetails = await userStore.show(req.params.id);
        if(req.body.username){
            currentUserDetails.username = req.body.username;
        }
        if(req.body.firstname){
            currentUserDetails.firstname = req.body.firstname;
        }
        if(req.body.lastname){
            currentUserDetails.lastname = req.body.lastname;
        }
        // console.log('users.ts/update: currentUserDetails', Object.entries( currentUserDetails));

        const updateUser = await userStore.update(currentUserDetails)

        res.status(200).json(updateUser);
    } catch (err) {
        res.status(400).json(err);
    }
}

const destroy = async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id;
        const userDelete = await userStore.delete(idToDelete);
        // console.log('users.ts/destroy: userDelete', userDelete);
        res.json(userDelete);
    } catch (err) {
        res.status(400).send(err);
    }
}

const userRoutes = (app: express.Application) => {
    app.get('/users', auth.verifyAuthToken, index);
    app.get('/users/:id', auth.verifyAuthToken, show);
    app.post('/users/create', auth.verifyAuthToken, checkUserName, create);// == new user
    app.post('/users/authenticate', authenticate); // == login
    app.post('/users/update/:id', auth.verifyAuthToken, update);
    app.delete('/users/delete/:id', auth.verifyAuthToken, destroy);
}

export default userRoutes;