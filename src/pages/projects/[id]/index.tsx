import Layout from '@/components/layout/Layout'
import { selectProject } from '@/features/projects/projectSlice';
import Project from '@/models/Project';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { ArrowLeft, } from 'react-feather'

export default function ProjectPage() {
  // get id from url
  const router = useRouter();
  const { id } = router.query;
  const project: Project = new Project(useSelector((state: any) => selectProject(state, id as string)))

  return (
    <Layout title='tcsn | Project' >
      <div className='w-[100%] min-h-[100vh] px-2 py-[60px] flex flex-col justify-start items-center bg-neutral-900'>
        {project && (
          <div className='project w-[100%] sm:max-w-[900px] p-2 flex flex-col justify-center items-center bg-neutral-800 text-white relative'>
            <ArrowLeft width={25} color='white' className='absolute top-5 left-2 sm:left-5 cursor-pointer scale-[120%]' onClick={() => router.back()} />

            {project.thumbnail.type === 'iframe' && (
              <iframe src={project.thumbnail.src} width={300} height={200} className='max-w-[300px] max-h-[200px] rounded-lg bg-neutral-900'></iframe>
            )}
            {project.thumbnail.type === 'image' && (
              <Image src={project.thumbnail.src} width={500} height={500} alt={project.thumbnail.alt} priority={true} className='w-[100%] max-w-[400px] pt-[50px] sm:pt-5' />
            )}

            <h1 className={['w-[100%] p-2 my-5 text-left text-2xl font-bold bg-neutral-900', project.titleColor].join(' ')}>{project.title}</h1>

            <div className='tags w-[100%] mb-5 flex flex-wrap justify-start'>
              {project.tags.map((tag, index) => (
                <span key={index} className='px-2 py-1 m-1 text-xs text-center rounded-2xl bg-slate-600'>{tag}</span>
              ))}
            </div>

            <div className='w-[100%] px-2 flex flex-col sm:flex-row'>
              <p className='flex-1'>{project.description}</p>

              <div className='details my-5 sm:m-5 sm:mt-0 flex-1'>
                {project.details.map((detail, index) => (
                  <div key={index} className={[
                    'detail w-[100%] flex flex-row justify-start items-center text-sm px-2 my-0.5',
                    index % 2 === 0 ? 'bg-neutral-700' : ''
                  ].join(' ')}>
                    <div className='w-[100px] font-semibold'>{detail.key}</div>
                    <div className='w-[100%] flex-1 text-right'>{detail.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {project.libraries.map((library, li) => (
              <div key={li} className='w-[100%] mt-0.5 flex flex-col justify-start items-center bg-neutral-700'>
                <div className=' w-[100%] flex flex-row flex-wrap justify-evenly'>
                  <h3 className={['w-[100%] p-2 text-left text-xl font-bold cursor-pointer bg-neutral-900 flex justify-between items-center', project.titleColor].join(' ')}>
                    {library.name}
                  </h3>

                  {library.description && (
                    <p className='w-[100%] p-2 mb-5 text-left'>{library.description}</p>
                  )}

                  {library.images.map((image, i) => (
                    <div key={i} className={['w-[100%] my-2', image.class].join(' ')}>
                      {project.thumbnail.type === 'iframe' && (
                        <iframe src={image.src} width={image.width} height={image.height} className='bg-neutral-900'></iframe>
                      )}
                      {project.thumbnail.type === 'image' && (
                        <Image src={image.src} width={500} height={500} alt={image.alt} loading='lazy' className='w-[100%]' />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </Layout>
  )
}
