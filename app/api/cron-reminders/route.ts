import EmailTemplate from '@/components/EmailTemplate';
import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';

export async function GET(request: Request) {
	const resend = new Resend(process.env.RESEND_API_KEY);
	const supabase = await createClient();
	const { data: members } = await supabase.from('members').select('*');
	const { data: events } = await supabase.from('events').select('*');
	const reminders = [];
	const result = [];
	if (!events || !members) {
		return Response.json({ error: 'No data' }, { status: 404 });
	}
	const rightNow = new Date();

	for (const event of events) {
		const eventDate = new Date(event.date);
		const eventTime = new Date(event.time);
		const eventDateTime = new Date(
			eventDate.getFullYear(),
			eventDate.getMonth(),
			eventDate.getDate(),
			eventTime.getHours(),
			eventTime.getMinutes()
		);

		const reminderTimes = [
			{
				time: new Date(eventDateTime.getTime() - 604800000),
				label: '1 week',
			},
			{
				time: new Date(eventDateTime.getTime() - 259200000),
				label: '3 days',
			},
			{
				time: new Date(eventDateTime.getTime() - 86400000),
				label: '1 day',
			},
			{
				time: (() => {
					const d = new Date(eventDateTime);
					d.setHours(7, 0, 0);
					return d;
				})(),
				label: 'today',
			},
		];
		for (const reminder of reminderTimes) {
			const timeDifference = reminder.time.getTime() - rightNow.getTime();

			if (timeDifference >= 0 && timeDifference <= 86400000) {
				reminders.push({ event, reminder: reminder.label });
			}
		}
	}

	for (const { event, reminder } of reminders) {
		for (const member of members) {
			try {
				const { data, error } = await resend.emails.send({
					from: 'onboarding@resend.dev',
					to: member.email, //change to member.email
					subject: `${event.title} is ${reminder} away`,
					react: EmailTemplate({
						firstName: member.name.split(' ')[0],
						event: event,
						reminder: reminder,
					}),
				});
				result.push({
					member: member.email,
					event: event.title,
					status: 'sent',
				});
			} catch (error) {
				console.error(error);
				result.push({
					status: 'failed',
					member: member.id,
					event: event.title,
				});
			}
		}
	}
	return Response.json({
		success: true,
		sent: result.length,
		results: result,
	});
}
