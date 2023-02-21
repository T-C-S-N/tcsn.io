import Project from '@/models/Project';
import Image from 'next/image';
import Link from 'next/link';
import { createRef, useEffect, useState } from 'react';
import { X } from 'react-feather'
import { selectProjects } from '@/features/projects/projectSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';

export default function ProjectList() {
   const dispatch = useAppDispatch();
   const projects: Project[] = useAppSelector(selectProjects);
   const [selectedTags, setSelectedTags] = useState<string[]>([])

   const handleSelectTag = (e: any, tag: string) => {
      e.preventDefault()

      if (selectedTags.includes(tag)) setSelectedTags([...selectedTags.filter(selectedTag => selectedTag !== tag)])
      else setSelectedTags([...selectedTags, tag])
   }

   const handleRemoveSelectedTag = (e: any, tag: string) => {
      e.preventDefault()

      setSelectedTags(selectedTags.filter(selectedTag => selectedTag !== tag))
   }

   // filter projects by selected tags
   const filteredProjects = projects.filter(project => {
      if (selectedTags.length === 0) return true

      console.log(projects)

      return selectedTags.every(tag => project.tags.includes(tag))
   })

   return (
      <section className='w-[100%] pt-2 flew flex-col justify-start items-start'>

         <header className='w-[100%]'>
            <div className='w-[100%] my-2 flex flex-row flex-wrap justify-start items-start'>
               {selectedTags.map((tag, index) => (
                  <Link href='' key={index} className=' px-2 pr-9 py-1 m-2 flex justify-center items-center relative text-xs text-center rounded-2xl text-white bg-slate-600 hover:bg-slate-500 transition' onClick={e => handleRemoveSelectedTag(e, tag)}>
                     {tag}
                     <X width={12} className='absolute right-3' />
                  </Link>
               ))}
            </div>
         </header>

         <section className='w-[100%] flex flex-row flex-wrap justify-start items-start'>
            {filteredProjects.map((project, index) => (
               <div key={index} className='w-[100%] sm:w-[300px] h-[200px] m-1 flex justify-center items-center relative'>
                  {project.thumbnail && (
                     <Link href={'/projects/' + project._id}>
                        {project.thumbnail.type === 'iframe' && (
                           <iframe src={project.thumbnail.src} width={300} height={200} className='max-w-[300px] max-h-[200px] rounded-lg bg-neutral-900'></iframe>
                        )}
                        {project.thumbnail.type !== 'iframe' && (
                           <Image src={project.thumbnail.src} width={500} height={500} alt={project.thumbnail.alt} priority={true} className='max-w-[300px] max-h-[200px] rounded-lg bg-neutral-900' />
                        )}
                     </Link>
                  )}

                  <Link href={'/projects/' + project._id} className='w-[300px] h-[200px] bg-[rgba(50,50,50,.9)] flex-1 absolute top-0 rounded-md opacity-0 hover:!opacity-100 transition'>
                     <div className='infos w-[300px] p-2 absolute bottom-0 transition'>
                        <h2 className='pb-3 text-gray-100 text-xl font-semibold'>{project.title}</h2>
                        <div className='flex flex-row flex-wrap max-h-[200px]'>
                           {project.tags.map((tag, index) => (
                              <div key={index} className={[
                                 'px-2 py-0.5 m-1 flex justify-center items-center text-xs text-center rounded-2xl text-neutral-700 bg-slate-200 hover:opacity-70 transition',
                                 selectedTags.includes(tag) ? 'opacity-50' : ''
                              ].join(' ')} onClick={e => handleSelectTag(e, tag)}>
                                 {tag}
                              </div>
                           ))}
                        </div>
                     </div>
                  </Link>
               </div>
            ))}
         </section>

      </section>
   )
}