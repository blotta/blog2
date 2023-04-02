import fs from 'fs';
import matter from 'gray-matter';
import getPostMetadata from '@/app/components/getPostMetadata';
import LBMarkdown from '@/app/components/LBMarkdown';
import TagList from '@/app/components/TagList';

const getPostContent = (slug: string) => {
  const folder = "content/posts/";
  const file = `${folder}${slug}.md`;
  const content = fs.readFileSync(file, 'utf8');
  const matterResult = matter(content);
  return matterResult;
}

export const generateStaticParams = async () => {
  const posts = getPostMetadata();
  return posts.map((post) => ({slug: post.slug}));
}

export default function PostPage(props: any) {
    const slug = props.params.slug;
    const post = getPostContent(slug);
    return <div>
        <h1 className='text-3xl text-center font-bold text-green-500'>{post.data.title}</h1>
        <p className='text-center'>{post.data.date.toLocaleDateString()}</p>
        <TagList tags={post.data.tags} />
        <LBMarkdown>{post.content}</LBMarkdown>
    </div>
}