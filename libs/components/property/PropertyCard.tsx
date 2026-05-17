import React, { useEffect, useState } from 'react';
import { Stack, Typography, Box, Rating } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Property } from '../../types/property/property';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { basketItemsVar, userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from 'next/router';
import { sweetBasicAlert, sweetMixinErrorAlert } from '../../sweetAlert';
import { i18n } from 'next-i18next';

interface PropertyCardType {
	property: Property;
	likePropertyHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const PropertyCard = (props: PropertyCardType) => {
	const { property, likePropertyHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [liked, setLiked] = useState(property?.meLiked?.[0]?.myFavorite || false);
	const [glow, setGlow] = useState(false);
	const [stars, setStars] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const imagePath: string = property?.propertyImages[0]
		? `${REACT_APP_API_URL}/${property?.propertyImages[0]}`
		: '/img/banner/header1.svg';
	const imagePath2 = property?.propertyImages?.[1] ? `${REACT_APP_API_URL}/${property?.propertyImages[1]}` : imagePath;
	
	useEffect(() => {
		if (property) {
			const commentCount = property?.propertyComments || 0;
			const likeCount = property?.propertyLikes || 0;
			const viewCount = property?.propertyViews || 0;
			const calculatedStars = Math.min(5, (commentCount + likeCount + viewCount) / 3);
			setStars(calculatedStars);
		}
	}, [property]);

	const handleLikeClick = (propertyId: string) => {
		likePropertyHandler(user, propertyId);
		setLiked((prev) => !prev);
		setGlow(true);
		setTimeout(() => setGlow(false), 600);
	};

	const handleAdd = (id: string, title: string, image: string, price: number) => {
		const currentItems = basketItemsVar();
		const index = currentItems.findIndex((item) => item.propertyId === id);
		let updatedItems = [...currentItems];

		if (index > -1) {
			updatedItems[index].itemQuantity += 1;
		} else {
			updatedItems.push({
				id,
				_id: id,
				propertyId: id,
				propertyTitle: title,
				propertyImages: image,
				propertyPrice: price,
				itemQuantity: 1,
			});
		}

		basketItemsVar(updatedItems);
	};

	const pushDetailHandler = async (propertyId: string) => {
		router.push({ pathname: '/property/detail', query: { id: propertyId } });
	};

	const handleAddClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!user?._id) {
			sweetBasicAlert('You need to be logged in to add items to your cart!');
			return;
		}
		handleAdd(property._id, property.propertyTitle, imagePath, property.propertyPrice);
	};


	if 
	(device === 'mobile') {
		return <div>PROPERTY CARD</div>;
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top" onClick={() => pushDetailHandler(property._id)}>
						<img src={imagePath} alt={property.propertyTitle} />
						{property?.propertyImages?.[1] && <img className="hover-img" src={imagePath2} alt={property.propertyTitle} />}
			
						{property?.propertyType && (
					<Box className="badge">
						<Typography className="badge-text">{property.propertyType}</Typography>
					</Box>
				)}
				{!recentlyVisited && (
					<div className="btn-group">
						<Box className="views">
							<span>{property?.propertyViews}</span>
							<RemoveRedEyeIcon style={{ fontSize: '26px', marginTop: '7px' }} />
						</Box>
						<button className="add-to-basket-btn" onClick={handleAddClick}>
							<span>Add to Cart</span>
						</button>
						<IconButton
							color="default"
							onClick={async (e: any) => {
								e.stopPropagation();
								if (!user || !user._id) {
									let message = '';
									if (i18n?.language === 'kr') {
										message = '좋아요를 누르려면 로그인해야 합니다.';
									} else if (i18n?.language === 'uz') {
										message = 'Tizimga login boling';
									} else {
										message = 'You must be logged in to like';
									}

									await sweetMixinErrorAlert(message, 2000, () => {
										router.push('/account/join'); // navigate AFTER alert closes
									});

									return;
								}
								handleLikeClick(property._id);
							}}
							title={!user?._id ? 'Login required to like' : 'Like this product'}
						>
							{liked || myFavorites || property?.meLiked?.[0]?.myFavorite ? (
								<FavoriteIcon color="primary" className={glow ? 'glow' : ''} />
							) : (
								<FavoriteBorderIcon color={!user?._id ? 'disabled' : 'inherit'} />
							)}
						</IconButton>
					</div>
				)}
				</Stack>
				
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Typography>
							<Typography>{property.propertyTitle}</Typography>
							</Typography>
							<Box className="product-stars">
						<Rating name="read-only" value={stars} readOnly precision={0.5} size="small" />
					</Box>
						</Stack>
					</Stack>
					<div className={'options'}>
					    <div className={'option'}>
							<img src="/img/icons/auto.png" alt="" />
							<span>{property?.propertyMovement}</span>
						</div>
						<div className={'option'}>
							<img src="/img/icons/material.png"  alt="" />
							<span>{property?.propertyMaterial}</span>
						</div>
						<div className={'option'}>
							<img src="/img/icons/size.png" alt="" />
							<span>{property?.propertySize} mm</span>
						</div>
					</div>
					<Stack className="divider"></Stack>
					<Stack className="type-buttons">

						<Stack className="type">
							<Typography
								sx={{ fontWeight: 500, fontSize: '13px' }}
								className={property.propertyLimitedEdition ? '' : 'disabled-type'}
							>
								Edition
							</Typography>
							<Typography
								sx={{ fontWeight: 500, fontSize: '13px' }}
								className={property.propertyBarter ? '' : 'disabled-type'}
							>
								Barter
							</Typography>
						</Stack>
						<Box component={'div'} className={'price-box'}>
								<Typography>${formatterStr(property?.propertyPrice)}</Typography>
							</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default PropertyCard;
