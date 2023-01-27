import UserUtils from "@/utils/UserUtils"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Loading from "./Loading"

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
      if (!id) return
      if (id === 'new') return setIsLoading(false)

      UserUtils.getUser(id)
         .then((res: any) => {
            setIsLoading(false)
            setFirstname(res.firstname)
            setLastname(res.lastname)
            setEmail(res.email)
            setRole(res.role)
         })
         .catch(err => {
            setIsLoading(false)
            setError(err.response.data.message)
         })
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
      setIsLoading(true)

      // create user
      UserUtils.createUser({
         firstname,
         lastname,
         email,
         role,
         password,
         passwordConfirm
      })
         .then(() => router.push('/dashboard/users'))
         .catch(err => {
            setIsLoading(false)
            setError(err.response.data.message)
         })
   }

   async function handleUpdateSubmit(e: any) {
      e.preventDefault()
      setError('')
      setDeleteConfirm(false)
      setIsLoading(true)

      // update user
      UserUtils.updateUser(id, {
         firstname,
         lastname,
         email,
         role
      })
         .then(() => router.push('/dashboard/users'))
         .catch(err => {
            setIsLoading(false)
            setError(err.response.data.message)
         })
   }

   async function handleDeleteSubmit(e: any) {
      e.preventDefault()
      setError('')
      setIsLoading(true)

      // delete user
      UserUtils.deleteUser(id)
         .then(() => router.push('/dashboard/users'))
         .catch(err => {
            setIsLoading(false)
            setError(err.response.data.message)
         })
   }

   return (
      <div className="flex flex-start flex-column width-90 sm-width-50 xl-width-30 bg-white margin-10">
         <header className="width-100 flex flex-start flex-justify-space-between flex-align-center padding-10">
            <h1 className="margin-0">{id === 'new' ? 'Create user' : 'Edit user'}</h1>
            <Link href="/dashboard/users" className="btn btn-small btn-light">Close</Link>
         </header>

         <Loading isLoading={isLoading} />

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