import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

class TaskController {
  create(req: Request, res: Response) {}

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
