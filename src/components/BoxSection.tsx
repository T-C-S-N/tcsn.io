import styles from '@/styles/components/BoxSection.module.css';

export default function BoxSection({ children }: { children: any }) {
   return (
      <section className={styles.box_section}>
         {children}
      </section>
   )
}