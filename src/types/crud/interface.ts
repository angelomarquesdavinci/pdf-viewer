import {
  IDataConstructor,
  IDataCreateReq,
  IDataGetByIdReq,
  IDataGetByIdRes,
  IDataModel,
  IDataQueryReq,
  IDataQueryRes,
  IDataSetByIdReq,
  IDataUpdByIdReq,
} from "../data/interface";

export interface ICrudModel extends IDataModel {}

export interface ICrudConstructor extends IDataConstructor {}

export interface ICrudQueryReq
  extends Omit<IDataQueryReq, "pkName" | "skName" | "pkValue"> {}

export interface ICrudQueryRes<T extends ICrudModel> extends IDataQueryRes<T> {}

export interface ICrudGetByIdReq extends IDataGetByIdReq {}

export type ICrudGetByIdRes<T extends ICrudModel> = IDataGetByIdRes<T>;

export interface ICrudCreateReq<T extends ICrudModel>
  extends IDataCreateReq<T> {}

export interface ICrudUpdByIdReq<T extends ICrudModel>
  extends IDataUpdByIdReq<T> {}

export interface ICrudSetByIdReq<T extends ICrudModel>
  extends IDataSetByIdReq<T> {}
