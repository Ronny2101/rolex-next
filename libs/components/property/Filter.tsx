import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PropertyLocation, PropertyMaterial, PropertyMovement, PropertyType } from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { propertySquare } from '../../config';
import RefreshIcon from '@mui/icons-material/Refresh';
import { type } from 'os';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: PropertiesInquiry;
	setSearchFilter: any;
	initialInput: PropertiesInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [propertyLocation, setPropertyLocation] = useState<PropertyLocation[]>(Object.values(PropertyLocation));
	const [propertyMovement, setPropertyMovement] = useState<PropertyMovement[]>(Object.values(PropertyMovement));
	const [propertyMaterial, setPropertyMaterial] = useState<PropertyMaterial[]>(Object.values(PropertyMaterial));
	const [propertyType, setPropertyType] = useState<PropertyType[]>(Object.values(PropertyType));
	const [searchText, setSearchText] = useState<string>('');
	const [showMoreMovement, setShowMoreMovement] = useState<boolean>(false);
	const [showMoreType, setShowMoreType] = useState<boolean>(false);
	const [showMoreMaterial, setShowMoreMaterial] = useState<boolean>(false);
	const [showMore, setShowMore] = useState<boolean>(false);

	/** LIFECYCLES **/
	useEffect(() => {

		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			setShowMore(false);
			router.push(`/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, `/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			router.push(`/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, `/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.materialList?.length == 0) {
			delete searchFilter.search.materialList;
			router.push(`/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, `/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.options?.length == 0) {
			delete searchFilter.search.options;
			router.push(`/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, `/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.movementList?.length == 0) {
			delete searchFilter.search.movementList;
			router.push(`/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, `/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.locationList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/
	const propertyLocationSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.locationList?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('propertyLocationSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, propertyLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('propertyTypeSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, propertyTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyMaterialSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					if (searchFilter?.search?.materialList?.includes(value)) {
						await router.push(
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									materialList: searchFilter?.search?.materialList?.filter((item: string) => item !== value),
								},
							})}`,
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									materialList: searchFilter?.search?.materialList?.filter((item: string) => item !== value),
								},
							})}`,
							{ scroll: false },
						);
					} else {
						await router.push(
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, materialList: [...(searchFilter?.search?.materialList || []), value] },
							})}`,
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, materialList: [...(searchFilter?.search?.materialList || []), value] },
							})}`,
							{ scroll: false },
						);
					}
				} else {
					delete searchFilter?.search.materialList;
					setSearchFilter({ ...searchFilter });
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('propertyMaterialSelectHandler:', value);
			} catch (err: any) {
				console.log('ERROR, propertyMaterialSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.options?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('propertyOptionSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, propertyOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyMovementSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					if (searchFilter?.search?.movementList?.includes(value)) {
						await router.push(
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									movementList: searchFilter?.search?.movementList?.filter((item: string) => item !== value),
								},
							})}`,
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									movementList: searchFilter?.search?.movementList?.filter((item: string) => item !== value),
								},
							})}`,
							{ scroll: false },
						);
					} else {
						await router.push(
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, movementList: [...(searchFilter?.search?.movementList || []), value] },
							})}`,
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, movementList: [...(searchFilter?.search?.movementList || []), value] },
							})}`,
							{ scroll: false },
						);
					}
				} else {
					delete searchFilter?.search.movementList;
					setSearchFilter({ ...searchFilter });
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('propertyMovementSelectHandler:', value);
			} catch (err: any) {
				console.log('ERROR, propertyMovementSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertySizeHandler = useCallback(
		async (e: any, type: string) => {
			const value = e.target.value;

			if (type == 'start') {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							sizeRange: { ...searchFilter.search.sizeRange, start: value },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							sizeRange: { ...searchFilter.search.sizeRange, start: value },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							sizeRange: { ...searchFilter.search.sizeRange, end: value },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							sizeRange: { ...searchFilter.search.sizeRange, end: value },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const propertyPriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/property?input=${JSON.stringify(initialInput)}`,
				`/property?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>PROPERTIES FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your Product</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'What are you looking for?'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
						Location
					</p>
					<Stack
						className={`property-location`}
						style={{ height: showMore ? '370px' : '90px' }}
						onMouseEnter={() => setShowMore(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.locationList) {
								setShowMore(false);
							}
						}}
					>
						{propertyLocation.map((location: string) => {
							return (
								<Stack className={'input-box'} key={location}>
									<Checkbox
										id={location}
										className="property-checkbox"
										color="default"
										size="small"
										value={location}
										checked={(searchFilter?.search?.locationList || []).includes(location as PropertyLocation)}
										onChange={propertyLocationSelectHandler}
									/>
									<label htmlFor={location} style={{ cursor: 'pointer' }}>
										<Typography className="property-type">{location}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Property Type</Typography>
					<Stack
						className={`property-location`}
						style={{ height: showMoreType ? '260px' : '90px' }}
						onMouseEnter={() => setShowMoreType(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.materialList) {
								setShowMoreType(false);
							}
						}}
					>
					{propertyType.map((type: string) => (
						<Stack className={'input-box'} key={type}>
							<Checkbox
								id={type}
								className="property-checkbox"
								color="default"
								size="small"
								value={type}
								onChange={propertyTypeSelectHandler}
								checked={(searchFilter?.search?.typeList || []).includes(type as PropertyType)}
							/>
							<label style={{ cursor: 'pointer' }}>
								<Typography className="property_type">{type}</Typography>
							</label>
						</Stack>
					))}</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
						Movement
					</p>
					<Stack
						className={`property-location`}
						style={{ height: showMoreMovement ? '53px' : '80px' }}
					>
						{propertyMovement.map((movement: string) => {
							return (
								<Stack className={'input-box'} key={movement}>
									<Checkbox
										id={movement}
										className="property-checkbox"
										color="default"
										size="small"
										value={movement}
										checked={(searchFilter?.search?.movementList || []).includes(movement as PropertyMovement)}
										onChange={propertyMovementSelectHandler}
									/>
									<label htmlFor={movement} style={{ cursor: 'pointer' }}>
										<Typography className="property-type">{movement}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
						Material
					</p>
					<Stack
						className={`property-location`}
						style={{ height: showMoreMaterial ? '250px' : '80px' }}
						onMouseEnter={() => setShowMoreMaterial(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.materialList) {
								setShowMoreMaterial(false);
							}
						}}
					>
						{propertyMaterial.map((material: string) => {
							return (
								<Stack className={'input-box'} key={material}>
									<Checkbox
										id={material}
										className="property-checkbox"
										color="default"
										size="small"
										value={material}
										checked={(searchFilter?.search?.materialList || []).includes(material as PropertyMaterial)}
										onChange={propertyMaterialSelectHandler}
									/>
									<label htmlFor={material} style={{ cursor: 'pointer' }}>
										<Typography className="property-type">{material}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Options</Typography>
					<Stack className={'input-box'}>
						<Checkbox
							id={'Barter'}
							className="property-checkbox"
							color="default"
							size="small"
							value={'propertyBarter'}
							checked={(searchFilter?.search?.options || []).includes('propertyBarter')}
							onChange={propertyOptionSelectHandler}
						/>
						<label htmlFor={'Barter'} style={{ cursor: 'pointer' }}>
							<Typography className="propert-type">Barter</Typography>
						</label>
					</Stack>
					<Stack className={'input-box'}>
						<Checkbox
							id={'Rent'}
							className="property-checkbox"
							color="default"
							size="small"
							value={'propertyLimitedEdition'}
							checked={(searchFilter?.search?.options || []).includes('propertyLimitedEdition')}
							onChange={propertyOptionSelectHandler}
						/>
						<label htmlFor={'Rent'} style={{ cursor: 'pointer' }}>
							<Typography className="propert-type">Limited Edition</Typography>
						</label>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Size</Typography>
					<Stack className="square-year-input">
						<FormControl>
							<InputLabel id="demo-simple-select-label">Min</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={searchFilter?.search?.sizeRange?.start ?? 0}
								label="Min"
								onChange={(e: any) => propertySizeHandler(e, 'start')}
								MenuProps={MenuProps}
							>
								{propertySquare.map((square: number) => (
									<MenuItem
										value={square}
										disabled={(searchFilter?.search?.sizeRange?.end || 0) < square}
										key={square}
									>
										{square}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<div className="central-divider"></div>
						<FormControl>
							<InputLabel id="demo-simple-select-label">Max</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={searchFilter?.search?.sizeRange?.end ?? 500}
								label="Max"
								onChange={(e: any) => propertySizeHandler(e, 'end')}
								MenuProps={MenuProps}
							>
								{propertySquare.map((square: number) => (
									<MenuItem
										value={square}
										disabled={(searchFilter?.search?.sizeRange?.start || 0) > square}
										key={square}
									>
										{square}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'}>
					<Typography className={'title'}>Price Range</Typography>
					<Stack className="square-year-input">
						<input
							type="number"
							placeholder="$ min"
							min={0}
							value={searchFilter?.search?.pricesRange?.start ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									propertyPriceHandler(e.target.value, 'start');
								}
							}}
						/>
						<div className="central-divider"></div>
						<input
							type="number"
							placeholder="$ max"
							value={searchFilter?.search?.pricesRange?.end ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									propertyPriceHandler(e.target.value, 'end');
								}
							}}
						/>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
