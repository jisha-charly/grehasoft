import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Milestones from "../../components/projects/Milestones";
import ProjectMembers from "../../components/projects/ProjectMembers";
import KanbanBoard from "../../components/tasks/KanbanBoard";
import AddTaskForm from "../../components/tasks/AddTaskForm";

import { getProjectById } from "../../api/services/project.service";
import { getTasksByProject } from "../../api/services/task.service";

import type { Task } from "../../types/task";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const projectId = Number(id);

  const [projectName, setProjectName] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<
    "milestones" | "members" | "tasks"
  >("tasks");

  const loadTasks = async () => {
    const data = await getTasksByProject(projectId);
    setTasks(data);
  };

  useEffect(() => {
    if (!projectId) return;

    getProjectById(projectId).then(p => setProjectName(p.name));
    loadTasks();
  }, [projectId]);

  return (
    <div className="container mt-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4>{projectName}</h4>
          <small className="text-muted">Project ID: {projectId}</small>
        </div>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/admin/projects")}
        >
          ← Back
        </button>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        {["milestones", "members", "tasks"].map(tab => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* CONTENT */}
      {activeTab === "milestones" && (
        <Milestones projectId={projectId} />
      )}

      {activeTab === "members" && (
        <ProjectMembers projectId={projectId} />
      )}

      {activeTab === "tasks" && (
        <>
          {/* ✅ TASK FORM */}
          <AddTaskForm
            projectId={projectId}
            onCreated={loadTasks}
          />

          {/* ✅ KANBAN */}
          <KanbanBoard tasks={tasks} />
        </>
      )}
    </div>
  );
};

export default ProjectDetails;
