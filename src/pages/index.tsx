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
      <div className='w-[100%] min-h-[780px] flex justify-center items-center'>
        <div className="w-[100%] mt-[-100px]">
          <WelcomeBox />
        </div>
      </div>
    </Layout>
  );
}
