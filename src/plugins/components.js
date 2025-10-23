import {
   LanguageSwitcher,
   Logo
} from '@/components/common';

import {
   Header,
   Footer,
   Layout,
   Splash
} from '@/components/layout';

import {
   GithubCalendar,
   GithubChart,
   GithubContribution,
   GithubContributionSimple,
} from '@/components/developer';

import {
   VisitedPage,
   VisitorAnalytics,
   VisitorAnalyticsDashboard,
   VisitorInfo,
   VisitorTrackingDemo
} from '@/components/tracking';

import {
   StarField,
   StarFieldControls,
   StarFieldFilter1
} from '@/components/starField';

import {
   ChatBot,
   ChatBotWidget
} from '@/components/chatbot';

import {
   DeveloperStats
} from '@/components/about';

export default {
   install: (app) => {
      app.component('LanguageSwitcher', LanguageSwitcher);
      app.component('Logo', Logo);

      app.component('Header', Header);
      app.component('Footer', Footer);
      app.component('Layout', Layout);
      app.component('Splash', Splash);

      app.component('GithubCalendar', GithubCalendar);
      app.component('GithubChart', GithubChart);
      app.component('GithubContribution', GithubContribution);
      app.component('GithubContributionSimple', GithubContributionSimple);

      app.component('VisitedPage', VisitedPage);
      app.component('VisitorAnalytics', VisitorAnalytics);
      app.component('VisitorAnalyticsDashboard', VisitorAnalyticsDashboard);
      app.component('VisitorInfo', VisitorInfo);
      app.component('VisitorTrackingDemo', VisitorTrackingDemo);

      app.component('StarField', StarField);
      app.component('StarFieldControls', StarFieldControls);
      app.component('StarFieldFilter1', StarFieldFilter1);

      app.component('ChatBot', ChatBot);
      app.component('ChatBotWidget', ChatBotWidget);

      app.component('DeveloperStats', DeveloperStats);
   }
};