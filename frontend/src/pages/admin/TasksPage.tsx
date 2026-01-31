import KanbanBoard from "../../components/tasks/KanbanBoard"

export default function TasksPage() {
  // later you can get projectId from route or dropdown
  const projectId = 1;

  return (
    <div className="container-fluid">
      <h3>Task Management</h3>
      <KanbanBoard projectId={1} />
    </div>
  );
}
