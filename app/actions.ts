'use server';

import { createClient } from '@/utils/supabase/server';

export async function getMembers() {
	const supabase = await createClient();
	const { data } = await supabase.from('members').select('*');
	return data || [];
}

export async function addMember(result: any) {
	const supabase = await createClient();

	const { data: any, error } = await supabase
		.from('members')
		.insert([
			{
				name: result.name,
				email: result.email,
				phone: result.phone,
			},
		])
		.select();

	if (error) {
		throw new Error(error.message);
	}

	return result;
}

export async function removeMember(id: bigint) {
	const supabase = await createClient();

	const { error } = await supabase.from('members').delete().eq('id', id);
	if (error) {
		throw new Error(error.message);
	}
}
