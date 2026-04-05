import { Task } from "@/types/task";

export default function TaskCard({ task }: { task: Task }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-500">{task.status}</p>
    </div>
  );
}