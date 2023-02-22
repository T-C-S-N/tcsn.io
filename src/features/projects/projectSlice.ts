import {
   createSlice,
   PayloadAction,
} from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import Project from '@/models/Project';

export type ProjectState = {
   projects: Project[];
};

let defaultProjects = [
   new Project({
      _id: '60f1f9f0b9d3b8b2b8b2b8b2',
      display: true,
      type: 'app',
      tags: ['React', 'Next', 'Tailwind', 'Vercel', 'TypeScript', 'Ecommerce', 'Storefront', 'Stripe', 'UI/UX', 'Design', 'Online'],
      title: 'Velofcourse',
      titleColor: 'text-yellow-400',
      description: 'Velofcourse is a bicycle store & repair shop in Brussels. The app is built from scratch as a storefront with an integrated e-commerce.',
      url: 'https://velofcourse.com',
      date: '2022-2023',
      details: [
         { key: 'Project Type', value: 'Storefront, E-commerce, Responsive' },
         { key: 'Multilingual', value: 'English, French' },
         { key: 'UI/UX Design', value: 'Figma' },
         { key: 'Language', value: 'Typescript' },
         { key: 'Libraries', value: 'Tailwind, Google Maps API, Stripe, Redux' },
         { key: 'Front-End', value: 'React' },
         { key: 'Back-End', value: 'NextJs' },
         { key: 'Architecture', value: 'Monolithic' },
         { key: 'Date', value: '2022-2023' },
      ],
      thumbnail: {
         alt: 'Velofcourse - Thumbnail',
         src: '/images/projects/Velofcourse/thumbnail.png',
         type: 'image'
      },
      libraries: [
         {
            name: 'Desktop UI',
            description: '',
            images: [
               {
                  alt: 'Velofcourse - Desktop - Home',
                  src: '/images/projects/Velofcourse/Desktop - Home.png',
                  type: 'image',
                  class: 'w-[100%]'
               },
               {
                  alt: 'Velofcourse - Desktop - Contact',
                  src: '/images/projects/Velofcourse/Desktop - Contact.png',
                  type: 'image',
                  class: 'w-[100%]'
               },
               {
                  alt: 'Velofcourse - Desktop - Store',
                  src: '/images/projects/Velofcourse/Desktop - Store.png',
                  type: 'image',
                  class: 'w-[100%]'
               },
               {
                  alt: 'Velofcourse - Desktop - Store item',
                  src: '/images/projects/Velofcourse/Desktop - Store item.png',
                  type: 'image',
                  class: 'w-[100%]'
               },
               {
                  alt: 'Velofcourse - Desktop - Cart',
                  src: '/images/projects/Velofcourse/Desktop - Cart.png',
                  type: 'image',
                  class: 'w-[100%]'
               },
            ],
         },
         {
            name: 'Mobile UI',
            description: '',
            images: [
               {
                  alt: 'Velofcourse - Mobile - Home',
                  src: '/images/projects/Velofcourse/Mobile - Home.png',
                  type: 'image',
                  class: 'w-[30%]'
               },
               {
                  alt: 'Velofcourse - Mobile - Contact',
                  src: '/images/projects/Velofcourse/Mobile - Contact.png',
                  type: 'image',
                  class: 'w-[30%]'
               },
               {
                  alt: 'Velofcourse - Mobile - Store',
                  src: '/images/projects/Velofcourse/Mobile - Store.png',
                  type: 'image',
                  class: 'w-[30%]'
               },
               {
                  alt: 'Velofcourse - Mobile - Store item',
                  src: '/images/projects/Velofcourse/Mobile - Store item.png',
                  type: 'image',
                  class: 'w-[30%]'
               },
            ],
         },
      ],
   }),

   new Project({
      _id: '60f1f9f0b9d3b8b2b8b2b8b3',
      display: true,
      type: 'app',
      tags: ['IOT', 'Arduino', 'Javascript', 'Vue', 'Node', 'POC', 'Microservices', '3D Print', 'Storefront', 'UI/UX', 'Design'],
      title: 'Ellipse',
      titleColor: 'text-blue-400',
      description: 'Ellipse is a IOT proof of concept for a smart home system. The app is built from scratch as a storefront with an integrated e-commerce.',
      url: '',
      date: '2021',
      details: [
         { key: 'Project Type', value: 'IOT, Mobile App' },
         { key: 'UI/UX Design', value: 'Adobe XD' },
         { key: 'Modeling', value: 'Fusion 360' },
         { key: '3D Print', value: 'Prusa Slicer, Creality Ender 5' },
         { key: 'Board', value: 'Arduino Nano, ESP32' },
         { key: 'Language', value: 'Javascript, C++' },
         { key: 'Libraries', value: 'Arduino, Websocket, Express' },
         { key: 'Front-End', value: 'Vue' },
         { key: 'Back-End', value: 'Node' },
         { key: 'Architecture', value: 'Microservices' },
         { key: 'Date', value: '2020-2021' },
      ],
      thumbnail: {
         alt: 'Ellipse - Thumbnail',
         src: '/images/projects/Ellipse/thumbnail.png',
         type: 'image'
      },
      libraries: [
         {
            name: 'Showcase',
            description: '',
            images: [
               {
                  alt: 'Ellipse Web',
                  src: '/images/projects/Ellipse/showcase/ellipse_web.png',
                  type: 'image',
                  class: 'w-[100%]'
               },
               {
                  alt: 'Ellipse Iphone',
                  src: '/images/projects/Ellipse/showcase/iphone-ellipse-v2.png',
                  type: 'image',
                  class: 'w-[30%]'
               },
               {
                  alt: 'Ellipse Iphone',
                  src: '/images/projects/Ellipse/showcase/iphone-system-active.png',
                  type: 'image',
                  class: 'w-[30%]'
               },
               {
                  alt: 'Ellipse Iphone',
                  src: '/images/projects/Ellipse/showcase/iphone-system-list.png',
                  type: 'image',
                  class: 'w-[30%]'
               },
            ],
         },
         {
            name: 'UI/UX',
            description: '',
            images: [
               {
                  alt: 'Ellipse UI/UX 1',
                  src: '/images/projects/Ellipse/UI-UX/ellipse-1.png',
                  type: 'image',
                  class: 'w-[50%]'
               },
               {
                  alt: 'Ellipse UI/UX 2',
                  src: '/images/projects/Ellipse/UI-UX/ellipse-2.png',
                  type: 'image',
                  class: 'w-[50%]'
               },
               {
                  alt: 'Ellipse UI/UX 3',
                  src: '/images/projects/Ellipse/UI-UX/ellipse-3.png',
                  type: 'image',
                  class: 'w-[50%]'
               },
               {
                  alt: 'Ellipse UI/UX 4',
                  src: '/images/projects/Ellipse/UI-UX/ellipse-4.png',
                  type: 'image',
                  class: 'w-[50%]'
               },
               {
                  alt: 'Ellipse UI/UX 5',
                  src: '/images/projects/Ellipse/UI-UX/ellipse-5.png',
                  type: 'image',
                  class: 'w-[50%]'
               },
               {
                  alt: 'Ellipse UI/UX 6',
                  src: '/images/projects/Ellipse/UI-UX/ellipse-6.png',
                  type: 'image',
                  class: 'w-[50%]'
               },
               {
                  alt: 'Ellipse UI/UX 7',
                  src: '/images/projects/Ellipse/UI-UX/ellipse-7.png',
                  type: 'image',
                  class: 'w-[50%]'
               },
               {
                  alt: 'Ellipse UI/UX 8',
                  src: '/images/projects/Ellipse/UI-UX/ellipse-8.png',
                  type: 'image',
                  class: 'w-[50%]'
               },
            ],
         },
         {
            name: 'Mobile UI with 3D Models',
            description: '',
            images: [
               {
                  alt: 'Ellipse Mobile UI',
                  src: '/images/projects/Ellipse/mobile-UI/ellipse_v1.png',
                  type: 'image',
                  class: 'w-[30%]'
               },
               {
                  alt: 'Ellipse Mobile UI',
                  src: '/images/projects/Ellipse/mobile-UI/ellipse_v2.png',
                  type: 'image',
                  class: 'w-[30%]'
               },
               {
                  alt: 'Ellipse Mobile UI',
                  src: '/images/projects/Ellipse/mobile-UI/ellipse_v3.png',
                  type: 'image',
                  class: 'w-[30%]'
               },
               {
                  alt: 'Ellipse Mobile UI',
                  src: '/images/projects/Ellipse/mobile-UI/ellipse_control.png',
                  type: 'image',
                  class: 'w-[30%]'
               },
               {
                  alt: 'Ellipse Mobile UI',
                  src: '/images/projects/Ellipse/mobile-UI/ellipse_connect.png',
                  type: 'image',
                  class: 'w-[30%]'
               },

               {
                  alt: 'Ellipse Mobile UI',
                  src: '/images/projects/Ellipse/mobile-UI/system_list___sort_by_place.png',
                  type: 'image',
                  class: 'w-[30%]'
               },
               {
                  alt: 'Ellipse Mobile UI',
                  src: '/images/projects/Ellipse/mobile-UI/system_profile___yucca_active.png',
                  type: 'image',
                  class: 'w-[30%]'
               },
               {
                  alt: 'Ellipse Mobile UI',
                  src: '/images/projects/Ellipse/mobile-UI/system_profile___aloe_active.png',
                  type: 'image',
                  class: 'w-[30%]'
               },
               {
                  alt: 'Ellipse Mobile UI',
                  src: '/images/projects/Ellipse/mobile-UI/system_profile___monstera_remove_confirmation.png',
                  type: 'image',
                  class: 'w-[30%]'
               },

               {
                  alt: 'Ellipse Mobile UI',
                  src: '/images/projects/Ellipse/mobile-UI/ellipse___item_in_cart.png',
                  type: 'image',
                  class: 'w-[30%]'
               },
               {
                  alt: 'Ellipse Mobile UI',
                  src: '/images/projects/Ellipse/mobile-UI/checkout.png',
                  type: 'image',
                  class: 'w-[30%]'
               },
               {
                  alt: 'Ellipse Mobile UI',
                  src: '/images/projects/Ellipse/mobile-UI/checkout_confirmation.png',
                  type: 'image',
                  class: 'w-[30%]'
               },
            ],
         },
         {
            name: 'LED Display',
            description: '',
            images: [
               {
                  alt: 'LED Display 3',
                  src: '/images/projects/Ellipse/led-display/ellipse_control_display_3.png',
                  type: 'image',
                  class: 'w-[25%]'
               },
               {
                  alt: 'LED Display 4',
                  src: '/images/projects/Ellipse/led-display/ellipse_control_display_4.png',
                  type: 'image',
                  class: 'w-[25%]'
               },
               {
                  alt: 'LED Display 5',
                  src: '/images/projects/Ellipse/led-display/ellipse_control_display_5.png',
                  type: 'image',
                  class: 'w-[25%]'
               },
               {
                  alt: 'LED Display 6',
                  src: '/images/projects/Ellipse/led-display/ellipse_control_display_6.png',
                  type: 'image',
                  class: 'w-[25%]'
               },
               {
                  alt: 'LED Display 1',
                  src: '/images/projects/Ellipse/led-display/ellipse_control_display_1.png',
                  type: 'image',
                  class: 'w-[20%]'
               },
               {
                  alt: 'LED Display 2',
                  src: '/images/projects/Ellipse/led-display/ellipse_control_display_2.png',
                  type: 'image',
                  class: 'w-[30%]'
               },
            ],
         },
      ],
   }),

   new Project({
      _id: '60f1f9f0b9d3b8b2b8b2b8b4',
      display: true,
      type: 'generative',
      tags: ['p5', 'Javascript', 'Generative'],
      title: 'Random Sized Rectangle Field',
      titleColor: 'text-red-400',
      description: 'Field of random sized rectangles.',
      url: '',
      date: '2022',
      details: [
         { key: 'Project Type', value: 'Generative' },
         { key: 'Language', value: 'Javascript' },
         { key: 'Libraries', value: 'p5' },
      ],
      thumbnail: {
         alt: 'Rand Rect Field Thumbnail',
         src: '/generative/rand-rect-field-300x200.html',
         type: 'iframe'
      },
      libraries: [
         {
            name: 'Showcase',
            description: '',
            images: [
               {
                  alt: 'Rand Rect Field',
                  src: '/generative/rand-rect-field.html',
                  type: 'image',
                  width: 510,
                  height: 510,
                  class: 'w-[510px] h-[510px]'
               },
            ]
         }
      ],
   }),

   new Project({
      _id: '60f1f9f0b9d3b8b2b8b2b8b5',
      display: true,
      type: 'generative',
      tags: ['p5', 'Javascript', 'Generative'],
      title: 'Speed Dot',
      titleColor: 'text-red-400',
      description: 'Randomely generated dots bouncing each other with speed debug data.',
      url: '',
      date: '2022',
      details: [
         { key: 'Project Type', value: 'Generative' },
         { key: 'Language', value: 'Javascript' },
         { key: 'Libraries', value: 'p5' },
      ],
      thumbnail: {
         alt: 'Speed Dot Thumbnail',
         src: '/generative/speed-dot-300x200.html',
         type: 'iframe'
      },
      libraries: [
         {
            name: 'Showcase',
            description: '',
            images: [
               {
                  alt: 'Speed Dot 1',
                  src: '/generative/speed-dot-1.html',
                  type: 'image',
                  width: 500,
                  height: 500,
                  class: 'w-[500px] h-[500px]'
               },
               {
                  alt: 'Speed Dot 2',
                  src: '/generative/speed-dot-2.html',
                  type: 'image',
                  width: 500,
                  height: 500,
                  class: 'w-[500px] h-[500px]'
               },
               {
                  alt: 'Speed Dot 3',
                  src: '/generative/speed-dot-3.html',
                  type: 'image',
                  width: 500,
                  height: 500,
                  class: 'w-[500px] h-[500px]'
               },
            ]
         }
      ],
   }),

   new Project({
      _id: '60f1f9f0b9d3b8b2b8b2b8b6',
      display: true,
      type: 'generative',
      tags: ['p5', 'Javascript', 'Generative'],
      title: 'Connections',
      titleColor: 'text-red-400',
      description: 'Generative using p5Js',
      url: '',
      date: '2022',
      details: [
         { key: 'Project Type', value: 'Generative' },
         { key: 'Language', value: 'Javascript' },
         { key: 'Libraries', value: 'p5' },
      ],
      thumbnail: {
         alt: 'Connection Thumbnail',
         src: '/generative/connection-300x200.html',
         type: 'iframe'
      },
      libraries: [
         {
            name: 'Showcase',
            description: '',
            images: [
               {
                  alt: 'Connection',
                  src: '/generative/connection.html',
                  type: 'image',
                  width: 500,
                  height: 500,
                  class: 'w-[500px] h-[500px]'
               },
            ]
         }
      ],
   }),

   new Project({
      _id: '60f1f9f0b9d3b8b2b8b2b8b7',
      display: false,
      type: 'generative',
      tags: ['p5', 'Javascript', 'Generative'],
      title: 'Resonance',
      titleColor: 'text-red-400',
      description: 'Generative using p5Js',
      url: '',
      thumbnail: {
         alt: 'Resonance Thumbnail',
         src: '/generative/resonance-300x200.html',
         type: 'iframe'
      },
      date: '2022',
      details: [
         { key: 'Project Type', value: 'Generative' },
         { key: 'Language', value: 'Javascript' },
         { key: 'Libraries', value: 'p5' },
      ],
      libraries: [
         {
            name: 'Showcase',
            description: '',
            images: [
               {
                  alt: 'Resonance',
                  src: '/generative/resonance.html',
                  type: 'image',
                  width: 500,
                  height: 500,
                  class: 'w-[500px] h-[500px]'
               },
            ]
         }
      ],
   }),

   new Project({
      _id: '60f1f9f0b9d3b8b2b8b2b8b8',
      display: true,
      type: 'graphic',
      tags: ['Logo', 'Illustrator', 'Graphic'],
      title: 'a.c.t.e.',
      titleColor: 'text-gray-100',
      description: 'Logo design for A.C.T.E.',
      url: '',
      thumbnail: {
         alt: 'Acte Thumbnail',
         src: '/images/projects/Acte/thumbnail.png',
         type: 'image'
      },
      date: '2021',
      details: [
         { key: 'Project Type', value: 'Logo Design' },
         { key: 'Tool', value: 'Adobe AI' },
         { key: 'Date', value: '2021' },
      ],
      libraries: [
         {
            name: 'Showcase',
            description: '',
            images: [
               {
                  alt: 'Acte Noir',
                  src: '/images/projects/Acte/acte-38.png',
                  type: 'image',
                  class: 'w-[100%]'
               },
               {
                  alt: 'Acte Noir',
                  src: '/images/projects/Acte/acte-35.png',
                  type: 'image',
                  class: 'w-[100%]'
               },
               {
                  alt: 'Acte Noir',
                  src: '/images/projects/Acte/acte_320x120.png',
                  type: 'image',
                  class: 'w-[100%]'
               },

               {
                  alt: 'Acte Noir',
                  src: '/images/projects/Acte/2022.02-acte-noir.png',
                  type: 'image',
                  class: 'w-[100%]'
               },
               {
                  alt: 'Acte Blanc',
                  src: '/images/projects/Acte/2022.02-acte-transparent-fond blanc.png',
                  type: 'image',
                  class: 'w-[100%]'
               },
            ]
         }
      ],
   }),

   new Project({
      _id: '60f1f9f0b9d3b8b2b8b2b8b9',
      display: true,
      type: 'graphic',
      tags: ['Logo', 'Illustrator', 'Graphic'],
      title: 'FG Consulting',
      titleColor: 'text-gray-100',
      description: 'Logo design for FG Consulting',
      url: '',
      thumbnail: {
         alt: 'FG Thumbnail',
         src: '/images/projects/FG/thumbnail.png',
         type: 'image'
      },
      date: '2021',
      details: [
         { key: 'Project Type', value: 'Logo Design' },
         { key: 'Tool', value: 'Adobe AI' },
         { key: 'Date', value: '2021' },
      ],
      libraries: [
         {
            name: 'Showcase',
            description: '',
            images: [
               {
                  alt: 'FG Noir',
                  src: '/images/projects/FG/FG_GOOD-7.png',
                  type: 'image',
                  class: 'w-[100%]'
               },
            ]
         }
      ],
   }),

   new Project({
      _id: '60f1f9f0b9d3b8b2b8b2b8c0',
      display: true,
      type: 'graphic',
      tags: ['Logo', 'Illustrator', 'Graphic'],
      title: 'Through Your Soul',
      titleColor: 'text-gray-100',
      description: 'Logo design for Through Your Soul',
      url: '',
      thumbnail: {
         alt: 'Resonance Thumbnail',
         src: '/images/projects/TYS/thumbnail.png',
         type: 'image'
      },
      date: '2021',
      details: [
         { key: 'Project Type', value: 'Logo Design' },
         { key: 'Tool', value: 'Adobe AI' },
         { key: 'Date', value: '2022' },
      ],
      libraries: [
         {
            name: 'Showcase',
            description: '',
            images: [
               {
                  alt: 'TYS Business Card Front',
                  src: '/images/projects/TYS/BC-front.png',
                  type: 'image',
                  class: 'w-[40%]'
               },
               {
                  alt: 'TYS Business Back Front',
                  src: '/images/projects/TYS/BC-back.png',
                  type: 'image',
                  class: 'w-[40%]'
               },

               {
                  alt: 'TYS Business Back Front',
                  src: '/images/projects/TYS/tys-logo-border_black-bg_white.png',
                  type: 'image',
                  class: 'w-[100%]'
               },
               {
                  alt: 'TYS Business Back Front',
                  src: '/images/projects/TYS/tys-logo-title-border_black-bg-white.png',
                  type: 'image',
                  class: 'w-[100%]'
               },
            ]
         }
      ],
   }),
];

// get the language from local storage
if (typeof window !== 'undefined') {
   const storedProjects = localStorage.getItem('projects');
   if (storedProjects) defaultProjects = JSON.parse(storedProjects);
}

function storeProjects(projects: Project[]) {
   if (typeof window !== 'undefined') {
      localStorage.setItem('projects', JSON.stringify(projects));
   }
}

const initialState: ProjectState = {
   projects: defaultProjects,
};

export const projectSlice = createSlice({
   name: 'projects',
   initialState,
   reducers: {
      // set project list
      setProjects: (state, action: PayloadAction<Project[]>) => {
         state.projects = [...action.payload];
         storeProjects([...action.payload]);
      },
   },
});

export const {
   setProjects,
} = projectSlice.actions;

export const selectProjects = (state: RootState) => state.project.projects;
export const selectProject = (state: RootState, id: string) => state.project.projects.find((project) => project._id === id);

export default projectSlice.reducer;