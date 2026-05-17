import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface EventData {
	eventTitle: string;
	city: string;
	description: string;
	imageSrc: string;
}
const eventsData: EventData[] = [
	{
		eventTitle: 'Rolex Boutique Harrods',
		city: 'London',
		description:
			'Classic luxury, timeless prestige, and the heart of elite watch culture.!',
			imageSrc: '/img/banner/2.jpeg',
	},
	{
		eventTitle: 'Premium Watches',
		city: 'Tashkent',
		description: 'Rolex — In Tashkent, a premium Swiss watch brand available through an official retailer, symbolizing prestige, precision, and timeless luxury in a growing luxury market!',
		imageSrc: '/img/banner/1.jpeg',
	},
	{
		eventTitle: 'Four seasons moscow',
		city: 'Moskva',
		description: 'Bold elegance, exclusive lifestyle, and powerful luxury presence!',
		imageSrc: '/img/banner/10.jpeg',
	},
	{
		eventTitle: 'Myungbosa',
		city: 'Busan',
		description:
			'Modern coastal luxury with a calm and refined atmosphere!',
			imageSrc: '/img/banner/8.jpeg',
	},
];

const EventCard = ({ event }: { event: EventData }) => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack
				className="event-card"
				style={{
					backgroundImage: `url(${event?.imageSrc})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<Box component={'div'} className={'info'}>
					<strong>{event?.city}</strong>
					<span>{event?.eventTitle}</span>
				</Box>
				<Box component={'div'} className={'more'}>
					<span>{event?.description}</span>
				</Box>
			</Stack>
		);
	}
};

const Events = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack className={'events'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span className={'white'}>Events</span>
							<p className={'white'}>Events waiting your attention!</p>
						</Box>
					</Stack>
					<Stack className={'card-wrapper'}>
						{eventsData.map((event: EventData) => {
							return <EventCard event={event} key={event?.eventTitle} />;
						})}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Events;
