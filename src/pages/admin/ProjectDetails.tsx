import { useParams } from "react-router-dom";
import Milestones from "../../components/projects/Milestones";
import ProjectMembers from "../../components/projects/ProjectMembers";

const ProjectDetails = () => {
  const { id } = useParams();

  return (
    <div className="container mt-3">
      <h4>Project Details</h4>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <span className="nav-link active">Milestones</span>
        </li>
        <li className="nav-item">
          <span className="nav-link">Members</span>
        </li>
      </ul>

      <Milestones projectId={Number(id)} />
      <ProjectMembers projectId={Number(id)} />
    </div>
  );
};

export default ProjectDetails;
