import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Task } from '../generated/prisma/client';
import { TaskCreate } from '../types/task';
import { validateTaskToCreate } from '../lib/validator';
import { requestCompleted, requestFailed } from '../lib/apiResponse';

class TaskController {
  async create(req: Request<any, any, TaskCreate>, res: Response) {
    const task: TaskCreate = req.body;

    const validation = validateTaskToCreate(task);
    if (!validation.success) {
      return requestFailed(res, 400, 'Invalid Task', validation.error);
    }

    const createdTask = await prisma.task.create({
      data: {
        title: task.title,
        description: task.description,
        userId: req.user.id,
        status: 'pending',
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
      },
    });

    return requestCompleted(res, "Task created successfully", createdTask);
  }

  async get(req: Request, res: Response) {
    try {
      const userId: string = '';
      const tasks = await prisma.task.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  getById(req: Request, res: Response) {}

  update(req: Request, res: Response) {}

  delete(req: Request, res: Response) {}

  toggle(req: Request, res: Response) {}
}

export const tasks = new TaskController();
