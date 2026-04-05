import { useCallback, useEffect, useState } from 'react';
import { Task } from '@/types/task';

type Query = {
  search: string;
  status: string;
  sort: string;
  page: number;
};

export function useTasks(query: Query) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams({
      search: query.search,
      status: query.status,
      sort: query.sort,
      page: String(query.page),
    });

    // fetch(`/tasks?${params}`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setTasks(data.tasks);
    //     setTotalPages(data.totalPages);
    //   });
  }, [query]);

  const addTask = useCallback(
    (task: Task) => {
      setTasks((prev) => [...prev, task]);
    },
    [tasks],
  );

  return { tasks, totalPages, addTask };
}
