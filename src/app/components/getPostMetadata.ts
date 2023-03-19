import matter from "gray-matter";
import { PostMetadata } from "./PostMetadata";

import fs from 'fs';

const getPostMetadata = (): PostMetadata[] => {
  const folder = "content/posts";
  const files = fs.readdirSync(folder);
  const markdownPosts = files.filter((file) => file.endsWith(".md"));

  const posts = markdownPosts.map((fileName) => {
    const fileContents = fs.readFileSync(`content/posts/${fileName}`, 'utf8');
    const matterResult = matter(fileContents);
    return {
      title: matterResult.data.title,
      date: matterResult.data.date,
      subtitle: matterResult.data.subtitle,
      slug: fileName.replace('.md', '')
    }
  })
  // console.log(posts);
  
  return posts;
}

export default getPostMetadata;