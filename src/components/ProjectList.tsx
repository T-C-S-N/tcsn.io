import ProjectUtils from "@/utils/ProjectUtils"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function ProjectList() {
   const router = useRouter();

   const [isLoading, setIsLoading] = useState(true)
   const [projects, setProjects] = useState([])
   const [search, setSearch] = useState('' as string)
   const [errors, setErrors] = useState([] as Array<string>)

   useEffect(() => {
      if (!router.isReady) return
      setIsLoading(false)

      ProjectUtils.getProjects().then((res: any) => setProjects(res))
         .catch(err => console.log('err', err))
   }, [router.isReady])

   return (
      <div className="width-100 flex flex-column flex-start bg-white padding-horizontal-10">
         {isLoading && <div>Loading...</div>}

         {errors && errors.length > 0 && (
            <div className="width-100">
               {errors.map((error, index) => (
                  <div key={index}>{error}</div>
               ))}
            </div>
         )}

         <h2>Projects</h2>

         {!isLoading && (
            <>
               <header className="width-100 flex flex-row flex-justify-space-between">
                  <div className="flex flex-row flex-align-center width-45 sm-width-30">
                     <input type="search" className="width-100" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <div className="flex flex-row flex-align-center width-45 sm-width-30 xl-width-15">
                     <Link href="/project/new" className="btn btn-small btn-dark width-100">Create Project</Link>
                  </div>
               </header>

               <div className="flex flex-column width-100 margin-top-20">
                  {projects.filter((u: any) => {
                     if (u.title.toLowerCase().includes(search.toLowerCase())) return u
                     else if (u.description.toLowerCase().includes(search.toLowerCase())) return u
                     else if (u.details.toLowerCase().includes(search.toLowerCase())) return u
                     else if (u.url.toLowerCase().includes(search.toLowerCase())) return u
                  }).map((project: any) => (
                     <Link href={`/project/${project._id}`} key={project._id}>
                        <div className="flex flex-row width-100 padding-5 margin-vertical-2 bg-info hover-bg-main" >
                           <div className="flex flex-align-end width-45">
                              {project.title}
                           </div>
                           <div className="flex flex-align-end width-45">
                              {project.description}
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            </>
         )}
      </div>
   )
}