export interface Admin {
  _id: string;
  email: string;
  username: string;
  role: "Administrateur" | "Consultant";
}

export interface NewAdmin {
  email: string;
  username: string;
  password: string;
  role: "Administrateur" | "Consultant";
}
