import Image from "next/image";
import Link from "next/link";
import LBLink from "./LBLink";
import { ProjectMetadata } from "./ProjectMetadata";

const ProjectPreview = (props: ProjectMetadata) => {
  return (
    <div className="border border-neutral-700 p-4 rounded shadow-md
      sm:grid grid-cols-4 grid-[1fr 3fr] gap-4
      sm:flex-none flex flex-col
    ">
      <div className="relative w-full h-full min-h-[20em] sm:min-h-0">
        <Image className="object-contain" fill src={props.image} alt={props.title} />
      </div>

      <div className="col-span-3">

        <LBLink href={`/projects/${props.slug}`} >
          <h2 className="font-bold text-xl mb-2 text-green-500">{props.title}</h2>
        </LBLink>
        <div className="flex flex-row gap-2 flex-wrap">
          {props.tags.map(tag => (
            <span className="p-1 bg-neutral-700 rounded" key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
export default ProjectPreview;