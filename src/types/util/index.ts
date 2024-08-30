import { DocumentTemplateType } from "../documentTemplate/interface";

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

export function cnpjMask(cnpj?: string): string | undefined {
  if (!cnpj) {
    return undefined;
  }

  cnpj = cnpj.replace(/\D/g, "");
  cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2");
  cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  cnpj = cnpj.replace(/\.(\d{3})(\d)/, ".$1/$2");
  cnpj = cnpj.replace(/(\d{4})(\d)/, "$1-$2");
  return cnpj;
}

export function cpfMask(cpf?: string): string | undefined {
  if (!cpf) {
    return undefined;
  }

  cpf = cpf.replace(/\D/g, "");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return cpf;
}

export function rgMask(rg?: string) {
  if (!rg) {
    return undefined;
  }

  rg = rg.replace(/\D/g, "");
  rg = rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})$/, "$1.$2.$3-$4");
  return rg;
}

export const phoneMask = (phone?: string): string | undefined => {
  if (!phone) {
    return undefined;
  }

  phone = phone.replace(/\D/g, "");
  phone = phone.replace(/(\d{2})(\d)/, "($1) $2");
  phone = phone.replace(/(\d)(\d{4})$/, "$1-$2");
  return phone;
};

export const zipMask = (zip?: string): string | undefined => {
  if (!zip) {
    return undefined;
  }

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

export function createNestedObject(path: string, value: any) {
  const pathKeys = path.split(".").reverse();

  let result = {};

  pathKeys.forEach((key, index) => {
    if (index === 0) {
      result = { [key]: value };
      return;
    }

    result = { [key]: result };
  });

  return result;
}

interface IPathToAttributesData {
  nameAttributes: { [key: string]: string };
  referencePath: string;
}

export function pathsToAttributes(pathKeys: string[]): IPathToAttributesData {
  return pathKeys.reduce(
    (acc, key, index) => {
      const attributeKey = `#F${key}`;

      const nameAttributes = {
        [attributeKey]: key,
        ...acc.nameAttributes,
      };

      let referencePath = acc.referencePath + attributeKey;

      if (index !== pathKeys.length - 1) {
        referencePath += ".";
      }

      return { nameAttributes, referencePath };
    },
    { nameAttributes: {}, referencePath: "" } as IPathToAttributesData
  );
}

export function getSignFormattedDate() {
  const date = new Date();

  const formattedDate = `${date.getFullYear()}.${String(
    date.getMonth() + 1
  ).padStart(2, "0")}.${String(date.getDate() + 1).padStart(2, "0")}`;

  const formattedTime = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const offset = -date.getTimezoneOffset() / 60;
  const formattedOffset = `${offset >= 0 ? "+" : "-"}${Math.abs(offset)
    .toString()
    .padStart(2, "0")}'00'`;

  return `${formattedDate} ${formattedTime} ${formattedOffset}`;
}

export function validCpf(cpf: string): boolean {
  const invalidCpfs = [
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999",
  ];

  if (!cpf || cpf.length !== 11 || invalidCpfs.includes(cpf)) {
    return false;
  }

  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}

export function validCnpj(cnpj: string): boolean {
  const invalidCnpjs = [
    "00000000000000",
    "11111111111111",
    "22222222222222",
    "33333333333333",
    "44444444444444",
    "55555555555555",
    "66666666666666",
    "77777777777777",
    "88888888888888",
    "99999999999999",
  ];

  if (!cnpj || cnpj.length !== 14 || invalidCnpjs.includes(cnpj)) {
    return false;
  }

  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;
  return true;
}

function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getDefaultDateFormat(date: Date) {
  const res = `${date.toLocaleString("pt-BR", {
    month: "long",
  })}/${date.getFullYear()}`;

  return capitalizeFirstLetter(res);
}

export function getTypeTemplate(templateRef: string) {
  // caso tenha o ref e não tenha o @ por default é pgrs
  if (!templateRef.includes("@")) {
    return DocumentTemplateType.PGRS;
  }

  const modelType = templateRef.split("@")[1];
  switch (modelType) {
    case "pgrss":
      return DocumentTemplateType.PGRSS;
    default:
      return DocumentTemplateType.PGRS;
  }
}

export function getFullDateFormat(date: Date) {
  const res = `${date.getDate()} de ${date.toLocaleString("pt-BR", {
    month: "long",
  })} de ${date.getFullYear()}`;

  return capitalizeFirstLetter(res);
}
