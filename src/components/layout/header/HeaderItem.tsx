
import Link from "next/link";
import { useRouter } from 'next/router';

export default function HeaderItem ( props: { title: string, href: string, active: boolean } ) {
   const router = useRouter();

return (
   <>
      <Link href={ props.href } className={ [
         'p-2 ml-5 text-sm hover:text-neutral-600 transition border-[transparent]',
         router.pathname == props.href ? 'rounded-md border border-[red]' : ''
      ].join( ' ' ) }>
         { props.title }
      </Link>
   </>
)
}