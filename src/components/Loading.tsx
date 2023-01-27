/** @format */

import styles from "../styles/components/Loading.module.css";

export default function Loading({ isLoading }: { isLoading: boolean }) {
  return (
    <>
      {isLoading && (
        <div className="width-100 height-100 min-height-100 flex-center">
          <div className="max-width-100">
            ...loading
          </div>
        </div>
      )}
    </>
  );

}
