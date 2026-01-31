import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Milestones from "../../components/projects/Milestones";
import ProjectMembers from "../../components/projects/ProjectMembers";
import KanbanBoard from "../../components/tasks/KanbanBoard";

import { getProjectById } from "../../api/services/project.service";
import { getTasksByProject } from "../../api/services/task.service";

import type { Task } from "../../types/task";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ FIX 1: projectId derived once
  const projectId = Number(id);

  const [projectName, setProjectName] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const [activeTab, setActiveTab] = useState<
    "milestones" | "members" | "tasks"
  >("milestones");

  // ✅ Load project
  useEffect(() => {
    if (!projectId) return;

    const loadProject = async () => {
      const project = await getProjectById(projectId);
      setProjectName(project.name);
    };

    loadProject();
  }, [projectId]);

  // ✅ FIX 2: Load tasks HERE (not in KanbanBoard)
  useEffect(() => {
    if (!projectId) return;

    const loadTasks = async () => {
      const data = await getTasksByProject(projectId);
      setTasks(data);
    };

    loadTasks();
  }, [projectId]);

  if (!projectId) {
    return <p className="text-danger">Invalid project</p>;
  }

  return (
    <div className="container mt-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-0">{projectName}</h4>
          <small className="text-muted">Project ID: {projectId}</small>
        </div>

        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/admin/projects")}
        >
          ← Back to Projects
        </button>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "milestones" ? "active" : ""
            }`}
            onClick={() => setActiveTab("milestones")}
          >
            Milestones
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "members" ? "active" : ""
            }`}
            onClick={() => setActiveTab("members")}
          >
            Members
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "tasks" ? "active" : ""
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            Tasks
          </button>
        </li>
      </ul>

      {/* Content */}
      {activeTab === "milestones" && (
        <Milestones projectId={projectId} />
      )}

      {activeTab === "members" && (
        <ProjectMembers projectId={projectId} />
      )}

      {activeTab === "tasks" && (
        <KanbanBoard tasks={tasks} />
      )}
    </div>
  );
};

export default ProjectDetails;
