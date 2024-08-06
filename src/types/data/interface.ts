import { IBaseConstructor } from "../base";
import { IJsonSchema } from "../schema";

export enum DataStatus {
  NONE = 0,
  DRAFT = 1,
  ENABLED = 2,
  DISABLED = 3,
  ARCHIVED = 4,
  BLOCKED = 5,
  OBSOLETE = 6,
  ERROR = 99,
}

export interface IDataModel {
  id: string;
  status: DataStatus;
  createdAt: number;
  updatedAt?: number;
  ver?: number;
  refId?: string;
}

export interface IDataConstructor extends IBaseConstructor {
  schema: IJsonSchema;
}

export interface IDataQueryReq {
  index?: string;
  fields?: string[];
  limit?: number;
  offset?: string;
  asc?: boolean;
  from?: number;
  to?: number;
  pk?: string | number;
}

export interface IDataSearchReq {
  index: string;
  fields?: string[];
  limit?: number;
  offset?: string;
  asc?: boolean;
  q?: string;
  pk: string | number;
}

export interface IDataQueryRes<T extends IDataModel> {
  offset?: string;
  items: T[];
}

export interface IDataGetByIdReq {
  id: string;
  fields?: string[];
}

export type IDataGetByIdRes<T extends IDataModel> = Partial<T> | undefined;

export interface IDataCreateReq<T extends IDataModel> {
  model: Omit<T, "createdAt" | "status">;
}

export interface IDataUpdByIdReq<T extends IDataModel> {
  id: string;
  model: Omit<T, "updatedAt" | "id" | "createdAt" | "status">;
  condition?: string;
}

export interface IDataSetByIdReq<T extends IDataModel> {
  id: string;
  model: Partial<Omit<T, "updatedAt" | "id" | "createdAt" | "status">>;
  condition?: string;
  values?: { [key: string]: any };
  names?: { [key: string]: any };
}

export interface IDataGetByPkReq {
  index: string;
  fields?: string[];
  pk?: string | number;
}

export interface IDataAddItemDataById<T extends IDataModel> {
  id: string;
  model: Partial<Omit<T, "updatedAt" | "id" | "createdAt" | "status">>;
  condition?: string;
  listName: string;
}

export interface IDataUpdItemDataById<T extends IDataModel> {
  id: string;
  model: Partial<Omit<T, "updatedAt" | "id" | "createdAt" | "status">>;
  condition?: string;
  index: number;
  listName: string;
}

export interface IDataRemoveItemDataById {
  id: string;
  condition?: string;
  index: number;
  listName: string;
}

export interface IDataListByIdsReq {
  ids: string[];
  fields?: string[];
}

// eslint-disable-next-line
export interface IDataAddNestedItemDataById<T extends IDataModel> {
  id: string;
  data: string[];
  listPath: string;
}

export interface IDataValidateNestedFieldById {
  id: string;
  fieldPath: string;
  value: any;
}

export interface IDataValidateNestedFieldByIdResult {
  nameAttributes: { [key: string]: string };
  referencePath: string;
  objectToCreate: any;
  arrayExists: boolean;
}

export interface IDataRemoveNestedItemDataById {
  id: string;
  index: number;
  listPath: string;
}

export interface IDataAddNestedDataById {
  id: string;
  data: any;
  listPath: string;
}

export interface IDataRemoveNestedDataById {
  id: string;
  listPath: string;
}

export interface IBasePagingReq {
  limit?: number;
  fields?: string[];
  offset?: string;
  asc?: boolean;
}

export interface IPagingRes<T extends IDataModel> {
  items: T[];
  offset?: string;
}

export interface IListAllReq {
  index?: string;
  fields?: string[];
}
