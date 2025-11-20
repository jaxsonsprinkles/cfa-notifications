'use client';

import { Input } from '@/components/ui/input';
import { useForm, Resolver } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { addMember, getMembers, removeMember } from '../actions';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import supabase from '@/utils/supabase/client';
import { resolver } from '@/lib/constants';

export default function Members() {
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm({ resolver });
	const [members, setMembers] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const onSubmit = async (data: any) => {
		setLoading(true);
		await addMember(data);

		setLoading(false);
	};
	useEffect(() => {
		const a = async () => {
			const res = await getMembers();
			setMembers(res);

			const channel = supabase
				.channel('custom-all-channel')
				.on(
					'postgres_changes',
					{ event: '*', schema: 'public', table: 'members' },
					(payload) => {
						console.log('Change received!', payload);
						if (payload.eventType === 'INSERT' && payload.new) {
							setMembers((prev) => [...prev, payload.new]);
						} else if (payload.eventType === 'UPDATE' && payload.new) {
							setMembers((prev) =>
								prev.map((member) =>
									member.id === payload.new.id ? payload.new : member
								)
							);
						} else if (payload.eventType === 'DELETE' && payload.old) {
							setMembers((prev) =>
								prev.filter((member) => member.id !== payload.old.id)
							);
						}
					}
				)
				.subscribe();

			return () => {
				supabase.removeChannel(channel);
			};
		};

		const cleanupPromise = a();
		return () => {
			cleanupPromise.then((cleanup) => {
				if (typeof cleanup === 'function') cleanup();
			});
		};
	}, []);

	return (
		<div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col gap-2 my-2'
			>
				<Input {...register('name')} placeholder='Member name' />
				<Input
					{...register('email', {
						required: 'Required',
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
							message: 'Invalid email address',
						},
					})}
					placeholder='Member email'
				/>
				<Input
					{...register('phone', {
						required: 'Required',
						pattern: {
							value: /^.{10}$/,
							message: 'Invalid phone number',
						},
					})}
					type='number'
					placeholder='Member phone #'
				/>
				<Button disabled={loading}>Add Member</Button>
				<Alert
					className={` ${
						Object.keys(errors).length != 0 ? 'flex flex-col' : 'hidden'
					}`}
					variant='destructive'
				></Alert>
			</form>
			{
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Phone</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{members?.map((member) => {
							return (
								<TableRow key={member.id}>
									<TableCell>{member.name}</TableCell>
									<TableCell>{member.email}</TableCell>
									<TableCell>{member.phone}</TableCell>
									<TableCell>
										<Trash2
											color='red'
											className='cursor-pointer size-5'
											onClick={() => {
												removeMember(member.id);
											}}
										/>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			}
		</div>
	);
}
