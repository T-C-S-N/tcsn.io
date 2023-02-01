/** @format */

import styles from "../styles/components/Loading.module.css";

export default function PageLoading({ isLoading }: { isLoading: boolean }) {
  return (
    <>
      {isLoading && (
        <div className="width-100 height-100 min-height-100 flex-center">
          <div className="max-width-100">
            <div className={styles.logo}>
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1366 768" className={styles.logo_svg}>
                <polygon className={styles.st1} points="384.2,352.8 580.5,549.2 635.7,604.5 649.2,537.4 397.6,286 	" />
                <polygon className={styles.st2} points="384.2,352.8 397.6,286 649.2,537.4 397.6,285.8 	" />
                <polygon className={styles.st3} points="535.6,262.3 415.6,195.7 397.6,285.8 490,270 	" />
                <polygon className={styles.st3} points="397.6,285.8 7,352.8 384.2,352.8 	" />
                <polygon className={styles.st4} points="384.2,352.8 7,352.8 258.4,604.5 635.7,604.5 580.5,549.2 	" />
                <polygon className={styles.st1} points="1107.4,164.3 698.6,352.8 849,503.2 950.2,604.5 1359,415.7 	" />
                <polygon className={styles.st3} points="1107.4,164.3 535.6,262.3 698.6,352.8 	" />
                <polygon className={styles.st4} points="698.6,352.8 535.6,262.3 787,513.8 950.2,604.5 849,503.2 	" />
                <polygon className={styles.st5} points="490,270 397.6,285.8 649.2,537.4 787,513.8 535.6,262.3 	" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );

}
