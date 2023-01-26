import styles from '@/styles/components/Project.module.css';

export default function Project({
   title = '',
   description = '',
   url = '',
   images = [],
   date = '',
   dev_language = '',
   dev_design = '',
   dev_front = '',
   dev_back = '',
   dev_host = '',
   dev_duration = '',
}: {
   title: string,
   description: string,
   url: string,
   images: string[],
   date: string,
   dev_language: string,
   dev_design: string,
   dev_front: string,
   dev_back: string,
   dev_host: string,
   dev_duration: string,
}) {
   return (
      <section className={styles.project}>
         <div className={styles.project__title}>
            <h2>{title}</h2>
         </div>
         <div className={styles.project__date}>
            <p>{date}</p>
         </div>
         <div className={styles.project__details}>
            <p>Language: {dev_language}</p>
            <p>Design: {dev_design}</p>
            <p>Front-end: {dev_front}</p>
            <p>Back-end: {dev_back}</p>
            <p>Hosting: {dev_host}</p>
            <p>Duration: {dev_duration}</p>
         </div>

         <div className={styles.project__description}>
            <p>{description}</p>
         </div>
         <div className={styles.project__images}>
            {images.map((image, index) => (
               <img src={image} />
            ))}
         </div>
         <div className={styles.project__link}>
            {url}
         </div>

      </section>
   )
}