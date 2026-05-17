import { PropertyLocation, PropertyMaterial, PropertyMovement, PropertyStatus, PropertyType } from '../../enums/property.enum';

export interface PropertyUpdate {
	_id: string;
	propertyType?: PropertyType;
	propertyStatus?: PropertyStatus;
	propertyLocation?: PropertyLocation;
	propertyAddress?: string;
	propertyTitle?: string;
	propertyPrice?: number;
	propertySize?: number;
	propertyMovement?: PropertyMovement;
	propertyMaterial?: PropertyMaterial;
	propertyImages?: string[];
	propertyDesc?: string;
	propertyBarter?: boolean;
	propertyLimitedEdition?: boolean;
	soldAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
}
