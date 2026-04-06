export type TaskCreate = { title: string; description?: string };


export type TaskQueryFilters = {
  search: string;
  status: string;
  page: number;
  sort: 'latest' | 'oldest';
}