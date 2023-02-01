import Modal from "@/components/Modal";
import User from "@/models/User"
import UserUtils from "@/utils/UserUtils";
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import UserForm from "./UserForm";

export default function UserList({ users, setUsers }: { users: User[], setUsers: Function }) {
   const router = useRouter();

   const [isLoading, setIsLoading] = useState(true)
   const [search, setSearch] = useState('' as string)
   const [selectedUser, setSelectedUser] = useState(null as User | null)
   const [message, setMessage] = useState(null as { type: number, message: string } | null)
   const [messageTimer, setMessageTimer] = useState<any>(null)

   useEffect(() => {
      if (!message) return

      clearTimeout(messageTimer)
      setMessageTimer(setTimeout(() => {
         setMessage(null)
         setMessageTimer(false)
      }, 2000));
   }, [message])

   const createUser = (user: User) => {

      console.log('user', user)
      setUsers([...users, user])
   }

   const updateUser = (user: User) => {
      setUsers(users.map((u: User) => {
         if (u._id === user._id) return user
         else return u
      }))
   }

   const deleteUser = (user: User) => {
      setUsers(users.filter((u: User) => u._id !== user._id))
   }

   return (
      <div className="width-100 flex-column flex-start bg-white ">
         <>
            <div className="width-100 flex-column">
               {message && message.type === 0 && <div className="width-100 padding-5-15 bg-danger text-white">{message.message}</div>}
               {message && message.type === 1 && <div className="width-100 padding-5-15 bg-success text-white">{message.message}</div>}
            </div>

            {!selectedUser && (
               <>
                  <header className="width-100 flex-column sm-flex-row">
                     <div className="width-30">
                        <h2>Users</h2>
                     </div>

                     <div className="width-100 sm-width-70 flex-row flex-justify-end">
                        <div className="flex-row flex-align-center width-70 sm-width-50 xl-width-30 padding-right-20">
                           <input type="search" className="width-100" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="flex-row flex-align-center width-30 sm-width-30 xl-width-15">
                           <Link href="#" className="btn small dark width-100" onClick={() => setSelectedUser(new User({ _id: 'new' }))}>Add</Link>
                        </div>
                     </div>
                  </header>

                  <div className="flex-column width-100 margin-top-20">
                     {users.filter((u: User) => {
                        if (u.firstname.toLowerCase().includes(search.toLowerCase())) return u
                        else if (u.lastname.toLowerCase().includes(search.toLowerCase())) return u
                        else if (u.email.toLowerCase().includes(search.toLowerCase())) return u
                        else if (u.role.toLowerCase().includes(search.toLowerCase())) return u
                     }).map((user: any) => (
                        <Link href='#' key={user._id} onClick={() => setSelectedUser(user)}>
                           <div className="flex-row width-100 padding-5 margin-vertical-2 bg-info hover-bg-info" >
                              <div className="flex-align-end width-45 ellipsis">{user.firstname} {user.lastname}</div>
                              <div className="flex-align-end width-45 ellipsis">{user.email}</div>
                              <div className="flex-align-end width-10 ellipsis">{user.role}</div>
                           </div>
                        </Link>
                     ))}
                  </div>
               </>
            )}

            {selectedUser && (
               <>
                  <header className="width-100 flex-row flex-align-center">
                     <div className="width-50">
                        <h2>{selectedUser._id === 'new' ? 'Create user' : 'Edit user'}</h2>
                     </div>
                     <div className="width-50 flex-justify-end">
                        <div className="flex-row flex-align-center width-45 sm-width-30 xl-width-15">
                           <Link href="#" className="btn small info width-100" onClick={() => setSelectedUser(null)}>Back</Link>
                        </div>
                     </div>
                  </header>

                  <UserForm users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser} setMessage={setMessage} createUser={createUser} updateUser={updateUser} deleteUser={deleteUser} />
               </>
            )}
         </>
      </div >
   )
}