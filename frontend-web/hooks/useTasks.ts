import { useCallback, useEffect, useState } from 'react';
import { Task, TaskQuery } from '@/types/task';
import { get } from '@/lib/axios';

export function useTasks(query: TaskQuery) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams({
      search: query.search,
      status: query.status,
      sort: query.sort,
      page: String(query.page),
    });

    get<Task[]>('/tasks').then((result) => {
      if (result.success) {
        setTasks(result.data ?? []);
      }
    });
  }, [query]);

  const addTask = useCallback(
    (task: Task) => {
      setTasks((prev) => [...prev, task]);
    },
    [tasks],
  );

  return { tasks, totalPages, addTask };
}
