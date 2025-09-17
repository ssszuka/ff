// Local type definitions for static site
export interface Owner {
  discordId: string;
  discordTag: string;
  displayName: string;
  avatarUrl?: string;
  realName?: string;
  location?: string;
  birthdate?: string;
  description?: string;
}

export interface Socials {
  youtube?: {
    url: string;
    handle: string;
    display: string;
  };
  instagram?: {
    url: string;
    handle: string;
    display: string;
  };
  discord?: {
    user: string;
    server: string;
    display: string;
  };
}

export interface Server {
  name: string;
  id: string;
  inviteUrl: string;
  logo?: string;
}

export interface Meta {
  title: string;
  description: string;
  keywords: string;
  lastUpdated: string;
}

export interface HomepageData {
  owner: Owner;
  socials: Socials;
  server: Server;
  meta: Meta;
}

export interface VerificationUser {
  discordId: string;
  discordTag: string;
  displayName: string;
  avatarUrl?: string;
}

export interface YoutubeChannel {
  id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  subscriberCount?: string;
}

export interface ServerStats {
  memberCount: number;
  memberCountFormatted: string;
  verifiedCount: number;
  verifiedCountFormatted: string;
  onlineCount?: number;
  boostCount?: number;
}

export interface ServerWithStats extends Server {
  stats: ServerStats;
}

export interface VerificationPortalData {
  server: ServerWithStats;
  youtubeChannel: YoutubeChannel;
  meta: Meta;
}

export interface VerificationTokenData {
  token: string;
  user: VerificationUser;
  server: Server;
  oauthUrl: string;
  valid: boolean;
  used?: boolean;
  expiresAt?: string;
}

export type VerificationState = 
  | 'loading'
  | 'validating_token'
  | 'ready_for_oauth'
  | 'connecting_oauth'
  | 'oauth_success'
  | 'oauth_error'
  | 'token_invalid'
  | 'token_expired'
  | 'verification_complete';

export interface VerificationData {
  tokenData?: VerificationTokenData;
  youtubeChannel?: YoutubeChannel;
  subscriptionStatus?: boolean;
  membershipStatus?: string;
  state: VerificationState;
  error?: string;
}