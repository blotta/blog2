import Link from "next/link";

export default function LBLink(props: any) {
  let cn = 'transition ease-in-out hover:text-green-400 hover:scale-110 hover:underline';
  if (props.className)
    cn += props.className;

  return (
    <Link {...props} className={cn}>
      {props.children}
    </Link>
  )
}