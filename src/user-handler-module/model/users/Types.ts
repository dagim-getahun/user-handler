export interface UserProfileType {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  bio?: string;
}

export interface UserType {
  _id: string;
  username: string;
  email: string;
  password?: string;
  passwordHash: string;
  profile: UserProfileType;
}

export interface MongooseResponseType {
  success: Boolean;
  task: String;
  message?: String;
  access_token?: string;
  auth?: boolean;
  error?: any;
  id?: string;
  data?: { count?: number; body: [UserType] };
  requestBody?: Record<string, any>;
}
