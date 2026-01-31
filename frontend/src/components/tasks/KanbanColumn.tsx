import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { Task } from "../../types/task";

type Props = {
  columnId: string;
  title: string;
  tasks: Task[];
};

export default function KanbanColumn({ columnId, title, tasks }: Props) {
  return (
    <div className="col">
      <h6 className="text-center">{title}</h6>

      <SortableContext
        items={tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
}
