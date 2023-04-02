import Link from "next/link";

const TagList = (props: {tags: string[]}) => {
  return (
    <div className="flex flex-row gap-2 flex-wrap mt-2">
      {props.tags.map(tag => (
        <span className="p-1 bg-neutral-700 rounded-lg" key={tag}>{tag}</span>
      ))}
    </div>
  )
}
export default TagList;