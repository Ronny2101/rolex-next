import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '';

			switch (router.pathname) {
				case '/property':
					title = 'Property Search';
					desc = 'HOME/PROPERTIES';
					bgImage = '/img/banner/2.PNG';
					break;
				case '/agent':
					title = 'Agents';
					desc = 'HOME / AGENTS';
					bgImage = '/img/banner/2.PNG';
					break;
				case '/agent/detail':
					title = 'Agent Page';
					desc = 'HOME / AGENT PAGE';
					bgImage = '/img/banner/1.PNG';
					break;
				case '/mypage':
					title = 'my page';
					desc = 'HOME / MY PAGE';
					bgImage = '/img/banner/2.PNG';
					break;
				case '/about':
					title = 'About';
					desc = 'HOME / ABOUT';
					bgImage = '/img/banner/2.PNG';
					break;
				case '/community':
					title = 'Community';
					desc = 'HOME / COMMUNITY';
					bgImage = '/img/banner/2.PNG';
					break;
				case '/community/detail':
					title = 'Community Detail';
					desc = 'Home / Community Detail';
					bgImage = '/img/banner/1.PNG';
					break;
				case '/cs':
					title = 'CS';
					desc = 'HOME / CS';
					bgImage = '/img/banner/2.PNG';
					break;
				case '/account/join':
					title = 'Login/Signup';
					desc = 'Authentication Process';
					bgImage = '/img/banner/1.PNG';
					setAuthHeader(true);
					break;
				case '/checkout':
					title = 'CHECKOUT';
					desc = 'Home/Checkout';
					bgImage = '/img/property/rolex-checkout.png';
					break;
				case '/member':
					title = 'Member Page';
					desc = 'Home / Member Page';
					bgImage = '/img/banner/2.PNG';
					break;
				default:
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

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

						<Stack
							className={`header-basic ${authHeader && 'auth'}`}
							style={{
								backgroundImage: `url(${memoizedValues.bgImage})`,
								backgroundSize: 'cover',
								boxShadow: 'inset 10px 40px 150px 40px rgb(24 22 36)',
							}}
						>
							<Stack className={'container'}>
								<strong>{t(memoizedValues.title)}</strong>
								<span>{t(memoizedValues.desc)}</span>
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

export default withLayoutBasic;
