export type ApiResponseData = Record<string, any> | Record<string, any>[];

export type ApiResponse =
  | {
      success: true;
      message: string;
      data?: ApiResponseData;
    }
  | {
      success: false;
      message: string;
      errors?: Record<string, any>;
    };
