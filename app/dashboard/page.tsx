'use client';

import { useEffect, useState } from 'react';
import { getEvents, getMembers, sendEmails } from '../actions';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import EmailTemplate from '@/components/EmailTemplate';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
	const [events, setEvents] = useState<any[]>([]);
	const [members, setMembers] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	useEffect(() => {
		async function fetchData() {
			const eventsData = await getEvents();
			const membersData = await getMembers();

			const now = new Date();
			const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

			const upcoming = eventsData.filter((event: any) => {
				const eventDate = new Date(event.date);
				return eventDate >= now && eventDate <= weekFromNow;
			});

			setEvents(upcoming);
			setMembers(membersData);
		}
		fetchData();
	}, []);

	const sendReminders = async () => {
		setLoading(true);
		const results = await sendEmails();
		console.log(results);
		setLoading(false);
	};

	return (
		<div>
			<div className='my-2 grid grid-cols-3 space-x-2'>
				<Card>
					<CardHeader>
						<CardTitle>
							<CardTitle>Total Members</CardTitle>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-4xl font-bold'>{members.length}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>
							<CardTitle>Upcoming Events</CardTitle>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-4xl font-bold'>{events.length}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>
							<CardTitle>Active Reminders</CardTitle>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-4xl font-bold'>{events.length * 4}</p>
					</CardContent>
				</Card>
			</div>
			<div>
				<Card>
					<CardHeader>
						<CardTitle>Upcoming Events</CardTitle>
					</CardHeader>
					<CardContent>
						{events.length == 0 ? (
							<p>No upcoming events in the next 7 days</p>
						) : (
							events.map((event, i) => {
								return (
									<div key={i} className='border-l-4 px-3 py-1 space-y-1 my-2'>
										<h3 className='text-2xl font-semibold'>{event.title}</h3>
										<p>
											{new Date(event.date).toLocaleDateString()} at{' '}
											{new Date(event.time).toLocaleTimeString()}
										</p>
										<p>{event.located_at}</p>
										<Button onClick={sendReminders}>Send Emails</Button>
									</div>
								);
							})
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
