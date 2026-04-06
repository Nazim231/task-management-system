import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { TaskCreate, TaskQueryFilters } from '../types/task';
import { validateTaskToCreate } from '../lib/validator';
import { requestCompleted, requestFailed } from '../lib/apiResponse';
import { TaskWhereInput } from '../generated/prisma/models';

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

    return requestCompleted(res, 'Task created successfully', createdTask);
  }

  async getAll(req: Request<any, any, any, TaskQueryFilters>, res: Response) {
    const params: TaskQueryFilters = req.query;
    const where: TaskWhereInput = {};

    if (params.search.trim()) {
      where.title = { contains: params.search };
    }
    if (params.status && params.status.toLowerCase() != 'all') {
      where.status = params.status;
    }

    try {
      const tasks = await prisma.task.findMany({
        select: {
          id: true,
          title: true,
          status: true,
        },
        where,
        orderBy: {
          createdAt: params.sort == 'latest' ? 'desc' : 'asc',
        },
        skip: (params.page - 1) * 10, //offset
        take: 10  // limit
      });

      return requestCompleted(res, 'Tasks Fetched', tasks);
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
