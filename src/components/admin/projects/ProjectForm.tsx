import ProjectUtils from "@/utils/ProjectUtils"
import Link from "next/link"
import { useEffect, useState } from "react"
import Loading from "../../Loading";
import Project from "@/models/Project";
import moment from "moment";

export default function ProjectForm({ projects, selectedProject, setSelectedProject, setMessage, createProject, updateProject, deleteProject }: { projects: Project[], selectedProject: Project, setSelectedProject: Function, setMessage: Function, createProject: Function, updateProject: Function, deleteProject: Function }) {

   const [isLoading, setIsLoading] = useState(true)
   const [deleteConfirm, setDeleteConfirm] = useState(false)
   const [deleteConfirmTimer, setDeleteConfirmTimer] = useState<any>(null)

   useEffect(() => {
      if (!deleteConfirm) return

      clearTimeout(deleteConfirmTimer)
      setDeleteConfirmTimer(setTimeout(() => {
         setDeleteConfirm(false)
      }, 1000));
   }, [deleteConfirm])

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

      const ok = await Project.checkUpdateForm(selectedProject)
         .catch(err => {
            return setMessage({ type: 0, message: err.message })
         })
      if (!ok) return

      // create project
      const newProject = new Project(selectedProject)
      delete newProject._id
      newProject.isOnline = JSON.parse(newProject.isOnline.toString())

      ProjectUtils.createProject(newProject)
         .then((res) => {
            setMessage({ type: 1, message: 'Project created' })
            createProject({ ...newProject, _id: res.insertedId })
            setSelectedProject(null)
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

      if (!selectedProject || !selectedProject._id) return setMessage({ type: 0, message: 'No project selected' })

      const ok = await Project.checkUpdateForm(selectedProject)
         .catch(err => {
            return setMessage({ type: 0, message: err.message })
         })
      if (!ok) return

      // update project
      const newProject = new Project(selectedProject)
      delete newProject.updatedAt
      ProjectUtils.updateProject(selectedProject._id, new Project(newProject))
         .then(() => {
            setMessage({ type: 1, message: 'Project updated' })
            updateProject(newProject)
            setSelectedProject(null)
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

      if (!selectedProject || !selectedProject._id) return setMessage({ type: 0, message: 'No project selected' })

      // delete project
      ProjectUtils.deleteProject(selectedProject._id)
         .then(() => {
            setMessage({ type: 1, message: 'Project deleted' })
            deleteProject(selectedProject)
            setSelectedProject(null)
         })
         .catch(err => {
            setIsLoading(false)
            setMessage({ type: 0, message: err.response.data.message })
         })
   }

   return (
      <div className="width-100 sm-width-55 xl-width-35 flex-column flex-start bg-white padding-horizontal-10">
         <div className="flex-column flex-center width-100">
            <div className="width-100 flex-column margin-vertical-5">
               <label className="width-100 margin-bottom-5">title</label>
               <input type="text" className="width-100" name="title" value={selectedProject.title}
                  onChange={(e: any) => setSelectedProject((s: Project) => ({ ...s, title: e.target.value }))} />
            </div>
            <div className="width-100 flex-column margin-vertical-5">
               <label className="width-100 margin-bottom-5">description</label>
               <textarea className="width-100" name="description" value={selectedProject.description}
                  onChange={(e: any) => setSelectedProject((s: Project) => ({ ...s, description: e.target.value }))}></textarea>
            </div>

            <div className="width-100 flex-column margin-vertical-5">
               <label className="width-100 margin-bottom-5">details</label>
               <textarea className="width-100" name="details" value={selectedProject.details}
                  onChange={(e: any) => setSelectedProject((s: Project) => ({ ...s, details: e.target.value }))}></textarea>
            </div>

            <div className="width-100 flex-column margin-vertical-5">
               <label className="width-100 margin-bottom-5">url</label>
               <input type="text" className="width-100" name="url" value={selectedProject.url}
                  onChange={(e: any) => setSelectedProject((s: Project) => ({ ...s, url: e.target.value }))} />
            </div>

            <div className="width-100 flex-row flex-align-center margin-vertical-5">
               <label className="width-100 margin-bottom-5">Is Online</label>
               <select name="isOnline" className="width-50" value={selectedProject.isOnline as any}
                  onChange={(e) => setSelectedProject((s: Project) => ({ ...s, isOnline: e.target.value }))}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
               </select>
            </div>

            {selectedProject._id !== 'new' && (
               <>
                  <div className="width-100 flex-row flex-align-center margin-vertical-5">
                     <label className="width-50">Created At</label>
                     <p className="width-50 flex-justify-end margin-0">{moment(selectedProject.createdAt).format('HH:mm DD/MM/YYYY')}</p>
                  </div>
                  <div className="width-100 flex-row flex-align-center margin-vertical-5">
                     <label className="width-50">Updated At</label>
                     <p className="width-50 flex-justify-end margin-0">{moment(selectedProject.updatedAt).format('HH:mm DD/MM/YYYY')}</p>
                  </div>
               </>
            )}

            {selectedProject._id !== 'new' && (
               <div className="flex-start flex-column sm-flex-row flex-justify-space-between width-100 margin-top-20">
                  <Link href='#' className="btn primary width-100 sm-width-45 margin-bottom-20 sm-margin-bottom-0" onClick={handleUpdateSubmit}>Update</Link>
                  {!deleteConfirm && <Link href='#' className="btn border danger width-100 sm-width-45" onClick={() => setDeleteConfirm(true)}>Delete</Link>}
                  {deleteConfirm && <Link href='#' className="btn danger width-100 sm-width-45" onClick={handleDeleteSubmit}>Confirm</Link>}
               </div>
            )}

            {selectedProject._id === 'new' && (
               <div className="flex-column flex-start flex-row flex-justify-space-between width-100 margin-top-20">
                  <Link href="#" onClick={handleCreateSubmit} className="btn primary width-100">Create</Link>
               </div>
            )}
         </div>
      </div>
   )
}