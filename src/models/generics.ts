export interface CustomError extends Error{
    message: string;
    user?: {
      id?: string;
      role?: string;
    };
    url?: string;
    thirdPartyError?:string
    service?:string,
    status?:number
  };
