import {
  DocumentFrequency,
  DocumentHealthWasteClass,
  DocumentWasteWeekDays,
} from "../document/enum";
import {
  IAddress,
  ICnae,
  IDocument,
  IDocumentCompany,
} from "../document/interface";
import {
  DOCUMENT_FREQUENCY,
  DOCUMENT_WASTE_WEEKDAYS,
} from "../document/resource";
import { cnpjMask, cpfMask, zipMask } from "../util";
import { IWasteClassification } from "../waste-classification/interface";

export const FIELD_EMPTY = "- ";
export const NOT_ADDRESS_NUMBER = "S/N";

export function getCnaeId(cnaes: ICnae[], id: string): string {
  const res = cnaes.find((cnae) => cnae.id === id);

  return res ? `${res.id} - ${res.desc}` : "";
}

export function setUpAddress(address?: IAddress) {
  if (!address) {
    return "[###]";
  }

  return `${address.street}, ${address.number ?? NOT_ADDRESS_NUMBER} - ${
    address.neighborhood ?? ""
  }, ${address.city} - ${address.state}, ${zipMask(address.zip)}${
    address.complement ? ` - ${address.complement}` : ""
  }`;
}

export function getClassificationId(
  classifications: IWasteClassification[],
  id: string
): string {
  const res = classifications.find(
    (classification) => classification.id === id
  );

  return res ? `${res.id} - ${res.desc}` : "";
}

export function getCnaeIdList(cnaes: ICnae[], ids: string[]): string {
  return ids.map((item) => getCnaeId(cnaes, item)).join(", ");
}

export function getWeekDays(days: DocumentWasteWeekDays[]): string {
  return days.map((item) => DOCUMENT_WASTE_WEEKDAYS(item)).join(", ");
}

export function getWorkHours(company?: IDocumentCompany): string {
  return `${company?.hoursDayStart ?? "[###]"}h-${
    company?.hoursDayEnd ?? "[###]"
  }h`;
}

export function getMarkedAnswer<T>(value?: T, expected?: T) {
  if (!!value === expected) return "X";
  return " ";
}

export function daysOfWeek(weekDays?: DocumentWasteWeekDays[]) {
  if (!weekDays) {
    return;
  }

  return weekDays
    .sort()
    .map((day) => DOCUMENT_WASTE_WEEKDAYS(day))
    .join(", ");
}

export function getMaskedUsername(username?: string) {
  if (!username) return undefined;

  return username?.length === 11 ? cpfMask(username) : cnpjMask(username);
}

export function getWorkSchedule(document: Partial<IDocument>) {
  const res = [];

  res.push([
    `${document.company?.weekDays
      .sort()
      .map((day) => DOCUMENT_WASTE_WEEKDAYS(day))
      .join(", ")}: ${document.company?.hoursDayStart ?? "-"}h - ${
      document.company?.hoursDayEnd ?? "-"
    }h`,
  ]);

  document.company?.othersWorkSchedule?.forEach((e) => {
    const hours = `${e?.weekDays
      .sort()
      .map((day) => DOCUMENT_WASTE_WEEKDAYS(day))
      .join(", ")}: ${e.hoursDayStart}h - ${e.hoursDayEnd}h`;

    res.push([hours]);
  });

  return res.join(" / \n");
}

export function getCollectionFrequency(
  collectionFrequency?: DocumentFrequency
) {
  if (
    collectionFrequency === DocumentFrequency.NONE ||
    collectionFrequency === undefined
  )
    return FIELD_EMPTY;

  return DOCUMENT_FREQUENCY(collectionFrequency);
}

export const groupKeyMap = {
  [DocumentHealthWasteClass.GROUP_A]: "groupA",
  [DocumentHealthWasteClass.GROUP_B]: "groupB",
  [DocumentHealthWasteClass.GROUP_C]: "groupC",
  [DocumentHealthWasteClass.GROUP_D_R]: "groupDR",
  [DocumentHealthWasteClass.GROUP_D_NR]: "groupDNR",
  [DocumentHealthWasteClass.GROUP_E]: "groupE",
} as const;

export function filterUnique<T>(arrayToFilter: T[], uniqueKey: keyof T): T[] {
  const seen: { [key: string]: boolean } = {};

  return arrayToFilter.filter((item) => {
    return seen.hasOwnProperty(String(item[uniqueKey]))
      ? false
      : (seen[String(item[uniqueKey])] = true);
  });
}

export function getLongDateFormat(dateSec?: number) {
  const date = dateSec ? new Date(dateSec * 1000) : new Date();

  return date.toLocaleString("pt-BR", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });
}
