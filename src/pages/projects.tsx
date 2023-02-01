import styles from '@/styles/pages/Projects.module.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SEO from '@/components/layout/SEO'
import Project from '@/components/Project'
import MobileMessage from '@/components/MobileOnlyMessage'

export default function ContactPage() {

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
    <>
      <SEO title='tcsn | Projects' description='Tocausan Projects' siteTitle='Tocausan' />
      <Header />
      <main className={styles.main}>
        <div className='sm-up'>
          <h1>Projects</h1>

          {projects.map((project, index) => (
            (project.visible && <Project {...project} key={project.title} />)
          ))}
        </div>
        <MobileMessage text='Mobile version coming soon!' />
      </main>
      <Footer />
    </>
  )
}
