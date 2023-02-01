import ProjectUtils from "@/utils/ProjectUtils"
import Link from "next/link"
import { useEffect, useState } from "react"
import Project from "@/models/Project";
import ProjectForm from "./ProjectForm";
const moment = require('moment')

export default function ProjectList({ projects, setProjects }: { projects: Project[], setProjects: Function }) {
   const [isLoading, setIsLoading] = useState(true)
   const [search, setSearch] = useState('' as string)
   const [selectedProject, setSelectedProject] = useState(null as Project | null)
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

   const createProject = (project: Project) => {
      setProjects([...projects, project])
   }

   const updateProject = (project: Project) => {
      setProjects(projects.map((u: Project) => {
         if (u._id === project._id) return project
         else return u
      }))
   }

   const deleteProject = (project: Project) => {
      setProjects(projects.filter((u: Project) => u._id !== project._id))
   }

   return (
      <div className="width-100 flex-column flex-start bg-white">
         <>
            <div className="width-100 flex-column">
               {message && message.type === 0 && <div className="width-100 padding-5-15 bg-danger text-white">{message.message}</div>}
               {message && message.type === 1 && <div className="width-100 padding-5-15 bg-success text-white">{message.message}</div>}
            </div>
            {!selectedProject && (
               <>
                  <header className="width-100 flex-column sm-flex-row">
                     <div className="width-30">
                        <h2>Projects</h2>
                     </div>

                     <div className="width-100 sm-width-70 flex-row flex-justify-end">
                        <div className="flex-row flex-align-center width-70 sm-width-50 xl-width-30 padding-right-20">
                           <input type="search" className="width-100" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="flex-row flex-align-center width-30 sm-width-30 xl-width-15">
                           <Link href="#" className="btn small primary width-100" onClick={() => setSelectedProject(new Project({ _id: 'new' }))}>Add</Link>
                        </div>
                     </div>
                  </header>

                  <div className="flex-column width-100 margin-top-20">

                     <div className="flex-row width-100 padding-5 margin-vertical-2 bg-main font-weight-bold" >
                        <div className="flex-align-end width-50 ellipsis">Title</div>
                        <div className="flex-end width-40 ellipsis">Created At</div>
                        <div className="flex-end width-10 ellipsis">Online</div>
                     </div>

                     {projects.filter((u: any) => {
                        if (u.title.toLowerCase().includes(search.toLowerCase())) return u
                        else if (u.description.toLowerCase().includes(search.toLowerCase())) return u
                        else if (u.details.toLowerCase().includes(search.toLowerCase())) return u
                        else if (u.url.toLowerCase().includes(search.toLowerCase())) return u
                     }).map((project: any) => (
                        <Link href='#' key={project._id} onClick={() => setSelectedProject(project)}>
                           <div className="flex-row width-100 padding-5 margin-vertical-2 bg-info hover-bg-main" >
                              <div className="flex-align-end width-50 ellipsis">{project.title}</div>
                              <div className="flex-end width-40 ellipsis">{moment(project.createdAt).format('DD/MM/YYYY')}</div>
                              <div className="flex-align-end width-10 ellipsis flex-justify-end">{project.isOnline ? 'yes' : 'no'}</div>
                           </div>
                        </Link>
                     ))}
                  </div>
               </>
            )}

            {selectedProject && (
               <>
                  <header className="width-100 flex-row flex-align-center">
                     <div className="width-50">
                        <h2>{selectedProject._id === 'new' ? 'Create project' : 'Edit project'}</h2>
                     </div>
                     <div className="width-50 flex-justify-end">
                        <div className="flex-row flex-align-center width-45 sm-width-30 xl-width-15">
                           <Link href="#" className="btn small info width-100" onClick={() => setSelectedProject(null)}>Back</Link>
                        </div>
                     </div>
                  </header>

                  <ProjectForm projects={projects} selectedProject={selectedProject} setSelectedProject={setSelectedProject} setMessage={setMessage} createProject={createProject} updateProject={updateProject} deleteProject={deleteProject} />
               </>
            )}
         </>
      </div>
   )
}