import fs from 'fs';
import Markdown from 'markdown-to-jsx';
import matter from 'gray-matter';
import getPostMetadata from '@/app/components/getPostMetadata';
import getProjectMetadata from '@/app/components/getProjectMetadata';
import Image from 'next/image';
import Link from 'next/link';
import { ProjectLink } from '@/app/components/ProjectMetadata';

const getProjectContent = (slug: string) => {
  const folder = "content/projects/";
  const file = `${folder}${slug}.md`;
  const content = fs.readFileSync(file, 'utf8');
  const matterResult = matter(content);
  return matterResult;
}

export const generateStaticParams = async () => {
  const posts = getProjectMetadata();
  return posts.map((proj) => ({slug: proj.slug}));
}

export default function ProjectPage(props: any) {
    const slug = props.params.slug;
    // const meta = getProjectMetadata().find(p => p.slug == slug);
    const proj = getProjectContent(slug);
    console.log(proj);
    
    return <div>
        <h1 className='text-3xl text-green-500 text-center font-bold mb-6'>{proj.data.title}</h1>

        <div className='grid grid-cols-3 gap-4 min-h-[300px]'>

          <div className='relative w-full col-span-2'>
            <Image className="object-contain" fill src={proj.data.image} alt={proj.data.title} />
          </div>

          <div className='flex flex-col justify-center gap-2'>
            {proj.data.links.map((link: ProjectLink) => (
              <Link key={link.url} target="_blank" className='p-2 text-center border bg-neutral-800' href={link.url}>{link.name}</Link>
            ))}
          </div>
        </div>

        <article className='prose
          prose-neutral
          lg:prose-xl
          text-neutral-300
          prose-pre:bg-slate-800
          prose-pre:rounded
          prose-code:text-neutral-300
          prose-code:bg-slate-800
          prose-a:text-neutral-300
          hover:prose-a:text-green-500'>
          <Markdown>{proj.content}</Markdown>
        </article>
    </div>
}