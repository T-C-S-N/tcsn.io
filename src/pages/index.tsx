/** @format */

import styles from "@/styles/pages/Home.module.css";
import Footer from "@/components/layout/Footer";
import WelcomeBox from "@/components/WelcomeBox";
import Header from "@/components/layout/Header";
import SEO from "@/components/layout/SEO";
import { useEffect } from "react";
import ImagesUtils from "@/utils/ImagesUtils";

import Layout from "@/components/layout/Layout";

export default function HomePage() {

  useEffect(() => {
    ImagesUtils.getImages()
  }, [])

  return (
    <Layout title='Home' >
      <div className='w-[100%] min-h-[780px] flex justify-center items-center'>
        <WelcomeBox />
      </div>
    </Layout>
  );
}
