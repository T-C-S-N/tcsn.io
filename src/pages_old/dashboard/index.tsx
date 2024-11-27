import SEO from '@/components/layout/SEO'
import DashboardHeader from '@/components/layout/DashboardHeader'
import DashboardFooter from '@/components/layout/DashboardFooter'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import UserUtils from '@/utils/UserUtils';
import { signOut } from 'next-auth/react';
import Loading from '@/components/Loading';
import UserProfile from '@/components/admin/users/UserProfile';
import UserList from '@/components/admin/users/UserList';
import ProjectList from '@/components/admin/projects/ProjectList';
import ProjectUtils from '@/utils/ProjectUtils';
import PageLoading from '@/components/PageLoading';

export default function Dashboard() {
  const router = useRouter();
  const { view } = router.query;

  const [isLoading, setIsLoading] = useState(true);
  const [pageView, setPageView] = useState(view as string || 'profile');

  const [profile, setProfile] = useState({
    firstname: '',
    lastname: '',
    email: '',
    role: ''
  });
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  const switchPageView = (type: string) => {
    setPageView(type);
  }

  useEffect(() => {
    if (pageView !== '') return;
    setPageView('profile');
  }, [router.isReady, pageView])

  useEffect(() => {
    if (!router.isReady) return;
    fetchAllData()
  }, [router.isReady, router.query])

  const fetchAllData = async () => {
    await Promise.all([
      // check token
      UserUtils.checkToken()
        .catch(() => {
          signOut()
          router.push('/auth?type=signin')
        }),

      // get profile
      UserUtils.getProfile()
        .then((res: any) => {
          setProfile({
            firstname: res.firstname,
            lastname: res.lastname,
            email: res.email,
            role: res.role
          })
        }),
      // get users
      UserUtils.getUsers()
        .then((res: any) => setUsers(res)),

      // get projects
      ProjectUtils.getProjects()
        .then((res: any) => setProjects(res))
    ]).then(() => {
      setIsLoading(false)
    }).catch(err => {
      console.log('err', err)
    })
  }

  return (
    <>
      <SEO title='tcsn | Dashboard' description='Tocausan dashboard' siteTitle='Tocausan' />

      {isLoading && (
        <div style={{ width: '100%', height: '100vh' }}>
          <PageLoading isLoading={isLoading} />
        </div>
      )}

      {!isLoading && (
        <>
          <main className='flex-column flex-justify-start sm-flex-row sm-flex-justify-start padding-bottom-40'>
            <DashboardHeader pageView={pageView} switchPageView={switchPageView} />
            <section className='width-100 sm-width-80 xl-width-90 bg-white padding-horizontal-10' style={{ height: 'calc(100vh - 40px)', overflowY: 'auto' }}>
              {pageView === '' && (
                <h1>Dashboard</h1>
              )}

              {pageView === 'profile' && (
                <UserProfile profile={profile} setProfile={setProfile} />
              )}

              {pageView === 'users' && (
                <UserList users={users} setUsers={setUsers} />
              )}

              {pageView === 'projects' && (
                <ProjectList projects={projects} setProjects={setProjects} />
              )}
            </section>
          </main>
          <DashboardFooter />
        </>
      )}
    </>
  )
}
