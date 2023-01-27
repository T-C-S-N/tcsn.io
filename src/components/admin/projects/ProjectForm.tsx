import ProjectUtils from "@/utils/ProjectUtils"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Loading from "../../Loading";

export default function ProjectForm({ id }: { id: any }) {
   const router = useRouter();

   const [isLoading, setIsLoading] = useState(true)
   const [error, setError] = useState('' as string)
   const [deleteConfirm, setDeleteConfirm] = useState(false)
   const [deleteConfirmTimer, setDeleteConfirmTimer] = useState<any>(null)

   const [title, setTitle] = useState('')
   const [description, setDescription] = useState('')
   const [details, setDetails] = useState('')
   const [url, setUrl] = useState('')
   const [isOnline, setIsOnline] = useState(false)
   const [createdAt, setCreatedAt] = useState('')
   const [updatedAt, setUpdatedAt] = useState('')

   useEffect(() => {
      if (!id) return
      if (id === 'new') return setIsLoading(false)

      ProjectUtils.getProject(id)
         .then((res: any) => {
            setIsLoading(false)
            setTitle(res.title)
            setDescription(res.description)
            setDetails(res.details)
            setUrl(res.url)
            setIsOnline(res.isOnline)
            setCreatedAt(res.createdAt)
            setUpdatedAt(res.updatedAt)
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
   }, [deleteConfirm])

   async function handleCreateSubmit(e: any) {
      e.preventDefault()
      setError('')
      setIsLoading(true)

      // create project
      ProjectUtils.createProject({
         title,
         description,
         details,
         url
      })
         .then(() => router.push('/dashboard/projects'))
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

      // update project
      ProjectUtils.updateProject(id, {
         title,
         description,
         details,
         url
      })
         .then(() => router.push('/dashboard/projects'))
         .catch(err => {
            setIsLoading(false)
            setError(err.response.data.message)
         })
   }

   async function handleDeleteSubmit(e: any) {
      e.preventDefault()
      setError('')
      setIsLoading(true)

      // delete project
      ProjectUtils.deleteProject(id)
         .then(() => router.push('/dashboard/projects'))
         .catch(err => {
            setIsLoading(false)
            setError(err.response.data.message)
         })
   }

   return (
      <div className="width-100 sm-width-55 xl-width-35 flex flex-column flex-start bg-white padding-horizontal-10">

         <Loading isLoading={isLoading} />

         {!isLoading && (
            <div className="container flex flex-center width-100">
               <div className="width-100 flex flex-column margin-bottom-15">
                  <h2>{id === 'new' ? 'Create project' : 'Edit project'}</h2>
                  <Link href="/dashboard/projects" className="btn btn-small btn-light width-20">Back</Link>
               </div>

               {error && (
                  <div className="width-100 flex flex-column margin-bottom-top-15 margin-bottom-10">
                     <div className="width-100 padding-5 bg-danger color-white">{error}</div>
                  </div>
               )}

               <div className="flex flex-column flex-start width-100">
                  <div className="width-100 flex flex-column margin-vertical-5">
                     <label className="width-100 margin-bottom-5">title</label>
                     <input type="text" className="width-100" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="width-100 flex flex-column margin-vertical-5">
                     <label className="width-100 margin-bottom-5">description</label>
                     <textarea className="width-100" name="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                  </div>

                  <div className="width-100 flex flex-column margin-vertical-5">
                     <label className="width-100 margin-bottom-5">details</label>
                     <textarea className="width-100" name="details" value={details} onChange={(e) => setDetails(e.target.value)}></textarea>
                  </div>

                  <div className="width-100 flex flex-column margin-vertical-5">
                     <label className="width-100 margin-bottom-5">url</label>
                     <input type="text" className="width-100" name="url" value={url} onChange={(e) => setUrl(e.target.value)} />
                  </div>

                  {id !== 'new' && (
                     <div className="flex flex-start flex-column sm-flex-row flex-justify-space-between width-100 margin-top-20">
                        <Link href='#' className="btn btn-primary width-100 sm-width-45 margin-bottom-20 sm-margin-bottom-0" onClick={handleUpdateSubmit}>Update</Link>
                        {!deleteConfirm && <Link href='#' className="btn btn-border-danger width-100 sm-width-45" onClick={() => setDeleteConfirm(true)}>Delete</Link>}
                        {deleteConfirm && <Link href='#' className="btn btn-danger width-100 sm-width-45" onClick={handleDeleteSubmit}>Confirm</Link>}
                     </div>
                  )}

                  {id === 'new' && (
                     <div className="flex flex-column flex-start flex-row flex-justify-space-between width-100 margin-top-20">
                        <Link href="#" onClick={handleCreateSubmit} className="btn btn-primary width-100">Create</Link>
                     </div>
                  )}
               </div>
            </div>
         )}

      </div>
   )
}