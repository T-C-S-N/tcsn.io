import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { githubService } from '@/services/githubService';

export const useAboutStore = defineStore('about', () => {
  const github = ref({
    currentYear: computed(() => new Date().getFullYear()),
    availableYears: ref([]),
    contributions: ref({})
  });

  function fetchGithubAvailableYears () {
    return githubService.fetchGithubAvailableYears().then(data => {
      github.value.availableYears = data.availableYears;
    });
  }

  function fetchGitHubContributions (year) {
    return githubService.fetchGitHubContributions(year).then(data => {
      github.value.contributions[year] = data;
    });
  }

  return {
    github,
    fetchGithubAvailableYears,
    fetchGitHubContributions
  };
});
