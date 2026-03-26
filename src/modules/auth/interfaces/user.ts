type UserInfo = {
  id: string;
  email: string;
  role: string;
  password: string;
  api_token: string;
  user_uuid: string;
};

type UserDetails = {
  id: string;
  user_id: string;
  thumbnail: string | null;
  uid: string;
  description: string;
  firstname: string;
  lastname: string;
  birthday: Date | null;
};

type UserType = {
  user: UserInfo;
  details: UserDetails;
  authorization: {
    access_token: string;
    refresh_token: string;
    type: string;
  };
};

export type { UserInfo, UserDetails, UserType };
