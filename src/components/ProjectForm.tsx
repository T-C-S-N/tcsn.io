import ProjectUtils from "@/utils/ProjectUtils"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

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
      if (!router.isReady) return
      setIsLoading(false)
   }, [router.isReady])

   useEffect(() => {
      if (!id) return
      setIsLoading(false)
      if (id === 'new') return

      ProjectUtils.getProject(id)
         .then((res: any) => {
            console.log('res', res)
            console.log('res.title', res.title)
            console.log('res.description', res.description)
            console.log('res.details', res.details)
            console.log('res.url', res.url)

            setTitle(res.title)
            setDescription(res.description)
            setDetails(res.details)
            setUrl(res.url)
            setIsOnline(res.isOnline)
            setCreatedAt(res.createdAt)
            setUpdatedAt(res.updatedAt)
         })
         .catch(err => console.log('err', err))
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

      // create project
      ProjectUtils.createProject({
         title,
         description,
         details,
         url
      })
         .then((res: any) => {
            console.log('res', res)
            window.location.href = '/dashboard/projects'
         })
         .catch(err => setError(err.response.data.message))
   }

   async function handleUpdateSubmit(e: any) {
      e.preventDefault()
      setError('')
      setDeleteConfirm(false)

      // update project
      ProjectUtils.updateProject(id, {
         title,
         description,
         details,
         url
      })
         .then((res: any) => {
            window.location.href = '/dashboard/projects'
         })
         .catch(err => setError(err.response.data.message))
   }

   async function handleDeleteSubmit(e: any) {
      e.preventDefault()
      setError('')

      // delete project
      ProjectUtils.deleteProject(id)
         .then((res: any) => {
            window.location.href = '/dashboard/projects'
         })
         .catch(err => setError(err.response.data.message))
   }

   return (
      <div className="flex flex-start flex-column width-90 sm-width-50 xl-width-30 bg-white margin-10">
         <header className="width-100 flex flex-start flex-justify-space-between flex-align-center padding-10">
            <h1 className="margin-0">{id === 'new' ? 'Create project' : 'Edit project'}</h1>
            <Link href="/dashboard/projects" className="btn btn-small btn-light">Close</Link>
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
               <div className="flex flex-column flex-start flex-row flex-justify-space-between width-100">
                  <Link href="#" onClick={handleCreateSubmit} className="btn btn-primary width-100">Create</Link>
               </div>
            </>
         )}

      </div>
   )
}