import Layout from '@/components/layout/Layout'
import ProjectList from '@/components/ProjectList'
import { selectProjects } from '@/features/projects/projectSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import Project from '@/models/Project';

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const pro: Project[] = useAppSelector(selectProjects);

  const projects = [
    {
      title: '1nventaire',
      description: 'A simple inventory management prototype app for small businesses.',
      url: 'https://1ventaire.com/#/',
      images: [],
      date: '2022',
      dev_language: 'TypeScript',
      dev_design: 'Figma',
      dev_front: 'Vue',
      dev_back: 'Node',
      dev_host: 'DigitalOcean',
      dev_duration: '2 weeks',
      visible: true,
    },
    {
      title: 'Packager',
      description: 'A mobile app to order from businesses and track packages from your phone.',
      url: '',
      images: [],
      date: '2022',
      dev_language: 'TypeScript',
      dev_design: 'Figma',
      dev_front: 'React Native',
      dev_back: 'Node',
      dev_host: 'DigitalOcean',
      dev_duration: '1 weeks',
      visible: false,
    },
    {
      title: 'Tocausan',
      description: '',
      url: 'https://tcsn.io',
      images: [],
      date: '2021',
      dev_language: 'TypeScript',
      dev_design: 'Figma',
      dev_front: 'React',
      dev_back: 'Next',
      dev_host: 'Vercel',
      dev_duration: '2 weeks',
      visible: true,
    },
    {
      title: 'Velofcourse',
      description: '',
      url: 'https://velofcourse.com',
      images: [],
      date: '2022',
      dev_language: 'TypeScript',
      dev_design: 'Figma',
      dev_front: 'React',
      dev_back: 'Next',
      dev_host: 'Vercel',
      dev_duration: '1 month',
      visible: true,
    },
  ]

  // sort projects by date (newest first)
  projects.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <Layout title='Home' >
      <div className='w-[100%] min-h-[100vh] px-2 flex flex-col justify-start items-start bg-neutral-900'>
        <ProjectList />
      </div>
    </Layout>
  )
}
