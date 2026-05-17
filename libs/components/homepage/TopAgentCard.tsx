// import React from 'react';
// import { useRouter } from 'next/router';
// import { Stack } from '@mui/material';
// import useDeviceDetect from '../../hooks/useDeviceDetect';
// import { Member } from '../../types/member/member';

// interface TopAgentProps {
// 	agent: Member;
// }
// const TopAgentCard = (props: TopAgentProps) => {
// 	const { agent } = props;
// 	const device = useDeviceDetect();
// 	const router = useRouter();
// 	const agentImage = agent?.memberImage
// 		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
// 		: '/img/profile/defaultUser.svg';

// 	/** HANDLERS **/

// 	if (device === 'mobile') {
// 		return (
// 			<Stack className="top-agent-card">
// 				<img src={agentImage} alt="" />

// 				<strong>{agent?.memberNick}</strong>
// 				<span>{agent?.memberType}</span>
// 			</Stack>
// 		);
// 	} else {
// 		return (
// 			<Stack className="top-agent-card">
// 				<img src={agentImage} alt="" />

// 				<strong>{agent?.memberNick}</strong>
// 				<span>{agent?.memberType}</span>
// 			</Stack>
// 		);
// 	}
// };

// export default TopAgentCard;


'use client';

import { useRouter } from 'next/router';
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import type { Member } from '../../types/member/member';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import member from '../../../pages/member';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Link from 'next/link';
import ArticleIcon from '@mui/icons-material/Article';
import { WatchIcon } from 'lucide-react';

interface TopAgentProps {
	agent: Member;
	likeMemberHandler: any;
}

const TopAgentCard = (props: TopAgentProps) => {
	const { agent, likeMemberHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const agentImage = agent?.memberImage
		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	const handleLike = () => {
		// Handle like functionality
	};

	const handleFollow = () => {
		// Handle follow functionality
	};

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card">
				<Link
					href={{
						pathname: '/agent/detail',
						query: { agentId: agent?._id },
					}}
				>
					<div className="agent-header">
						<img src={agentImage || '/placeholder.svg'} alt={agent?.memberNick} />
						<div className="agent-info">
							<div className="name-section">
								<PersonIcon />
								<strong>{agent?.memberNick}</strong>
							</div>
							<div className="phone-section">
								<PhoneIcon />
								<span>{agent?.memberPhone || 'No contact info'}</span>
							</div>
						</div>
					</div>
				</Link>

				<div className="agent-stats">
					<Stack gap={'5px'}>
						<div className="stat-item">
							<WatchIcon />
							<span>{agent?.memberProperties}</span>
						</div>
						<Typography component={'p'}>Product</Typography>
					</Stack>
					<Stack gap={'5px'}>
						<div className="stat-item">
							<ArticleIcon />
							<span>{agent?.memberArticles}</span>
						</div>
						<Typography component={'p'}>Followers</Typography>
					</Stack>
					<Stack gap={'5px'}>
						<div className="stat-item">
							<PeopleIcon />
							<span>{agent?.memberFollowings}</span>
						</div>
						<Typography component={'p'}>Followings</Typography>
					</Stack>
				</div>

				<div className="agent-description">
					<p>{agent?.memberDesc || 'No description available'}</p>
				</div>

				<div className="agent-actions">
					<Link
						href={{
							pathname: '/agent/detail',
							query: { agentId: agent?._id },
						}}
					>
						<Button startIcon={<OpenInNewIcon />} className={'view-btn'}>
							View
						</Button>
					</Link>
					{/* Like Button with Count */}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							cursor: 'pointer',
						}}
						onClick={() => likeMemberHandler(user, agent?._id)}
					>
						{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
							<FavoriteIcon sx={{ color: 'red', fontSize: 14 }} />
						) : (
							<FavoriteBorderIcon sx={{ color: '#666', fontSize: 14 }} />
						)}
						<Typography variant="body2" sx={{ fontSize: '14px', color: '#666' }}>
							{agent?.memberLikes}
						</Typography>
					</div>
				</div>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-agent-card">
				<Link
					href={{
						pathname: '/agent/detail',
						query: { agentId: agent?._id },
					}}
				>
					<div className="agent-header">
						<img src={agentImage || '/placeholder.svg'} alt={agent?.memberNick} />
						<div className="agent-info">
							<div className="name-section">
								<PersonIcon />
								<strong>{agent?.memberNick}</strong>
							</div>
							<div className="phone-section">
								<PhoneIcon />
								<span>{agent?.memberPhone || 'No contact info'}</span>
							</div>
						</div>
					</div>
				</Link>

				<div className="agent-stats">
					<Stack gap={'5px'}>
						<div className="stat-item">
							<WatchIcon />
							<span>{agent.memberProperties}</span>
						</div>
						<Typography component={'p'}>Product</Typography>
					</Stack>
					<Stack gap={'5px'}>
						<div className="stat-item">
							<ArticleIcon />
							<span>{agent?.memberArticles}</span>
						</div>
						<Typography component={'p'}>Articles</Typography>
					</Stack>
					<Stack gap={'5px'}>
						<div className="stat-item">
							<PeopleIcon />
							<span>{agent?.memberFollowers}</span>
						</div>
						<Typography component={'p'}>Followers</Typography>
					</Stack>
				</div>

				<div className="agent-actions">
					<Link
						href={{
							pathname: '/agent/detail',
							query: { agentId: agent?._id },
						}}
					>
						<Button startIcon={<OpenInNewIcon />} className={'view-btn'}>
							View
						</Button>
					</Link>
					{/* Like Button with Count */}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							cursor: 'pointer',
						}}
						onClick={() => likeMemberHandler(user, agent?._id)}
					>
						{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
							<FavoriteIcon sx={{ color: 'red', fontSize: 24 }} />
						) : (
							<FavoriteBorderIcon sx={{ color: '#666', fontSize: 24 }} />
						)}
						<Typography variant="body2" sx={{ fontSize: '14px', color: '#666' }}>
							{agent?.memberLikes}
						</Typography>
					</div>
				</div>
			</Stack>
		);
	}
};

export default TopAgentCard;