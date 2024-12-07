/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Cities = "cities",
	Countries = "countries",
	Favorites = "favorites",
	Lists = "lists",
	Tags = "tags",
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
export type CitiesRecord<Thighlights = unknown> = {
	accessibility: number
	averageRating?: number
	bestSeason: number
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
	population: string
	recommendedStay: number
	safetyScore: number
	slug: string
	tags?: RecordIdString[]
	totalReviews?: number
	transit: number
	transitScore: number
	type?: CitiesTypeOptions[]
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

export enum ListsStatusOptions {
	"published" = "published",
	"draft" = "draft",
}

export enum ListsCollectionOptions {
	"want-to-visit" = "want-to-visit",
	"visited" = "visited",
	"planning" = "planning",
	"favorites" = "favorites",
}

export enum ListsPrivacyOptions {
	"public" = "public",
	"private" = "private",
	"followers" = "followers",
}
export type ListsRecord<Ttags = unknown> = {
	author: RecordIdString
	category: string
	collection?: ListsCollectionOptions
	description: string
	isVerified?: boolean
	likes?: number
	places?: RecordIdString[]
	privacy: ListsPrivacyOptions
	relatedLists?: RecordIdString[]
	saves?: number
	shares?: number
	status: ListsStatusOptions
	tags: null | Ttags
	title: string
	totalPlaces: number
	views?: number
}

export type TagsRecord = {
	active?: boolean
	identifier: string
	label: string
	order?: number
}

export type UsersRecord = {
	avatar?: string
	bio?: string
	isPrivate?: boolean
	lists_count?: number
	location?: string
	name?: string
	places_visited?: RecordIdString[]
}

// Response types include system fields and match responses from the PocketBase API
export type CitiesResponse<Thighlights = unknown, Texpand = unknown> = Required<CitiesRecord<Thighlights>> & BaseSystemFields<Texpand>
export type CountriesResponse<Texpand = unknown> = Required<CountriesRecord> & BaseSystemFields<Texpand>
export type FavoritesResponse<Texpand = unknown> = Required<FavoritesRecord> & BaseSystemFields<Texpand>
export type ListsResponse<Ttags = unknown, Texpand = unknown> = Required<ListsRecord<Ttags>> & BaseSystemFields<Texpand>
export type TagsResponse<Texpand = unknown> = Required<TagsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	cities: CitiesRecord
	countries: CountriesRecord
	favorites: FavoritesRecord
	lists: ListsRecord
	tags: TagsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	cities: CitiesResponse
	countries: CountriesResponse
	favorites: FavoritesResponse
	lists: ListsResponse
	tags: TagsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'cities'): RecordService<CitiesResponse>
	collection(idOrName: 'countries'): RecordService<CountriesResponse>
	collection(idOrName: 'favorites'): RecordService<FavoritesResponse>
	collection(idOrName: 'lists'): RecordService<ListsResponse>
	collection(idOrName: 'tags'): RecordService<TagsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
