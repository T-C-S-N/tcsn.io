import { useRouter } from 'next/router'

const Memo = () => {
   const router = useRouter()
   const { pid } = router.query

   return <p>Memo Not found: {pid}</p>
}

export default Memo