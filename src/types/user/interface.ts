import { Profile } from "../auth/interface";
import { ICrudModel, ICrudQueryReq } from "../crud/interface";
import { DataStatus, IDataSearchReq } from "../data/interface";
import { IAddress } from "../document/interface";

export interface IUser extends ICrudModel {
  name: string;
  email: string;
  holdingId?: string;
  profile?: Profile;
  password?: string;
  username: string;
  certificate?: ISignatureCertificate;
  phone?: string;
  position?: string;
  company?: IUserCompany;
  rubric?: string;
  professionalClass?: IUserProfessionalClass;
  identityNumber?: string; // RG
  taxpayerNumber?: string; // CPF
  profession?: string; // profissão
}

export interface IUserGetByUsernameReq {
  username: string;
  fields: string[];
}

export interface IUserConfirmById {
  id: string;
  password: string;
}

export interface IUserSetEmailByIdReq {
  id: string;
  email: string;
}

export interface IUserSetNameByIdReq {
  id: string;
  name: string;
}

export interface IUserSetPasswordByIdReq {
  id: string;
  password: string;
}

export interface IUserSetUsernameByIdReq {
  id: string;
  username: string;
}

export interface IUserSetCertificateByIdReq {
  id: string;
  certificate: ISignatureCertificate;
}

export interface IUserQueryByHoldingIdReq {
  holdingId: string;
  fields?: string[];
  offset?: string;
}

export interface IUserSearchByStatusReq
  extends Omit<IDataSearchReq, "index" | "pk"> {
  status?: DataStatus;
}

export interface IUserQueryReq extends ICrudQueryReq {
  status?: DataStatus;
}

export interface ISignatureCertificate {
  fileBase64: string;
  password?: string;
}

export interface IUserCompany {
  name: string;
  tradeName: string;
  identity: string;
  email: string;
  address: IAddress;
}

export interface IUserSetRubricByIdReq {
  id: string;
  rubric: string;
}

export interface IUserProfessionalClass {
  identity: string; // N.° de registro no órgão de classe profissional
  institution: string; // Órgão de Registro de Classe Profissional
  state?: string; // UF do órgão de classe profissional
}
