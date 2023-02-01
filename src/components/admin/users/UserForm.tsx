import UserUtils from "@/utils/UserUtils"
import Link from "next/link"
import { useEffect, useState } from "react"
import User from "@/models/User"
import moment from "moment"

export default function UserForm({ users, selectedUser, setSelectedUser, setMessage, createUser, updateUser, deleteUser }: { users: User[], selectedUser: User, setSelectedUser: Function, setMessage: Function, createUser: Function, updateUser: Function, deleteUser: Function }) {
   const [isLoading, setIsLoading] = useState(false)
   const [deleteConfirm, setDeleteConfirm] = useState(false)
   const [deleteConfirmTimer, setDeleteConfirmTimer] = useState<any>(null)

   useEffect(() => {
      if (!deleteConfirm) return

      clearTimeout(deleteConfirmTimer)
      setDeleteConfirmTimer(setTimeout(() => {
         setDeleteConfirm(false)
      }, 1000));
   }, [deleteConfirm])

   async function handleCreateSubmit(e: any) {
      e.preventDefault()
      setMessage(null)
      setIsLoading(true)

      const ok = await User.checkCreationForm(selectedUser)
         .catch(err => {
            return setMessage({ type: 0, message: err.message })
         })
      if (!ok) return

      // create user
      const newUser = new User(selectedUser)
      delete newUser._id

      UserUtils.createUser(newUser)
         .then((res) => {
            setMessage({ type: 1, message: 'User created' })
            createUser({ ...newUser, _id: res.insertedId })
            setSelectedUser(null)
         })
         .catch(err => {
            setIsLoading(false)
            setMessage({ type: 0, message: err.response.data.message })
         })
   }

   async function handleUpdateSubmit(e: any) {
      e.preventDefault()
      setMessage(null)
      setDeleteConfirm(false)
      setIsLoading(true)

      if (!selectedUser || !selectedUser._id) return setMessage({ type: 0, message: 'No user selected' })

      const ok = await User.checkUpdateForm(selectedUser)
         .catch(err => {
            return setMessage({ type: 0, message: err.message })
         })
      if (!ok) return

      // update user
      const newUser = new User(selectedUser)
      delete newUser.updatedAt
      UserUtils.updateUser(selectedUser._id, new User(newUser))
         .then(() => {
            setMessage({ type: 1, message: 'User updated' })
            updateUser(newUser)
            setSelectedUser(null)
         })
         .catch(err => {
            setIsLoading(false)
            setMessage({ type: 0, message: err.response.data.message })
         })
   }

   async function handleDeleteSubmit(e: any) {
      e.preventDefault()
      setMessage(null)
      setIsLoading(true)

      if (!selectedUser || !selectedUser._id) return setMessage({ type: 0, message: 'No user selected' })

      // delete user
      UserUtils.deleteUser(selectedUser._id)
         .then(() => {
            setMessage({ type: 1, message: 'User deleted' })
            deleteUser(selectedUser)
            setSelectedUser(null)
         })
         .catch(err => {
            setIsLoading(false)
            setMessage({ type: 0, message: err.response.data.message })
         })
   }

   return (
      <div className="width-100 sm-width-55 xl-width-35 flex-column flex-start bg-white padding-horizontal-10">
         <div className="flex-column flex-start width-100">
            <div className="width-100 flex-column margin-vertical-5">
               <label className="width-100 margin-bottom-5">Firstname</label>
               <input type="text" className="width-100" name="firstname" value={selectedUser.firstname}
                  onChange={(e) => setSelectedUser((s: User) => ({ ...s, firstname: e.target.value }))} />
            </div>
            <div className="width-100 flex-column margin-vertical-5">
               <label className="width-100 margin-bottom-5">Lastname</label>
               <input type="text" className="width-100" name="lastname" value={selectedUser.lastname}
                  onChange={(e) => setSelectedUser((s: User) => ({ ...s, lastname: e.target.value }))} />
            </div>

            <div className="width-100 flex-column margin-vertical-5">
               <label className="width-100 margin-bottom-5">Email</label>
               <input type="email" className="width-100" name="email" value={selectedUser.email}
                  onChange={(e) => setSelectedUser((s: User) => ({ ...s, email: e.target.value }))} />
            </div>

            <div className="width-100 flex-column margin-vertical-5">
               <label className="width-100 margin-bottom-5">Role</label>
               <select name="role" value={selectedUser.role}
                  onChange={(e) => setSelectedUser((s: User) => ({ ...s, role: e.target.value }))}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
               </select>
            </div>

            {selectedUser._id !== 'new' && (
               <>
                  <div className="width-100 flex-row flex-align-center margin-vertical-5">
                     <label className="width-50">Created At</label>
                     <p className="width-50 flex-justify-end margin-0">{moment(selectedUser.createdAt).format('HH:mm DD/MM/YYYY')}</p>
                  </div>
                  <div className="width-100 flex-row flex-align-center margin-vertical-5">
                     <label className="width-50">Updated At</label>
                     <p className="width-50 flex-justify-end margin-0">{moment(selectedUser.updatedAt).format('HH:mm DD/MM/YYYY')}</p>
                  </div>
               </>
            )}

            {selectedUser._id !== 'new' && (
               <div className="flex-start flex-column sm-flex-row flex-justify-space-between width-100 margin-top-20">
                  <Link href='#' className="btn primary width-100 sm-width-45 margin-bottom-20 sm-margin-bottom-0"
                     onClick={handleUpdateSubmit}>Update</Link>

                  {users.length > 1 && (
                     <>
                        {!deleteConfirm && <Link href='#' className="btn border danger width-100 sm-width-45"
                           onClick={() => setDeleteConfirm(true)}>Delete</Link>}
                        {deleteConfirm && <Link href='#' className="btn danger width-100 sm-width-45"
                           onClick={handleDeleteSubmit}>Confirm</Link>}
                     </>
                  )}

               </div>
            )}

            {selectedUser._id === 'new' && (
               <>
                  <div className="flex-column flex-start width-100">
                     <div className="width-100 flex-column margin-vertical-5">
                        <label className="width-100 margin-bottom-5">Password</label>
                        <input type="password" className="width-100" name="password" value={selectedUser.password}
                           onChange={(e) => setSelectedUser((s: User) => ({ ...s, password: e.target.value }))} />
                     </div>
                     <div className="width-100 flex-column margin-vertical-5">
                        <label className="width-100 margin-bottom-5">Password confirmation</label>
                        <input type="password" className="width-100" name="passwordConfirm" value={selectedUser.passwordConfirm}
                           onChange={(e) => setSelectedUser((s: User) => ({ ...s, passwordConfirm: e.target.value }))} />
                     </div>
                  </div>

                  <div className="flex-column flex-start flex-row flex-justify-space-between width-100 margin-top-20">
                     <Link href="#" onClick={handleCreateSubmit} className="btn primary width-100">Create</Link>
                  </div>
               </>
            )}
         </div>

      </div>
   )
}