import { useNavigate } from "react-router-dom";

const ProjectsTable = ({ projects }: any) => {
  const navigate = useNavigate();

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
        {projects.map((p: any) => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>{p.status}</td>
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
        ))}
      </tbody>
    </table>
  );
};

export default ProjectsTable;
