import { TableCell, TDocumentDefinitions } from "pdfmake/interfaces";
import {
  DocumentCompanyPeoplesInvolved,
  DocumentHealthWasteClass,
  DocumentWasteCompanyLicense,
  DocumentWasteFrequency,
  DocumentWasteUnit,
  IDocumentWasteContainmentAccident,
} from "../../types/document/enum";
import {
  IDocumentApprovedGoals,
  IDocumentHealthWaste,
  IDocumentHealthWasteClassA,
  IDocumentHealthWasteClassE,
} from "../../types/document/interface";
import {
  DOCUMENT_HEALTH_WASTE_ORIGIN_POINT,
  DOCUMENT_HEALTH_WASTE_PACKING,
  DOCUMENT_WASTE_UNIT_LONG,
  DOCUMENT_APPROVED_GOAL_DECREASEELETRONICS,
  DOCUMENT_APPROVED_GOAL_DECREASEFOODWASTE,
  DOCUMENT_APPROVED_GOAL_DECREASEGASES,
  DOCUMENT_APPROVED_GOAL_DECREASENONRECYCLABLE,
  DOCUMENT_APPROVED_GOAL_IMPLEMENTCOMPOSTING,
  DOCUMENT_APPROVED_GOAL_IMPLEMENTENVIRONMENTALEDUCATION,
  DOCUMENT_APPROVED_GOAL_IMPLEMENTWATERREUSE,
  DOCUMENT_APPROVED_GOAL_INCREASERECYCLABLERATE,
  DOCUMENT_APPROVED_GOAL_REUSE,
  DOCUMENT_FREQUENCY,
  DOCUMENT_WASTE_COMPANY_LICENSE,
  DOCUMENT_WASTE_CONTAINMENT_ACCIDENT,
  DOCUMENT_WASTE_FREQUENCY,
  DOCUMENT_WASTE_TREATMENT,
  DOCUMENT_WASTE_WEEKDAYS,
  LOCALE,
} from "../../types/document/resource";
import { IRenderReq } from "../../types/template/interface";
import { FIELD_EMPTY, getMaskedUsername } from "../../types/template/utils";
import {
  cnpjMask,
  cpfMask,
  dateFormat,
  getCnaeId,
  Months,
  phoneMask,
  setUpAddress,
} from "../../utils";

const logo = "http://localhost:5173/foz-do-iguacu-pr.jpeg";

const groupKeyMap = Object.freeze({
  [DocumentHealthWasteClass.GROUP_A]: "groupA",
  [DocumentHealthWasteClass.GROUP_B]: "groupB",
  [DocumentHealthWasteClass.GROUP_C]: "groupC",
  [DocumentHealthWasteClass.GROUP_D_R]: "groupDR",
  [DocumentHealthWasteClass.GROUP_D_NR]: "groupDNr",
  [DocumentHealthWasteClass.GROUP_E]: "groupE",
});

type GroupKeyMapValue = (typeof groupKeyMap)[keyof typeof groupKeyMap];

