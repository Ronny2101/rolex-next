import React, { useState } from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Property } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { basketItemsVar, setBasketItems, userVar } from '../../../apollo/store';
import { sweetBasicAlert, sweetMixinErrorAlert } from '../../sweetAlert';
import { i18n, useTranslation } from 'next-i18next';

interface PopularPropertyCardProps {
	property: Property;
	likePropertyHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
	user?: any;
}

const PopularPropertyCard = (props: PopularPropertyCardProps) => {
	const { property, likePropertyHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
    const { t } = useTranslation('common');
	const router = useRouter();
	const user = useReactiveVar(userVar);
    const [liked, setLiked] = useState<boolean>(Boolean(property?.meLiked?.[0]?.myFavorite));
	const [glow, setGlow] = useState(false);



	const imagePath: string = property?.propertyImages?.[0]
			? `${REACT_APP_API_URL}/${property.propertyImages[0]}`
			: '/img/banner/header1.svg';

	/** HANDLERS **/
	const pushDetailHandler = async (propertyId: string) => {
		console.log('propertyId:', propertyId);
		await router.push({ pathname: '/property/detail', query: {id: propertyId}});

	}

	const handleAdd = (id: string, title: string, image: string, price: number) => {
		const current = basketItemsVar();
		const idx = current.findIndex((item) => item.propertyId === id);
		const next = [...current];

		if (idx > -1) {
			next[idx].itemQuantity += 1;
		} else {
			next.push({
				id,
				_id: id,
				propertyId: id,
				propertyTitle: title,
				propertyImages: image,
				propertyPrice: price,
				itemQuantity: 1,
			});
		}
		setBasketItems(next);
	};

	const handleLikeClick = (e: React.MouseEvent, propertyId: string) => {
		e.preventDefault();
		e.stopPropagation();
		if (likePropertyHandler) {
			likePropertyHandler(user, propertyId);
		}
		setLiked((prev) => !prev);
		setGlow(true);
		setTimeout(() => setGlow(false), 600);
	};

	const handleAddClick = (e: React.MouseEvent) => {
			e.stopPropagation();
			if (!user?._id) {
				sweetBasicAlert('You need to be logged in to add items to your cart!');
				return;
			}
			handleAdd(property._id, property.propertyTitle, imagePath, property.propertyPrice);
		};
	

	if (device === 'mobile') {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					onClick={() => pushDetailHandler(property._id)}
				>
					<img  src={imagePath} alt={property.propertyTitle} loading="lazy" />
					{property?.propertyImages?.[1] && (
						<img
							className="hover-img"
							src={`${REACT_APP_API_URL}/${property.propertyImages[1]}`}
							alt={`${property.propertyTitle} alternate`}
							loading="lazy"
						/>
					)}
					{property && property?.propertyRank >= topPropertyRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}
					{!recentlyVisited && (
							<div className='btn-group'>
								<Box className="view-box" aria-label="view count">
									<RemoveRedEyeIcon />
									<Typography>{property?.propertyViews}</Typography>
								</Box>

								<button className="add-to-basket-btn" type="button" onClick={handleAddClick} aria-label="Add to cart">
									<span>{t('Add to Cart')}</span>
								</button>

								<IconButton
									color="default"
									className="like-btn"
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
										handleLikeClick(e, property._id);
									}}
									title={!user?._id ? t('Login required to like') : t('Like this property')}
									aria-label="Like this property"
								>
									{liked || myFavorites || property?.meLiked?.[0]?.myFavorite ? (
										<FavoriteIcon
											color="primary"
											className={glow ? 'glow' : ''}
										/>
									) : (
										<FavoriteBorderIcon
											color={!user?._id ? 'disabled' : 'inherit'}
										/>
									)}
								</IconButton>
							</div>
						)}
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}  onClick={() => pushDetailHandler(property._id)}>{property.propertyTitle}</strong>
					<p className={'desc'}>{property.propertyType}</p>
					<div className={'options'}>
					    <div>
							<img src="/img/icons/auto.png" alt="" />
							<span>{property?.propertyMovement}</span>
						</div>
						<div>
							<img src="/img/icons/material.png" alt="" />
							<span>{property?.propertyMaterial}</span>
						</div>
						<div>
							<img src="/img/icons/size.png" alt="" />
							<span>{property?.propertySize} mm</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>{property?.propertyLimitedEdition ? 'rent' : 'sale'}</p>
						<div className={'price'}>${property.propertyPrice}</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					onClick={() => pushDetailHandler(property._id)}
			>
				    <img  src={imagePath} alt={property.propertyTitle} loading="lazy" />
						{property?.propertyImages?.[1] && (
							<img
								className="hover-img"
								src={`${REACT_APP_API_URL}/${property.propertyImages[1]}`}
								alt={`${property.propertyTitle} alternate`}
								loading="lazy"
							/>
					    )}
					{property && property?.propertyRank >= topPropertyRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}
                    {!recentlyVisited && (
							<div className='btn-group'>
								<Box className="view-box" aria-label="view count">
									<RemoveRedEyeIcon />
									<Typography>{property?.propertyViews}</Typography>
								</Box>

								<button className="add-to-basket-btn" type="button" onClick={handleAddClick} aria-label="Add to cart">
									<span>{t('Add to Cart')}</span>
								</button>

								<IconButton
									color="default"
									className="like-btn"
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
										handleLikeClick(e, property._id);
									}}
									title={!user?._id ? t('Login required to like') : t('Like this property')}
									aria-label="Like this property"
								>
									{liked || myFavorites || property?.meLiked?.[0]?.myFavorite ? (
										<FavoriteIcon
											color="primary"
											className={glow ? 'glow' : ''}
										/>
									) : (
										<FavoriteBorderIcon
											color={!user?._id ? 'disabled' : 'inherit'}
										/>
									)}
								</IconButton>
							</div>
						)}
				
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}  onClick={() => pushDetailHandler(property._id)}>{property.propertyTitle}</strong>
					<p className={'desc'}>{property.propertyType}</p>
					<div className={'options'}>
					    <div>
							<img src="/img/icons/auto.png" alt="" />
							<span>{property?.propertyMovement}</span>
						</div>
						<div>
							<img src="/img/icons/material.png" alt="" />
							<span>{property?.propertyMaterial}</span>
						</div>
						<div>
							<img src="/img/icons/size.png" alt="" />
							<span>{property?.propertySize} mm</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>{property?.propertyLimitedEdition ? 'rent' : 'sale'}</p>
						<div className={'price'}>${property.propertyPrice}</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PopularPropertyCard;
