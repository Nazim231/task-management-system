'use client'

import { useCallback, useEffect, useMemo, useState } from 'react';
import { TaskListItem, TaskQuery } from '@/types/task';
import { get } from '@/lib/axios';
import {debounce} from 'lodash';

export function useTasks(query: TaskQuery) {
  const [tasks, setTasks] = useState<TaskListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams({
      search: query.search,
      status: query.status,
      sort: query.sort,
      page: String(query.page),
    });

    debouncedFetch(params);

    return () => {
      debouncedFetch.cancel();
    }
  }, [query.search, query.status, query.status, query.page]);

  const debouncedFetch = useMemo(
    () =>
      debounce((params: URLSearchParams) => {
        console.log("Fetching Tasks List");
        get<TaskListItem[]>('/tasks', params).then((result) => {
          if (result.success) {
            setTasks(result.data ?? []);
          }
        });
      }, 1000),
    [],
  );

  const addTask = useCallback(
    (task: TaskListItem) => {
      setTasks((prev) => [...prev, task]);
    },
    [tasks],
  );

  return { tasks, totalPages, addTask };
}
