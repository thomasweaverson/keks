import type { ReviewsFilter, SortOrder } from "../const/business";
import { Locations } from "../const/contacts";

export type TLocation = (typeof Locations)[keyof typeof Locations];

export type TReviewsFilter = typeof ReviewsFilter[keyof typeof ReviewsFilter];

export type TReviewsSortOrder = typeof SortOrder[keyof typeof SortOrder];