export function render({
  document,
  classifications,
  cnaes,
  techinical,
}: IRenderReq) {
  const { company, responsibles, healthWastes } = document;

  const {
    groupA: groupANoType,
    groupB,
    groupDR,
    groupDNr,
    groupE: groupENoType,
  } = healthWastes?.reduce((acc, cur) => {
    const key = groupKeyMap[cur.group as DocumentHealthWasteClass];

    acc[key] = cur as IDocumentHealthWaste;

    return acc;
  }, {} as Record<GroupKeyMapValue, IDocumentHealthWaste>) ?? {};
  const groupA = groupANoType as IDocumentHealthWasteClassA | undefined;
  const groupE = groupENoType as IDocumentHealthWasteClassE | undefined;

  const timeline: TableCell[][] = [];

  function daysOfWeekAndHours() {
    const res = [];
    const days = (document.company?.weekDays ?? [])
      .sort()
      .map((day) => DOCUMENT_WASTE_WEEKDAYS(day))
      .join(", ");

    res.push(
      `${days} - ${document.company?.hoursDayStart}h-${document.company?.hoursDayEnd}h`
    );

    document.company?.othersWorkSchedule?.forEach((e) => {
      const othersDays = e.weekDays
        .sort()
        .map((day) => DOCUMENT_WASTE_WEEKDAYS(day))
        .join(", ");

      res.push(`${othersDays} - ${e.hoursDayStart}h-${e.hoursDayEnd}h`);
    });

    return res.join("/ \n\n");
  }

  function getCompaniesTransport(waste?: IDocumentHealthWaste): string {
    if (
      waste?.companyTransport === undefined ||
      waste?.companyTransport === DocumentWasteCompanyLicense.NONE
    )
      return FIELD_EMPTY;

    if (waste.companyTransport === DocumentWasteCompanyLicense.OUTSOURCED) {
      return (
        waste.companiesTransport?.map((company) => company.name).join(", ") ??
        ""
      );
    }

    return DOCUMENT_WASTE_COMPANY_LICENSE(waste.companyTransport);
  }

  function getCompaniesDestination(waste?: IDocumentHealthWaste): string {
    if (
      waste?.companyDestination === undefined ||
      waste?.companyDestination === DocumentWasteCompanyLicense.NONE
    )
      return FIELD_EMPTY;

    if (waste.companyDestination === DocumentWasteCompanyLicense.OUTSOURCED) {
      return (
        waste.companiesDestination?.map((company) => company.name).join(", ") ??
        ""
      );
    }

    return DOCUMENT_WASTE_COMPANY_LICENSE(waste.companyDestination!);
  }

  function getPeopleInvolved(value: DocumentCompanyPeoplesInvolved): string {
    const res = document.company?.peopleInvolved?.types?.includes(value);

    return res ? "X" : " ";
  }

  function getContainmentAccident(values: IDocumentWasteContainmentAccident[]) {
    const res =
      values?.map((e) => DOCUMENT_WASTE_CONTAINMENT_ACCIDENT(e)).join(", ") ??
      FIELD_EMPTY;

    return res;
  }

  function getGoals(): string {
    const goals = document.approved?.goals;
    if (!goals) {
      return "";
    }

    const res: string[] = [];

    const goalMappings: Record<keyof IDocumentApprovedGoals, string> = {
      decreaseEletronics: DOCUMENT_APPROVED_GOAL_DECREASEELETRONICS,
      decreaseFoodWaste: DOCUMENT_APPROVED_GOAL_DECREASEFOODWASTE,
      decreaseGases: DOCUMENT_APPROVED_GOAL_DECREASEGASES,
      decreaseNonRecyclable: DOCUMENT_APPROVED_GOAL_DECREASENONRECYCLABLE,
      implementComposting: DOCUMENT_APPROVED_GOAL_IMPLEMENTCOMPOSTING,
      implementEnvironmentalEducation:
        DOCUMENT_APPROVED_GOAL_IMPLEMENTENVIRONMENTALEDUCATION,
      implementWaterReuse: DOCUMENT_APPROVED_GOAL_IMPLEMENTWATERREUSE,
      increaseRecyclableRate: DOCUMENT_APPROVED_GOAL_INCREASERECYCLABLERATE,
      reuse: DOCUMENT_APPROVED_GOAL_REUSE,
    };

    for (const [goalKey, goalText] of Object.entries(goalMappings)) {
      const goal = goalKey as keyof IDocumentApprovedGoals;
      if (goals[goal]) {
        res.push(`- ${goalText.replace("{number}", String(goals[goal]))}`);
      }
    }

    return res.join("\n\n");
  }

  function setTimeline() {
    document.approved?.timeline?.forEach((e) => {
      const row = [
        {
          text: e.action,
          colSpan: 2,
          style: "field",
        },
        "",
        {
          text: dateFormat(e.inicialDate),
          colSpan: 2,
          style: "field",
          margin: [2, 2, 0, 0],
        },
        "",
      ];

      timeline.push(row);
    });
  }

  setTimeline();

  function getGroupQuantity(
    quantity?: number,
    unit?: DocumentWasteUnit,
    frequency?: DocumentWasteFrequency
  ) {
    if (
      unit === undefined ||
      frequency === undefined ||
      quantity === undefined
    ) {
      return FIELD_EMPTY;
    }

    return `${quantity.toLocaleString(LOCALE)} ${DOCUMENT_WASTE_UNIT_LONG(
      unit
    )} por ${DOCUMENT_WASTE_FREQUENCY(frequency)}`;
  }

  const template: TDocumentDefinitions = {
    pageSize: "A4",
    pageOrientation: "portrait",
    pageMargins: [50, 90, 50, 50],
    defaultStyle: { font: "Helvetica" },
    footer: function (currentPage: number, pageCount: number) {
      return {
        stack: [
          {
            text: "Pág." + currentPage + "/" + pageCount,
            width: 150,
            margin: [0, 0, 50, 25],
            fontSize: 10,
            alignment: "right",
          },
        ],
      };
    },
    content: [
      {
        stack: [
          {
            stack: [
              {
                table: {
                  widths: [15, "*", 150, 20],
                  headerRows: 2,
                  body: [
                    [
                      {
                        image: "logo",
                        width: 35,
                        margin: [20, 5, 0, 5],
                        colSpan: 1,
                        border: [true, true, false, true],
                      },
                      {
                        text: "Prefeitura Municipal de Foz do Iguaçu \n Estado do Paraná \n Secretaria Municipal de Meio Ambiente",
                        bold: true,
                        colSpan: 3,
                        alignment: "center",
                        border: [false, true, true, true],
                      },
                      "",
                      "",
                    ],
                    [
                      {
                        text: "PLANO DE GERENCIAMENTO DE RESÍDUOS SÓLIDOS",
                        alignment: "center",
                        bold: true,
                        colSpan: 4,
                      },
                    ],
                    [
                      {
                        text: `( ${
                          document.company?.renovation ? "X" : ""
                        } ) 1ª APRESENTAÇÃO DE PGRS ( ${
                          !document.company?.renovation ? "X" : ""
                        } ) ATUALIZAÇÃO`,
                        alignment: "center",
                        colSpan: 4,
                        margin: [0, 0, 0, 10],
                      },
                    ],
                    [
                      {
                        text: "1.",
                        colSpan: 1,
                        style: "title",
                        border: [true, true, false, true],
                      },
                      {
                        text: "IDENTIFICAÇÃO DO EMPREENDIMENTO",
                        colSpan: 3,
                        border: [false, true, true, true],
                        style: "title",
                      },
                    ],
                    [
                      {
                        text: `Razão social: ${
                          document.company?.name ?? FIELD_EMPTY
                        }`,
                        colSpan: 4,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: `Nome fantasia: ${
                          document.company?.businessName ?? FIELD_EMPTY
                        }`,
                        colSpan: 4,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: `CNAE principal e secundários (nº e descrição): ${
                          document.company?.cnaeId
                            ? getCnaeId(cnaes, document.company.cnaeId)
                            : FIELD_EMPTY
                        }`,
                        colSpan: 4,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: `Licença ambiental: ${
                          document.company?.license ?? FIELD_EMPTY
                        }`,
                        colSpan: 2,
                        style: "field",
                        margin: [0, 0, 0, 2],
                      },
                      "",
                      {
                        text: `Validade da licença: ${
                          dateFormat(document.company?.licenseExpirationDate) ??
                          FIELD_EMPTY
                        }`,
                        colSpan: 2,
                        style: "field",
                        margin: [0, 0, 0, 2],
                      },
                      "",
                    ],
                    [
                      {
                        text: `CNPJ/CPF: ${
                          document.company?.identifier
                            ? cnpjMask(document.company.identifier)
                            : FIELD_EMPTY
                        }`,
                        colSpan: 2,
                        style: "field",
                      },
                      "",
                      {
                        text: `Telefone: ${
                          document.company?.phone
                            ? phoneMask(document.company.phone)
                            : FIELD_EMPTY
                        }`,
                        colSpan: 2,
                        style: "field",
                      },
                      "",
                    ],
                    [
                      {
                        text: `Endereço: ${setUpAddress(
                          document.company?.address
                        )}`,
                        colSpan: 4,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: `Localização do empreendimento (imagem aérea): Em Anexos`,
                        colSpan: 4,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: `E-mail: ${
                          document.company?.email ?? FIELD_EMPTY
                        }`,
                        colSpan: 4,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: `Área total do estabelecimento (m²): ${
                          document.company?.totalArea?.toLocaleString(LOCALE) ??
                          FIELD_EMPTY
                        } \n Área construída (m²): ${
                          document.company?.builtArea?.toLocaleString(LOCALE) ??
                          FIELD_EMPTY
                        }`,
                        colSpan: 2,
                        style: "field",
                        margin: [0, 0, 0, 2],
                      },
                      "",
                      {
                        text: `Horários e dias de funcionamento:\n ${daysOfWeekAndHours()}`,
                        colSpan: 2,
                        style: "field",
                        margin: [0, 0, 0, 2],
                      },
                      "",
                    ],
                    [
                      {
                        text: `Número estimado de pessoas envolvidas na geração de resíduos: ${
                          document.company?.totalEmployeesCount !== undefined
                            ? document.company?.totalEmployeesCount
                            : FIELD_EMPTY
                        } \n (${getPeopleInvolved(
                          DocumentCompanyPeoplesInvolved.EMPLOYEES
                        )}) funcionários (${getPeopleInvolved(
                          DocumentCompanyPeoplesInvolved.CUSTOMERS
                        )}) clientes (${getPeopleInvolved(
                          DocumentCompanyPeoplesInvolved.STUDENTS
                        )}) estudantes (${getPeopleInvolved(
                          DocumentCompanyPeoplesInvolved.OTHERS
                        )}) outras pessoas de frequência ou permanência eventual`,
                        colSpan: 4,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "2.",
                        colSpan: 1,
                        style: "title",
                        border: [true, true, false, true],
                      },
                      {
                        text: "RESPONSÁVEL LEGAL PELO EMPREENDIMENTO",
                        colSpan: 3,
                        border: [false, true, true, true],
                        style: "title",
                      },
                    ],
                    [
                      {
                        text: `Nome: ${
                          document.responsibles?.legal?.name ?? FIELD_EMPTY
                        }`,
                        colSpan: 4,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: `CPF: ${
                          document.responsibles?.legal?.taxpayerNumber
                            ? cpfMask(
                                document.responsibles?.legal.taxpayerNumber
                              )
                            : FIELD_EMPTY
                        }`,
                        colSpan: 4,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: `Telefone: ${
                          document.responsibles?.legal?.phone
                            ? phoneMask(document.responsibles?.legal.phone)
                            : FIELD_EMPTY
                        }`,

                        colSpan: 4,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "3.",
                        colSpan: 1,
                        style: "title",
                        border: [true, true, false, true],
                      },
                      {
                        text: "IDENTIFICAÇÃO DO PROFISSIONAL TÉCNICO RESPONSÁVEL PELA ELABORAÇÃO DO PGRS",
                        colSpan: 3,
                        border: [false, true, true, true],
                        style: "title",
                      },
                    ],
                    [
                      {
                        text: `Responsável técnico pela elaboração do PGRS: ${
                          techinical?.name ?? FIELD_EMPTY
                        }`,
                        colSpan: 2,
                        style: "field",
                      },
                      "",
                      {
                        text: `CPF: ${
                          getMaskedUsername(techinical?.username) ?? FIELD_EMPTY
                        }`,
                        colSpan: 2,
                        style: "field",
                      },

                      "",
                    ],
                    [
                      {
                        text: `Profissão: ${
                          techinical?.position ?? FIELD_EMPTY
                        }`,
                        colSpan: 2,
                        style: "field",
                      },
                      "",
                      {
                        text: `Registro no Conselho de Classe: ${
                          techinical?.professionalClass?.institution ??
                          FIELD_EMPTY
                        } ${
                          techinical?.professionalClass?.identity ?? FIELD_EMPTY
                        }`,
                        colSpan: 2,
                        style: "field",
                      },

                      "",
                    ],
                    [
                      {
                        text: `Endereço: ${
                          techinical?.company
                            ? setUpAddress(techinical?.company?.address)
                            : "-"
                        }`,
                        colSpan: 2,
                        style: "field",
                      },
                      "",
                      {
                        text: `Telefone: ${
                          techinical?.phone ? phoneMask(techinical.phone) : "-"
                        }`,
                        colSpan: 2,
                        style: "field",
                      },
                      "",
                    ],
                    [
                      {
                        text: `Empresa de consultoria (razão social e nome fantasia): ${techinical?.company?.name}`,
                        colSpan: 2,
                        style: "field",
                      },
                      "",
                      {
                        text: `CNPJ: ${cnpjMask(
                          techinical?.company?.identity
                        )}`,
                        colSpan: 2,
                        style: "field",
                      },

                      "",
                    ],
                    [
                      {
                        text: `Telefone: ${
                          techinical?.phone ? phoneMask(techinical?.phone) : "-"
                        }`,
                        colSpan: 2,
                        style: "field",
                      },
                      "",
                      {
                        text: `E-mail: ${techinical?.company?.email}`,
                        colSpan: 2,
                        style: "field",
                      },

                      "",
                    ],
                    [
                      {
                        text: `Endereço: ${
                          techinical?.company
                            ? setUpAddress(techinical.company.address)
                            : "-"
                        }`,
                        colSpan: 4,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "4.",
                        colSpan: 1,
                        style: "title",
                        border: [true, true, false, true],
                      },
                      {
                        text: "IDENTIFICAÇÃO DO PROFISSIONAL TÉCNICO RESPONSÁVEL PELA IMPLEMENTAÇÃO DO PGRS",
                        colSpan: 3,
                        border: [false, true, true, true],
                        style: "title",
                      },
                    ],
                    [
                      {
                        text: `Responsável pela implementação do PGRS: ${
                          document.responsibles?.implementation?.name ??
                          FIELD_EMPTY
                        }`,
                        colSpan: 4,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: `Telefone: ${
                          document.responsibles?.implementation?.phone
                            ? phoneMask(
                                document.responsibles.implementation.phone
                              )
                            : FIELD_EMPTY
                        }`,
                        colSpan: 2,
                        style: "field",
                      },
                      "",
                      {
                        text: `E-mail: ${
                          document.responsibles?.implementation?.email ??
                          FIELD_EMPTY
                        }`,
                        colSpan: 2,
                        style: "field",
                      },

                      "",
                    ],
                    [
                      {
                        text: "5.",
                        colSpan: 1,
                        style: "title",
                        border: [true, true, false, true],
                      },
                      {
                        text: "OBJETIVO E JUSTIFICATIVA DO PLANO DE GERENCIAMENTO DE RESÍDUOS SÓLIDOS",
                        colSpan: 3,
                        border: [false, true, true, true],
                        style: "title",
                      },
                    ],
                    [
                      {
                        text:
                          document.approved?.goalsAndJustifications ??
                          FIELD_EMPTY,
                        colSpan: 4,
                        style: "field",
                        margin: [2.5, 5],
                      },
                    ],
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        stack: [
          {
            pageBreak: "before",
            stack: [
              {
                table: {
                  dontBreakRows: true,
                  widths: [100, "*"],
                  body: [
                    [
                      {
                        text: "Resíduos infectantes (Grupo A)",
                        colSpan: 2,
                        style: "title",
                        bold: true,
                      },
                      "",
                    ],
                    [
                      {
                        text: "",
                      },
                      {
                        text: `Resíduos`,
                        style: "headerTable",
                      },
                    ],
                    [
                      {
                        text: "Resíduos Gerado",
                        colSpan: 1,
                        style: "field",
                      },
                      { text: groupA?.names?.join(", ") ?? "", style: "field" },
                    ],
                    [
                      {
                        text: "Ponto de Geração",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text:
                          groupA?.originPoints
                            ?.map((item) =>
                              DOCUMENT_HEALTH_WASTE_ORIGIN_POINT(item)
                            )
                            .join(", ") ?? "",
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Quantidade",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: getGroupQuantity(
                          groupA?.quantity,
                          groupA?.unit,
                          groupA?.frequency
                        ),
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Acondicionamento interno",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: groupA?.packing
                          ? DOCUMENT_HEALTH_WASTE_PACKING(groupA?.packing)
                          : FIELD_EMPTY,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Acondicionamento externo",
                        colSpan: 1,
                        style: "field",
                      },
                      { text: "-", style: "field" },
                    ],
                    [
                      {
                        text: "Medidas de contenção em caso de acidente",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: "Não há – somente resíduos sólidos",
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Frequência de coleta",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: groupA?.collectionFrequency
                          ? DOCUMENT_FREQUENCY(groupA?.collectionFrequency)
                          : FIELD_EMPTY,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Destinação",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: groupA?.treatment
                          ? DOCUMENT_WASTE_TREATMENT(groupA?.treatment)
                          : FIELD_EMPTY,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Empresa responsável pelo transporte dos resíduos",
                        colSpan: 1,
                        style: "field",
                      },
                      { text: getCompaniesTransport(groupA), style: "field" },
                    ],
                    [
                      {
                        text: "Empresa responsável pelo destino  dos resíduos",
                        colSpan: 1,
                        style: "field",
                      },
                      { text: getCompaniesDestination(groupA), style: "field" },
                    ],
                    [
                      {
                        text: "Resíduos químicos (Grupo B)",
                        colSpan: 2,
                        style: "title",
                        bold: true,
                      },
                      "",
                    ],
                    [
                      {
                        text: "",
                      },
                      {
                        text: `Resíduos`,
                        style: "headerTable",
                      },
                    ],
                    [
                      {
                        text: "Resíduos Gerado",
                        colSpan: 1,
                        style: "field",
                      },
                      { text: groupB?.names?.join(", ") ?? "", style: "field" },
                    ],
                    [
                      {
                        text: "Ponto de Geração",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text:
                          groupB?.originPoints
                            ?.map((item) =>
                              DOCUMENT_HEALTH_WASTE_ORIGIN_POINT(item)
                            )
                            .join(", ") ?? "",
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Quantidade",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: getGroupQuantity(
                          groupB?.quantity,
                          groupB?.unit,
                          groupB?.frequency
                        ),
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Acondicionamento interno",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: groupB?.packing
                          ? DOCUMENT_HEALTH_WASTE_PACKING(groupB?.packing)
                          : FIELD_EMPTY,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Acondicionamento externo",
                        colSpan: 1,
                        style: "field",
                      },
                      { text: "-", style: "field" },
                    ],
                    [
                      {
                        text: "Medidas de contenção em caso de acidente",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: "Não há – somente resíduos sólidos",
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Frequência de coleta",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: groupB?.collectionFrequency
                          ? DOCUMENT_FREQUENCY(groupB?.collectionFrequency)
                          : FIELD_EMPTY,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Destinação",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: groupB?.treatment
                          ? DOCUMENT_WASTE_TREATMENT(groupB?.treatment)
                          : FIELD_EMPTY,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Empresa responsável pelo transporte dos resíduos",
                        colSpan: 1,
                        style: "field",
                      },
                      { text: getCompaniesTransport(groupB), style: "field" },
                    ],
                    [
                      {
                        text: "Empresa responsável pelo destino  dos resíduos",
                        colSpan: 1,
                        style: "field",
                      },
                      { text: getCompaniesDestination(groupB), style: "field" },
                    ],
                    [
                      {
                        text: "Resíduos comuns não recicláveis (Grupo D)",
                        colSpan: 2,
                        style: "title",
                        bold: true,
                      },
                      "",
                    ],
                    [
                      {
                        text: "",
                      },
                      {
                        text: `Resíduos`,
                        style: "headerTable",
                      },
                    ],
                    [
                      {
                        text: "Resíduos Gerado",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: groupDNr?.names?.join(", ") ?? "",
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Ponto de Geração",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text:
                          groupDNr?.originPoints
                            ?.map((item) =>
                              DOCUMENT_HEALTH_WASTE_ORIGIN_POINT(item)
                            )
                            .join(", ") ?? "",
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Quantidade",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: getGroupQuantity(
                          groupDNr?.quantity,
                          groupDNr?.unit,
                          groupDNr?.frequency
                        ),
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Acondicionamento interno",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: groupDNr?.packing
                          ? DOCUMENT_HEALTH_WASTE_PACKING(groupDNr?.packing)
                          : "-",
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Acondicionamento externo",
                        colSpan: 1,
                        style: "field",
                      },
                      { text: "-", style: "field" },
                    ],
                    [
                      {
                        text: "Medidas de contenção em caso de acidente",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: "Não há – somente resíduos sólidos",
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Frequência de coleta",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: groupDNr?.collectionFrequency
                          ? DOCUMENT_FREQUENCY(groupDNr?.collectionFrequency)
                          : FIELD_EMPTY,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Destinação",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: groupDNr?.treatment
                          ? DOCUMENT_WASTE_TREATMENT(groupDNr?.treatment)
                          : FIELD_EMPTY,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Empresa responsável pelo transporte dos resíduos",
                        colSpan: 1,
                        style: "field",
                      },
                      { text: getCompaniesTransport(groupDNr), style: "field" },
                    ],
                    [
                      {
                        text: "Empresa responsável pelo destino  dos resíduos",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: getCompaniesDestination(groupDNr),
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Resíduos comuns recicláveis (Grupo D)",
                        colSpan: 2,
                        style: "title",
                        bold: true,
                      },
                      "",
                    ],
                    [
                      {
                        text: "",
                      },
                      {
                        text: `Resíduos`,
                        style: "headerTable",
                      },
                    ],
                    [
                      {
                        text: "Resíduos Gerado",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: groupDR?.names?.join(", ") ?? "",
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Ponto de Geração",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text:
                          groupDR?.originPoints
                            ?.map((item) =>
                              DOCUMENT_HEALTH_WASTE_ORIGIN_POINT(item)
                            )
                            .join(", ") ?? "",
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Quantidade",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: getGroupQuantity(
                          groupDR?.quantity,
                          groupDR?.unit,
                          groupDR?.frequency
                        ),
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Acondicionamento interno",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: groupDR?.packing
                          ? DOCUMENT_HEALTH_WASTE_PACKING(groupDR?.packing)
                          : "-",
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Acondicionamento externo",
                        colSpan: 1,
                        style: "field",
                      },
                      { text: "-", style: "field" },
                    ],
                    [
                      {
                        text: "Medidas de contenção em caso de acidente",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: "Não há – somente resíduos sólidos",
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Frequência de coleta",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: groupDR?.collectionFrequency
                          ? DOCUMENT_FREQUENCY(groupDR?.collectionFrequency)
                          : FIELD_EMPTY,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Destinação",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: groupDR?.treatment
                          ? DOCUMENT_WASTE_TREATMENT(groupDR?.treatment)
                          : FIELD_EMPTY,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Empresa responsável pelo transporte dos resíduos",
                        colSpan: 1,
                        style: "field",
                      },
                      { text: getCompaniesTransport(groupDR), style: "field" },
                    ],
                    [
                      {
                        text: "Empresa responsável pelo destino  dos resíduos",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: getCompaniesDestination(groupDR),
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Resíduos perfurocortantes (Grupo E)",
                        colSpan: 2,
                        style: "title",
                        bold: true,
                      },
                      "",
                    ],
                    [
                      {
                        text: "",
                      },
                      {
                        text: `Resíduos`,
                        style: "headerTable",
                      },
                    ],
                    [
                      {
                        text: "Resíduos Gerado",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: groupE?.names?.join(", ") ?? "",
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Ponto de Geração",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text:
                          groupE?.originPoints
                            ?.map((item) =>
                              DOCUMENT_HEALTH_WASTE_ORIGIN_POINT(item)
                            )
                            .join(", ") ?? "",
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Quantidade",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: getGroupQuantity(
                          groupE?.quantity,
                          groupE?.unit,
                          groupE?.frequency
                        ),
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Acondicionamento interno",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: groupE?.packing
                          ? DOCUMENT_HEALTH_WASTE_PACKING(groupE?.packing)
                          : "-",
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Acondicionamento externo",
                        colSpan: 1,
                        style: "field",
                      },
                      { text: "-", style: "field" },
                    ],
                    [
                      {
                        text: "Medidas de contenção em caso de acidente",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: "Não há – somente resíduos sólidos",
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Frequência de coleta",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: groupE?.collectionFrequency
                          ? DOCUMENT_FREQUENCY(groupE?.collectionFrequency)
                          : FIELD_EMPTY,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Destinação",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: groupE?.treatment
                          ? DOCUMENT_WASTE_TREATMENT(groupE?.treatment)
                          : FIELD_EMPTY,
                        style: "field",
                      },
                    ],
                    [
                      {
                        text: "Empresa responsável pelo transporte dos resíduos",
                        colSpan: 1,
                        style: "field",
                      },
                      { text: getCompaniesTransport(groupE), style: "field" },
                    ],
                    [
                      {
                        text: "Empresa responsável pelo destino  dos resíduos",
                        colSpan: 1,
                        style: "field",
                      },
                      {
                        text: getCompaniesDestination(groupE),
                        style: "field",
                      },
                    ],
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        stack: [
          {
            stack: [
              {
                table: {
                  widths: [20, "*", 150, 20],
                  body: [
                    [
                      {
                        text: "7.",
                        colSpan: 1,
                        style: "title",
                        border: [true, true, false, true],
                      },
                      {
                        text: "METAS E PROCEDIMENTOS VISANDO A NÃO GERAÇÃO, A REDUÇÃO, A REUTILIZAÇÃO E A RECICLAGEM DOS RESÍDUOS",
                        colSpan: 3,
                        border: [false, true, true, true],
                        style: "title",
                      },
                      "",
                      "",
                    ],
                    [
                      {
                        text: getGoals() ?? FIELD_EMPTY,
                        colSpan: 4,
                        style: "field",
                        margin: [2.5, 5],
                      },
                      "",
                      "",
                      "",
                    ],
                    [
                      {
                        text: "8.",
                        colSpan: 1,
                        style: "title",
                        border: [true, true, false, true],
                      },
                      {
                        text: "CRONOGRAMA DE IMPLANTAÇÃO OU READEQUAÇÃO DO PGRS NO EMPREENDIMENTO",
                        colSpan: 3,
                        border: [false, true, true, true],
                        style: "title",
                      },
                      "",
                      "",
                    ],
                    [
                      {
                        text: "Ação",
                        colSpan: 2,
                        style: "headerTable",
                      },
                      "",
                      {
                        text: "Mês/ano",
                        colSpan: 2,
                        style: "headerTable",
                      },
                      "",
                    ],
                    ...timeline,
                    [
                      {
                        text: "9.",
                        colSpan: 1,
                        style: "title",
                        border: [true, true, false, true],
                      },
                      {
                        text: "CAPACITAÇÃO E SENSIBILIZAÇÃO DOS COLABORADORES ACERCA DAS AÇÕES REFERENTES AO PGRS",
                        colSpan: 3,
                        border: [false, true, true, true],
                        style: "title",
                      },
                      "",
                      "",
                    ],
                    [
                      {
                        text:
                          document.approved?.employeeAwareness ?? FIELD_EMPTY,
                        colSpan: 4,
                        style: "field",
                        margin: [2.5, 5],
                      },
                      "",
                      "",
                      "",
                    ],
                    [
                      {
                        text: "10.",
                        colSpan: 1,
                        style: "title",
                        border: [true, true, false, true],
                      },
                      {
                        text: "OBSERVAÇÕES",
                        colSpan: 3,
                        border: [false, true, true, true],
                        style: "title",
                      },
                      "",
                      "",
                    ],
                    [
                      {
                        text: document.approved?.observation ?? FIELD_EMPTY,
                        colSpan: 4,
                        style: "field",
                        margin: [2.5, 5],
                      },
                      "",
                      "",
                      "",
                    ],
                    [
                      {
                        text: "11.",
                        colSpan: 1,
                        style: "title",
                        border: [true, true, false, true],
                      },
                      {
                        text: "LEGISLAÇÃO UTILIZADA",
                        colSpan: 3,
                        border: [false, true, true, true],
                        style: "title",
                      },
                      "",
                      "",
                    ],
                    [
                      {
                        text: [
                          "Lei Complementar Municipal n° 342/2020; Decreto Municipal nº32.677/2024;",
                          "\nLeis Estaduais nº 12.493/1999 e nº 15.862/2008; Decreto Estadual nº 6674/2002 e Portaria IAP 224/2007; ",
                          "\nLeis Federais nº 9.605/2008 e nº12.305/2010, Resoluções do CONAMA 05/1993, 258/1999, 263/1999, 275/2001, 301/2002, 313/2002, 316/2002, 362/2005 e 401/2008; ",
                          "\nNormas da ABNT NBR 7500, 9191, 9800, 10004, 10005, 10006, 10007, 10703, 11174, 12235 e 13221.",
                        ],
                        colSpan: 4,
                        style: "field",
                        margin: [2.5, 5],
                      },
                      "",
                      "",
                      "",
                    ],
                  ],
                },
              },
              {
                pageBreak: "before",
                table: {
                  widths: ["*", "*"],
                  body: [
                    [
                      {
                        text: `FOZ DO IGUAÇU, ${new Date().getDate()} DE ${Months[
                          new Date().getMonth()
                        ].toUpperCase()} DE ${new Date().getFullYear()}.`,
                        colSpan: 2,
                        style: "field",
                        alignment: "right",
                        margin: [5, 5],
                        border: [true, true, true, false],
                      },
                      "",
                    ],
                    [
                      {
                        text: "O responsável técnico declara, sob as penas da lei, que as informações prestadas são verdadeiras e que o responsável legal pelo empreendimento está ciente acerca das mesmas em sua íntegra.",
                        colSpan: 2,
                        style: "field",
                        margin: [5, 5],
                        lineHeight: 1.4,
                        border: [true, false, true, false],
                      },
                      "",
                    ],
                    [
                      {
                        text: "_________________________________ \n RESPONSÁVEL LEGAL",
                        style: "field",
                        margin: [5, 20],
                        lineHeight: 1.4,
                        border: [true, false, false, true],

                        alignment: "center",
                      },

                      {
                        text: "_________________________________ \n RESPONSÁVEL TÉCNICO PELA ELABORAÇÃO DO PGRS",
                        style: "field",
                        margin: [5, 20],
                        lineHeight: 1.4,
                        alignment: "center",
                        border: [false, false, true, true],
                      },
                    ],
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
    images: {
      logo,
    },
    styles: {
      field: {
        bold: false,
        alignment: "justify",
        fontSize: 10,
        margin: [0, 2, 0, 2],
      },
      title: {
        bold: true,
        alignment: "justify",
        fontSize: 11,
        characterSpacing: 0,
        margin: [0, 2, 0, 2],
      },
      headerTable: {
        bold: true,
        alignment: "justify",
        fontSize: 10,
        characterSpacing: 0,
        margin: [0, 2, 0, 2],
      },
    },
  };

  return template;
}
