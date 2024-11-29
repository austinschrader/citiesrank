/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Cities = "cities",
	Countries = "countries",
	Lists = "lists",
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

export type CitiesRecord<Tcoordinates = unknown, TdestinationTypes = unknown, Thighlights = unknown, Treviews = unknown> = {
	accessibility: number
	averageRating?: number
	bestSeason: number
	coordinates: null | Tcoordinates
	cost: number
	costIndex: number
	country: string
	crowdLevel: number
	description: string
	destinationTypes: null | TdestinationTypes
	highlights: null | Thighlights
	imageUrl?: string
	interesting: number
	name: string
	normalizedName: string
	population: string
	recommendedStay: number
	reviews: null | Treviews
	safetyScore: number
	slug: string
	totalReviews?: number
	transit: number
	transitScore: number
	walkScore: number
}

export type CountriesRecord = {
	description: string
	isoCode: string
	name: string
	population: number
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
export type CitiesResponse<Tcoordinates = unknown, TdestinationTypes = unknown, Thighlights = unknown, Treviews = unknown, Texpand = unknown> = Required<CitiesRecord<Tcoordinates, TdestinationTypes, Thighlights, Treviews>> & BaseSystemFields<Texpand>
export type CountriesResponse<Texpand = unknown> = Required<CountriesRecord> & BaseSystemFields<Texpand>
export type ListsResponse<Ttags = unknown, Texpand = unknown> = Required<ListsRecord<Ttags>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	cities: CitiesRecord
	countries: CountriesRecord
	lists: ListsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	cities: CitiesResponse
	countries: CountriesResponse
	lists: ListsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'cities'): RecordService<CitiesResponse>
	collection(idOrName: 'countries'): RecordService<CountriesResponse>
	collection(idOrName: 'lists'): RecordService<ListsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
