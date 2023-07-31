import type { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';

export type Result<T = void, R = PostgrestError> = Success<T> | Failure<R>;

export type Success<T> = {
	data: T;
	error: null;
};

export type Failure<R = PostgrestError> = {
	data: null;
	error: R;
};

export const Ok = <T>(data: T): Success<T> => ({ data, error: null });

export const Err = <T>(error: T): Failure<T> => ({ error, data: null });

export const mapToResult = <T>(result: PostgrestSingleResponse<T>): Result<T> => {
	if (result.error) {
		return Err(result.error);
	}
	return Ok(result.data);
};
