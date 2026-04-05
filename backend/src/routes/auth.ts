import { Router } from 'express';
import { auth } from '../controllers/auth';


const authRouter = Router();

authRouter.post('/register', auth.register);
authRouter.post('/login', auth.login);
authRouter.post('/refresh', auth.refresh);


export default authRouter;