import { z } from 'zod';


export type TaskQuery = {
  search: string;
  status: TaskStatus;
  sort: 'latest' | 'oldest';
  page: number;
};

export const taskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

type TaskMeta = {
  id: string;
  status: 'pending' | 'completed';
  createdAt: Date;
  updatedAt?: Date;
};
export type TaskCreate = z.infer<typeof taskSchema>;
export type Task = TaskCreate & TaskMeta;
export type TaskListItem = {
  id: TaskMeta['id'];
  status: TaskMeta['status'];
  title: TaskCreate['title'];
}

// export type TaskStatus = 'all' | 'completed' | 'pending';

export enum TaskStatus {
  ALL = 'all',
  COMPLETED = 'completed',
  PENDING = 'pending',
}
