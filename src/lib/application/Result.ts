import type { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';

export type Result<T = void> = Success<T> | Failure;

export type Success<T> = {
	data: T;
	error: null;
};

export type Failure = {
	data: null;
	error: Error | PostgrestError;
};

export const Ok = <T>(data: T): Success<T> => ({ data, error: null });

export const Err = (error: Error | PostgrestError): Failure => ({ error, data: null });

export const mapToResult = <T>(result: PostgrestSingleResponse<T>): Result<T> => {
	if (result.error) {
		return Err(result.error);
	}
	return Ok(result.data);
};
