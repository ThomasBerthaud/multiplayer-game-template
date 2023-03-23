import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase } }) => {
	const { data } = await supabase.from('Games').select();
	return {
		games: data ?? []
	};
};
