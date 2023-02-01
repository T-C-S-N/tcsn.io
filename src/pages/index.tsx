/** @format */

import styles from "@/styles/pages/Home.module.css";
import Footer from "@/components/layout/Footer";
import WelcomeBox from "@/components/WelcomeBox";
import Header from "@/components/layout/Header";
import SEO from "@/components/layout/SEO";

export default function HomePage() {
  return (
    <>
      <SEO title='tcsn | Home' description='Tocausan Homepage' siteTitle='Tocausan' />
      <Header />
      <main className={styles.main}>
        <div className='container margin-top-50 padding-0'>
          <WelcomeBox />
        </div>

        {/* <MobileMessage text='Mobile version coming soon!' /> */}
      </main>
      <Footer />
    </>
  );
}
