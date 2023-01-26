import styles from '@/styles/pages/User.module.css'
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import SEO from '@/components/layout/SEO';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProjectForm from '@/components/ProjectForm';

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
         <Header />
         <main className={styles.main}>
            <ProjectForm id={id} />
         </main>
         <Footer />
      </>
   );
}