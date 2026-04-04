import { ApiResponse, ApiResponseData } from '../types/api';
import type { Response } from 'express';

export function requestFailed(
  responseHandler: Response,
  status: number,
  message: string,
  errors?: Record<string, any>,
): Response<ApiResponse> {
  const response: ApiResponse = { success: false, message, errors };
  return responseHandler.status(status).json(response);
}

export function requestCompleted(
  responseHandler: Response,
  message: string,
  data?: ApiResponseData,
): Response {
  const response: ApiResponse = { success: true, message, data };
  return responseHandler.status(200).json(response);
}
