export interface IToken {
  id: string;
  name: string;
  username: string;
  profile?: Profile;
  holdingId?: string;
  iat?: number;
  exp?: number;
  sa?: boolean;
}

export enum Profile {
  TECHINICAL = 1,
}
