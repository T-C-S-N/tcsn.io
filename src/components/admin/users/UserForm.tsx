import axios from "axios"
import { useState } from "react"

// display a form to create a new user
export default function UserForm() {
   const [firstname, setFirstname] = useState('')
   const [lastname, setLastname] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [role, setRole] = useState('user')

   async function handleSubmit(e: any) {
      e.preventDefault()
      const res = await axios.post('/api/admin/users/addUser', {
         name,
         email,
         password,
         role
      })
   }

   return (
      <div className="user-form">
         {firstname} <br />
         {lastname} <br />
         {email} <br />
         {password} <br />
         {role} <br /> <br />

         <div className="user-form__title">Create a new user</div>
         <div className="user-form__form">
            <div className="user-form__form__input">
               <label htmlFor="name">Firstname</label>
               <input type="text" name="firstname" id="name" onChange={e => setFirstname(e.target.value)} />
            </div>
            <div className="user-form__form__input">
               <label htmlFor="name">Lastname</label>
               <input type="text" name="lastname" id="name" onChange={e => setLastname(e.target.value)} />
            </div>
            <div className="user-form__form__input">
               <label htmlFor="email">Email</label>
               <input type="email" name="email" id="email" onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="user-form__form__input">
               <label htmlFor="password">Password</label>
               <input type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="user-form__form__input">
               <label htmlFor="role">Role</label>
               <select name="role" id="role" onChange={e => setRole(e.target.value)} value={role}>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
               </select>
            </div>
            <div className="user-form__form__input">
               <button type="submit" onClick={handleSubmit}>Create</button>
            </div>
         </div>
      </div>
   )
}


