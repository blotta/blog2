import Markdown from "markdown-to-jsx";
import Link from "next/link";

export default function LBMarkdown({
  children,
}: {
  children: string
}) {
  return (
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
          <Markdown>{children}</Markdown>
        </article>
  )
}