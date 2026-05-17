import React, { useEffect, useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Button, Link, Stack } from '@mui/material';
import HeaderFilter from '../homepage/HeaderFilter';
import { userVar } from '../../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useTranslation } from 'next-i18next';
import { t } from 'i18next';


const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);
		const { t } = useTranslation('common');
		const [open, setOpen]= useState(false);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Rolex</title>
						<meta name={'title'} content={`Rolex`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Rolex</title>
						<meta name={'title'} content={`Rolex`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack className={'header-main'}>
							<div className="img-wrapper"></div>
							<div className="overlay-content">
								<h1>{t('Rolex is a symbol of quality and luxury')}</h1>
								<p>{t('Rolex tel the time for you and speaks about you to those around you')}</p>
								<Link href="/property" style={{ textDecoration: 'none' }}>
								<Button variant="contained" className="shop-now-btn">
									{t('SHOP NOW')}
								</Button>
								</Link>
							</div>
						<Stack className={'container'}>
								<HeaderFilter
								   open={open} 
								   onClose={() => setOpen(false)}/>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutMain;
