/**
 * Response utility functions for standardizing API responses
 */

import { redirect } from "next/navigation";

/**
 * Standard response object for API actions
 */
export interface ActionResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

/**
 * Creates a success response
 */
export function successResponse(message: string, data?: unknown): ActionResponse {
  const response: ActionResponse = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return response;
}

/**
 * Creates an error response
 */
export function errorResponse(message: string, data?: unknown): ActionResponse {
  const response: ActionResponse = {
    success: false,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return response;
}

/**
 * Creates a redirect response
 */
export function redirectResponse(path: string) {
  return redirect(path);
}

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(type: "error" | "success", path: string, message: string) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}
