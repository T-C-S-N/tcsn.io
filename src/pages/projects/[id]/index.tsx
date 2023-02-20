import Layout from '@/components/layout/Layout'
import { selectProject } from '@/features/projects/projectSlice';
import Project from '@/models/Project';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { ArrowLeft } from 'react-feather'

export default function ProjectPage() {
  // get id from url
  const router = useRouter();
  const { id } = router.query;
  const project: Project = new Project(useSelector((state: any) => selectProject(state, id as string)))


  return (
    <Layout title='Home' >
      <div className='w-[100%] min-h-[850px] px-2 flex flex-col justify-start items-center bg-neutral-900'>
        {project && (
          <div className='project w-[100%] sm:max-w-[900px] p-2 flex flex-col justify-center items-center bg-neutral-800 text-white relative'>
            <ArrowLeft width={24} color='white' className='absolute top-[10px] left-[10px] cursor-pointer' onClick={() => router.back()} />

            <Image src={project.thumbnail.src} alt={project.thumbnail.alt} width={500} height={500} className='w-[100%] max-w-[400px]' priority={true} />

            <h1 className={['w-[100%] p-2 my-5 text-left text-2xl font-bold', project.titleColor].join(' ')}>{project.title}</h1>

            <div className='tags w-[100%] mb-5 flex flex-wrap justify-start'>
              {project.tags.map((tag, index) => (
                <span key={index} className='px-2 py-1 m-1 text-xs text-center rounded-2xl bg-slate-600'>{tag}</span>
              ))}
            </div>

            <div className='w-[100%] px-2 flex flex-col sm:flex-row'>
              <p className='flex-1'>{project.description}</p>

              <div className='details px-2 mt-5 sm:mt-0 flex-1 border border-neutral-500 rounded-md'>
                {project.details.map((detail, index) => (
                  <div key={index} className='detail w-[100%] flex flex-row justify-start items-center'>
                    <span className='w-[100px] text-sm font-semibold'>{detail.key}</span>
                    <span className='w-[100%] text-sm text-right'>{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {project.desktopUI && project.desktopUI.length > 0 && (
              <div className='desktop-ui w-[100%] mt-5 p-2 flex flex-col justify-start items-center bg-neutral-900 rounded-md'>
                <h3 className={['w-[100%] p-2 text-left text-xl font-bold', project.titleColor].join(' ')}>Desktop UI</h3>

                <div className='desktop-ui-images w-[100%] flex flex-wrap justify-evenly'>
                  {project.desktopUI.map((image, index) => (
                    <div key={index} className='w-[100%] sm:w-[45%] m-2'>
                      <Image src={image.src} alt={image.alt} width={500} height={500} loading='lazy' className='w-[100%]' />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.mobileUI && project.mobileUI.length > 0 && (
              <div className='mobile-ui w-[100%] mt-5 p-2 flex flex-col justify-start items-center bg-neutral-900 rounded-md'>
                <h3 className={['w-[100%] p-2 text-left text-xl font-bold', project.titleColor].join(' ')}>Mobile UI</h3>

                <div className='mobile-ui-images w-[100%] flex flex-wrap justify-evenly'>
                  {project.mobileUI.map((image, index) => (
                    <div key={index} className='w-[100%] sm:w-[45%] m-2'>
                      <Image src={image.src} alt={image.alt} width={500} height={500} loading='lazy' className='w-[100%]' />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </Layout>
  )
}
