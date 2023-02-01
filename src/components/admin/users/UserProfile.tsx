import UserUtils from "@/utils/UserUtils"
import Link from "next/link"
import { useRouter } from "next/router";
import { useEffect, useState } from "react"

export default function UserProfile({ profile: { firstname, lastname, email, role }, setProfile }: { profile: { firstname: string, lastname: string, email: string, role: string }, setProfile: Function }) {
   const router = useRouter();

   const [isLoading, setIsLoading] = useState(false)
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

   async function handleUpdateSubmit() {
      setMessage(null)
      setIsLoading(true)

      UserUtils.updateProfile({
         firstname: firstname,
         lastname: lastname,
         email: email,
         role: role
      })
         .then(() => {
            setIsLoading(false)
            setMessage({ type: 1, message: 'Profile updated successfully' })
         })
         .catch(err => {
            setIsLoading(false)
            setMessage({ type: 0, message: err.response.data.message })
         })
   }

   return (
      <div className="width-100 flex-column flex-start bg-white">

         <div className="width-100 flex-column">
            {message && message.type === 0 && <div className="width-100 padding-5-15 bg-danger text-white">{message.message}</div>}
            {message && message.type === 1 && <div className="width-100 padding-5-15 bg-success text-white">{message.message}</div>}
         </div>

         <h2>Profile</h2>

         <div className="flex-center width-100 sm-width-50 xl-width-30">
            <div className="flex-column flex-start width-100">
               <div className="width-100 flex-column margin-vertical-5">
                  <label className="width-100 margin-bottom-5">Firstname</label>
                  {/* setprofile update firstname */}
                  <input type="text" className="width-100" name="firstname" value={firstname} onChange={(e) => setProfile((p: any) => ({ ...p, firstname: e.target.value }))} />
               </div>

               <div className="width-100 flex-column margin-vertical-5">
                  <label className="width-100 margin-bottom-5">Lastname</label>
                  <input type="text" className="width-100" name="lastname" value={lastname} onChange={(e) => setProfile((p: any) => ({ ...p, lastname: e.target.value }))} />
               </div>

               <div className="width-100 flex-column margin-vertical-5">
                  <div className="width-100 margin-bottom-5">Email</div>
                  <input type="email" className="width-100" name="email" value={email} onChange={(e) => setProfile((p: any) => ({ ...p, email: e.target.value }))} disabled />
               </div>

               {!isLoading && (
                  <div className="flex-column flex-start flex-row flex-justify-space-between width-100 margin-top-20">
                     <Link href="#" onClick={handleUpdateSubmit} className="btn primary width-100">Update</Link>
                  </div>
               )}

            </div>
         </div>
      </div>
   )
}