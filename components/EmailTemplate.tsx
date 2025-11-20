import Image from 'next/image';

export default function EmailTemplate({
	firstName,
	event,
	reminder,
}: {
	firstName: string;
	event: any;
	reminder: string;
}) {
	return (
		<div className='p-3'>
			<div className='bg-[#cf2434] w-full h-70 rounded-md'>
				<img
					src='https://ci3.googleusercontent.com/meips/ADKq_NZoBw5wDj3jlWCNRWMeYhrxIA6n1wjVhew8oBw7-lzYYqNuTqLbJWdehSxTFueB_J1hUV7ycyVjW2L0Koy0pXJU3nihb9wnBb--siPgPf81RDjEcYnfIxy5YIL3uoAYchbacWXFdIQLyGFgCtrV09MHgK83lcPNhVUHkOaY2rQAmUX_2z_Z3Nii9mhHPt2oUsEXasAsI13A=s0-d-e1-ft#https://app.chickfilaleaderacademy.com/assets/new-logo-white-8b3cdfd9ed5fa3e0fa5f861396e6833aca019242bb7e8a899225ed995ab5f478.png'
					alt='Chick-Fil-A Leadership Academy'
					className='mx-auto'
				/>
			</div>
			<div>
				<h1 className='text-4xl font-bold mt-10 mb-5'>
					{firstName}, {event.title} is {reminder}
					{reminder != 'today' && ' days away'}!
				</h1>
				<p className='font-bold mb-2'>Location: {event.located_at}</p>
				<p className='text-muted-foreground'>{event.description}</p>
			</div>
		</div>
	);
}
