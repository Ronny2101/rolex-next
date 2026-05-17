import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface AgentCardProps {
	agent: any;
	likeMemberHandler: any
}

const AgentCard = (props: AgentCardProps) => {
	const { agent, likeMemberHandler} = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = agent?.memberImage
		? `${REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	if (device === 'mobile') {
		return <div>AGENT CARD</div>;
	} else {
		return (
			<Stack className="agent-general-card">
				<Link
					href={{
						pathname: '/agent/detail',
						query: { agentId: agent?._id },
					}}
				>
					<Box
						component={'div'}
						className={'agent-img'}
						style={{
							backgroundImage: `url(${imagePath})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat',
						}}
					>
						<div>{agent?.memberProperties} properties</div>
					</Box>
				</Link>

				<Stack className={'agent-desc'}>
					<Box component={'div'} className={'agent-info'}>
						<Link
							href={{
								pathname: '/agent/detail',
								query: { agentId: 'id' },
							}}
						>
							<strong>{agent?.memberFullName ?? agent?.memberNick}</strong>
						</Link>
						<span>Agent</span>
					</Box>
					<Box component={'div'} className={'buttons'}>
						<IconButton color={'default'}>
							<RemoveRedEyeIcon />
						</IconButton>
						<Typography className="view-cnt">{agent?.memberViews}</Typography>
						<IconButton color={'default'} onClick={() => likeMemberHandler(user, agent?._id)}>
							{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon color={'primary'} />
							) : (
								<FavoriteBorderIcon />
							)}
						</IconButton>
						<Typography className="view-cnt">{agent?.memberLikes}</Typography>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default AgentCard;

// import React, { useState } from 'react';
// import useDeviceDetect from '../../hooks/useDeviceDetect';
// import { Stack, Box, Typography } from '@mui/material';
// import Link from 'next/link';
// import { REACT_APP_API_URL } from '../../config';
// import IconButton from '@mui/material/IconButton';
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import { useReactiveVar } from '@apollo/client';
// import { userVar } from '../../../apollo/store';
// import { useRouter } from 'next/router';
// import { sweetMixinErrorAlert } from '../../sweetAlert';
// import { i18n, useTranslation } from 'next-i18next';

// interface AgentCardProps {
// 	agent: any;
// 	likeMemberHandler: any;
// 	myFavorites?: boolean;
// 	recentlyVisited?: boolean;
// 	user?: any;
// }

// const AgentCard = (props: AgentCardProps) => {
// 	const { agent, likeMemberHandler, myFavorites, recentlyVisited } = props;
// 	const device = useDeviceDetect();
// 	const router = useRouter();
// 	const user = useReactiveVar(userVar);
// 	const { t } = useTranslation('common');
// 	const [liked, setLiked] = useState(agent?.meLiked?.[0]?.myFavorite || false);
// 	const [glow, setGlow] = useState(false);

// 	const imagePath: string = agent?.memberImage
// 		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
// 		: '/img/profile/defaultUser.svg';

// 	const handleLikeClick = (e: React.MouseEvent, propertyId: string) => {
// 		e.preventDefault();
// 		e.stopPropagation();
// 		likeMemberHandler(user, propertyId);
// 		setLiked((prev: any) => !prev);
// 		setGlow(true);
// 		setTimeout(() => setGlow(false), 600);
// 	};

// 	if (device === 'mobile') {
// 		return <div>STORE CARD</div>;
// 	} else {
// 		return (
// 			<Stack className="top-store-card">
// 				<Stack className="store-image-container">
// 					<img src={imagePath} alt={agent.memberNick} />
// 				</Stack>

// 				<Stack className="top-store-card-down">
// 					<Stack className="top-store-card-info">
// 						<h1>
// 							<img src="/img/profile/address.png" alt="phone" />
// 							{agent.memberAddress ?? 'Seoul'}
// 						</h1>
// 						<strong>{agent.memberNick}</strong>
// 						<p>
// 							<img src="/img/profile/contact.png" alt="phone" />
// 							{agent.memberPhone}
// 						</p>
// 					</Stack>

// 					<Stack className="top-store-card-middle">
// 						<span>{agent?.memberDesc ?? 'No Description'}</span>
// 					</Stack>

// 					<Stack className="stats-row">
// 						<div className="stat-item">
// 							<span className="icon">
// 								<img src="/img/icons/followers.png" alt="follower" />
// 							</span>
// 							<span>{agent.memberFollowers} Followers</span>
// 						</div>
// 						<div className="stat-item">
// 							<span className="icon">
// 								<img src="/img/icons/followers.png" alt="following" />
// 							</span>
// 							<span>{agent.memberFollowings} Followings</span>
// 						</div>
// 						<div className="stat-item">
// 							<span className="icon">
// 								<img src="/img/icons/product.png" alt="products" />
// 							</span>
// 							<span>{agent.memberProperties} Products</span>
// 						</div>
// 					</Stack>

// 					<button
// 						className="view-store-btn"
// 						onClick={(e) => {
// 							e.stopPropagation();
// 							router.push(`/agent/detail?id=${agent._id}`);
// 						}}
// 					>
// 						<span>View Store Info</span>
// 					</button>

// 					{!recentlyVisited && (
// 						<div className="interaction-buttons">
// 							<Box className="view-box">
// 								<RemoveRedEyeIcon />
// 								<Typography>{agent?.memberViews}</Typography>
// 							</Box>

// 							<IconButton
// 								color="default"
// 								onClick={async (e: any) => {
// 									e.stopPropagation();
// 									if (!user || !user._id) {
// 										let message = '';
// 										if (i18n?.language === 'kr') {
// 											message = '좋아요를 누르려면 로그인해야 합니다.';
// 										} else if (i18n?.language === 'uz') {
// 											message = 'Tizimga login boling';
// 										} else {
// 											message = 'You must be logged in to like';
// 										}

// 										await sweetMixinErrorAlert(message, 2000, () => {
// 											router.push('/account/join'); // navigate AFTER alert closes
// 										});

// 										return;
// 									}
// 									handleLikeClick(e, agent._id);
// 								}}
// 								title={!user?._id ? 'Login required to like' : 'Like this product'}
// 							>
// 								{liked || myFavorites || agent?.meLiked?.[0]?.myFavorite ? (
// 									<FavoriteIcon color="primary" className={glow ? 'glow' : ''} />
// 								) : (
// 									<FavoriteBorderIcon color={!user?._id ? 'disabled' : 'inherit'} />
// 								)}
// 							</IconButton>
// 						</div>
// 					)}
// 				</Stack>
// 			</Stack>
// 		);
// 	}
// };

// export default AgentCard;
