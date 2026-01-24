import { useEffect, useState } from "react";
import { getProjects } from "../../api/projects";
import ProjectsTable from "../../components/projects/ProjectsTable";
import ProjectForm from "../../components/projects/ProjectForm";
import { isAdmin } from "../../utils/auth";

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);

  const load = async () => {
    const res = await getProjects();
    setProjects(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container mt-3">
      <h3>Projects</h3>

      {/* ✅ ADMIN ONLY */}
      { <ProjectForm onSuccess={load} />}

      <ProjectsTable projects={projects} />
    </div>
  );
};

export default Projects;
