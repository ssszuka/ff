import type { HomepageData } from "@/lib/types";

export interface AppConfig {
  USE_REMOTE_API: boolean;
  API: {
    INFO: string;
  };
  USE_REMOTE_API: boolean;
  LOCAL_DATA: HomepageData;
  UI: {
    LOADING_TIMEOUT: number;
    ANIMATION_DURATION: number;
    THEME: string;
  };
  FEATURES: {
    AOS_ANIMATIONS: boolean;
    GSAP_ANIMATIONS: boolean;
    API_TOGGLE: boolean;
    LOADING_SCREEN: boolean;
  };
}

export const appConfig: AppConfig = {
  USE_REMOTE_API: false, // Disabled for static hosting
  API: {
    INFO: '/api/info',
  },
  LOCAL_DATA: {
    owner: {
      discordId: '1045714939676999752',
      discordTag: 'Janvi Dreamer',
      displayName: 'Janvi Dreamer',
      avatarUrl: 'https://knarlix.github.io/images/janvi/logo.png',
      realName: 'Janvi Gautam',
      location: 'Madhya Pradesh, India',
      birthdate: '23rd February',
      description: 'Janvi Dreamer, whose real name is Janvi Gautam, from Madhya Pradesh, India. Born on 23rd February, she is a passionate creator who began her YouTube journey in 2022. Beyond content creation, Janvi finds joy in reading, writing, and playing video games, which fuel her creativity and imagination. She is also an avid traveller, always eager and enthusiastic to explore new places and experiences.',
    },
    socials: {
      youtube: {
        url: 'https://www.youtube.com/channel/UCa4-5c2gCYxqummRhmh6V4Q',
        handle: '@janvidreamer',
        display: 'YouTube',
      },
      instagram: {
        url: 'https://www.instagram.com/janvidreamer',
        handle: '@janvidreamer',
        display: 'Instagram',
      },
      discord: {
        user: 'https://discord.com/users/1045714939676999752',
        server: 'https://discord.gg/dreamersland',
        display: 'Discord',
      },
    },
    server: {
      name: "Dreamer's Land",
      id: 'dreamersland',
      inviteUrl: 'https://joindc.pages.dev',
      logo: '',
    },
    meta: {
      title: 'Janvi Dreamer - Content Creator & YouTuber',
      description: 'Passionate creator from Madhya Pradesh, India. YouTuber since 2022, gamer, writer.',
      keywords: 'Janvi Dreamer, YouTuber, Content Creator, Gaming, Travel, India, Dreamer, Janvi',
      lastUpdated: new Date().toISOString(),
    },
  },
  UI: {
    LOADING_TIMEOUT: 3000,
    ANIMATION_DURATION: 300,
    THEME: 'dark',
  },
  FEATURES: {
    AOS_ANIMATIONS: true,
    GSAP_ANIMATIONS: true,
    API_TOGGLE: true,
    LOADING_SCREEN: true,
  },
};

export default appConfig;
