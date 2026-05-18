import React, { useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AgentCard from '../../libs/components/common/AgentCard';
import { LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_AGENTS } from '../../apollo/user/query';
import { AgentsInquiry } from '../../libs/types/member/member.input';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { T } from '../../libs/types/common';
import { Member } from '../../libs/types/member/member';
import TopAgentCard from '../../libs/components/homepage/TopAgentCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});
interface AboutCardProps {
	initialInput: AgentsInquiry;
}

const About = (props: AboutCardProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [topAgents, setTopAgents] = useState<Member[]>([]);


	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	
		const {
			loading: getAgentsLoading,
			data: getAgentsData,
			error: getAgentsError,
			refetch: getAgentsRefetch,
		} = useQuery(GET_AGENTS, {
			fetchPolicy: 'cache-and-network',
			variables: { input: initialInput },
			notifyOnNetworkStatusChange: true,
			onCompleted: (data: T) => {
				setTopAgents(data?.getAgents?.list);
			},
		});
	
		const likeMemberHandler = async (user: any, id: string) => {
			try {
				if (!id) return;
				if (!user._id) throw new Error(Messages.error2);
	
				await likeTargetMember({
					variables: {
						input: id,
					},
				});
				await getAgentsRefetch({ input: initialInput });
				await sweetTopSmallSuccessAlert('success', 800);
			} catch (err: any) {
				console.log('ERROR, likePropertyHandler:', err.message);
				sweetMixinErrorAlert(err.message).then();
			}
		};

	if (device === 'mobile') {
		return <div>ABOUT PAGE MOBILE</div>;
	} else {
		return (
			<Stack className={'about-page'}>
				<Stack className={'intro'}>
					<Stack className={'container'}>
						<Stack className={'left'}>
							<strong>We're on a Mission to Change View of Real Estate Field.</strong>
							<Box className={'left-img'}>
							   <img src="/img/banner/header1.svg" alt="" />
							   <img src="/img/banner/header1.svg" alt="" />
							   <img src="/img/banner/header1.svg" alt="" />
						    </Box>
						</Stack>
						<Stack className={'right'}>
							<p>
							Rolex is considered one of the most famous and prestigious luxury watch brands in the world. The brand is valued not only as a device for telling time, but also as a symbol of wealth, success, refined taste, and social status. Rolex watches are globally recognized for their durability, precision, and timeless design. Today, the brand is one of the most desired luxury watch manufacturers among athletes, businessmen, actors, and collectors.

							The company was founded in 1905 by Hans Wilsdorf. Initially, the company began operating in London before later moving to Geneva. Hans Wilsdorf’s main goal was to create wristwatches that were highly accurate and practical for everyday use, unlike the pocket watches that were common at the time. Rolex quickly became famous for its innovative technologies. In 1926, the company introduced the world’s first waterproof wristwatch called the “Oyster.” This model became a major breakthrough in watchmaking history and significantly increased Rolex’s popularity.

							Rolex watches are manufactured using only premium materials. The company uses special 904L Oystersteel, 18-carat gold, platinum, and sapphire crystal glass. As a result, Rolex watches are known for being extremely durable, corrosion-resistant, and capable of maintaining their quality for many years. Each Rolex model contains a highly precise mechanical movement that undergoes strict testing procedures. Many of the watches are certified by COSC, confirming their exceptional accuracy.
								<br />
								<br />
								The design of Rolex watches is another factor that sets the brand apart from others. Instead of rapidly following fashion trends, the company maintains a classic and timeless style that never loses value. Because of this, even vintage Rolex models remain highly expensive today. Models such as Rolex Submariner, Rolex Daytona, Rolex Datejust, and Rolex GMT-Master II are especially popular around the world. Each of these models has its own unique history, design, and technical features.

							There are several reasons why Rolex watches are so expensive. First, the company uses extremely high-quality materials and assembles each watch with exceptional attention to detail. In addition, Rolex produces a limited number of watches each year, which increases demand even further. Many collectors also purchase Rolex watches as investments because the value of certain models continues to rise over time. Some rare and vintage Rolex watches have even been sold at auctions for millions of dollars.

							Today, Rolex is no longer just a watch manufacturer, but a global symbol of prestige and success. Wearing a Rolex is often associated with refined taste, financial achievement, and personal success. For this reason, Rolex remains one of the strongest and most respected luxury watch brands in the world.
							</p>
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'boxes'}>
					<Stack className={'container'}>
						<div className={'box'}>
										<div>
											<img src="/img/icons/crown.svg" alt="" />
										</div>
										<span>Timelles Luxury</span>
										<p>Crafted with precision and elegance</p>
									</div>
									<div className={'box'}>
										<div>
											<img src="/img/icons/securePayment.svg" alt="" />
										</div>
										<span>Secure Payment</span>
										<p>Luxury shopping with complete security</p>
									</div>
									<div className={'box'}>
										<div>
											<img src="/img/icons/globe2.svg" alt="" />
										</div>
										<span>Luxury Experience</span>
										<p>Discover the world of Rolex excellence</p>
									</div>
									<div className={'box'}>
										<div>
											<img src="/img/icons/time.svg" alt="" />
										</div>
										<span>Official Rolex</span>
										<p>Authenticity, prestige and heritage</p>
									</div>
									<div className={'box'}>
										<div>
											<img src="/img/icons/badge1.svg" alt="" />
										</div>
										<span>Elite Collection</span>
										<p>Iconic watches for timeless style</p>
									</div>
					</Stack>
                </Stack>
				<Stack className={'statistics'}>
					<Stack className={'container'}>
						<Stack className={'banner'}>
							<img src="/img/banner/header1.svg" alt="" />
						</Stack>
						<Stack className={'info'}>
							<Box component={'div'}>
								<strong>4M</strong>
								<p>Award Winning</p>
							</Box>
							<Box component={'div'}>
								<strong>12K</strong>
								<p>Property Ready</p>
							</Box>
							<Box component={'div'}>
								<strong>20M</strong>
								<p>Happy Customer</p>
							</Box>
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'options'}>
					<img src="/img/banner/aboutBanner.svg" alt="" className={'about-banner'} />
					<Stack className={'container'}>
						<strong>Let’s find the right selling option for you</strong>
						<Stack>
							<div className={'icon-box'}>
								<img src="/img/icons/security.svg" alt="" />
							</div>
							<div className={'text-box'}>
								<span>Property Management</span>
								<p>Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.</p>
							</div>
						</Stack>
						<Stack>
							<div className={'icon-box'}>
								<img src="/img/icons/keywording.svg" alt="" />
							</div>
							<div className={'text_-box'}>
								<span>Property Management</span>
								<p>Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.</p>
							</div>
						</Stack>
						<Stack>
							<div className={'icon-box'}>
								<img src="/img/icons/investment.svg" alt="" />
							</div>
							<div className={'text-box'}>
								<span>Property Management</span>
								<p>Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.</p>
							</div>
						</Stack>
						<Stack className={'btn'}>
							Learn More
							<img src="/img/icons/rightup.svg" alt="" />
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'partners'}>
					<Stack className={'container'}>
						<span>Trusted bu the world's best</span>
						<Stack className={'wrap'}>
							<img src="/img/icons/brands/amazon.svg" alt="" />
							<img src="/img/icons/brands/amd.svg" alt="" />
							<img src="/img/icons/brands/cisco.svg" alt="" />
							<img src="/img/icons/brands/dropcam.svg" alt="" />
							<img src="/img/icons/brands/spotify.svg" alt="" />
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'help'}>
					<Stack className={'container'}>
						<Box component={'div'} className={'left'}>
							<strong>Need help? Talk to our expert.</strong>
							<p>Talk to our experts or Browse through more properties.</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'white'}>
								Contact Us
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
							<div className={'black'}>
								<img src="/img/icons/call.svg" alt="" />
								920 851 9087
							</div>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(About);
