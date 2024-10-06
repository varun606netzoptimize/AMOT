// ** Login and register form interface

export interface FormData {
  username: string;
  password: string;
  isRemember: boolean;
}

// ** User info interface

export interface UserInfo {
  user_id: number;
  user_email: string;
  first_name: string;
  user_nicename: string;
  user_display_name: string;
}

export interface UserData {
  token: string;
  success: string;
  data: UserInfo;
}
