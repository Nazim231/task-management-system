import { Router } from 'express';
import auth from './auth';

const router = Router();

router.get('/', (req, res) => {
  return res.json({ message: 'Welcome to Task Management System' });
});

router.use('/auth', auth);

export default router;
