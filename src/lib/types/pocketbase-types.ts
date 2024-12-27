/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Cities = "cities",
	Countries = "countries",
	Favorites = "favorites",
	FeedItems = "feed_items",
	ListPlaces = "list_places",
	Lists = "lists",
	SavedLists = "saved_lists",
	UserPreferences = "user_preferences",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export enum CitiesTypeOptions {
	"country" = "country",
	"region" = "region",
	"city" = "city",
	"neighborhood" = "neighborhood",
	"sight" = "sight",
}
export type CitiesRecord<Thighlights = unknown, Ttags = unknown> = {
	accessibility: number
	averageRating?: number
	bestSeason: number
	climate?: string
	cost: number
	costIndex: number
	country: string
	crowdLevel: number
	description: string
	highlights: null | Thighlights
	imageUrl: string
	interesting: number
	latitude?: number
	longitude?: number
	name: string
	normalizedName: string
	parentId?: RecordIdString
	population?: number
	recommendedStay: number
	safetyScore: number
	slug: string
	tags?: null | Ttags
	totalReviews?: number
	transit: number
	transitScore: number
	type?: CitiesTypeOptions
	userId?: RecordIdString
	walkScore: number
}

export type CountriesRecord = {
	description: string
	isoCode: string
	name: string
	population: number
}

export type FavoritesRecord = {
	city: RecordIdString
	field?: string
	user: RecordIdString
}

export enum FeedItemsTypeOptions {
	"trending_place" = "trending_place",
	"place_collection" = "place_collection",
	"similar_places" = "similar_places",
	"place_update" = "place_update",
	"tag_spotlight" = "tag_spotlight",
}

export enum FeedItemsSourceTypeOptions {
	"tag" = "tag",
	"place" = "place",
	"system" = "system",
}
export type FeedItemsRecord<Tcontent = unknown, Tstats = unknown> = {
	content?: null | Tcontent
	curator?: RecordIdString
	place?: RecordIdString
	places?: RecordIdString[]
	source_name: string
	source_type: FeedItemsSourceTypeOptions
	stats?: null | Tstats
	timestamp: IsoDateString
	type: FeedItemsTypeOptions
}

export type ListPlacesRecord = {
	description?: string
	list: RecordIdString
	place: RecordIdString
	rank?: number
}

export type ListsRecord = {
	description?: string
	place_count?: number
	saves?: number
	title: string
	user: RecordIdString
}

export type SavedListsRecord = {
	list?: RecordIdString
	user?: RecordIdString
}

export type UserPreferencesRecord<Tfollowed_places = unknown, Tfollowed_tags = unknown> = {
	followed_places?: null | Tfollowed_places
	followed_tags?: null | Tfollowed_tags
	user: RecordIdString
}

export type UsersRecord = {
	avatar?: string
	bio?: string
	isAdmin?: boolean
	isPrivate?: boolean
	lists_count?: number
	location?: string
	name?: string
	places_visited?: RecordIdString[]
}

// Response types include system fields and match responses from the PocketBase API
export type CitiesResponse<Thighlights = unknown, Ttags = unknown, Texpand = unknown> = Required<CitiesRecord<Thighlights, Ttags>> & BaseSystemFields<Texpand>
export type CountriesResponse<Texpand = unknown> = Required<CountriesRecord> & BaseSystemFields<Texpand>
export type FavoritesResponse<Texpand = unknown> = Required<FavoritesRecord> & BaseSystemFields<Texpand>
export type FeedItemsResponse<Tcontent = unknown, Tstats = unknown, Texpand = unknown> = Required<FeedItemsRecord<Tcontent, Tstats>> & BaseSystemFields<Texpand>
export type ListPlacesResponse<Texpand = unknown> = Required<ListPlacesRecord> & BaseSystemFields<Texpand>
export type ListsResponse<Texpand = unknown> = Required<ListsRecord> & BaseSystemFields<Texpand>
export type SavedListsResponse<Texpand = unknown> = Required<SavedListsRecord> & BaseSystemFields<Texpand>
export type UserPreferencesResponse<Tfollowed_places = unknown, Tfollowed_tags = unknown, Texpand = unknown> = Required<UserPreferencesRecord<Tfollowed_places, Tfollowed_tags>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	cities: CitiesRecord
	countries: CountriesRecord
	favorites: FavoritesRecord
	feed_items: FeedItemsRecord
	list_places: ListPlacesRecord
	lists: ListsRecord
	saved_lists: SavedListsRecord
	user_preferences: UserPreferencesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	cities: CitiesResponse
	countries: CountriesResponse
	favorites: FavoritesResponse
	feed_items: FeedItemsResponse
	list_places: ListPlacesResponse
	lists: ListsResponse
	saved_lists: SavedListsResponse
	user_preferences: UserPreferencesResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'cities'): RecordService<CitiesResponse>
	collection(idOrName: 'countries'): RecordService<CountriesResponse>
	collection(idOrName: 'favorites'): RecordService<FavoritesResponse>
	collection(idOrName: 'feed_items'): RecordService<FeedItemsResponse>
	collection(idOrName: 'list_places'): RecordService<ListPlacesResponse>
	collection(idOrName: 'lists'): RecordService<ListsResponse>
	collection(idOrName: 'saved_lists'): RecordService<SavedListsResponse>
	collection(idOrName: 'user_preferences'): RecordService<UserPreferencesResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
