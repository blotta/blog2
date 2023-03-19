import Image from "next/image";
import Link from "next/link";
import { ProjectMetadata } from "./ProjectMetadata";

const ProjectPreview = (props: ProjectMetadata) => {
  return (
    <div className="border border-neutral-700 p-4 rounded shadow-md
      grid grid-cols-4 grid-[1fr 3fr] gap-4
    ">
      <div className="relative w-full h-full">
        <Image className="object-contain" fill src={props.image} alt={props.title} />
      </div>

      <div className="col-span-3">

        <Link href={`/projects/${props.slug}`} >
          <h2 className="font-bold text-green-400 hover:underline">{props.title}</h2>
        </Link>
        <div className="flex flex-row gap-2 flex-wrap">
          {props.tags.map(tag => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
export default ProjectPreview;