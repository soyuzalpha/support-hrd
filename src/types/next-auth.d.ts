import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: any;
      id_position?: number;
      id_division?: number;
      id_company?: number;
    } & DefaultSession["user"];
  }

  interface User {
    id: any;
    accessToken?: string;
    id_position?: number;
    id_division?: number;
    id_company?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: number;
    accessToken?: string;
    id_position?: number;
    id_division?: number;
  }
}

// import type { DefaultUser } from "next-auth";
// import type { DefaultJWT } from "next-auth/jwt";

// declare module "next-auth" {
//   interface Session {
//     accessToken?: string;
//   }

//   interface User extends DefaultUser {
//     accessToken?: string;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT extends DefaultJWT {
//     accessToken?: string;
//   }
// }
