import { ICrudModel, ICrudQueryReq } from "../crud/interface";
import { DataStatus, IDataSearchReq } from "../data/interface";

export interface IDocumentTemplate extends ICrudModel {
  ref: string;
  documentFields: string[];
  documentFieldsRequired: string[];
  techinicalFields: string[];
  techinicalFieldsRequired: string[];
  sourceFile: string;
  helpFile: string;
  type: DocumentTemplateType;
  subtitle?: string;
}

export interface IDocumentTemplateGetByRefReq {
  ref: string;
  fields?: string[];
}

export enum DocumentTemplateType {
  PGRS = 0,
  PGRSS = 1,
}

export interface IDocumentTemplateQueryReq extends ICrudQueryReq {
  status?: DataStatus;
}

export interface IDocumentTemplateSearchReq extends IDataSearchReq {
  status?: DataStatus;
}
