import UserUtils from "@/utils/UserUtils"
import axios from "axios"
import { getSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function UserForm({ id }: { id: any }) {
   const router = useRouter();

   const [isLoading, setIsLoading] = useState(true)
   const [error, setError] = useState('' as string)
   const [firstname, setFirstname] = useState('')
   const [lastname, setLastname] = useState('')
   const [email, setEmail] = useState('')
   const [role, setRole] = useState('user')
   const [password, setPassword] = useState('')
   const [passwordConfirm, setPasswordConfirm] = useState('')
   const [deleteConfirm, setDeleteConfirm] = useState(false)
   const [deleteConfirmTimer, setDeleteConfirmTimer] = useState<any>(null)

   useEffect(() => {
      if (!router.isReady) return
      setIsLoading(false)


   }, [router.isReady, id])

   useEffect(() => {
      if (!id) return
      setIsLoading(false)
      if (id === 'new') return

      UserUtils.getUser(id)
         .then((res: any) => {
            setFirstname(res.firstname)
            setLastname(res.lastname)
            setEmail(res.email)
            setRole(res.role)
         })
         .catch(err => setError(err.response.data.message))
   }, [id])

   useEffect(() => {
      if (!deleteConfirm) return

      clearTimeout(deleteConfirmTimer)
      setDeleteConfirmTimer(setTimeout(() => {
         setDeleteConfirm(false)
      }, 1000));
   }, [deleteConfirm, deleteConfirmTimer])

   async function handleCreateSubmit(e: any) {
      e.preventDefault()
      setError('')

      // create user
      UserUtils.createUser({
         firstname,
         lastname,
         email,
         role,
         password,
         passwordConfirm
      })
         .then((res: any) => {
            console.log('res', res)
            window.location.href = '/dashboard/users'
         })
         .catch(err => setError(err.response.data.message))
   }

   async function handleUpdateSubmit(e: any) {
      e.preventDefault()
      setError('')
      setDeleteConfirm(false)

      // update user
      UserUtils.updateUser(id, {
         firstname,
         lastname,
         email,
         role
      })
         .then((res: any) => {
            window.location.href = '/dashboard/users'
         })
         .catch(err => setError(err.response.data.message))
   }

   async function handleDeleteSubmit(e: any) {
      e.preventDefault()
      setError('')

      // delete user
      UserUtils.deleteUser(id)
         .then((res: any) => {
            window.location.href = '/dashboard/users'
         })
         .catch(err => setError(err.response.data.message))
   }

   return (
      <div className="flex flex-start flex-column width-90 sm-width-50 xl-width-30 bg-white margin-10">
         <header className="width-100 flex flex-start flex-justify-space-between flex-align-center padding-10">
            <h1 className="margin-0">{id === 'new' ? 'Create user' : 'Edit user'}</h1>
            <Link href="/dashboard/users" className="btn btn-small btn-light">Close</Link>
         </header>

         {isLoading && <div>Loading...</div>}

         {error && (
            <div className="width-100 flex flex-column padding-5 margin-left-10">
               <div className="width-95 padding-5 bg-danger color-white">{error}</div>
            </div>
         )}

         {!isLoading && (
            <div className="flex flex-column flex-start width-100 padding-15">
               <div className="width-100 flex flex-column margin-vertical-5">
                  <label className="width-100 margin-bottom-5">Firstname</label>
                  <input type="text" className="width-100" name="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
               </div>
               <div className="width-100 flex flex-column margin-vertical-5">
                  <label className="width-100 margin-bottom-5">Lastname</label>
                  <input type="text" className="width-100" name="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
               </div>

               <div className="width-100 flex flex-column margin-vertical-5">
                  <label className="width-100 margin-bottom-5">Email</label>
                  <input type="email" className="width-100" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
               </div>

               <div className="width-100 flex flex-column margin-vertical-5">
                  <label className="width-100 margin-bottom-5">Role</label>
                  <select name="role" value={role} onChange={(e) => setRole(e.target.value)}>
                     <option value="user">User</option>
                     <option value="admin">Admin</option>
                  </select>
               </div>
            </div>
         )}

         {!isLoading && id !== 'new' && (
            <>
               <div className="flex flex-column flex-start flex-row flex-justify-space-between width-100 padding-15">
                  <Link href='#' className="btn btn-primary width-100" onClick={handleUpdateSubmit}>Update</Link>
                  {!deleteConfirm && <Link href='#' className="btn btn-border-danger width-100 margin-top-20" onClick={() => setDeleteConfirm(true)}>Delete</Link>}
                  {deleteConfirm && <Link href='#' className="btn btn-danger width-100 margin-top-20" onClick={handleDeleteSubmit}>Confirm</Link>}
               </div>
            </>
         )}

         {!isLoading && id === 'new' && (
            <>
               <div className="flex flex-column flex-start width-100 padding-15">
                  <div className="width-100 flex flex-column margin-vertical-5">
                     <label className="width-100 margin-bottom-5">Password</label>
                     <input type="password" className="width-100" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div className="width-100 flex flex-column margin-vertical-5">
                     <label className="width-100 margin-bottom-5">Password confirmation</label>
                     <input type="password" className="width-100" name="passwordConfirm" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                  </div>
               </div>

               <div className="flex flex-column flex-start flex-row flex-justify-space-between width-100">
                  <Link href="#" onClick={handleCreateSubmit} className="btn btn-primary width-100">Create</Link>
               </div>
            </>
         )}

      </div>
   )
}