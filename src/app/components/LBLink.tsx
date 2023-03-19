import Link from "next/link";

export default function LBLink(props: any) {
  let cn = 'hover:text-green-400 hover:scale-110 ';
  if (props.className)
    cn += props.className;

  return (
    <Link {...props} className={cn}>
      {props.children}
    </Link>
  )
}