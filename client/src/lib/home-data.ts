// Home-specific data that's only used on homepage
export interface HomeSocialsData {
  socials: {
    youtube: {
      handle: string;
      url: string;
    };
    discord: {
      handle: string;
      url: string;
      inviteCode: string;
    };
    instagram: {
      handle: string;
      url: string;
    };
    twitter: {
      handle: string;
      url: string;
    };
  };
  server: {
    name: string;
    logo: string;
    inviteUrl: string;
    description: string;
  };
}

// Static home-specific data (this could be made dynamic later if needed)
export const homeData: HomeSocialsData = {
  socials: {
    youtube: {
      handle: '@janvidreamer',
      url: 'https://www.youtube.com/channel/UCa4-5c2gCYxqummRhmh6V4Q'
    },
    discord: {
      handle: 'Dreamer\'s Land',
      url: 'https://discord.gg/dreamer',
      inviteCode: 'dreamer'
    },
    instagram: {
      handle: '@janvidreamer',
      url: 'https://instagram.com/janvidreamer'
    },
    twitter: {
      handle: '@janvidreamer',
      url: 'https://twitter.com/janvidreamer'
    }
  },
  server: {
    name: 'Dreamer\'s Land',
    logo: '/cdn/logo.avif',
    inviteUrl: 'https://joindc.pages.dev',
    description: 'Join our amazing community of dreamers!'
  }
};