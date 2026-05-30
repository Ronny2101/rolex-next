import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberBlocks
			memberProperties
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberBlocks
			memberProperties
			memberRank
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberProperties
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberBlocks
			memberProperties
			memberRank
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;


/**************************
 *        CART        *
 *************************/

// --- Create Order ---
export const CREATE_ORDER = gql`
 mutation CreateOrder($input: [OrderItemInput!]!) {
  createOrder(input: $input) {
    _id
    orderTotal
    orderDelivery
    orderStatus
    createdAt
    orderItems {
      _id
      itemQuantity
      itemPrice
  propertyId
      propertyData {
        _id
        propertyTitle
        propertyPrice
        propertyImages 
      }
    }
  }
}`;
  
// --- Update Order ---

export const UPDATE_ORDER = gql`
  mutation UpdateOrder($input: OrderUpdateInput!) {
    updateOrder(input: $input) {
      _id
      orderStatus
      updatedAt
    }
  }
`;

/**************************
 *         CONTACT        *
 *************************/
export const CREATE_CONTACT = gql`
  mutation CreateContact($createContactInput: CreateContactInput!) {
    createContact(createContactInput: $createContactInput) {
      _id
	  name
	  email
	  subject
	  message
	  createdAt
    }
  }
`;


/**************************
 *        PROPERTY        *
 *************************/

export const CREATE_PROPERTY = gql`
	mutation CreateProperty($input: PropertyInput!) {
		createProperty(input: $input) {
			_id
			propertyType
			propertyStatus
			propertyLocation
			propertyAddress
			propertyTitle
			propertyPrice
			propertySize
			propertyMovement
			propertyMaterial
			propertyViews
			propertyLikes
			propertyImages
			propertyDesc
			propertyBarter
			propertyLimitedEdition
			memberId
			soldAt
			deletedAt
			constructedAt
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_PROPERTY = gql`
	mutation UpdateProperty($input: PropertyUpdate!) {
		updateProperty(input: $input) {
			_id
			propertyType
			propertyStatus
			propertyLocation
			propertyAddress
			propertyTitle
			propertyPrice
		    propertySize
			propertyMovement
			propertyMaterial
			propertyViews
			propertyLikes
			propertyImages
			propertyDesc
			propertyBarter
			propertyLimitedEdition
			memberId
			soldAt
			deletedAt
			constructedAt
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_PROPERTY = gql`
	mutation LikeTargetProperty($input: String!) {
		likeTargetProperty(propertyId: $input) {
			_id
			propertyType
			propertyStatus
			propertyLocation
			propertyAddress
			propertyTitle
			propertyPrice
			propertySize
			propertyMovement
			propertyMaterial
			propertyViews
			propertyLikes
			propertyImages
			propertyDesc
			propertyBarter
			propertyLimitedEdition
			memberId
			soldAt
			deletedAt
			constructedAt
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const CREATE_BOARD_ARTICLE = gql`
	mutation CreateBoardArticle($input: BoardArticleInput!) {
		createBoardArticle(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_BOARD_ARTICLE = gql`
	mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
		updateBoardArticle(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_BOARD_ARTICLE = gql`
	mutation LikeTargetBoardArticle($input: String!) {
		likeTargetBoardArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const CREATE_COMMENT = gql`
	mutation CreateComment($input: CommentInput!) {
		createComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/

export const SUBSCRIBE = gql`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

export const UNSUBSCRIBE = gql`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;
/**************************
 *      NOTIFICATION      *
 *************************/

export const MARKNOTIFICATIONREAD = gql`
	mutation MarkNotificationRead($id: String!) {
		markNotificationRead(id: $id) {
			_id
			notificationType
			notificationStatus
			notificationGroup
			notificationTitle
			notificationDesc
			authorId
			receiverId
			propertyId
			articleId
			createdAt
			updatedAt
		}
	}
`;

// ---------- Mutations ----------
export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($input: CreateNotificationInput!) {
    createNotification(input: $input) { _id }
  }
`;

export const MARKALLNOTIFICATIONREAD = gql`
	mutation MarkAllNotificationsRead {
		markAllNotificationsRead
	}
`;

export const REMOVENOTIFICATION = gql`
	mutation RemoveNotification($id: String!) {
		removeNotification(id: $id) {
			_id
			notificationType
			notificationStatus
			notificationGroup
			notificationTitle
			notificationDesc
			authorId
			receiverId
			propertyId
			articleId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVEALLNOTIFICATION = gql`
	mutation RemoveAllNotifications{
		removeAllNotifications
	}
`;