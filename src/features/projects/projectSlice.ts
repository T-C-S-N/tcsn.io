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
      tags: ['React', 'Next', 'Tailwind', 'Vercel', 'TypeScript', 'ecommerce', 'storefront', 'stripe', 'UI/UX', 'design', 'development'],
      title: 'Velofcourse',
      titleColor: 'text-yellow-400',
      description: 'Velofcourse is a bicycle store & repair shop in Brussels. The app is built from scratch as a storefront with an integrated e-commerce.',
      url: 'https://velofcourse.com',
      thumbnail: {
         alt: 'Velofcourse - Desktop',
         src: '/images/projects/velofcourse/thumbnail.png',
         type: 'desktop-ui'
      },
      desktopUI: [
         {
            alt: 'Velofcourse - Desktop - Home',
            src: '/images/projects/velofcourse/Desktop - Home.png',
            type: 'desktop-ui'
         },
         {
            alt: 'Velofcourse - Desktop - Contact',
            src: '/images/projects/velofcourse/Desktop - Contact.png',
            type: 'desktop-ui'
         },
         {
            alt: 'Velofcourse - Desktop - Store',
            src: '/images/projects/velofcourse/Desktop - Store.png',
            type: 'desktop-ui'
         },
         {
            alt: 'Velofcourse - Desktop - Store item',
            src: '/images/projects/velofcourse/Desktop - Store item.png',
            type: 'desktop-ui'
         },
         {
            alt: 'Velofcourse - Desktop - Cart',
            src: '/images/projects/velofcourse/Desktop - Cart.png',
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
         { key: 'Project Type', value: 'Storefront, E-commerce, Responsive Website' },
         { key: 'Multilingual', value: 'English, French' },
         { key: 'UI/UX Design', value: 'Figma' },
         { key: 'Language', value: 'Typescript' },
         { key: 'Libraries', value: 'Tailwind, Google Maps API, Stripe, Redux' },
         { key: 'Front-End', value: 'React' },
         { key: 'Back-End', value: 'NextJs' },
         { key: 'Architecture', value: 'Monolithic' },
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