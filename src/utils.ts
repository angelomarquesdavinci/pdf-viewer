// import { IAddress, ICnae } from "../document/interface";
// import { IWasteClassification } from "../waste-classification/interface";

import { DOCUMENT_WASTE_WEEKDAYS } from "./resource";
import {
  ICnae,
  IAddress,
  DocumentWasteWeekDays,
  IDocumentCompany,
} from "./types/document/interface";
import { IWasteClassification } from "./types/waste-classification/interface";

export function getCnaeId(cnaes: ICnae[], id: string): string {
  const res = cnaes.find((cnae) => cnae.id === id);

  return res ? `${res.id} - ${res.desc}` : "";
}

export function setUpAddress(address?: IAddress) {
  if (!address) {
    return "-";
  }

  return `${address.street}, ${address.number} - ${address.neighborhood}, ${
    address.city
  } - ${address.state}, ${address.zip}${
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

export const TECNICAL = {
  // TODO: Atualmente o preenchimento do técnico fixo
  name: "PEDRO AMERICO DUARTE",
  class: "CRQ IX 09202481",
  taxpayerNumber: "061.096.419-44",
  phone: "(41) 3011-4500",
  position: "Químico Ambiental",
  company: {
    name: "DAVINCI CONSULTORIA E PROJETOS AMBIENTAIS LTDA",
    tradeName: "DAVINCI AMBIENTAL",
    identity: "19824514000190",
    email: "pedro@davinciambiental.com.br",
    address: {
      zip: "80420010",
      street: "Vicente Machado",
      city: "Curitiba",
      state: "PR",
      number: 467,
      neighborhood: "Centro",
      complement: "cj 102",
    },
  },
};

export function dateFormat(date?: number): string | undefined {
  if (!date) {
    return;
  }

  const data = new Date(date * 1000),
    day = data.getDate().toString().padStart(2, "0"),
    month = (data.getMonth() + 1).toString().padStart(2, "0"),
    year = data.getFullYear();

  return !isNaN(date) ? `${day}/${month}/${year}` : undefined;
}

export function cnpjMask(cnpj: string | undefined): string {
  if (!cnpj) {
    return "";
  }

  cnpj = cnpj.replace(/\D/g, "");
  cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2");
  cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  cnpj = cnpj.replace(/\.(\d{3})(\d)/, ".$1/$2");
  cnpj = cnpj.replace(/(\d{4})(\d)/, "$1-$2");
  return cnpj;
}

export function cpfMask(cpf: string): string {
  cpf = cpf.replace(/\D/g, "");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return cpf;
}

export function rgMask(rg: string): string {
  rg = rg.replace(/\D/g, "");
  rg = rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})$/, "$1.$2.$3-$4");
  return rg;
}

export const phoneMask = (phone: string) => {
  phone = phone.replace(/\D/g, "");
  phone = phone.replace(/(\d{2})(\d)/, "($1) $2");
  phone = phone.replace(/(\d)(\d{4})$/, "$1-$2");
  return phone;
};

export const zipMask = (zip: string) => {
  zip = zip.replace(/\D/g, "");
  zip = zip.replace(/(\d{5})(\d)/, "$1-$2");
  return zip;
};

export const takeOffZipMask = (zip: string) => {
  zip = zip.replace("-", "");
  return zip;
};

export const takeOffPhoneMask = (phone: string) => {
  phone = phone
    .replace("(", "")
    .replace(")", "")
    .replace(" ", "")
    .replace("/", "")
    .replace(".", "")
    .replace(".", "")
    .replace("-", "");
  return phone;
};

export function takeOffCnpjMask(cnpj: string): string {
  cnpj = cnpj
    .replace("/", "")
    .replace(".", "")
    .replace(".", "")
    .replace("-", "");
  return cnpj;
}

export function takeOffRgMask(rg: string): string {
  rg = rg.replace("/", "").replace(".", "").replace(".", "").replace("-", "");
  return rg;
}

export function takeOffCpfMask(cpf: string): string {
  cpf = cpf.replace("/", "").replace(".", "").replace(".", "").replace("-", "");
  return cpf;
}

export const Months: { [key: number]: string } = {
  0: "Janeiro",
  1: "Fevereiro",
  2: "Março",
  3: "Abril",
  4: "Maio",
  5: "Junho",
  6: "Julho",
  7: "Agosto",
  8: "Setembro",
  9: "Outubro",
  10: "Novembro",
  11: "Dezembro",
};

export function getDateSec(value?: number): number {
  const date = Math.ceil(value ? value : Date.now() / 1000);
  return date;
}

export function removeAccents(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
  if (value === expected) return "X";
  return " ";
}
