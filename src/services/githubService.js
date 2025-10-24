
export class GithubService {
  constructor () {
    this.githubApi = 'https://api.github.com/graphql';
    this.githubToken = import.meta.env.VITE_GITHUB_TOKEN;
    this.githubUsername = import.meta.env.VITE_GITHUB_USERNAME;
  }

  // Fetch available years from GitHub
  async fetchGithubAvailableYears () {
    let data = {
      startYear: null,
      availableYears: [],
      userCreatedYear: null,
      currentYear: new Date().getFullYear()
    };


    try {
      // Fetch user creation year and current activity
      const query = `
      query($userName:String!) {
        user(login: $userName) {
          createdAt
          contributionsCollection {
            contributionCalendar {
              totalContributions
            }
          }
        }
      }
    `;

      const res = await fetch(this.githubApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.githubToken}`
        },
        body: JSON.stringify({
          query,
          variables: { userName: this.githubUsername }
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const d = await res.json();

      if (d.errors) {
        throw new Error(d.errors[0].message);
      }

      data.startYear = new Date(d.data.user.createdAt).getFullYear();

      // Generate years from user creation year to current year
      const years = [];
      for (let year = data.currentYear; year >= data.startYear; year--) {
        years.push(year);
      }
      data.availableYears = years.reverse();
    } catch (err) {
      console.error('Error fetching available years:', err);
      // Fallback: generate years from 2010 to current year
      const years = [];
      for (let year = data.currentYear; year >= 2010; year--) {
        years.push(year);
      }
      data.availableYears = years;
    }

    return data;
  }

  // Fetch real GitHub contribution data
  async fetchGitHubContributions (selectedYear) {
    const data = {
      totalContributions: 0,
      weeks: []
    };

    try {
      // Calculate the date range for the selected year
      const fromDate = `${selectedYear}-01-01T00:00:00Z`;
      const toDate = `${selectedYear}-12-31T23:59:59Z`;

      const query = `
      query($userName:String!, $from:DateTime!, $to:DateTime!) {
        user(login: $userName) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

      const res = await fetch(this.githubApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.githubToken}`
        },
        body: JSON.stringify({
          query,
          variables: {
            userName: this.githubUsername,
            from: fromDate,
            to: toDate
          }
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const d = await res.json();

      if (d.errors) {
        throw new Error(d.errors[0].message);
      }

      const calendar = d.data.user.contributionsCollection.contributionCalendar;
      data.totalContributions = calendar.totalContributions;

      // Transform the API response: weeks have contributionDays arrays
      data.weeks = calendar.weeks.map((week) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount
        }))
      );
    } catch (err) {
      console.error('Error fetching GitHub contributions:', err);
      throw new Error('Error fetching GitHub contributions');
    }

    return data;
  }
}

// Create and export a singleton instance
export const githubService = new GithubService();
export default githubService;
