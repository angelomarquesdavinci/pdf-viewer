import {
  IDataAddItemDataById,
  IDataConstructor,
  IDataCreateReq,
  IDataRemoveItemDataById,
  IDataGetByIdReq,
  IDataGetByIdRes,
  IDataModel,
  IDataQueryReq,
  IDataQueryRes,
  IDataSetByIdReq,
  IDataUpdByIdReq,
  IDataUpdItemDataById,
  DataStatus,
} from "../../data/interface";

export interface IUserCrudModel extends IDataModel {
  createdBy: string;
  userId: string;
  updatedBy?: string;
  holdingId?: string;
}

export interface IUserCrudConstructor extends IDataConstructor {}

export interface IUserCrudQueryReq
  extends Omit<IDataQueryReq, "pkName" | "skName" | "pkValue"> {}

export interface IUserCrudQueryByStatusReq
  extends Omit<IDataQueryReq, "pkName" | "skName" | "pkValue"> {
  status: DataStatus;
}

export interface IUserCrudQueryRes<T extends IUserCrudModel>
  extends IDataQueryRes<T> {}

export interface IUserCrudGetByIdReq extends IDataGetByIdReq {}

export interface IUserCrudGetByPkReq {
  pk: string;
  index: string;
  fields?: string[];
}

export type IUserCrudGetByIdRes<T extends IUserCrudModel> = IDataGetByIdRes<T>;

export interface IUserCrudCreateReq<T extends IUserCrudModel>
  extends Omit<IDataCreateReq<T>, "model"> {
  model: Omit<T, "createdAt" | "status" | "createdBy" | "userId">;
}

export interface IUserCrudUpdByIdReq<T extends IUserCrudModel>
  extends IDataUpdByIdReq<T> {}

export interface IUserCrudSetByIdReq<T extends IUserCrudModel>
  extends IDataSetByIdReq<T> {}

export interface IUserCrudAddItemByIdReq<T extends IUserCrudModel>
  extends IDataAddItemDataById<T> {}

export interface IUserCrudUpdItemByIdReq<T extends IUserCrudModel>
  extends IDataUpdItemDataById<T> {}

export interface IUserCrudRemoveItemByIdReq extends IDataRemoveItemDataById {}
