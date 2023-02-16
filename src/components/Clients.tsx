import Image from 'next/image';

export default function Clients() {


   const clients = [
      {
         name: 'a.c.t.e.',
         logo: '/clients/acte.png',
         url: 'https://acte.co',
         width: 200,
         height: 200,
      },
      {
         name: 'FG Consulting',
         logo: '/clients/FG-consulting.png',
         url: 'https://www.fgconsulting.be/',
         width: 200,
         height: 200,
      },
      {
         name: 'OuiOuiOui',
         logo: '/clients/OuiOuiOui.png',
         url: '',
         width: 200,
         height: 200,
      },
      {
         name: 'Through Your Soul',
         logo: '/clients/tys.png',
         url: '',
         width: 200,
         height: 200,
      },
      {
         name: 'Velofcourse',
         logo: '/clients/velofcourse.svg',
         url: 'https://velofcourse.com',
         width: 200,
         height: 200,
      },
   ]

   return (
      <section className='w-[100%] flex flex-row justify-between border border-neutral-600 shadow-md'>
         <div className='h-[100px] flex justify-center items-center border border-r-neutral-600 border-l-0 border-t-0 border-b-0 bg-gray-800 text-white'>
            <h2 className='w-[30px] mb-[-55px] rotate-[-90deg] text-xl font-serif'>CLIENTS</h2>
         </div>
         <div className='w-[100%] flex justify-start sm:justify-evenly items-center bg-white overflow-x-auto scrollbar-hide'>
            {clients.map((client, index) => (
               <div key={index} className='p-2'>
                  <Image src={client.logo} alt={client.name} width={client.width} height={client.height} priority={true} className='min-w-[80px] sm:w-[80px]' />
               </div>
            ))}
         </div>
      </section>
   )
}