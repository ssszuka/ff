// Default/Fallback data for instant display - similar to NodeJS export modules
// This data shows immediately on page load, then gets replaced by API data

export const defaultOwnerData = {
  id: "1212719184870383621",
  username: "janvidreamer", 
  displayName: "Janvi Dreamer",
  avatarUrl: "/cdn/assets/image/pfp.avif",
  about: "Janvi Dreamer, whose real name is Janvi Gautam, from Madhya Pradesh, India. Born on 23rd February, she is a passionate creator who began her YouTube journey in 2022. Beyond content creation, Janvi finds joy in reading, writing, and playing video games, which fuel her creativity and imagination. She is also an avid traveller, always eager and enthusiastic to explore new places and experiences."
};

export const defaultGuildData = {
  id: "1080560914262139001",
  name: "Dreamer's Land",
  iconUrl: "/cdn/assets/image/guild-logo.avif",
  memberCountFormatted: "N/A",
  verifiedUserCountFormatted: "N/A"
};

export const defaultYoutubeData = {
  channelId: "UCa4-5c2gCYxqummRhmh6V4Q",
  channelTitle: "Janvi Dreamer",
  customUsername: "@janvidreamer",
  logoUrl: "/cdn/assets/image/logo.avif",
  subscriberCountFormatted: "N/A",
  channelUrl: "https://www.youtube.com/channel/UCa4-5c2gCYxqummRhmh6V4Q"
};

export const defaultHeroData = {
  name: "Janvi Dreamer",
  tagline: "YouTuber & Gamer",
  subtitle: "Passionate creator from Madhya Pradesh, India. Join me on my journey through YouTube, gaming, and more!",
  avatarUrl: "/cdn/assets/image/pfp.avif"
};

// Complete default data structure that matches API response structure
export const defaultAppData = {
  owner: defaultOwnerData,
  guild: defaultGuildData,
  youtube: defaultYoutubeData
};