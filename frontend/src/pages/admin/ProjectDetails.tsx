import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Milestones from "../../components/projects/Milestones";
import ProjectMembers from "../../components/projects/ProjectMembers";
import KanbanBoard from "../../components/tasks/KanbanBoard";
import AddTaskForm from "../../components/tasks/AddTaskForm";

import { getProjectById } from "../../api/services/project.service";

type Tab = "milestones" | "members" | "tasks";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const projectId = Number(id);

  const [projectName, setProjectName] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("milestones");

  const reloadTasks = () => {
    // This will be passed to AddTaskForm
    // KanbanBoard listens to projectId and reloads automatically
  };

  useEffect(() => {
    if (!projectId) return;

    const loadProject = async () => {
      const project = await getProjectById(projectId);
      setProjectName(project.name);
    };

    loadProject();
  }, [projectId]);

  if (!projectId) {
    return <p className="text-danger">Invalid project</p>;
  }

  return (
    <div className="container mt-3">
      {/* HEADER */}
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

      {/* TABS */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "milestones" ? "active" : ""}`}
            onClick={() => setActiveTab("milestones")}
          >
            Milestones
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "members" ? "active" : ""}`}
            onClick={() => setActiveTab("members")}
          >
            Members
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "tasks" ? "active" : ""}`}
            onClick={() => setActiveTab("tasks")}
          >
            Tasks
          </button>
        </li>
      </ul>

      {/* TAB CONTENT */}
      {activeTab === "milestones" && (
        <Milestones projectId={projectId} />
      )}

      {activeTab === "members" && (
        <ProjectMembers projectId={projectId} />
      )}

      {activeTab === "tasks" && (
        <>
          {/* ✅ ADD TASK FORM (THIS WAS MISSING) */}
          <AddTaskForm
            projectId={projectId}
            onCreated={reloadTasks}
          />

          <hr />

          {/* ✅ KANBAN BOARD */}
          <KanbanBoard projectId={projectId} />
        </>
      )}
    </div>
  );
};

export default ProjectDetails;
