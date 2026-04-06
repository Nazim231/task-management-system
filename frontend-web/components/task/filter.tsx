import { TaskQuery, TaskStatus } from '@/types/task';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useMemo } from 'react';

type Props = {
  search: string;
  status: string;
  sort: string;
  queryUpdater: (key: keyof TaskQuery, value: any) => void;
};

type SelectorItem = { value: string; label: string };

export default function TaskFilters({ search, status, sort, queryUpdater }: Props) {
  const sortItems: SelectorItem[] = useMemo(() => {
    return [
      { label: 'Latest', value: 'latest' },
      { label: 'Oldest', value: 'oldest' },
    ];
  }, []);

  const statusItems: SelectorItem[] = useMemo(() => {
    return [
      { label: 'All', value: TaskStatus.ALL },
      { label: 'Pending', value: TaskStatus.PENDING },
      { label: 'Completed', value: TaskStatus.COMPLETED },
    ];
  }, []);
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4 w-full">
      <Input
        value={search}
        onChange={(e) => queryUpdater('search', e.target.value)}
        placeholder="Search tasks..."
        className="border px-3 py-2 flex-3"
      />
      <div className="flex flex-row items-center gap-2 flex-2">
        <Selector value={status} onValueChange={(v: string) => queryUpdater('status', v)} placeholder="Status" items={statusItems} />
        <Selector value={sort} onValueChange={(v: string) => queryUpdater('sort', v)} placeholder="Sort" items={sortItems} />
      </div>
    </div>
  );
}

function Selector({
  placeholder,
  items,
  value,
  onValueChange,
}: {
  placeholder: string;
  items: SelectorItem[];
  value: string;
  onValueChange: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className='w-1/2! md:w-full'>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((i) => (
          <SelectItem value={i.value}>{i.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
