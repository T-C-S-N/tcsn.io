import UserUtils from "@/utils/UserUtils"
import Link from "next/link"
import { useRouter } from "next/router";
import { useEffect, useState } from "react"

export default function UserProfile() {
   const router = useRouter();

   const [isLoading, setIsLoading] = useState(true)
   const [success, setSuccess] = useState('' as string)
   const [error, setError] = useState('' as string)
   const [timer, setTimer] = useState<any>(null)
   const [firstname, setFirstname] = useState('')
   const [lastname, setLastname] = useState('')
   const [email, setEmail] = useState('')
   const [role, setRole] = useState('')

   useEffect(() => {
      if (!router.isReady) return
      setIsLoading(false)

      UserUtils.getProfile()
         .then((res: any) => {
            setFirstname(res.firstname)
            setLastname(res.lastname)
            setEmail(res.email)
            setRole(res.role)
         })
         .catch(err => console.log('err', err))
   }, [router.isReady])

   async function handleUpdateSubmit() {
      setSuccess('')
      setError('')

      UserUtils.updateProfile({
         firstname: firstname,
         lastname: lastname,
         email: email,
         role: role
      })
         .then(() => {
            setSuccess('Profile updated successfully')
         })
         .catch(err => setError(err.message || err.response.data.message))
   }

   return (
      <div className="width-100 flex flex-column flex-start bg-white padding-horizontal-10">
         <h2>Profile</h2>
         {isLoading && <div>Loading...</div>}

         {success && (
            <div className="width-100 sm-width-60 xl-width-40 flex flex-column padding-5 margin-left-10">
               <div className="width-95 padding-5 bg-success color-white">{success}</div>
            </div>
         )}
         {error && (
            <div className="width-100 sm-width-60 xl-width-40 flex flex-column padding-5 margin-left-10">
               <div className="width-95 padding-5 bg-success color-white">{error}</div>
            </div>
         )}
         {!isLoading && (
            <div className="container flex flex-center width-100">
               <div className="width-100 flex flex-column margin-vertical-5 width-100 sm-width-60 xl-width-40">
                  <label className="width-100 margin-bottom-5">Firstname</label>
                  <input type="text" className="width-100" name="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
               </div>

               <div className="width-100 flex flex-column margin-vertical-5 width-100 sm-width-60 xl-width-40">
                  <label className="width-100 margin-bottom-5">Lastname</label>
                  <input type="text" className="width-100" name="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
               </div>

               <div className="width-100 flex flex-column margin-vertical-5 width-100 sm-width-60 xl-width-40">
                  <div className="width-100 margin-bottom-5">Email</div>
                  <input type="email" className="width-100" name="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
               </div>

               <div className="flex flex-start flex-row flex-justify-space-between width-100 margin-top-20 width-100 sm-width-60 xl-width-40">
                  <Link href="#" onClick={handleUpdateSubmit} className="btn btn-primary width-100">Update</Link>
               </div>
            </div>
         )}
      </div>
   )
}