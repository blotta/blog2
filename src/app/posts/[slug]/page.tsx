import fs from 'fs';
import Markdown from 'markdown-to-jsx';
import matter from 'gray-matter';
import getPostMetadata from '@/app/components/getPostMetadata';

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
        <article className='prose
          prose-neutral
          lg:prose-xl
          text-neutral-300
          prose-pre:bg-slate-800
          prose-pre:rounded
          prose-blockquote:text-neutral-300
          prose-h2:text-neutral-300
          prose-h3:text-neutral-300
          prose-code:text-neutral-300
          prose-code:bg-slate-800
          prose-a:text-neutral-300
          hover:prose-a:text-green-500'>
          <Markdown>{post.content}</Markdown>
        </article>
    </div>
}