import UserUtils from "@/utils/UserUtils"
import Link from "next/link"
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import Loading from "./Loading";

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

      UserUtils.getProfile()
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
   }, [router.isReady])

   async function handleUpdateSubmit() {
      setSuccess('')
      setError('')
      setIsLoading(true)

      UserUtils.updateProfile({
         firstname: firstname,
         lastname: lastname,
         email: email,
         role: role
      })
         .then(() => {
            setIsLoading(false)
            setSuccess('Profile updated successfully')
         })
         .catch(err => {
            setIsLoading(false)
            setError(err.response.data.message)
         })
   }

   return (
      <div className="width-100 sm-width-50 xl-width-30 flex flex-column flex-start bg-white padding-horizontal-10">
         <h2>Profile</h2>

         <Loading isLoading={isLoading} />

         {!isLoading && (
            <div className="container flex flex-center width-100">
               {success && (
                  <div className="width-100 flex flex-column margin-bottom-top-15 margin-bottom-10">
                     <div className="width-100 padding-5 bg-success color-white">{success}</div>
                  </div>
               )}
               {error && (
                  <div className="width-100 flex flex-column margin-bottom-top-15 margin-bottom-10">
                     <div className="width-100 padding-5 bg-danger color-white">{error}</div>
                  </div>
               )}

               <div className="flex flex-column flex-start width-100">
                  <div className="width-100 flex flex-column margin-vertical-5">
                     <label className="width-100 margin-bottom-5">Firstname</label>
                     <input type="text" className="width-100" name="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                  </div>

                  <div className="width-100 flex flex-column margin-vertical-5">
                     <label className="width-100 margin-bottom-5">Lastname</label>
                     <input type="text" className="width-100" name="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                  </div>

                  <div className="width-100 flex flex-column margin-vertical-5">
                     <div className="width-100 margin-bottom-5">Email</div>
                     <input type="email" className="width-100" name="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                  </div>

                  <div className="flex flex-column flex-start flex-row flex-justify-space-between width-100 margin-top-20">
                     <Link href="#" onClick={handleUpdateSubmit} className="btn btn-primary width-100">Update</Link>
                  </div>
               </div>
            </div>
         )}
      </div>
   )
}