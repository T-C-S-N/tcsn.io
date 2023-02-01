import ProjectUtils from "@/utils/ProjectUtils"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Loading from "../../Loading";
import Project from "@/models/Project";
const moment = require('moment')

export default function ProjectList({ projects, setProjects }: { projects: Project[], setProjects: Function }) {
   const router = useRouter();

   const [isLoading, setIsLoading] = useState(true)
   const [search, setSearch] = useState('' as string)

   useEffect(() => {
      if (!router.isReady) return

      ProjectUtils.getProjects()
         .then((res: any) => {
            setIsLoading(false)
            setProjects(res)
         })
         .catch(err => {
            setIsLoading(false)
            console.log('err', err)
         })
   }, [router.isReady])

   return (
      <div className="width-100 flex-column flex-start bg-white">
         <>
            <h2>Projects</h2>

            <header className="width-100 flex-row flex-justify-space-between">
               <div className="flex-row flex-align-center width-45 sm-width-30">
                  <input type="search" className="width-100" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
               </div>
               <div className="flex-row flex-align-center width-45 sm-width-30 xl-width-15">
                  <Link href="/dashboard/projects/new" className="btn small dark width-100">Create Project</Link>
               </div>
            </header>

            <div className="flex-column width-100 margin-top-20">
               {projects.filter((u: any) => {
                  if (u.title.toLowerCase().includes(search.toLowerCase())) return u
                  else if (u.description.toLowerCase().includes(search.toLowerCase())) return u
                  else if (u.details.toLowerCase().includes(search.toLowerCase())) return u
                  else if (u.url.toLowerCase().includes(search.toLowerCase())) return u
               }).map((project: any) => (
                  <Link href={`/dashboard/projects/${project._id}`} key={project._id}>
                     <div className="flex-row width-100 padding-5 margin-vertical-2 bg-info hover-bg-main" >
                        <div className="flex-align-end width-70 ellipsis">{project.title}</div>
                        <div className="flex-end width-30 ellipsis">{moment(project.createdAt).format('DD/MM/YYYY')}</div>
                     </div>
                  </Link>
               ))}
            </div>
         </>
      </div>
   )
}