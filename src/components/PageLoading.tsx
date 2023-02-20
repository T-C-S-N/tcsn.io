/** @format */

import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function PageLoading({ isLoading }: { isLoading: boolean }) {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    switch (true) {
      case router.pathname.includes('/projects'):
        setIsDarkMode(true);
        break;
      default:
        setIsDarkMode(false);
    }
  }, [router.pathname]);

  return (
    <>
      {isLoading && (
        <div className={[
          'w-[100%] h-[100%] flex justify-center items-center',
          isDarkMode ? 'bg-neutral-900' : 'bg-gray-50'
        ].join(' ')}>
          <div className="max-w-[100%]">
            <div className=''>
              {!isDarkMode && (
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1366 768" className='w-[200px] flip'>
                  <polygon className='st1' points="384.2,352.8 580.5,549.2 635.7,604.5 649.2,537.4 397.6,286 	" />
                  <polygon className='st2' points="384.2,352.8 397.6,286 649.2,537.4 397.6,285.8 	" />
                  <polygon className='st3' points="535.6,262.3 415.6,195.7 397.6,285.8 490,270 	" />
                  <polygon className='st3' points="397.6,285.8 7,352.8 384.2,352.8 	" />
                  <polygon className='st4' points="384.2,352.8 7,352.8 258.4,604.5 635.7,604.5 580.5,549.2 	" />
                  <polygon className='st1' points="1107.4,164.3 698.6,352.8 849,503.2 950.2,604.5 1359,415.7 	" />
                  <polygon className='st3' points="1107.4,164.3 535.6,262.3 698.6,352.8 	" />
                  <polygon className='st4' points="698.6,352.8 535.6,262.3 787,513.8 950.2,604.5 849,503.2 	" />
                  <polygon className='st5' points="490,270 397.6,285.8 649.2,537.4 787,513.8 535.6,262.3 	" />
                </svg>
              )}

              {isDarkMode && (
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1366 768" className='w-[200px] flip [&>*]:fill-none [&>*]:stroke-white [&>*]:stroke-[5px]'>
                  <polygon points="384.2,352.8 580.5,549.2 635.7,604.5 649.2,537.4 397.6,286 	" />
                  <polygon points="384.2,352.8 397.6,286 649.2,537.4 397.6,285.8 	" />
                  <polygon points="535.6,262.3 415.6,195.7 397.6,285.8 490,270 	" />
                  <polygon points="397.6,285.8 7,352.8 384.2,352.8 	" />
                  <polygon points="384.2,352.8 7,352.8 258.4,604.5 635.7,604.5 580.5,549.2 	" />
                  <polygon points="1107.4,164.3 698.6,352.8 849,503.2 950.2,604.5 1359,415.7 	" />
                  <polygon points="1107.4,164.3 535.6,262.3 698.6,352.8 	" />
                  <polygon points="698.6,352.8 535.6,262.3 787,513.8 950.2,604.5 849,503.2 	" />
                  <polygon points="490,270 397.6,285.8 649.2,537.4 787,513.8 535.6,262.3 	" />
                </svg>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );

}
