import Link from "next/link";
import getPostMetadata from "../components/getPostMetadata";
import PostPreview from "../components/PostPreview";

export default function PostsPage() {
  const posts = getPostMetadata();
  const postList = posts
    .sort((a, b) => {return a.date.getTime() - b.date.getTime()})
    .reverse()
    .map((post) => (
    <PostPreview key={post.slug} {...post} />
  ))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{postList}</div>
  )
}
