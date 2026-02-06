import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProjects } from "../../api/services/project.service";
import ProjectsTable from "../../components/projects/ProjectsTable";
import ProjectForm from "../../components/projects/ProjectForm";
import { isAdmin } from "../../utils/auth";

const Projects = () => {
  const location = useLocation();
  const highlightProjectId = location.state?.highlightProjectId;

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="container mt-3">
      <h3>Projects</h3>

      {/* ✅ ADMIN ONLY */}
      {<ProjectForm onSuccess={loadProjects} />}

      {loading ? (
        <div className="text-muted">Loading projects...</div>
      ) : (
        <ProjectsTable
          projects={projects}
          highlightProjectId={highlightProjectId}
        />
      )}
    </div>
  );
};

export default Projects;
