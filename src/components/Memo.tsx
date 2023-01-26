import styles from '@/styles/components/Memo.module.css';

export default function Memo({ children }: { children: any }) {
   return (
      <div className={styles.memo}>
         {children}
      </div>
   )
}
