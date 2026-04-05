import { Router } from 'express';
import auth from './auth';
import task from './tasks';
import { verifyUser } from '../middlewares/verifyUser';

const router = Router();

router.get('/', (_, res) => {
  return res.json({
    status: true,
    message: 'Welcome to Task Management System',
  });
});

router.use('/auth', auth);
router.use('/tasks', verifyUser, task);

export default router;
