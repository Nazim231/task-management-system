'use client';

import { ComponentProps, useCallback, useState } from 'react';
import TaskFilters from './filter';
import Pagination from './pagination';
import TaskListItem from './task';
import { Task, TaskListItem as TaskListItemT, TaskCreate, TaskQuery, taskSchema, TaskStatus } from '@/types/task';
import { useTasks } from '@/hooks/useTasks';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodInputField } from '../ui/zodInputField';
import { post } from '@/lib/axios';
import { toast } from 'sonner';

export default function TaskList({ className, ...props }: ComponentProps<'div'>) {
  const [taskQuery, setTaskQuery] = useState<TaskQuery>({
    search: '',
    status: TaskStatus.ALL,
    sort: 'latest',
    page: 1,
  });

  const { tasks, totalPages, addTask } = useTasks(taskQuery);

  const updateQueryByKey = useCallback(
    (key: keyof TaskQuery, value: string | number | TaskStatus) => {
      setTaskQuery((prev) => ({ ...prev, [key]: value }));
    },
    [taskQuery],
  );

  return (
    <div>
      <Card className={cn('p-6', className)} {...props}>
        <div className="flex w-full justify-between items-center">
          <p className="text-2xl font-medium">Tasks</p>
          <TaskDialog addTask={addTask} />
        </div>
        <TaskFilters search={taskQuery.search} status={taskQuery.status} sort={taskQuery.sort} queryUpdater={updateQueryByKey} />
        <Tasks tasks={tasks} />
        <Pagination page={taskQuery.page} totalPages={totalPages} setPage={(pageNumber) => updateQueryByKey('page', pageNumber)} />
      </Card>
    </div>
  );
}

function Tasks({ tasks }: { tasks: TaskListItemT[] }) {
  if (!tasks.length) {
    return <p>No tasks found</p>;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskListItem key={task.id} task={task} />
      ))}
    </div>
  );
}

function TaskDialog({ addTask }: { addTask: (task: Task) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    setError,
    reset,
  } = useForm<TaskCreate>({
    resolver: zodResolver(taskSchema),
  });

  const [isOpen, setOpen] = useState<boolean>(false);

  const fields = [
    { name: 'title', label: 'Title', placeholder: 'Enter your title', type: 'text' },
    {
      name: 'description',
      label: 'Description',
      placeholder: 'Description (Optional)',
      type: 'text',
    },
  ];

  const onSubmit = useCallback(async (data: TaskCreate) => {
    const response = await post<Task>('/tasks/', data);

    if (response.success) {
      reset();

      // Store user in auth store if response.data contains user info
      if (response.data) {
        toast.success('Task Created');
        addTask(response.data);
        setOpen(false);
      }
    } else if (response.errors) {
      Object.entries(response.errors).forEach(([field, err]) => {
        setError(field as keyof TaskCreate, { message: err });
      });
    } else toast.error(response.message);
  }, []);
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-6">
          {fields.map((f) => (
            <ZodInputField
              key={f.name}
              disabled={isLoading}
              zodRegister={register}
              error={errors.title && errors.title.message}
              {...f}
            />
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'secondary'}>Close</Button>
          </DialogClose>
          <Button onClick={handleSubmit(onSubmit)}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
