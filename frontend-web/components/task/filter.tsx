import { TaskStatus } from "@/types/task";
import { Input } from "../ui/input";

type Props = {
  search: string;
  status: string;
  sort: string;
  setSearch: (v: string) => void;
  setStatus: (v: TaskStatus) => void;
  setSort: (v: string) => void;
};

export default function TaskFilters({
  search,
  status,
  sort,
  setSearch,
  setStatus,
  setSort,
}: Props) {
  return (
    <div className="flex gap-4 mb-4 w-full">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks..."
        className="border px-3 py-2 rounded"
      />

      <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
        <option value={TaskStatus.ALL}>All</option>
        <option value={TaskStatus.PENDING}>Pending</option>
        <option value={TaskStatus.COMPLETED}>Completed</option>
      </select>

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
}