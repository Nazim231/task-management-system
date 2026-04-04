import { Router } from 'express';
import { auth } from '../controllers/auth';


const authRouter = Router();

authRouter.post('/register', auth.register);


export default authRouter;