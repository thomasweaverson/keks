import { Locations } from "../const/contacts";

export type TLocation = (typeof Locations)[keyof typeof Locations];
