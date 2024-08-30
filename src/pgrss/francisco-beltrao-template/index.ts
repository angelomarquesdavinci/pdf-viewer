import { TableLayout, TDocumentDefinitions } from "pdfmake/interfaces";
import { FIELD_EMPTY } from "../../default-template";
import {
  DOCUMENT_FREQUENCY,
  DOCUMENT_WASTE_COMPANY_LICENSE,
  DOCUMENT_WASTE_FREQUENCY,
  DOCUMENT_WASTE_TREATMENT,
  DOCUMENT_WASTE_UNIT,
  LOCALE,
} from "../../resource";
import { getFullDateFormat } from "../../service/util";
import {
  DocumentHealthWasteClass,
  DocumentWasteCompanyLicense,
  IDocumentHealthWasteBase,
  IDocumentHealthWasteClassA,
  IDocumentHealthWasteClassE,
  IRenderReq,
} from "../../types/document/interface";
import {
  cnpjMask,
  cpfMask,
  dateFormat,
  getClassificationId,
  getCnaeId,
  getCnaeIdList,
  getWorkHours,
  phoneMask,
  rgMask,
  zipMask,
} from "../../utils";

// const FIELD_EMPTY = "-";

// const logo = "http://localhost:5173/francisco-beltrao-pr.jpg";

// const borderOptions = {
//   noBottom: [true, true, true, false],
//   noTop: [true, false, true, true],
//   horizontalOnly: [true, false, true, false],
//   leftBottomOnly: [true, false, false, true],
//   noBorder: [false, false, false, false],
//   noRight: [true, true, false, true],
//   noLeft: [false, true, true, true],
// };

const thinBorderLayout: TableLayout = {
  hLineWidth: function () {
    return 0.1;
  },
  vLineWidth: function () {
    return 0.1;
  },
};

console.log("document", document);

const groupKeyMap = Object.freeze({
  [DocumentHealthWasteClass.GROUP_A]: "groupA",
  [DocumentHealthWasteClass.GROUP_B]: "groupB",
  [DocumentHealthWasteClass.GROUP_C]: "groupC",
  [DocumentHealthWasteClass.GROUP_D_R]: "groupDR",
  [DocumentHealthWasteClass.GROUP_D_NR]: "groupDNr",
  [DocumentHealthWasteClass.GROUP_E]: "groupE",
});

type GroupKeyMapValue = (typeof groupKeyMap)[keyof typeof groupKeyMap];

