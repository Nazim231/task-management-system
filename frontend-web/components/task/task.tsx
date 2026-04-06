import { cn } from '@/lib/utils';
import { TaskListItem as TaskListItemT, TaskStatus } from '@/types/task';

export default function TaskListItem({ task }: { task: TaskListItemT }) {
  return (
    <div className="border rounded-lg p-4 shadow-xs">
      <Badge status={task.status} />
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-500">{task.status}</p>
    </div>
  );
}

function Badge({ status }: { status: TaskListItemT['status'] }) {
  const classes: Record<TaskStatus, string> = {
    pending: 'bg-orange-100 text-orange-600',
    completed: 'bg-green-100 text-green-600',
    all: '',
  };

  return <div className={cn('rounded-full capitalize font-medium text-xs px-2 py-1 w-min', classes[status])}>{status}</div>
}
