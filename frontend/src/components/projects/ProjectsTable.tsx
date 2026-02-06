import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface ProjectsTableProps {
  projects: any[];
  highlightProjectId?: number;
}

const ProjectsTable = ({ projects, highlightProjectId }: ProjectsTableProps) => {
  const navigate = useNavigate();

  // 🔹 Ref for highlighted row
  const highlightedRowRef = useRef<HTMLTableRowElement | null>(null);

  // 🔹 Auto-scroll to highlighted project
  useEffect(() => {
    if (highlightedRowRef.current) {
      highlightedRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightProjectId, projects]);

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Progress</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {projects.map((p: any) => {
          const isHighlighted = p.id === highlightProjectId;

          return (
            <tr
              key={p.id}
              ref={isHighlighted ? highlightedRowRef : null}
              className={isHighlighted ? "table-primary" : ""}
            >
              <td>{p.name}</td>
              <td>{p.derived_status}</td>
              <td>{p.progress_percentage}%</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => navigate(`/admin/projects/${p.id}`)}
                >
                  Open
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ProjectsTable;
