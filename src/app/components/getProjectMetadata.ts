import matter from "gray-matter";
import { PostMetadata } from "./PostMetadata";

import fs from 'fs';
import { ProjectMetadata } from "./ProjectMetadata";

const getProjectMetadata = (): ProjectMetadata[] => {
  const folder = "content/projects";
  const files = fs.readdirSync(folder);
  const markdownPosts = files.filter((file) => file.endsWith(".md"));

  const projects = markdownPosts.map((fileName) => {
    const fileContents = fs.readFileSync(`content/projects/${fileName}`, 'utf8');
    const matterResult = matter(fileContents);
    return {
      title: matterResult.data.title,
      slug: fileName.replace('.md', ''),
      image: matterResult.data.image,
      tags: matterResult.data.tags,
      links: matterResult.data.links,
      priority: matterResult.data.priority
    }
  })
  // console.log(JSON.stringify(projects, null, 2));
  
  return projects;
}

export default getProjectMetadata;