import styles from '@/styles/pages/User.module.css'
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import SEO from '@/components/layout/SEO';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import UserForm from '@/components/UserForm';

export default function User() {
   const [id, setId] = useState('');
   const router = useRouter()

   useEffect(() => {
      if (!router.isReady) return;
      const { id } = router.query;
      setId(id as string);
   }, [router.isReady, router.query]);

   return (
      <>
         <SEO title='tcsn | User' description='Tocausan user' siteTitle='Tocausan' />
         <Header />
         <main className={styles.main}>
            <UserForm id={id} />
         </main>
         <Footer />
      </>
   );
}