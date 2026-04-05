import { tasks } from '../controllers/tasks';
import { Router } from 'express';

const tasksRouter = Router();

tasksRouter.get('/', tasks.get);
tasksRouter.post('/', tasks.create);
tasksRouter.get('/:id', tasks.getById);
tasksRouter.patch('/:id', tasks.update);
tasksRouter.delete('/:id', tasks.delete);
tasksRouter.get('/:id/toggle', tasks.toggle);

export default tasksRouter;