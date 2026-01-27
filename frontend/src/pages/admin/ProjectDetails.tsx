import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Milestones from "../../components/projects/Milestones";
import ProjectMembers from "../../components/projects/ProjectMembers";
import { getProjectById } from "../../api/services/project.service";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const projectId = Number(id);

  const [projectName, setProjectName] = useState("");
  const [activeTab, setActiveTab] = useState<"milestones" | "members">(
    "milestones"
  );

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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-0">{projectName || "Project Details"}</h4>
          <small className="text-muted">Project ID: {projectId}</small>
        </div>

        <button
          type="button"
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
      </ul>

      {activeTab === "milestones" && (
        <Milestones projectId={projectId} />
      )}

      {activeTab === "members" && (
        <ProjectMembers projectId={projectId} />
      )}
    </div>
  );
};

export default ProjectDetails;
