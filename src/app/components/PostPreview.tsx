import Link from "next/link";
import { PostMetadata } from "./PostMetadata";

const PostPreview = (props: PostMetadata) => {
  return (
    <div className="border border-neutral-700 p-4 rounded shadow-md ">
      <Link href={`/posts/${props.slug}`} >
        <h2 className="font-bold text-green-400 hover:underline">{props.title}</h2>
      </Link>
      <p className="text-sm text-neutral-400 text-center">{props.date.toLocaleDateString()}</p>
      <p className="text-neutral-500">{props.subtitle}</p>
    </div>
  )
}
export default PostPreview;