export function render({ classifications, cnaes, document }: IRenderReq) {
  const { company, responsibles, healthWastes } = document;

  const {
    groupA: groupANoType,
    groupB,
    groupDR,
    groupDNr,
    groupE: groupENoType,
  } = healthWastes?.reduce((acc, cur) => {
    const key = groupKeyMap[cur.group as DocumentHealthWasteClass];

    acc[key] = cur as IDocumentHealthWasteBase;

    return acc;
  }, {} as Record<GroupKeyMapValue, IDocumentHealthWasteBase>) ?? {};
  const groupA = groupANoType as IDocumentHealthWasteClassA;
  const groupE = groupENoType as IDocumentHealthWasteClassE;
  const concatenatedGroupDIds = [
    ...(groupDR?.classificationIds ?? []),
    ...(groupDNr?.classificationIds ?? []),
  ];

  function getCompaniesTransport(waste: IDocumentHealthWasteBase): string {
    if (
      waste.companyTransport === undefined ||
      waste.companyTransport === DocumentWasteCompanyLicense.NONE
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

  function getCompaniesDestination(waste: IDocumentHealthWasteBase): string {
    if (
      waste.companyDestination === undefined ||
      waste.companyDestination === DocumentWasteCompanyLicense.NONE
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

  function getOthersGroupDClassificationIds() {
    const excludeIds = [
      "20 01 99",
      "20 01 08",
      "20 03 01",
      "20 02 01",
      "20 03 99",
    ];

    const filteredIds = concatenatedGroupDIds.filter(
      (e) => !excludeIds.includes(e)
    );

    console.log("othersGroupDClassificationIds", filteredIds);
    const res = filteredIds.map((e) => getClassificationId(classifications, e));

    return res.length > 0 ? `${res.join("\n")} ` : FIELD_EMPTY;
  }

  const template: TDocumentDefinitions = {
    pageSize: "A4",
    pageOrientation: "portrait",
    pageMargins: [70, 50, 70, 60],
    defaultStyle: { font: "Arial", fontSize: 11 },
    footer: function (currentPage, pageCount) {
      return {
        columns: [
          "",
          {
            text: [
              "Página ",
              { text: currentPage - 1, bold: true },
              " de ",
              { text: pageCount - 1, bold: true },
            ],
            width: "auto",
            margin: [0, 0, 50, 0],
            fontSize: 10,
            alignment: "right",
          },
        ],
      };
    },
    content: [
      {
        fontSize: 11,
        stack: [
          {
            alignment: "center",
            stack: [
              {
                text: "PLANO SIMPLIFICADO DE GERENCIAMENTO DE RESÍDUOS DE SERVIÇOS DA SAÚDE PARA MÍNIMOS GERADORES",
                bold: true,
                margin: [0, 200, 0, 0],
              },
              {
                text: [
                  "Em conformidade com a ",
                  {
                    text: "Resolução Conjunta n.º 002/2005 - SEMA/SESA, de 31 de maio de 2005 - ANEXO I",
                    italics: true,
                  },
                ],
                italics: true,
                margin: [0, 10, 0, 0],
              },
              {
                layout: thinBorderLayout,
                margin: [115, 50],
                table: {
                  widths: ["*"],
                  body: [
                    [
                      {
                        stack: [
                          {
                            text: [
                              {
                                text: "Nome do Empreendimento: ",
                                bold: true,
                              },
                              company?.name,
                            ],
                          },
                          {
                            text: [
                              { text: "CNPJ: ", bold: true },
                              cnpjMask(company?.identifier),
                            ],
                          },
                          {
                            text: [
                              { text: "Endereço: ", bold: true },
                              `${company?.address.street}, ${company?.address.number}` +
                                (company?.address.complement
                                  ? `- ${company?.address.complement}`
                                  : ""),
                            ],
                          },
                          {
                            text: [
                              { text: "Bairro: ", bold: true },
                              company?.address?.neighborhood,
                            ],
                          },
                          {
                            text: [
                              { text: "Cidade: ", bold: true },
                              `${company?.address?.city} - ${company?.address?.state}`,
                            ],
                          },
                          {
                            text: [
                              { text: "Fone / Fax: ", bold: true },
                              company?.landline
                                ? phoneMask(company?.landline)
                                : FIELD_EMPTY,
                            ],
                          },
                          {
                            text: [
                              {
                                text: "Nome do Responsável Técnico: ",
                                bold: true,
                              },
                              responsibles?.techinical?.name,
                            ],
                          },
                          {
                            text: [
                              {
                                text: "Telefone do Responsável Técnico: ",
                                bold: true,
                              },
                              responsibles?.techinical?.phone
                                ? phoneMask(responsibles?.techinical?.phone)
                                : FIELD_EMPTY,
                            ],
                          },
                        ],
                        alignment: "left",
                      },
                    ],
                  ],
                },
              },
            ],
          },
          {
            pageBreak: "before",
            stack: [
              {
                text: "PLANO SIMPLIFICADO DE GERENCIAMENTO DE RESÍDUOS DE SERVIÇOS DA SAÚDE PARA MÍNIMOS GERADORES",
                style: ["font-bold", "text-center"],
              },
              {
                text: "CONFORME RESOLUÇÃO CONJUNTA N.º 002/2005 - SEMA/SESA, DE 31 DE MAIO DE 2005 - ANEXO I",
                margin: [0, 15, 0, 0],
                style: ["font-bold", "text-center"],
              },
              {
                text: "Até 30 Litros/semana",
                style: ["font-bold", "text-red", "text-center"],
                margin: [0, 15, 0, 0],
              },
            ],
          },
          {
            stack: [
              {
                text: "1. IDENTIFICAÇÃO DO GERADOR",
                style: ["font-bold"],
                margin: [0, 15, 0, 0],
              },
              {
                margin: [15, 0, 0, 0],
                lineHeight: 1.2,
                stack: [
                  {
                    text: [
                      { text: "Razão Social: ", bold: true },
                      company?.name ?? FIELD_EMPTY,
                    ],
                  },
                  {
                    text: [
                      { text: "Nome Fantasia: ", bold: true },
                      company?.businessName ?? FIELD_EMPTY,
                    ],
                  },
                  {
                    text: [
                      { text: "CNPJ: ", bold: true },
                      company?.identifier
                        ? cnpjMask(company?.identifier)
                        : FIELD_EMPTY,
                    ],
                  },
                  {
                    text: [
                      { text: "Endereço: ", bold: true },
                      `${company?.address.street}, ${company?.address.number}` +
                        (company?.address.complement
                          ? `- ${company?.address.complement}`
                          : ""),
                    ],
                  },
                  {
                    text: [
                      { text: "Bairro: ", bold: true },
                      company?.address?.neighborhood ?? FIELD_EMPTY,
                    ],
                  },
                  {
                    text: [
                      { text: "Cidade: ", bold: true },
                      `${company?.address?.city} - ${company?.address?.state}`,
                    ],
                  },
                  {
                    text: [
                      { text: "Fone / Fax: ", bold: true },
                      company?.landline
                        ? phoneMask(company?.landline)
                        : FIELD_EMPTY,
                    ],
                  },
                  {
                    text: [
                      { text: "Email: ", bold: true },
                      company?.email ?? FIELD_EMPTY,
                    ],
                  },
                  {
                    layout: "noBorders",
                    margin: [0, -2, 0, 0],
                    table: {
                      widths: ["*", "*"],
                      body: [
                        [
                          {
                            text: [
                              { text: "Área Construída (m²): ", bold: true },
                              company?.builtArea
                                ? company?.builtArea.toLocaleString(LOCALE)
                                : FIELD_EMPTY,
                            ],
                          },
                          {
                            text: [
                              {
                                text: "Área Total do Terreno (m²): ",
                                style: ["font-bold"],
                              },
                              company?.totalArea
                                ? company?.totalArea.toLocaleString(LOCALE)
                                : FIELD_EMPTY,
                            ],
                          },
                        ],
                      ],
                    },
                  },
                ],
              },
              {
                margin: [0, 15, 0, 0],
                lineHeight: 1.2,
                stack: [
                  {
                    text: [
                      {
                        text: "Especialidades/Atividades desenvolvidas: ",
                        style: ["font-bold"],
                      },
                      `${
                        company?.cnaeId
                          ? getCnaeId(cnaes, company?.cnaeId)
                          : FIELD_EMPTY
                      }` +
                        (company?.cnaeIds?.length
                          ? `, ${getCnaeIdList(cnaes, company?.cnaeIds)}`
                          : ""),
                    ],
                  },
                  {
                    text: [
                      {
                        text: "Data de início de funcionamento: ",
                        style: ["font-bold"],
                      },
                      company?.foundingDate
                        ? dateFormat(company?.foundingDate) ?? FIELD_EMPTY
                        : FIELD_EMPTY,
                    ],
                  },
                  {
                    text: [
                      {
                        text: "Horário de funcionamento: ",
                        style: ["font-bold"],
                      },
                      company?.hoursDayStart || company?.hoursDayEnd
                        ? getWorkHours(company)
                        : FIELD_EMPTY,
                    ],
                  },
                  {
                    text: [
                      {
                        text: "Número de pacientes atendidos por dia: ",
                        style: ["font-bold"],
                      },
                      company?.healthAppointmentsByDay ?? FIELD_EMPTY,
                    ],
                  },
                  {
                    text: [
                      {
                        text: "Número de funcionários: ",
                        style: ["font-bold"],
                      },
                      company?.totalEmployeesCount ?? FIELD_EMPTY,
                    ],
                  },
                ],
              },
              {
                margin: [0, 15, 0, 0],
                text: "Responsável pelo Estabelecimento: ",
                style: ["font-bold"],
              },
              {
                lineHeight: 1.2,
                layout: "noBorders",
                margin: [15, 0, 0, 0],
                table: {
                  widths: ["*", "*"],
                  body: [
                    [
                      {
                        text: [
                          { text: "Nome: ", style: ["font-bold"] },
                          responsibles?.legal?.name,
                        ],
                        colSpan: 2,
                      },
                      "",
                    ],
                    [
                      {
                        text: [
                          { text: "RG: ", style: ["font-bold"] },
                          responsibles?.legal?.identityNumber
                            ? rgMask(responsibles?.legal?.identityNumber)
                            : FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                        colSpan: 2,
                      },
                      "",
                    ],
                    [
                      {
                        text: [
                          { text: "Profissão: ", style: ["font-bold"] },
                          responsibles?.legal?.position ?? FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                        colSpan: 2,
                      },
                      "",
                    ],
                    [
                      {
                        text: [
                          {
                            text: "Registro no Conselho: ",
                            style: ["font-bold"],
                          },
                          responsibles?.legal?.professionalClass
                            ? `${responsibles?.legal?.professionalClass?.institution}  ${responsibles?.legal?.professionalClass?.identity}`
                            : FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                      },
                      {
                        text: [
                          { text: "UF: ", style: ["font-bold"] },
                          responsibles?.legal?.address?.state ?? FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                      },
                    ],
                    [
                      {
                        text: [
                          {
                            text: "Endereço residencial: ",
                            style: ["font-bold"],
                          },
                          `${responsibles?.legal?.address?.street}, ${responsibles?.legal?.address?.number}` +
                            (responsibles?.legal?.address?.complement
                              ? `- ${responsibles?.legal?.address.complement}`
                              : ""),
                        ],
                        margin: [0, -4, 0, 0],
                        colSpan: 2,
                      },
                      "",
                    ],
                    [
                      {
                        text: [
                          { text: "Bairro: ", style: ["font-bold"] },
                          responsibles?.legal?.address?.neighborhood ??
                            FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                      },
                      {
                        text: [
                          { text: "CEP: ", style: ["font-bold"] },
                          responsibles?.legal?.address?.zip
                            ? zipMask(responsibles?.legal?.address?.zip)
                            : FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                      },
                    ],
                    [
                      {
                        text: [
                          { text: "Cidade: ", style: ["font-bold"] },
                          responsibles?.legal?.address?.city ?? FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                      },
                      {
                        text: [
                          { text: "Estado: ", style: ["font-bold"] },
                          responsibles?.legal?.address?.state ?? FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                      },
                    ],
                    [
                      {
                        text: [
                          { text: "Fone / Fax: ", style: ["font-bold"] },
                          responsibles?.legal?.phone
                            ? phoneMask(responsibles?.legal?.phone)
                            : FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                        colSpan: 2,
                      },
                      "",
                    ],
                    [
                      {
                        text: [
                          { text: "Email: ", style: ["font-bold"] },
                          responsibles?.legal?.email ?? FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                        colSpan: 2,
                      },
                      "",
                    ],
                  ],
                },
              },
              {
                margin: [0, 15, 0, 0],
                text: "Responsável Técnico pelo Plano de Gerenciamento de Resíduos:  ",
                style: ["font-bold"],
              },
              {
                lineHeight: 1.2,
                layout: "noBorders",
                margin: [15, 0, 0, 0],
                table: {
                  widths: ["*", "*"],
                  body: [
                    [
                      {
                        text: [
                          { text: "Nome: ", style: ["font-bold"] },
                          responsibles?.techinical?.name ?? FIELD_EMPTY,
                        ],
                        colSpan: 2,
                      },
                      "",
                    ],
                    [
                      {
                        text: [
                          { text: "RG: ", style: ["font-bold"] },
                          responsibles?.techinical?.identityNumber
                            ? rgMask(responsibles?.techinical?.identityNumber)
                            : FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                        colSpan: 2,
                      },
                      "",
                    ],
                    [
                      {
                        text: [
                          { text: "Profissão: ", style: ["font-bold"] },
                          responsibles?.techinical?.position ?? FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                        colSpan: 2,
                      },
                      "",
                    ],
                    [
                      {
                        text: [
                          {
                            text: "Registro no Conselho: ",
                            style: ["font-bold"],
                          },
                          responsibles?.techinical?.professionalClass
                            ? `${responsibles?.techinical?.professionalClass?.institution}  ${responsibles?.techinical?.professionalClass?.identity}`
                            : FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                      },
                      {
                        text: [
                          { text: "UF: ", style: ["font-bold"] },
                          responsibles?.techinical?.address?.state ??
                            FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                      },
                    ],
                    [
                      {
                        text: [
                          {
                            text: "Endereço residencial: ",
                            style: ["font-bold"],
                          },
                          responsibles?.techinical?.address
                            ? `${responsibles?.techinical?.address?.street}, ${responsibles?.techinical?.address?.number}` +
                              (responsibles?.techinical?.address?.complement
                                ? `- ${responsibles?.techinical?.address.complement}`
                                : "")
                            : FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                        colSpan: 2,
                      },
                      "",
                    ],
                    [
                      {
                        text: [
                          { text: "Bairro: ", style: ["font-bold"] },
                          responsibles?.techinical?.address?.neighborhood ??
                            FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                      },
                      {
                        text: [
                          { text: "CEP: ", style: ["font-bold"] },
                          responsibles?.techinical?.address?.zip
                            ? zipMask(responsibles?.techinical?.address?.zip)
                            : FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                      },
                    ],
                    [
                      {
                        text: [
                          { text: "Cidade: ", style: ["font-bold"] },
                          responsibles?.techinical?.address?.city ??
                            FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                      },
                      {
                        text: [
                          { text: "Estado: ", style: ["font-bold"] },
                          responsibles?.techinical?.address?.state ??
                            FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                      },
                    ],
                    [
                      {
                        text: [
                          { text: "Fone / Fax: ", style: ["font-bold"] },
                          responsibles?.techinical?.phone
                            ? phoneMask(responsibles?.techinical?.phone)
                            : FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                        colSpan: 2,
                      },
                      "",
                    ],
                    [
                      {
                        text: [
                          { text: "Email: ", style: ["font-bold"] },
                          responsibles?.techinical?.email ?? FIELD_EMPTY,
                        ],
                        margin: [0, -4, 0, 0],
                        colSpan: 2,
                      },
                      "",
                    ],
                  ],
                },
              },
            ],
          },
          {
            pageBreak: "before",
            lineHeight: 1.2,
            stack: [
              {
                text: "2. IDENTIFICAÇÃO DOS RESÍDUOS GERADOS ",
                style: ["font-bold"],
              },
              {
                text: "GRUPO A: Resíduos Infectantes ",
                style: ["font-bold"],
                margin: [0, 15, 0, 0],
              },
              {
                text: "Resíduos que apresentam risco potencial à saúde pública e ao meio ambiente devido à presença de agentes biológicos.",
                style: ["font-italics"],
              },
              {
                text: "GRUPO A1",
                style: ["font-bold"],
                margin: [0, 15, 0, 0],
              },
              `(${
                groupA.classificationIds?.includes("18 01 01") ? "X" : " "
              }) culturas e estoques de microrganismos resíduos de fabricação de produtos biológicos, exceto os hemoderivados; (estes resíduos não podem deixar a unidade geradora sem tratamento prévio).`,
              `(${
                groupA.classificationIds?.includes("18 01 01") ? "X" : " "
              }) meios de cultura e instrumentais utilizados para transferência, inoculação ou mistura de culturas; (estes resíduos não podem deixar a unidade geradora sem tratamento prévio).`,
              `(${
                groupA.classificationIds?.includes("18 01 01") ? "X" : " "
              }) resíduos de laboratórios de manipulação genética. (estes resíduos não podem deixar a unidade geradora sem tratamento prévio).`,
              `(${
                groupA.classificationIds?.includes("18 01 01") ? "X" : " "
              }) resíduos resultantes de atividades de vacinação com microrganismos vivos ou atenuados, incluindo frascos de vacinas com expiração do prazo de validade, com conteúdo inutilizado, vazios ou com restos do produto, agulhas e seringas. (devem ser submetidos a tratamento antes da disposição final).`,
              `(${
                groupA.classificationIds?.includes("18 01 02") ? "X" : " "
              }) resíduos resultantes da atenção à saúde de indivíduos ou animais, com suspeita ou certeza de contaminação biológica por agentes Classe de Risco 4 (Apêndice II), microrganismos com relevância epidemiológica e risco de disseminação ou causador de doença emergente que se torne epidemiologicamente importante ou cujo mecanismo de transmissão seja desconhecido. (devem ser submetidos a tratamento antes da disposição final).`,
              `(${
                groupA.classificationIds?.includes("18 01 03") ? "X" : " "
              }) bolsas transfusionais contendo sangue ou hemocomponentes rejeitadas por contaminação ou por má conservação, ou com prazo de validade vencido, e aquelas oriundas de coleta incompleta; (devem ser submetidos a tratamento antes da disposição final).`,
              `(${
                groupA.classificationIds?.includes("18 01 04") ? "X" : " "
              }) sobras de amostras de laboratório contendo sangue ou líquidos corpóreos, recipientes e materiais resultantes do processo de assistência à saúde, contendo sangue ou líquidos corpóreos na forma livre. (devem ser submetidos a tratamento antes da disposição final).`,
              "( ) Outros resíduos do grupo A1. Descreva:_______________________________________",
              {
                text: "GRUPO A2",
                style: ["font-bold"],
                margin: [0, 15, 0, 0],
              },
              `(${
                groupA.classificationIds?.includes("18 01 05") ? "X" : " "
              }) Carcaças, peças anatômicas, vísceras e outros resíduos provenientes de animais submetidos a processos de experimentação com inoculação de microrganismos, bem como suas forrações, e os cadáveres de animais suspeitos de serem portadores de microrganismos de relevância epidemiológica e com risco de disseminação, que foram submetidos ou não a estudo anatomopatológico ou confirmação diagnóstica. (devem ser submetidos a tratamento antes da disposição final).`,
              "(  ) Outros resíduos do grupo A2. Descreva:_______________________________________",
              {
                text: "GRUPO A3",
                style: ["font-bold"],
                margin: [0, 15, 0, 0],
              },
              `(${
                groupA.classificationIds?.includes("18 01 06") ? "X" : " "
              }) Peças anatômicas (membros) do ser humano; produto de fecundação sem sinais vitais, com peso menor que 500 gramas ou estatura menor que 25 centímetros ou idade gestacional menor que 20 semanas, que não tenham valor científico ou legal e não tenha havido requisição pelo paciente ou familiares. `,
              "(  ) Outros resíduos do grupo A3. Descreva:_______________________________________",
              {
                text: "GRUPO A4",
                style: ["font-bold"],
                margin: [0, 15, 0, 0],
              },
              `(${
                groupA.classificationIds?.includes("18 01 07") ? "X" : " "
              }) Kits de linhas arteriais, endovenosas e dialisadores, quando descartados.`,
              `(${
                groupA.classificationIds?.includes("18 01 08") ? "X" : " "
              }) Filtros de ar e gases aspirados de área contaminada; membrana filtrante de equipamento médico-hospitalar e de pesquisa, entre outros similares.`,
              `(${
                groupA.classificationIds?.includes("18 01 09") ? "X" : " "
              }) Sobras de amostras de laboratório e seus recipientes contendo fezes, urina e secreções, provenientes de pacientes que não contenham e nem sejam suspeitos de conter agentes Classe de Risco 4, e nem apresentem relevância epidemiológica e risco de disseminação, ou microrganismo causador de doença emergente que se torne epidemiologicamente importante ou cujo mecanismo de transmissão seja desconhecido ou com suspeita de contaminação com príons. `,
              `(${
                groupA.classificationIds?.includes("18 01 10") ? "X" : " "
              }) Resíduos de tecido adiposo proveniente de lipoaspiração, lipoescultura ou outro procedimento de cirurgia plástica que gere este tipo de resíduo. `,
              `(${
                groupA.classificationIds?.includes("18 01 11") ? "X" : " "
              }) Recipientes e materiais resultantes do processo de assistência à saúde, que não contenha sangue ou líquidos corpóreos na forma livre. `,
              `(${
                groupA.classificationIds?.includes("18 01 12") ? "X" : " "
              }) Peças anatômicas (órgãos e tecidos) e outros resíduos provenientes de procedimentos cirúrgicos ou de estudos anatomopatológicos ou de confirmação diagnóstica. `,
              `(${
                groupA.classificationIds?.includes("18 01 13") ? "X" : " "
              }) Carcaças, peças anatômicas, vísceras e outros resíduos provenientes de animais não submetidos a processos de experimentação com inoculação de microrganismos, bem como suas forrações. `,
              `(${
                groupA.classificationIds?.includes("18 01 14") ? "X" : " "
              }) Bolsas transfusionais vazias ou com volume residual pós-transfusão. `,
              "(  ) Outros resíduos do grupo A4. Descreva:_______________________________________",
              {
                text: "GRUPO A5",
                style: ["font-bold"],
                margin: [0, 15, 0, 0],
              },
              `(${
                groupA.classificationIds?.includes("18 01 15") ? "X" : " "
              }) Órgãos, tecidos, fluidos orgânicos, materiais perfurocortantes ou escarificantes e demais materiais resultantes da atenção à saúde de indivíduos ou animais, com suspeita ou certeza de contaminação com príons. `,
              "(  ) Outros resíduos do grupo A5. Descreva:_______________________________________",
              {
                text: "GRUPO B: Resíduos Químicos ",
                style: ["font-bold"],
                margin: [0, 15, 0, 0],
              },
              {
                text: "Resíduos que apresentam risco potencial à saúde pública e ao meio ambiente devido às suas características químicas. ",
                style: ["font-italics"],
              },
              {
                text: `(${
                  groupB?.classificationIds?.includes("18 02 01") ? "X" : " "
                }) Produtos hormonais e produtos antimicrobianos; imunossupressores; digitálicos; imunomoduladores; antirretrovirais, quando descartados por serviços de saúde, farmácias, drogarias e distribuidores de medicamentos ou apreendidos e os resíduos e insumos farmacêuticos dos Medicamentos controlados pela Portaria MS 344/98 e suas atualizações. `,
                margin: [0, 15, 0, 0],
              },
              {
                text: `(${
                  groupB?.classificationIds?.includes("18 02 02") ? "X" : " "
                }) Resíduos de saneantes, desinfetantes, desinfestantes; resíduos contendo metais pesados; reagentes para laboratório, inclusive os recipientes contaminados por estes. `,
              },
              {
                text: `(${
                  groupB?.classificationIds?.includes("18 02 03") ? "X" : " "
                }) Efluentes de processadores de imagem (reveladores e fixadores). `,
              },
              {
                text: `(${
                  groupB?.classificationIds?.includes("18 02 04") ? "X" : " "
                } ) Efluentes dos equipamentos automatizados utilizados em análises clínicas `,
              },
              {
                text: `(${
                  groupB?.classificationIds?.includes("18 02 05") ? "X" : " "
                }) Demais produtos considerados perigosos, conforme classificação da NBR 10.004 da ABNT (tóxicos, corrosivos, inflamáveis e reativos). `,
              },
              {
                text: "( ) Outros resíduos do grupo B. Descreva:________________________________________",
              },
              {
                text: "GRUPO D: Resíduos Comuns ",
                style: ["font-bold"],
                margin: [0, 15, 0, 0],
              },
              {
                text: "Resíduos que não apresentem risco biológico, químico ou radiológico à saúde ou ao meio ambiente, podendo ser equiparados aos resíduos domiciliares.",
                style: ["font-italics"],
              },
              {
                margin: [0, 15, 0, 0],
                text: `(${
                  concatenatedGroupDIds.includes("20 01 99") ? "X" : " "
                }) papel de uso sanitário e fralda, absorventes higiênicos, peças descartáveis de vestuário, resto alimentar de paciente, material utilizado em anti-sepsia e hemostasia de venóclises equipo de soro e outros similares não classificados como A1; `,
              },
              {
                text: `(${
                  concatenatedGroupDIds.includes("20 01 08") ? "X" : " "
                }) sobras de alimentos e do preparo de alimentos; `,
              },
              {
                text: `(${
                  concatenatedGroupDIds.includes("20 01 08") ? "X" : " "
                }) resto alimentar de refeitório; `,
              },
              {
                text: `(${
                  concatenatedGroupDIds.includes("20 03 01") ? "X" : " "
                }) resíduos provenientes das áreas administrativas; `,
              },
              `(${
                concatenatedGroupDIds.includes("20 02 01") ? "X" : " "
              }) resíduos de varrição, flores, podas e jardins.`,
              `(${
                concatenatedGroupDIds.includes("20 03 99") ? "X" : " "
              }) resíduos de gesso provenientes de assistência à saúde `,
              {
                text: `(${
                  getOthersGroupDClassificationIds() ? "X" : " "
                }) Outros resíduos do grupo D.Descreva:\n${getOthersGroupDClassificationIds()}`,
              },
              {
                text: "GRUPO E: Materiais perfurocortantes ou escarificantes",
                style: ["font-bold"],
                margin: [0, 15, 0, 0],
              },
              // {
              //   text: "( ) Lâminas de barbear, agulhas, escalpes, ampolas de vidro, brocas, limas endodônticas, pontas diamantadas, lâminas de bisturi, lancetas; ",
              // },
              // {
              //   text: "( ) tubos capilares; micropipetas; ",
              // },
              // {
              //   text: "( ) lâminas e lamínulas; espátulas; ",
              // },
              // {
              //   text: "( ) utensílios de vidro quebrados no laboratório (pipetas, tubos de coleta sanguínea e placas de Petri) ",
              // },
              {
                text: `(${
                  groupE?.classificationIds?.includes("18 04 01") ? "X" : " "
                }) Materiais perfurocortantes ou escarificantes, tais como: lâminas de barbear, agulhas, escalpes, ampolas de vidro, brocas, limas endodônticas, pontas diamantadas, lâminas de bisturi, lancetas; tubos capilares; micropipetas; lâminas e lamínulas; espátulas; e todos os utensílios de vidro quebrados no laboratório (pipetas, tubos de coleta sanguínea e placas de Petri) e outros similares\n`,
              },
              {
                text: "( ) Outros resíduos do grupo E. Descreva:________________________________________",
              },
              {
                text: "3. QUANTIFICAÇÃO DOS RESÍDUOS ",
                style: ["font-bold"],
                margin: [0, 25, 0, 0],
              },
              {
                layout: "noBorders",
                margin: [0, 10, 0, 0],
                table: {
                  widths: [300, "*"],
                  body: [
                    [
                      {
                        text: "Grupo A, Resíduos Infectantes (Total): ",
                      },
                      {
                        text: groupA
                          ? `( ${groupA.quantity.toLocaleString(
                              LOCALE
                            )} ) ${DOCUMENT_WASTE_UNIT(
                              groupA.unit
                            )} por ${DOCUMENT_WASTE_FREQUENCY(
                              groupA.frequency
                            )} `
                          : FIELD_EMPTY,
                      },
                    ],
                    // [
                    //   {
                    //     text: "Grupo A2, Resíduos Infectantes: ",
                    //     margin: [0, -4, 0, 0],
                    //   },
                    //   {
                    //     text: "(  ) litros por semana ",
                    //     margin: [0, -4, 0, 0],
                    //   },
                    // ],
                    // [
                    //   {
                    //     text: "Grupo A3, Resíduos Infectantes: ",
                    //     margin: [0, -4, 0, 0],
                    //   },
                    //   {
                    //     text: "(  ) litros por semana ",
                    //     margin: [0, -4, 0, 0],
                    //   },
                    // ],
                    // [
                    //   {
                    //     text: "Grupo A4, Resíduos Infectantes: ",
                    //     margin: [0, -4, 0, 0],
                    //   },
                    //   {
                    //     text: "(  ) litros por semana ",
                    //     margin: [0, -4, 0, 0],
                    //   },
                    // ],
                    // [
                    //   {
                    //     text: "Grupo A5, Resíduos Infectantes: ",
                    //     margin: [0, -4, 0, 0],
                    //   },
                    //   {
                    //     text: "(  ) litros por semana ",
                    //     margin: [0, -4, 0, 0],
                    //   },
                    // ],
                    [
                      {
                        text: "Grupo B, Resíduos Químicos: ",
                        margin: [0, -4, 0, 0],
                      },
                      {
                        text: groupB
                          ? `( ${groupB.quantity.toLocaleString(
                              LOCALE
                            )} ) ${DOCUMENT_WASTE_UNIT(
                              groupB.unit
                            )} por ${DOCUMENT_WASTE_FREQUENCY(
                              groupB.frequency
                            )} `
                          : FIELD_EMPTY,
                        margin: [0, -4, 0, 0],
                      },
                    ],
                    [
                      {
                        text: "Grupo D, Resíduos Comuns – não recicláveis: ",
                        margin: [0, -4, 0, 0],
                      },
                      {
                        text: groupDNr
                          ? `( ${groupDNr.quantity.toLocaleString(
                              LOCALE
                            )} ) ${DOCUMENT_WASTE_UNIT(
                              groupDNr.unit
                            )} por ${DOCUMENT_WASTE_FREQUENCY(
                              groupDNr.frequency
                            )} `
                          : FIELD_EMPTY,
                        margin: [0, -4, 0, 0],
                      },
                    ],
                    [
                      {
                        text: "Grupo D, Resíduos Comuns – recicláveis: ",
                        margin: [0, -4, 0, 0],
                      },
                      {
                        text: groupDR
                          ? `( ${groupDR.quantity.toLocaleString(
                              LOCALE
                            )} ) ${DOCUMENT_WASTE_UNIT(
                              groupDR.unit
                            )} por ${DOCUMENT_WASTE_FREQUENCY(
                              groupDR.frequency
                            )} `
                          : FIELD_EMPTY,
                        margin: [0, -4, 0, 0],
                      },
                    ],
                    [
                      {
                        text: "Grupo E, Resíduos Perfurantes: ",
                        margin: [0, -4, 0, 0],
                      },
                      {
                        text: groupE
                          ? `( ${groupE.quantity.toLocaleString(
                              LOCALE
                            )} ) ${DOCUMENT_WASTE_UNIT(
                              groupE.unit
                            )} por ${DOCUMENT_WASTE_FREQUENCY(
                              groupE.frequency
                            )} `
                          : FIELD_EMPTY,
                        margin: [0, -4, 0, 0],
                      },
                    ],
                  ],
                },
              },
            ],
          },
          {
            pageBreak: "before",
            lineHeight: 1.2,
            stack: [
              {
                text: "4. ACONDICIONAMENTO DOS RESÍDUOS – Obrigações Legais",
                style: ["font-bold"],
              },
              {
                text: "Os resíduos deste estabelecimento serão acondicionados e armazenados da seguinte forma, de acordo com as Resoluções RDC – ANVISA nº 306/2004, RDC Nº 222, DE 28 DE MARÇO DE 2018, CONAMA nº 358/2005 e normas pertinentes da ABNT e do município sede do estabelecimento. ",
              },
              {
                text: "GRUPO A: Resíduos Infectantes ",
                style: ["font-bold"],
                margin: [0, 15, 0, 0],
              },
              {
                text: "São acondicionados em sacos plásticos, impermeáveis e resistentes, de cor branca leitosa, com simbologia de resíduo infectante. É observada a necessidade de utilização de sacos vermelhos – RDC 306/04 – ANVISA e RDC Nº 222/2018.",
              },
              {
                text: "São armazenados em recipientes estanques, metálicos ou de plástico, com tampa, de fácil higienização e manuseio. ",
              },
              {
                text: "GRUPO B: Resíduos Químicos ",
                style: ["font-bold"],
                margin: [0, 15, 0, 0],
              },
              {
                text: "São acondicionados em duplo saco plástico de cor branca leitosa, com identificação do resíduo e dos riscos; ou acondicionados em recipiente rígido e estanque, compatível com as características físico-químicas do resíduo ou produto a ser descartado, identificando de forma visível com o nome do conteúdo e suas principais características. ",
              },
              {
                text: "GRUPO D: Resíduos Comuns ",
                style: ["font-bold"],
                margin: [0, 15, 0, 0],
              },
              {
                text: "São acondicionados em sacos pretos resistentes de modo a evitar derramamento durante o manuseio. Os resíduos comuns recicláveis (papel, papelão, plástico e vidro) são ser separados e destinados à reciclagem. ",
              },
              {
                text: "GRUPO E: Resíduos Perfurantes ou escarificantes",
                style: ["font-bold"],
                margin: [0, 15, 0, 0],
              },
              {
                text: "Os resíduos perfurantes e cortantes do Grupo A são acondicionados e armazenados em recipientes rígidos, resistentes à punctura, rompimento e vazamento, com tampa, devidamente identificados com a simbologia de resíduo infectante e perfurocortante. ",
              },
              {
                text: "5. COLETA INTENA DOS RESÍDUOS – Obrigações Legais ",
                style: ["font-bold"],
                margin: [0, 35, 0, 0],
              },
              {
                text: "Os resíduos deverão seguir os seguintes procedimentos ao serem transportados dentro do estabelecimento, de acordo com as Resoluções RDC – ANVISA nº 306/2004, RDC Nº 222/2018, CONAMA nº 358/2005 e normas pertinentes da ABNT e do município sede do estabelecimento. ",
              },
              {
                margin: [15, 15, 0, 0],
                ol: [
                  {
                    text: "O transporte dos recipientes deve se realizado sem esforço excessivo ou risco de acidente para o funcionário. ",
                  },
                  {
                    text: "Os procedimentos devem ser realizados de forma a não permitir o rompimento dos recipientes. No caso de acidente ou derramamento, deve-se imediatamente realizar a limpeza e desinfecção simultânea do local, e notificar a chefia da unidade. ",
                  },
                ],
              },
              {
                text: "6. ABRIGO DOS RESÍDUOS – Obrigações Legais ",
                style: ["font-bold"],
                margin: [0, 35, 0, 0],
              },
              {
                text: "Os resíduos deverão seguir os seguintes procedimentos ao serem transportados dentro do estabelecimento, de acordo com as Resoluções RDC – ANVISA nº 306/2004, RDC Nº 222/2018, CONAMA nº 358/2004 e normas pertinentes da ABNT e do município sede do estabelecimento. ",
              },
              {
                margin: [15, 15, 0, 0],
                ol: [
                  {
                    text: "O abrigo de resíduos deve ser constituído de um local fechado, ser exclusivo para guarda temporária de resíduos de serviços de saúde, devidamente acondicionados em recipientes. ",
                  },
                  {
                    text: "As dimensões do abrigo devem ser suficientes para armazenar a produção de resíduos de até três dias, sem empilhamento dos recipientes acima de 1,20 m. ",
                  },
                  {
                    text: "O piso, paredes, porta e teto devem ser de material liso, impermeável, lavável e de cor branca. ",
                  },
                  {
                    text: "A porta deve ostentar o símbolo de substância infectante. ",
                  },
                  {
                    text: "O abrigo de resíduo deve ser higienizado após a coleta externa ou sempre que ocorrer derramamento. ",
                  },
                ],
              },
              {
                margin: [15, 25, 0, 0],
                stack: [
                  {
                    text: "FOTO DO ABRIGO DOS RESÍDUOS DO LOCAL:",
                  },
                  {
                    text: "INSERIR AS FOTOS AQUI",
                    style: ["text-red"],
                  },
                ],
              },
              {
                text: "7. TRATAMENTO E DESTINO FINAL DOS RESÍDUOS – Obrigações Legais ",
                style: ["font-bold"],
                margin: [0, 35, 0, 0],
              },
              {
                text: "Os resíduos deverão ser tratados e destinados da seguinte forma, de acordo com Resoluções RDC – ANVISA nº 306/2004, RDC Nº 222/2018, CONAMA nº 358/2005 e normas pertinentes da ABNT e do município sede do estabelecimento. ",
              },
            ],
          },
          {
            pageBreak: "before",
            lineHeight: 1.2,
            stack: [
              {
                text: "8.COLETA EXTERNA DOS RESIDUOS ",
                style: ["font-bold"],
              },
              {
                text: "GRUPO A: Resíduos Infectantes ",
                style: ["font-bold"],
                margin: [0, 15, 0, 0],
              },
              {
                text: [
                  {
                    text: "Responsável pelo transporte: ",
                    style: ["font-bold"],
                  },
                  getCompaniesTransport(groupA),
                ],
              },
              {
                text: [
                  {
                    text: "Veículo utilizado: ",
                    style: ["font-bold"],
                  },
                  "Caminhão",
                ],
              },
              {
                text: [
                  { text: "Frequência de coleta: ", style: ["font-bold"] },
                  groupA?.collectionFrequency
                    ? DOCUMENT_FREQUENCY(groupA.collectionFrequency)
                    : FIELD_EMPTY,
                ],
              },
              {
                text: [
                  {
                    text: "Tratamento: ",
                    style: ["font-bold"],
                  },
                  groupA?.treatment
                    ? DOCUMENT_WASTE_TREATMENT(groupA.treatment)
                    : FIELD_EMPTY,
                ],
              },
              {
                text: [
                  {
                    text: "Destino Final: ",
                    style: ["font-bold"],
                  },
                  getCompaniesDestination(groupA),
                ],
              },
              {
                text: "GRUPO B: Resíduos Químicos ",
                style: ["font-bold"],
                margin: [0, 15, 0, 0],
              },
              {
                text: [
                  {
                    text: "Responsável pelo transporte: ",
                    style: ["font-bold"],
                  },
                  groupB ? getCompaniesTransport(groupB) : FIELD_EMPTY,
                ],
              },
              {
                text: [
                  {
                    text: "Veículo utilizado: ",
                    style: ["font-bold"],
                  },
                  "Caminhão",
                ],
              },
              {
                text: [
                  {
                    text: "Frequência de coleta: ",
                    style: ["font-bold"],
                  },
                  groupB?.collectionFrequency
                    ? DOCUMENT_FREQUENCY(groupB.collectionFrequency)
                    : FIELD_EMPTY,
                ],
              },
              {
                text: [
                  {
                    text: "Tratamento: ",
                    style: ["font-bold"],
                  },
                  groupB?.treatment
                    ? DOCUMENT_WASTE_TREATMENT(groupB.treatment)
                    : FIELD_EMPTY,
                ],
              },
              {
                text: [
                  {
                    text: "Destino Final: ",
                    style: ["font-bold"],
                  },
                  groupB ? getCompaniesDestination(groupB) : FIELD_EMPTY,
                ],
              },
              {
                margin: [0, 15, 0, 0],
                text: "GRUPO D: Resíduos Comuns Não Recicláveis ",
                style: ["font-bold"],
              },
              {
                text: [
                  {
                    text: "Responsável pelo transporte: ",
                    style: ["font-bold"],
                  },
                  groupDNr ? getCompaniesTransport(groupDNr) : FIELD_EMPTY,
                ],
              },
              {
                text: [
                  {
                    text: "Veículo utilizado: ",
                    style: ["font-bold"],
                  },
                  "Caminhão",
                ],
              },
              {
                text: [
                  {
                    text: "Frequência de coleta: ",
                    style: ["font-bold"],
                  },
                  groupDNr?.collectionFrequency
                    ? DOCUMENT_FREQUENCY(groupDNr.collectionFrequency)
                    : FIELD_EMPTY,
                ],
              },
              {
                text: [
                  {
                    text: "Destino Final: ",
                    style: ["font-bold"],
                  },
                  groupDNr ? getCompaniesDestination(groupDNr) : FIELD_EMPTY,
                ],
              },
              {
                margin: [0, 15, 0, 0],
                text: "GRUPO D: Resíduos Recicláveis ",
                style: ["font-bold"],
              },
              {
                text: [
                  {
                    text: "Responsável pelo transporte: ",
                    style: ["font-bold"],
                  },
                  groupDR ? getCompaniesTransport(groupDR) : FIELD_EMPTY,
                ],
              },
              {
                text: [
                  {
                    text: "Veículo utilizado: ",
                    style: ["font-bold"],
                  },
                  "Caminhão",
                ],
              },
              {
                text: [
                  {
                    text: "Frequência de coleta: ",
                    style: ["font-bold"],
                  },
                  groupDR?.collectionFrequency
                    ? DOCUMENT_FREQUENCY(groupDR.collectionFrequency)
                    : FIELD_EMPTY,
                ],
              },
              {
                text: [
                  {
                    text: "Destino Final: ",
                    style: ["font-bold"],
                  },
                  groupDR ? getCompaniesDestination(groupDR) : FIELD_EMPTY,
                ],
              },
              {
                margin: [0, 15, 0, 0],
                text: "GRUPO E: Resíduos Perfurantes ou escarificantes",
                style: ["font-bold"],
              },
              {
                text: [
                  {
                    text: "Responsável pelo transporte: ",
                    style: ["font-bold"],
                  },
                  groupE ? getCompaniesTransport(groupE) : FIELD_EMPTY,
                ],
              },
              {
                text: [
                  {
                    text: "Veículo utilizado: ",
                    style: ["font-bold"],
                  },
                  "Caminhão",
                ],
              },
              {
                text: [
                  {
                    text: "Frequência de coleta: ",
                    style: ["font-bold"],
                  },
                  groupE?.collectionFrequency
                    ? DOCUMENT_FREQUENCY(groupE.collectionFrequency)
                    : FIELD_EMPTY,
                ],
              },
              {
                text: [
                  {
                    text: "Tratamento: ",
                    style: ["font-bold"],
                  },
                  groupE?.treatment
                    ? DOCUMENT_WASTE_TREATMENT(groupE.treatment)
                    : FIELD_EMPTY,
                ],
              },
              {
                text: [
                  {
                    text: "Destino Final: ",
                    style: ["font-bold"],
                  },
                  groupE ? getCompaniesDestination(groupE) : FIELD_EMPTY,
                ],
              },
            ],
          },
          {
            pageBreak: "before",
            lineHeight: 1.2,
            stack: [
              {
                text: "9. SAÚDE E SEGURANÇA OCUPACIONAL – Obrigações legais e recomendações ",
                style: ["font-bold"],
              },
              {
                text: "As seguintes medidas serão implantadas neste estabelecimento, de acordo com Resoluções RDC – ANVISA nº 306/2004, RDC Nº 222/2018, CONAMA nº 358/2005 e normas pertinentes da ABNT e do município sede do estabelecimento:",
              },
              {
                margin: [15, 15, 0, 0],
                ol: [
                  {
                    text: "Durante o manuseio dos resíduos o funcionário deverá utilizar os seguintes equipamentos de proteção individual: luvas: de PVC ou borracha, impermeáveis, resistentes, de cor clara, antiderrapantes e de cano longo; e avental: de PVC, ",
                  },
                  {
                    text: "Impermeável e de médio comprimento. ",
                  },
                  {
                    text: "Após a coleta interna, o funcionário deve lavar as mãos ainda enluvadas, retirando as luvas e colocando-as em local apropriado. O funcionário deve lavar as mãos antes de calçar as luvas e depois de retirá-las. ",
                  },
                  {
                    text: "Em caso de ruptura das luvas, o funcionário deve descartá-las imediatamente, não as reutilizando. ",
                  },
                  {
                    text: "Estes equipamentos de proteção individual devem ser lavados e desinfetados diariamente. Sempre que houver contaminação com material infectante, devem ser substituídos imediatamente, lavados e esterilizados. As pessoas envolvidas com o manuseio de resíduos devem ser submetidas a exame admissional, periódico, de retorno ao trabalho, mudança de função e demissional. Os exames e avaliações que devem ser submetidas são: Anamnese ocupacional, Exame físico, Exame mental. Os funcionários também devem ser vacinados contra tétano, hepatite e outras considerações importantes pela Vigilância Sanitária. ",
                  },
                ],
              },
              {
                margin: [0, 15, 0, 0],
                text: "Para a prevenção de acidentes e exposição do trabalhador e agentes biológicos devem ser adotadas as seguintes medidas: ",
              },
              {
                margin: [15, 15, 0, 0],
                ol: [
                  {
                    text: "Realizar anti-sepsia das mãos sempre que houver contato da pele com sangue e secreções ",
                  },
                  {
                    text: "Usar luvas sempre e, após retirá-las realizar lavagem das mãos ",
                  },
                  {
                    text: "Não fumar e não alimentar-se durante o manuseio com resíduos. ",
                  },
                  {
                    text: "Retirar as luvas e lavar as mãos sempre que exercer outra atividade não relacionada aos resíduos (ir ao sanitário, atender ao telefone, beber água, etc.) ",
                  },
                  {
                    text: "Manter o ambiente sempre limpo. ",
                  },
                ],
              },
              {
                margin: [0, 15, 0, 0],
                text: "Em caso de acidente com perfurantes e cortantes, as seguintes medidas serão tomadas: ",
              },
              {
                margin: [15, 15, 0, 0],
                ol: [
                  {
                    text: "Lavar bem o local com solução de detergente neutro. ",
                  },
                  {
                    text: "Aplicar solução antisséptica (álcool iodado, álcool glicerinado a 70%) de 30 segundos a 2 minutos. ",
                  },
                  {
                    text: "Notificar imediatamente a chefia da unidade, e encaminhar para o pronto atendimento se necessário. ",
                  },
                ],
              },
            ],
          },
          {
            pageBreak: "before",
            lineHeight: 1.2,
            stack: [
              {
                text: "10. BIBLIOGRAFIA ",
                style: ["font-bold"],
              },
              {
                text: "Para fins de atendimento de apresentação do Plano de Gerenciamento de Resíduos Sólidos Sépticos, deverão ser observadas as seguintes Legislações e Normas Técnicas: ",
              },
              {
                margin: [0, 10, 0, 0],
                text: "LEI FEDERAL Nº 9605/98 – Dispõe sobre crimes ambientais. ",
              },
              {
                margin: [0, 10, 0, 0],
                text: "RESOLUÇÃO CONAMA Nº 01/86 – Estabelece definições, responsabilidade, critérios básicos, e diretrizes da avaliação do impacto ambiental, determina que aterros sanitários, processamento e destino final de resíduos tóxicos ou perigosos são passiveis de avaliação. ",
              },
              {
                margin: [0, 10, 0, 0],
                text: "RESOLUÇÃO CONAMA Nº 05/88 – Especifica licenciamento de obras de unidade de transferências, tratamento e disposição final de resíduos sólidos de origem domésticas, públicas, industriais e de origem hospitalar. ",
              },
              {
                margin: [0, 10, 0, 0],
                text: "RESOLUÇÃO CONAMA Nº 05/93 – dispões sobre destinação dos resíduos sólidos de serviço de saúde, portos, aeroportos, terminais rodoviários e ferroviários. Onde define a responsabilidade do gerador quanto o gerenciamento dos resíduos desde a geração até a disposição final. ",
              },
              {
                margin: [0, 10, 0, 0],
                text: "RESOLUÇÃO CONAMA Nº 358/2005 – Dispõe sobre o tratamento a destinação final dos resíduos dos serviços de saúde. ",
              },
              {
                margin: [0, 10, 0, 0],
                text: "RESOLUÇÃO CONAMA Nº 306/04 – Dispõe sobre o regulamento técnico para o gerenciamento de resíduos dos serviços de saúde. ",
              },
              {
                margin: [0, 10, 0, 0],
                text: "RDC Nº 222, DE 28 DE MARÇO DE 2018 - Regulamenta as Boas Práticas de Gerenciamento dos Resíduos de Serviços de Saúde e dá outras providências.",
              },
              {
                text: "NBR 10.004/87 – Classifica os resíduos sólidos quanto aos seus riscos potenciais ao meio ambiente e à sua saúde. ",
              },
              {
                margin: [0, 10, 0, 0],
                text: "NBR 7.500/87 – Símbolos de risco e manuseio para o transporte e armazenamento de resíduos sólidos. ",
              },
              {
                margin: [0, 10, 0, 0],
                text: "NBR 12.235/92 – Armazenamento de resíduos sólidos perigosos definidos na NBR 10004 – procedimentos ",
              },
              {
                margin: [0, 10, 0, 0],
                text: "NBR 12807/93 – Resíduos de serviços de saúde – terminologia. ",
              },
              {
                margin: [0, 10, 0, 0],
                text: "NBR 12808/93 – Resíduos de serviços de saúde – classificação. ",
              },
              {
                margin: [0, 10, 0, 0],
                text: "NBR 12809/93 – Manuseio de resíduos de serviços de saúde – procedimentos. ",
              },
              {
                margin: [0, 10, 0, 0],
                text: "NBR 12810/93 – Coleta de resíduos de serviços de saúde – procedimentos. ",
              },
              {
                margin: [0, 10, 0, 0],
                text: "NBR 12980/93 – Coleta, varrição e acondicionamento de resíduos sólidos urbanos terminologia. ",
              },
              {
                margin: [0, 10, 0, 0],
                text: "NBR 11.175/90 – Fixa as condições exigíveis de desempenho do equipamento para incineração de resíduos sólidos perigosos. ",
              },
              {
                margin: [0, 10, 0, 0],
                text: "NBR 13.853/97 – Coletores para resíduos de serviços de saúde perfurantes ou cortantes – requisitos e métodos de ensaio. ",
              },
              {
                margin: [0, 10, 0, 0],
                text: "CNEN – NE 6.05/98 gerência dos rejeitos radioativos ",
              },
            ],
          },
          {
            pageBreak: "before",
            lineHeight: 1.2,
            stack: [
              {
                text: "11. CONSIDERAÇÕES FINAIS",
                style: ["font-bold"],
              },
              {
                text: "Este estabelecimento se compromete a seguir as disposições e implantar as medidas contidas neste plano. ",
              },
              {
                text: [
                  "Francisco Beltrão, ",
                  {
                    text: getFullDateFormat(new Date()) ?? FIELD_EMPTY,
                    style: [],
                  },
                ],
                style: ["text-center"],
                margin: [0, 25, 0, 0],
              },
              {
                margin: [0, 60, 0, 0],
                text: "_______________________________________________",
                style: ["text-center"],
              },
              {
                text: "Assinatura do Responsável pelo Estabelecimento Gerador",
                style: ["text-center"],
              },
              {
                text: [
                  {
                    text: "Nome: ",
                    style: ["font-bold"],
                  },
                  responsibles?.legal?.name ?? FIELD_EMPTY,
                ],
                style: ["text-center"],
              },
              {
                text: [
                  {
                    text: "CPF: ",
                    style: ["font-bold"],
                  },
                  responsibles?.legal?.taxpayerNumber
                    ? cpfMask(responsibles?.legal?.taxpayerNumber)
                    : FIELD_EMPTY,
                ],
                style: ["text-center"],
              },
              {
                margin: [0, 60, 0, 0],
                text: "_______________________________________________",
                style: ["text-center"],
              },
              {
                text: "Assinatura do Responsável Técnico pelo Plano de Gerenciamento",
                style: ["text-center"],
              },
              {
                text: [
                  {
                    text: "Nome: ",
                    style: ["font-bold"],
                  },
                  responsibles?.techinical?.name ?? FIELD_EMPTY,
                ],
                style: ["text-center"],
              },
              {
                text: [
                  {
                    text: "Registro nº: ",
                    style: ["font-bold"],
                  },
                  responsibles?.techinical?.professionalClass
                    ? `${responsibles?.techinical?.professionalClass?.institution}  ${responsibles?.techinical?.professionalClass?.identity}`
                    : FIELD_EMPTY,
                ],
                style: ["text-center"],
              },
            ],
          },
          {
            pageBreak: "before",
            lineHeight: 1.2,
            stack: [
              {
                text: "12. ANEXOS:",
                style: ["font-bold"],
              },
              {
                margin: [15, 15, 0, 0],
                ul: [
                  {
                    text: "Documentos de comprovação de destinação final dos resíduos;",
                  },
                  {
                    text: "Documento de comprovação de habilitação técnica do responsável pelo PGRSS;",
                    margin: [0, 10, 0, 0],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    styles: {
      "text-center": {
        alignment: "center",
      },
      "font-bold": {
        bold: true,
      },
      "font-italics": {
        italics: true,
      },
      "text-red": {
        color: "red",
      },
    },
  };

  return template;
}
