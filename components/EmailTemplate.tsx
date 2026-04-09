const logo =
	'https://ci3.googleusercontent.com/meips/ADKq_NZoBw5wDj3jlWCNRWMeYhrxIA6n1wjVhew8oBw7-lzYYqNuTqLbJWdehSxTFueB_J1hUV7ycyVjW2L0Koy0pXJU3nihb9wnBb--siPgPf81RDjEcYnfIxy5YIL3uoAYchbacWXFdIQLyGFgCtrV09MHgK83lcPNhVUHkOaY2rQAmUX_2z_Z3Nii9mhHPt2oUsEXasAsI13A=s0-d-e1-ft#https://app.chickfilaleaderacademy.com/assets/new-logo-white-8b3cdfd9ed5fa3e0fa5f861396e6833aca019242bb7e8a899225ed995ab5f478.png';

function Header() {
	return (
		<div style={{ backgroundColor: '#cf2434', borderRadius: '0.375rem', width: '100%' }}>
			<img
				src={logo}
				alt='Chick-Fil-A Leadership Academy'
				style={{
					display: 'block',
					marginLeft: 'auto',
					marginRight: 'auto',
					paddingTop: '0.5rem',
					paddingBottom: '0.5rem',
				}}
			/>
		</div>
	);
}

export function ReminderEmailTemplate({
	firstName,
	event,
	reminder,
}: {
	firstName: string;
	event: any;
	reminder: string;
}) {
	return (
		<div style={{ padding: '12px' }}>
			<Header />
			<div>
				<h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '2.5rem', marginBottom: '1.25rem' }}>
					{firstName}, {event.title} is {reminder === 'today' ? 'today' : `${reminder} away`}!
				</h1>
				<p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Location: {event.located_at}</p>
				<p style={{ color: '#6b7280' }}>{event.description}</p>
			</div>
		</div>
	);
}

export function NewEventEmailTemplate({
	firstName,
	event,
}: {
	firstName: string;
	event: any;
}) {
	const eventDate = new Date(event.date).toLocaleDateString(undefined, {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
	const eventTime = new Date(event.time).toLocaleTimeString(undefined, {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});

	return (
		<div style={{ padding: '12px' }}>
			<Header />
			<div>
				<h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '2.5rem', marginBottom: '1.25rem' }}>
					New event: {event.title}
				</h1>
				<p style={{ marginBottom: '0.5rem' }}>
					Hey {firstName}, a new event has been added to your calendar.
				</p>
				<p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
					{eventDate} at {eventTime}
				</p>
				<p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Location: {event.located_at}</p>
				<p style={{ color: '#6b7280' }}>{event.description}</p>
			</div>
		</div>
	);
}

// Default export kept for backwards compatibility with cron route
export default ReminderEmailTemplate;
