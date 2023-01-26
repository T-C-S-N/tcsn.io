import User from "@/models/User"
import UserUtils from "@/utils/UserUtils"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function UserList() {
   const router = useRouter();

   const [isLoading, setIsLoading] = useState(true)
   const [users, setUsers] = useState([])
   const [search, setSearch] = useState('' as string)
   const [errors, setErrors] = useState([] as Array<string>)

   useEffect(() => {
      if (!router.isReady) return
      setIsLoading(false)

      UserUtils.getUsers().then((res: any) => setUsers(res))
         .catch(err => console.log('err', err))
   }, [router.isReady])

   return (
      <div className="width-100 flex flex-column flex-start bg-white padding-horizontal-10">
         {isLoading && <div>Loading...</div>}

         {errors && errors.length > 0 && (
            <div className="width-100">
               {errors.map((error, index) => (
                  <div key={index}>{error}</div>
               ))}
            </div>
         )}

         <h2>Users</h2>

         {!isLoading && (
            <>
               <header className="width-100 flex flex-row flex-justify-space-between">
                  <div className="flex flex-row flex-align-center width-45 sm-width-30">
                     <input type="search" className="width-100" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <div className="flex flex-row flex-align-center width-45 sm-width-30 xl-width-15">
                     <Link href="/user/new" className="btn btn-small btn-dark width-100">Create User</Link>
                  </div>
               </header>

               <div className="flex flex-column width-100 margin-top-20">
                  {users.filter((u: User) => {
                     if (u.firstname.toLowerCase().includes(search.toLowerCase())) return u
                     else if (u.lastname.toLowerCase().includes(search.toLowerCase())) return u
                     else if (u.email.toLowerCase().includes(search.toLowerCase())) return u
                     else if (u.role.toLowerCase().includes(search.toLowerCase())) return u
                  }).map((user: any) => (
                     <Link href={`/user/${user._id}`} key={user._id}>
                        <div className="flex flex-row width-100 padding-5 margin-vertical-2 bg-info hover-bg-main" >
                           <div className="flex flex-align-end width-45">
                              {user.firstname} {user.lastname}
                           </div>
                           <div className="flex flex-align-end width-45">
                              {user.email}
                           </div>
                           <div className="flex flex-align-end width-10">{user.role}</div>
                        </div>
                     </Link>
                  ))}
               </div>
            </>
         )}
      </div>
   )
}