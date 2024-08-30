import {
  ICnae,
  IDocument,
  IDocumentHealthWasteBase,
  IDocumentHealthWasteClassA,
  IDocumentHealthWasteClassE,
} from "../document/interface";
import { ILocation } from "../location/interface";
import { IUser } from "../user/interface";
import { IWasteClassification } from "../waste-classification/interface";

export interface IRenderReq {
  document: Partial<IDocument>;
  classifications: IWasteClassification[];
  cnaes: ICnae[];
  location?: ILocation;
  techinical: Partial<IUser>;
  isApproved: boolean;
}

export interface IHealthWasteClassLabel {
  groupA?: IDocumentHealthWasteClassA;
  groupB?: IDocumentHealthWasteBase;
  groupC?: IDocumentHealthWasteBase;
  groupDR?: IDocumentHealthWasteBase;
  groupDNR?: IDocumentHealthWasteBase;
  groupE?: IDocumentHealthWasteClassE;
}
