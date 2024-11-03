/** @format */

import WelcomeBox from "@/components/WelcomeBox";
import { useEffect } from "react";
import ImagesUtils from "@/utils/ImagesUtils";
import Layout from "@/components/layout/Layout";

export default function HomePage() {

  useEffect(() => {
    ImagesUtils.getImages()
  }, [])

  return (
    <Layout title='Home' >
      <div className='w-[100%] min-h-[100vh] flex flex-col justify-center items-center bg-gradient-to-b from-[#F5F5F5] to-[#E5F7FF]'>
        <div className="w-[100%] mt-[-100px]">
          <WelcomeBox />
        </div>
      </div>
      {/*
       <div className='w-[100%] p-[30px] flex flex-col justify-center items-center bg-neutral-900'>
        <div className="w-[90%] flex flex-row ">
          <Clients />
        </div>
      </div>
      */}

    </Layout>
  );
}
