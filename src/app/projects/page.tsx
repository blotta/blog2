
import getProjectMetadata from "../components/getProjectMetadata";
import ProjectPreview from "../components/ProjectPreview";

export default function ProjectsPage() {
  const projects = getProjectMetadata();
  const projectsList = projects.sort(p => -p.priority).map((proj) => (
    <ProjectPreview key={proj.slug} {...proj} />
  ))



  return (
    <>
      <h1 className="text-3xl font-bold mb-3">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">{projectsList}</div>
    </>
  )
}
