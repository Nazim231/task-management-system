export interface UserProfile {
  name: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserProfile, Credentials {}