import DashboardFooter from '@/components/layout/DashboardFooter';
import DashboardHeader from '@/components/layout/DashboardHeader';
import SEO from '@/components/layout/SEO';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProjectForm from '@/components/admin/projects/ProjectForm';

export default function Project() {
   const [id, setId] = useState('');
   const router = useRouter()

   useEffect(() => {
      if (!router.isReady) return;
      const { id } = router.query;
      setId(id as string);
   }, [router.isReady, router.query]);

   return (
      <>
         <SEO title='tcsn | Project' description='Tocausan project' siteTitle='Tocausan' />

         <main className='flex-column flex-justify-start sm-flex-row sm-flex-justify-start padding-bottom-40'>
            <DashboardHeader />
            <ProjectForm id={id} />
         </main>
         <DashboardFooter />
      </>
   );
}