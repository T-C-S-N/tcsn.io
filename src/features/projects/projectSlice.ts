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
      type: 'web-app',
      tags: ['React', 'Next', 'Tailwind', 'Vercel', 'TypeScript', 'ecommerce', 'storefront', 'stripe', 'UI/UX', 'design', 'development'],
      title: 'Velofcourse',
      titleColor: 'text-yellow-400',
      description: 'Velofcourse is a bicycle store & repair shop in Brussels. The app is built from scratch as a storefront with an integrated e-commerce.',
      url: 'https://velofcourse.com',
      thumbnail: {
         alt: 'Velofcourse - Thumbnail',
         src: '/images/projects/Velofcourse/thumbnail.png',
         type: 'desktop-ui'
      },
      desktopUI: [
         {
            alt: 'Velofcourse - Desktop - Home',
            src: '/images/projects/Velofcourse/Desktop - Home.png',
            type: 'desktop-ui'
         },
         {
            alt: 'Velofcourse - Desktop - Contact',
            src: '/images/projects/Velofcourse/Desktop - Contact.png',
            type: 'desktop-ui'
         },
         {
            alt: 'Velofcourse - Desktop - Store',
            src: '/images/projects/Velofcourse/Desktop - Store.png',
            type: 'desktop-ui'
         },
         {
            alt: 'Velofcourse - Desktop - Store item',
            src: '/images/projects/Velofcourse/Desktop - Store item.png',
            type: 'desktop-ui'
         },
         {
            alt: 'Velofcourse - Desktop - Cart',
            src: '/images/projects/Velofcourse/Desktop - Cart.png',
            type: 'desktop-ui'
         },
      ],
      mobileUI: [
         {
            alt: 'Velofcourse - Mobile - Home',
            src: '/images/projects/Velofcourse/Mobile - Home.png',
            type: 'mobile-ui'
         },
         {
            alt: 'Velofcourse - Mobile - Contact',
            src: '/images/projects/Velofcourse/Mobile - Contact.png',
            type: 'mobile-ui'
         },
         {
            alt: 'Velofcourse - Mobile - Store',
            src: '/images/projects/Velofcourse/Mobile - Store.png',
            type: 'mobile-ui'
         },
         {
            alt: 'Velofcourse - Mobile - Store item',
            src: '/images/projects/Velofcourse/Mobile - Store item.png',
            type: 'mobile-ui'
         },
      ],
      date: '2022/23',
      details: [
         { key: 'Project Type', value: 'Storefront, E-commerce, Responsive' },
         { key: 'Multilingual', value: 'English, French' },
         { key: 'UI/UX Design', value: 'Figma' },
         { key: 'Language', value: 'Typescript' },
         { key: 'Libraries', value: 'Tailwind, Google Maps API, Stripe, Redux' },
         { key: 'Front-End', value: 'React' },
         { key: 'Back-End', value: 'NextJs' },
         { key: 'Architecture', value: 'Monolithic' },
      ]
   }),

   new Project({
      _id: '60f1f9f0b9d3b8b2b8b2b8b3',
      type: 'iot',
      tags: ['React', 'Next', 'Tailwind', 'Vercel', 'TypeScript', 'ecommerce', 'storefront', 'stripe', 'UI/UX', 'design', 'development'],
      title: 'Ellipse',
      titleColor: 'text-blue-400',
      description: 'Ellipse is a, ecosystem  Velofcourse is a bicycle store & repair shop in Brussels. The app is built from scratch as a storefront with an integrated e-commerce.',
      url: '',
      thumbnail: {
         alt: 'Ellipse - Thumbnail',
         src: '/images/projects/Ellipse/thumbnail.png',
         type: 'desktop-ui'
      },
      images: [
         {
            alt: 'Ellipse Web',
            src: '/images/projects/Ellipse/ellipse_web.png',
            type: 'desktop-ui'
         },
      ],
      desktopUI: [
         {
            alt: 'Ellipse Web',
            src: '/images/projects/Ellipse/ellipse_web.png',
            type: 'desktop-ui'
         },
      ],
      mobileUI: [
         {
            alt: 'Velofcourse - Mobile - Home',
            src: '/images/projects/velofcourse/Mobile - Home.png',
            type: 'mobile-ui'
         },
         {
            alt: 'Velofcourse - Mobile - Contact',
            src: '/images/projects/velofcourse/Mobile - Contact.png',
            type: 'mobile-ui'
         },
         {
            alt: 'Velofcourse - Mobile - Store',
            src: '/images/projects/velofcourse/Mobile - Store.png',
            type: 'mobile-ui'
         },
         {
            alt: 'Velofcourse - Mobile - Store item',
            src: '/images/projects/velofcourse/Mobile - Store item.png',
            type: 'mobile-ui'
         },
      ],
      date: '2022/23',
      details: [
         { key: 'Project Type', value: 'Storefront, E-commerce, Responsive' },
         { key: 'Multilingual', value: 'English, French' },
         { key: 'UI/UX Design', value: 'Figma' },
         { key: 'Language', value: 'Typescript' },
         { key: 'Libraries', value: 'Tailwind, Google Maps API, Stripe, Redux' },
         { key: 'Front-End', value: 'React' },
         { key: 'Back-End', value: 'NextJs' },
         { key: 'Architecture', value: 'Monolithic' },
      ]
   }),

   new Project({
      _id: '60f1f9f0b9d3b8b2b8b2b8b4',
      type: 'generative',
      tags: ['p5', 'Javascript', 'generative'],
      title: 'Random Field',
      titleColor: 'text-blue-400',
      description: 'Generative using p5Js',
      url: '',
      thumbnail: {
         alt: 'Generative - Thumbnail',
         src: '/generative/rand-rect-field-300x200.html',
         type: 'iframe'
      },
      images: [],
      desktopUI: [],
      mobileUI: [],
      date: '2022',
      details: [
         { key: 'Project Type', value: 'Generative' },
         { key: 'Language', value: 'Javascript' },
         { key: 'Libraries', value: 'p5' },
      ]
   }),

   new Project({
      _id: '60f1f9f0b9d3b8b2b8b2b8b5',
      type: 'generative',
      tags: ['p5', 'Javascript', 'generative'],
      title: 'Speed Dot',
      titleColor: 'text-blue-400',
      description: 'Generative using p5Js',
      url: '',
      thumbnail: {
         alt: 'Generative - Thumbnail',
         src: '/generative/speed-dot-300x200.html',
         type: 'iframe'
      },
      images: [],
      desktopUI: [],
      mobileUI: [],
      date: '2022',
      details: [
         { key: 'Project Type', value: 'Generative' },
         { key: 'Language', value: 'Javascript' },
         { key: 'Libraries', value: 'p5' },
      ]
   }),

   new Project({
      _id: '60f1f9f0b9d3b8b2b8b2b8b6',
      type: 'generative',
      tags: ['p5', 'Javascript', 'generative'],
      title: 'Connections',
      titleColor: 'text-blue-400',
      description: 'Generative using p5Js',
      url: '',
      thumbnail: {
         alt: 'Generative - Thumbnail',
         src: '/generative/connection-300x200.html',
         type: 'iframe'
      },
      images: [],
      desktopUI: [],
      mobileUI: [],
      date: '2022',
      details: [
         { key: 'Project Type', value: 'Generative' },
         { key: 'Language', value: 'Javascript' },
         { key: 'Libraries', value: 'p5' },
      ]
   }),

   new Project({
      _id: '60f1f9f0b9d3b8b2b8b2b8b7',
      type: 'generative',
      tags: ['p5', 'Javascript', 'generative'],
      title: 'Resonance',
      titleColor: 'text-blue-400',
      description: 'Generative using p5Js',
      url: '',
      thumbnail: {
         alt: 'Generative - Thumbnail',
         src: '/generative/resonance-300x200.html',
         type: 'iframe'
      },
      images: [],
      desktopUI: [],
      mobileUI: [],
      date: '2022',
      details: [
         { key: 'Project Type', value: 'Generative' },
         { key: 'Language', value: 'Javascript' },
         { key: 'Libraries', value: 'p5' },
      ]
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