import { TableLayout, TDocumentDefinitions } from "pdfmake/interfaces";
import {
  DOCUMENT_FREQUENCY,
  DOCUMENT_WASTE_COMPANY_LICENSE,
  DOCUMENT_WASTE_FREQUENCY,
  DOCUMENT_WASTE_TREATMENT,
  DOCUMENT_WASTE_UNIT,
  LOCALE,
} from "../../resource";
import {
  DocumentHealthWasteClass,
  DocumentWasteCompanyLicense,
  DocumentWasteFrequency,
  DocumentWasteUnit,
  IDocumentHealthWasteBase,
  IDocumentHealthWasteClassA,
  IDocumentHealthWasteClassE,
  IRenderReq,
} from "../../types/document/interface";
import {
  cnpjMask,
  dateFormat,
  getClassificationId,
  getWorkHours,
  phoneMask,
  rgMask,
  zipMask,
} from "../../utils";

const FIELD_EMPTY = "-";

const header = "http://localhost:5173/itajai-header.png";

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

  function setGroupQuantity(
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

    return `${quantity.toLocaleString(LOCALE)} ${DOCUMENT_WASTE_UNIT(
      unit
    )} por ${DOCUMENT_WASTE_FREQUENCY(frequency)}`;
  }

  const template: TDocumentDefinitions = {
    pageSize: "A4",
    pageOrientation: "portrait",
    pageMargins: [50, 100, 50, 60],
    defaultStyle: { font: "Arial", fontSize: 12 },
    header: function () {
      return {
        image: "header",
        width: 500,
        alignment: "center",
        margin: [0, 20, 0, 0],
      };
    },
    // footer: function (currentPage, pageCount) {
    //   return {
    //     columns: [
    //       "",
    //       {
    //         text: [
    //           "Página ",
    //           { text: currentPage - 1, bold: true },
    //           " de ",
    //           { text: pageCount - 1, bold: true },
    //         ],
    //         width: "auto",
    //         margin: [0, 0, 50, 0],
    //         fontSize: 10,
    //         alignment: "right",
    //       },
    //     ],
    //   };
    // },
    content: [
      {
        stack: [
          {
            style: ["text-justify"],
            stack: [
              {
                text: "RESOLUÇÃO CONJUNTA N.º 002/2005 - SEMA/SESA",
                style: ["font-bold"],
                margin: [0, 0, 0, 0],
              },
              {
                text: [
                  {
                    text: "SECRETÁRIO DE ESTADO DO MEIO AMBIENTE E RECURSOS HÍDRICOS, Luiz Eduardo Cheida",
                    style: ["font-bold"],
                  },
                  " e o ",
                  {
                    text: "SECRETÁRIO DE ESTADO DA SAÚDE, Cláudio Murilo Xavier ",
                    style: ["font-bold"],
                  },
                  "no uso de suas atribuições legais estabelecidas pelo artigo 90, inciso II da Constituição do Estado do Paraná, do artigo 45 da Lei 8.485/87, artigo 577 do Regulamento pelo Decreto Estadual 5.711/2002,",
                ],
                style: ["text-justify"],
                margin: [0, 25, 0, 0],
              },
              {
                margin: [0, 15, 0, 0],
                style: ["font-italics"],
                columns: [
                  {
                    width: 15,
                    text: "-",
                  },
                  {
                    text: [
                      { text: "Considerando", style: ["font-bold"] },
                      " que o Plano de Gerenciamento de Resíduos de Serviços de Saúde – PGRSS é documento integrante do processo de licenciamento ambiental;",
                    ],
                  },
                ],
              },
              {
                margin: [0, 15, 0, 0],
                style: ["font-italics"],
                columns: [
                  {
                    width: 15,
                    text: "-",
                  },
                  {
                    text: [
                      { text: "Considerando", style: ["font-bold"] },
                      " que o PGRSS deve ser elaborado pelo gerador dos resíduos e de acordo com os critérios estabelecidos pelos órgãos de vigilância sanitária e meio ambiente, a quem cabe sua análise e aprovação;",
                    ],
                  },
                ],
              },
              {
                margin: [0, 15, 0, 0],
                style: ["font-italics"],
                columns: [
                  {
                    width: 15,
                    text: "-",
                  },
                  {
                    text: [
                      { text: "Considerando", style: ["font-bold"] },
                      " que no Plano de Gerenciamento de Resíduos de Serviços de Saúde – PGRSS deve conter critérios sobre a coleta e destinação final dos resíduos de saúde;",
                    ],
                  },
                ],
              },
              {
                margin: [0, 15, 0, 0],
                text: "RESOLVEM:",
                style: ["font-bold"],
              },
              {
                margin: [15, 15, 0, 0],
                columns: [
                  {
                    width: 15,
                    text: "1.",
                  },
                  {
                    text: [
                      "Estabelecer diretrizes, conforme anexo, para elaboração de Plano Simplificado de Gerenciamento de Resíduos de Serviços de Saúde para Geradores de até 30 litros por semana, excluídos os estabelecimentos que gerem resíduos quimioterápicos e radioativos;",
                    ],
                  },
                ],
              },
              {
                margin: [15, 25, 0, 0],
                columns: [
                  {
                    width: 15,
                    text: "2.",
                  },
                  {
                    text: [
                      "Estabelecer diretrizes, conforme anexo, para elaboração de Plano de Gerenciamento de Resíduos de Serviços de Saúde para Geradores acima de 30 litros por semana, incluídos neste os estabelecimentos que gerem resíduos quimioterápicos e radioativos.",
                    ],
                  },
                ],
              },
              {
                margin: [15, 25, 0, 0],
                columns: [
                  {
                    width: 15,
                    text: "3.",
                  },
                  {
                    text: [
                      "Os estabelecimentos geradores de resíduos de serviços de saúde em operação, devem, primeiramente, protocolar o PGRSS ao órgão da saúde para manifestação definitiva dentro da sua esfera de competência, sendo que após esta manifestação deverá ser protocolado junto com o requerimento do licenciamento ambiental ao órgão ambiental competente, junto com os demais documentos necessários à instrução do procedimento para análise e conclusão do licenciamento solicitado.",
                    ],
                  },
                ],
              },
              {
                margin: [15, 25, 0, 0],
                columns: [
                  {
                    width: 15,
                    text: "4.",
                  },
                  {
                    text: [
                      "O licenciamento ambiental para os estabelecimentos geradores de resíduos de serviços de saúde a serem implantados, obedecerá aos trâmites previstos na Resolução 031/98 – SEMA e Resolução 358/05 CONAMA.",
                    ],
                  },
                ],
              },
              {
                margin: [0, 25, 0, 0],
                text: "RESOLUÇÃO CONJUNTA N.º001/2005 - SEMA/SESA",
                style: ["font-bold"],
              },
              {
                margin: [15, 30, 0, 0],
                columns: [
                  {
                    width: 15,
                    text: "5.",
                  },
                  {
                    text: [
                      "Convocar, se preciso for, para esclarecimentos adicionais durante a análise do PGRSS, os responsáveis técnicos por sua elaboração, gerenciamento e execução, bem como o estabelecimento gerador.",
                    ],
                  },
                ],
              },
              {
                margin: [15, 25, 0, 0],
                columns: [
                  {
                    width: 15,
                    text: "6.",
                  },
                  {
                    text: [
                      "Anexar a esta Resolução o Plano Simplificado para gerenciamento de resíduos sólidos.",
                    ],
                  },
                ],
              },
              {
                margin: [15, 25, 0, 0],
                columns: [
                  {
                    width: 15,
                    text: "7.",
                  },
                  {
                    text: [
                      "Esta Resolução entrará em vigor na data da sua publicação.",
                    ],
                  },
                ],
              },
              {
                margin: [15, 45, 0, 0],
                text: "Curitiba, 31 de maio de 2005.",
              },
              {
                margin: [15, 65, 0, 0],
                style: ["text-center", "font-bold"],
                columns: [
                  {
                    stack: [
                      "LUIZ EDUARDO CHEIDA",
                      "Secretário de Estado do Meio Ambiente e Recursos Hídrico",
                    ],
                  },
                  {
                    stack: [
                      "LUIZ EDUARDO CHEIDA",
                      "Secretário de Estado da Saúde",
                    ],
                  },
                ],
              },
            ],
            margin: [0, 50, 0, 0],
          },
          {
            pageBreak: "before",
            stack: [
              {
                style: ["font-italics"],
                lineHeight: 2,
                stack: [
                  { text: "ANEXO I", style: ["font-bold"] },
                  {
                    text: "PLANO SIMPLIFICADO DE GERENCIAMENTO DE RESÍDUOS DE SERVIÇOS DA SAÚDE PARA MÍNIMOS GERADORES",
                    lineHeight: 2,
                  },
                  {
                    text: "Até 30 litros por semana",
                  },
                  {
                    text: "(não aplicável para estabelecimentos que geram resíduos quimioterápicos e radioativos)",
                    lineHeight: 2,
                    style: ["font-bold"],
                  },
                ],
                margin: [0, 10, 0, 0],
              },
              {
                text: "1. IDENTIFICAÇÃO DO GERADOR",
                margin: [0, 10, 0, 0],
                style: ["font-bold"],
              },
              {
                margin: [0, 20, 0, 0],
                text: [
                  {
                    text: "Razão Social: ",
                    style: ["font-bold"],
                  },
                  company?.name ?? FIELD_EMPTY,
                ],
              },
              {
                margin: [0, 10, 0, 0],
                text: [
                  {
                    text: "Nome Fantasia: ",
                    style: ["font-bold"],
                  },
                  company?.businessName ?? FIELD_EMPTY,
                ],
              },
              {
                margin: [0, 10, 0, 0],
                text: [
                  {
                    text: "C.N.P.J: ",
                    style: ["font-bold"],
                  },
                  cnpjMask(company?.identifier),
                ],
              },
              {
                margin: [0, 10, 0, 0],
                text: [
                  {
                    text: "Endereço: ",
                    style: ["font-bold"],
                  },
                  `${company?.address.street}, ${company?.address.number}` +
                    (company?.address.complement
                      ? `- ${company?.address.complement}`
                      : ""),
                ],
              },
              {
                margin: [0, 10, 0, 0],
                text: [
                  {
                    text: "Bairro: ",
                    style: ["font-bold"],
                  },
                  company?.address.neighborhood
                    ? company?.address.neighborhood
                    : FIELD_EMPTY,
                ],
              },
              {
                margin: [0, 10, 0, 0],
                text: [
                  {
                    text: "Cidade: ",
                    style: ["font-bold"],
                  },
                  company?.address
                    ? `${company.address.city} - ${company.address.state}`
                    : FIELD_EMPTY,
                ],
              },
              {
                margin: [0, 10, 0, 0],
                text: [
                  {
                    text: "Fone / Fax: ",
                    style: ["font-bold"],
                  },
                  company?.landline
                    ? phoneMask(company?.landline)
                    : FIELD_EMPTY,
                ],
              },
              {
                margin: [0, 10, 0, 0],
                text: [
                  {
                    text: "Email: ",
                    style: ["font-bold"],
                  },
                  company?.email ?? FIELD_EMPTY,
                ],
              },
              // {
              //   margin: [0, 10, 0, 0],
              //   text: [
              //     {
              //       text: "Área Construída (m²): ",
              //       style: ["font-bold"],
              //     },
              //     "________________________________________________________",
              //   ],
              // },
              // {
              //   margin: [0, 10, 0, 0],
              //   text: [
              //     {
              //       text: "Área Total do Terreno (m²): ",
              //       style: ["font-bold"],
              //     },
              //     "________________________________________________________",
              //   ],
              // },
              {
                layout: "noBorders",
                margin: [0, 10, 0, 0],
                table: {
                  widths: [130, 70, 160, "*"],
                  body: [
                    [
                      { text: "Área Construída (m²): ", style: ["font-bold"] },
                      company?.builtArea?.toLocaleString(LOCALE) ?? FIELD_EMPTY,
                      {
                        text: "Área Total do Terreno (m²):",
                        style: ["font-bold"],
                      },
                      company?.totalArea?.toLocaleString(LOCALE) ?? FIELD_EMPTY,
                    ],
                  ],
                },
              },
              {
                margin: [0, 25, 0, 0],
                text: "Especialidades Médicas",
                style: ["font-bold"],
              },
              {
                margin: [0, 5, 0, 0],
                text: company?.healthProceduresDescription ?? FIELD_EMPTY,
              },
              {
                margin: [0, 10, 0, 0],
                text: [
                  {
                    text: "Data de início de funcionamento: ",
                    style: ["font-bold"],
                  },
                  dateFormat(company?.foundingDate) ?? FIELD_EMPTY,
                ],
              },
              {
                margin: [0, 10, 0, 0],
                text: [
                  {
                    text: "Horário de funcionamento: ",
                    style: ["font-bold"],
                  },
                  getWorkHours(company),
                ],
              },
              {
                layout: "noBorders",
                margin: [0, 10, 0, 0],
                table: {
                  widths: [230, 50, 145, "*"],
                  body: [
                    [
                      {
                        text: "Número de pacientes atendidos por dia: ",
                        style: ["font-bold"],
                      },
                      company?.healthAppointmentsByDay ?? FIELD_EMPTY,
                      {
                        text: "Número de funcionários:",
                        style: ["font-bold"],
                      },
                      company?.totalEmployeesCount ?? FIELD_EMPTY,
                    ],
                  ],
                },
              },
              {
                margin: [0, 25, 0, 0],
                text: "Responsável Técnico pelo Plano de Gerenciamento de Resíduos: ",
                style: ["font-bold"],
              },
              {
                margin: [0, 5, 0, 0],
                text: "(pode ser o responsável técnico pelo estabelecimento)",
                style: ["font-bold"],
              },
              {
                margin: [0, 10, 0, 0],
                text: [
                  {
                    text: "Nome: ",
                    style: ["font-bold"],
                  },
                  responsibles?.techinical?.name ?? FIELD_EMPTY,
                ],
              },
              {
                margin: [0, 10, 0, 0],
                text: [
                  {
                    text: "R.G.: ",
                    style: ["font-bold"],
                  },
                  responsibles?.techinical?.identityNumber
                    ? rgMask(responsibles.techinical.identityNumber)
                    : FIELD_EMPTY,
                ],
              },
              {
                layout: "noBorders",
                margin: [0, 10, 0, 0],
                table: {
                  widths: [60, 120, 130, "*"],
                  body: [
                    [
                      {
                        text: "Profissão: ",
                        style: ["font-bold"],
                      },
                      responsibles?.techinical?.position ?? FIELD_EMPTY,
                      {
                        text: "Registro no Conselho: ",
                        style: ["font-bold"],
                      },
                      responsibles?.techinical?.professionalClass
                        ? `${responsibles?.techinical?.professionalClass?.institution} - ${responsibles?.techinical?.professionalClass?.identity}`
                        : FIELD_EMPTY,
                    ],
                  ],
                },
              },
              {
                margin: [0, 10, 0, 0],
                text: [
                  {
                    text: "Endereço residencial: ",
                    style: ["font-bold"],
                  },
                  responsibles?.techinical?.address
                    ? `${responsibles?.techinical.address.street}, ${responsibles?.techinical.address.number}` +
                      (responsibles?.techinical.address.complement
                        ? `- ${responsibles?.techinical.address.complement}`
                        : "")
                    : FIELD_EMPTY,
                ],
              },
              {
                layout: "noBorders",
                margin: [0, 10, 0, 0],
                table: {
                  widths: [50, 180, 45, "*"],
                  body: [
                    [
                      {
                        text: "Bairro: ",
                        style: ["font-bold"],
                      },
                      responsibles?.techinical?.address?.neighborhood ??
                        FIELD_EMPTY,
                      {
                        text: "CEP: ",
                        style: ["font-bold"],
                      },
                      responsibles?.techinical?.address?.zip
                        ? zipMask(responsibles?.techinical?.address?.zip)
                        : FIELD_EMPTY,
                    ],
                    [
                      {
                        margin: [0, 10, 0, 0],
                        text: "Cidade: ",
                        style: ["font-bold"],
                      },
                      {
                        text:
                          responsibles?.techinical?.address?.city ??
                          FIELD_EMPTY,
                        margin: [0, 10, 0, 0],
                      },
                      {
                        margin: [0, 10, 0, 0],
                        text: "Estado: ",
                        style: ["font-bold"],
                      },
                      {
                        text:
                          responsibles?.techinical?.address?.state ??
                          FIELD_EMPTY,
                        margin: [0, 10, 0, 0],
                      },
                    ],
                  ],
                },
              },
              {
                margin: [0, 10, 0, 0],
                text: [
                  {
                    text: "Fone / Fax: ",
                    style: ["font-bold"],
                  },
                  responsibles?.techinical?.phone
                    ? phoneMask(responsibles?.techinical?.phone)
                    : FIELD_EMPTY,
                ],
              },
              {
                margin: [0, 10, 0, 0],
                text: [
                  {
                    text: "Email: ",
                    style: ["font-bold"],
                  },
                  responsibles?.techinical?.email ?? FIELD_EMPTY,
                ],
              },
              {
                margin: [0, 30, 0, 0],
                text: "2. IDENTIFICAÇÃO DOS RESÍDUOS GERADOS ",
                style: ["font-bold"],
              },
              {
                margin: [0, 10, 0, 0],
                text: "Assinale com um X os resíduos que são gerados no estabelecimento:",
              },
              {
                margin: [15, 20, 0, 0],
                text: "GRUPO A: Resíduos Infectantes",
              },
              {
                lineHeight: 1.3,
                stack: [
                  {
                    text: "Resíduos que apresentam risco potencial à saúde pública e ao meio ambiente devido à presença de agentes biológicos",
                  },
                  {
                    margin: [15, 10, 0, 0],
                    text: "GRUPO A1",
                    style: ["font-bold"],
                  },
                  `(${
                    groupA.classificationIds?.includes("18 01 01") ? "X" : " "
                  }) culturas e estoques de microrganismos resíduos de fabricação de produtos biológicos, exceto os hemoderivados; (estes resíduos não podem deixar a unidade geradora sem tratamento prévio).`,
                  `(${
                    groupA.classificationIds?.includes("18 01 01") ? "X" : " "
                  }) meios de cultura e instrumentais utilizados para transferência, inoculação ou mistura de culturas; (estes resíduos não podem deixar a unidade geradora sem tratamento prévio).`,
                  `(${
                    groupA.classificationIds?.includes("18 01 01") ? "X" : " "
                  }) resíduos de laboratório de manipulação genética. (estes resíduos não podem deixar a unidade geradora sem tratamento prévio).`,
                  `(${
                    groupA.classificationIds?.includes("18 01 01") ? "X" : " "
                  }) resíduos resultantes de atividades de vacinação com microorganismos vivos ou atenuados, incluindo frascos de vacinas com expiração do prazo de validade, com conteúdo inutilizado, vazios ou com restos do produto, agulhas e seringas. (devem ser submetidos a tratamento antes da disposição final).`,
                  `(${
                    groupA.classificationIds?.includes("18 01 02") ? "X" : " "
                  }) resíduos resultantes da atenção à saúde de indivíduos ou animais, com suspeita ou certeza de contaminação biológica por agentes Classe de Risco 4 (Apêndice II), microrganismos com relevância epidemiológica e risco de disseminação ou causador de doença emergente que se torne epidemiologicamente importante ou cujo mecanismo de transmissão seja desconhecido. (devem ser submetidos a tratamento antes da disposição final).`,
                  `(${
                    groupA.classificationIds?.includes("18 01 03") ? "X" : " "
                  }) bolsas transfusionais contendo sangue ou hemocomponentes rejeitadas por contaminação ou por má conservação, ou com prazo de validade vencido, e aquelas oriundas de coleta incompleta; (devem ser submetidos a tratamento antes da disposição final).`,
                  "( ) sobras de amostras de laboratório contendo sangue ou líquidos corpóreos, recipientes e materiais resultantes do processo de assistência à saúde, contendo sangue ou líquidos corpóreos na forma livre. (devem ser submetidos a tratamento antes da disposição final).",
                  {
                    margin: [15, 10, 0, 0],
                    text: "GRUPO A2",
                    style: ["font-bold"],
                  },
                  `(${
                    groupA.classificationIds?.includes("18 01 05") ? "X" : " "
                  }) carcaças, peças anatômicas, vísceras e outros resíduos provenientes de animais submetidos a processos de experimentação com inoculação de microorganismos, bem como suas forrações, e os cadáveres de animais suspeitos de serem portadores de microrganismos de relevância epidemiológica e com risco de disseminação, que foram submetidos ou não a estudo anátomo-patológico ou confirmação diagnóstica. (devem ser submetidos a tratamento antes da disposição final).`,
                  {
                    margin: [15, 10, 0, 0],
                    text: "GRUPO A3",
                    style: ["font-bold"],
                  },
                  `(${
                    groupA.classificationIds?.includes("18 01 06") ? "X" : " "
                  }) Peças anatômicas (membros) do ser humano; produto de fecundação sem sinais vitais, com peso menor que 500 gramas ou estatura menor que 25 centímetros ou idade gestacional menor que 20 semanas, que não tenham valor científico ou legal e não tenha havido requisição pelo paciente ou familiares.`,
                  {
                    margin: [15, 10, 0, 0],
                    text: "GRUPO A4",
                    style: ["font-bold"],
                  },
                  `(${
                    groupA.classificationIds?.includes("18 01 07") ? "X" : " "
                  }) Kits de linhas arteriais, endovenosas e dialisadores, quando descartados.`,
                  `(${
                    groupA.classificationIds?.includes("18 01 08") ? "X" : " "
                  }) Filtros de ar e gases aspirados de área contaminada; membrana filtrante de equipamento médico-hospitalar e de pesquisa, entre outros similares.`,
                  `(${
                    groupA.classificationIds?.includes("18 01 09") ? "X" : " "
                  }) Sobras de amostras de laboratório e seus recipientes contendo fezes, urina e secreções, provenientes de pacientes que não contenham e nem sejam suspeitos de conter agentes Classe de Risco 4, e nem apresentem relevância epidemiológica e risco de disseminação, ou microrganismo causador de doença emergente que se torne epidemiologicamente importante ou cujo mecanismo de transmissão seja desconhecido ou com suspeita de contaminação com príons.`,
                  `(${
                    groupA.classificationIds?.includes("18 01 10") ? "X" : " "
                  }) Resíduos de tecido adiposo proveniente de lipoaspiração, lipoescultura ou outro procedimento de cirurgia plástica que gere este tipo de resíduo.`,
                  `(${
                    groupA.classificationIds?.includes("18 01 11") ? "X" : " "
                  }) Recipientes e materiais resultantes do processo de assistência à saúde, que não contenha sangue ou líquidos corpóreos na forma livre.`,
                  `(${
                    groupA.classificationIds?.includes("18 01 12") ? "X" : " "
                  }) Peças anatômicas (órgãos e tecidos) e outros resíduos provenientes de procedimentos cirúrgicos ou de estudos anátomo-patológicos ou de confirmação diagnóstica.`,
                  `(${
                    groupA.classificationIds?.includes("18 01 13") ? "X" : " "
                  }) Carcaças, peças anatômicas, vísceras e outros resíduos provenientes de animais não submetidos a processos de experimentação com inoculação de microorganismos, bem como suas forrações.`,
                  `(${
                    groupA.classificationIds?.includes("18 01 14") ? "X" : " "
                  }) Bolsas transfusionais vazias ou com volume residual pós-transfusão.`,
                  {
                    margin: [15, 10, 0, 0],
                    text: "GRUPO A5",
                    style: ["font-bold"],
                  },
                  `(${
                    groupA.classificationIds?.includes("18 01 15") ? "X" : " "
                  }) Órgãos, tecidos, fluidos orgânicos, materiais perfurocortantes ou escarificantes e demais materiais resultantes da atenção à saúde de indivíduos ou animais, com suspeita ou certeza de contaminação com príons.`,
                  {
                    margin: [15, 10, 0, 0],
                    text: "GRUPO B: Resíduos Químicos",
                    style: ["font-bold"],
                  },
                  "Resíduos que apresentam risco potencial à saúde pública e ao meio ambiente devido às suas características químicas.",
                  `(${
                    groupB?.classificationIds?.includes("18 02 01") ? "X" : " "
                  }) Produtos hormonais e produtos antimicrobianos; imunossupressores; digitálicos; imunomoduladores; anti-retrovirais, quando descartados por serviços de saúde, farmácias, drogarias e distribuidores de medicamentos ou apreendidos e os resíduos e insumos farmacêuticos dos Medicamentos controlados pela Portaria MS 344/98 e suas atualizações.`,
                  `(${
                    groupB?.classificationIds?.includes("18 02 02") ? "X" : " "
                  }) Resíduos de saneantes, desinfetantes, desinfestantes; resíduos contendo metais pesados; reagentes para laboratório, inclusive os recipientes contaminados por estes.`,
                  `(${
                    groupB?.classificationIds?.includes("18 02 03") ? "X" : " "
                  }) Efluentes de processadores de imagem (reveladores e fixadores).`,
                  `(${
                    groupB?.classificationIds?.includes("18 02 04") ? "X" : " "
                  }) Efluentes dos equipamentos automatizados utilizados em análises clínicas`,
                  "( ) Demais produtos considerados perigosos, conforme classificação da NBR 10.004 da ABNT (tóxicos, corrosivos, inflamáveis e reativos).",
                  {
                    margin: [15, 10, 0, 0],
                    text: "GRUPO D: Resíduos Comuns",
                    style: ["font-bold"],
                  },
                  "Resíduos que não apresentam risco biológico, químico ou radiológico à saúde ou ao meio ambiente, podendo ser equiparados aos resíduos domiciliares.",
                  `(${
                    concatenatedGroupDIds.includes("20 01 99") ? "X" : " "
                  }) papel de uso sanitário e fralda, absorventes higiênicos, peças descartáveis de vestuário, resto alimentar de paciente, material utilizado em anti-sepsia e hemostasia de venóclises equipo de soro e outros similares não classificados como A1;`,
                  `(${
                    concatenatedGroupDIds.includes("20 01 08") ? "X" : " "
                  }) sobras de alimentos e do preparo de alimentos;`,
                  `(${
                    concatenatedGroupDIds.includes("20 01 08") ? "X" : " "
                  }) resto alimentar de refeitório;`,
                  `(${
                    concatenatedGroupDIds.includes("20 03 01") ? "X" : " "
                  }) resíduos provenientes das áreas administrativas;`,
                  `(${
                    concatenatedGroupDIds.includes("20 02 01") ? "X" : " "
                  }) resíduos de varrição, flores, podas e jardins`,
                  `(${
                    concatenatedGroupDIds.includes("20 03 99") ? "X" : " "
                  }) resíduos de gesso provenientes de assistência à saúde`,
                  {
                    text: `(${
                      getOthersGroupDClassificationIds() ? "X" : " "
                    }) Outros resíduos do grupo D. Descreva:\n${getOthersGroupDClassificationIds()}`,
                  },
                  {
                    margin: [15, 10, 0, 0],
                    text: "GRUPO E: Materiais perfurocortantes ou escarificantes.",
                    style: ["font-bold"],
                  },
                  {
                    text: `(${
                      groupA.classificationIds?.includes("18 04 01") ? "X" : " "
                    }) Materiais perfurocortantes ou escarificantes, tais como: lâminas de barbear, agulhas, escalpes, ampolas de vidro, brocas, limas endodônticas, pontas diamantadas, lâminas de bisturi, lancetas; tubos capilares; micropipetas; lâminas e lamínulas; espátulas; e todos os utensílios de vidro quebrados no laboratório (pipetas, tubos de coleta sanguínea e placas de Petri) e outros similares\n`,
                  },
                  "( ) outros similares.",
                ],
              },
              {
                text: "3. QUANTIFICAÇÃO DOS RESÍDUOS",
                style: ["font-bold"],
                margin: [0, 25, 0, 0],
              },
              {
                text: "Indique a quantidade gerada de cada tipo de resíduos, em litros ou em kg por semana:",
                margin: [0, 5, 0, 0],
              },
              {
                text: [
                  {
                    text: "Grupo A, Resíduos Infectantes (Total): ",
                    style: ["font-bold"],
                  },
                  setGroupQuantity(
                    groupA?.quantity,
                    groupA?.unit,
                    groupA?.frequency
                  ),
                ],
                margin: [0, 25, 0, 0],
              },
              {
                text: [
                  {
                    text: "Grupo B, Resíduos Químicos: ",
                    style: ["font-bold"],
                  },
                  setGroupQuantity(
                    groupB?.quantity,
                    groupB?.unit,
                    groupA?.frequency
                  ),
                ],
                margin: [0, 5, 0, 0],
              },
              {
                text: [
                  {
                    text: "Grupo D, Resíduos Comuns – não recicláveis: ",
                    style: ["font-bold"],
                  },
                  setGroupQuantity(
                    groupDNr?.quantity,
                    groupDNr?.unit,
                    groupDNr?.frequency
                  ),
                ],
                margin: [0, 5, 0, 0],
              },
              {
                text: [
                  {
                    text: "Grupo D, Resíduos Comuns – recicláveis: ",
                    style: ["font-bold"],
                  },
                  setGroupQuantity(
                    groupDR?.quantity,
                    groupDR?.unit,
                    groupDR?.frequency
                  ),
                ],
                margin: [0, 5, 0, 0],
              },
              {
                text: [
                  {
                    text: "Grupo E, Resíduos Perfurantes: ",
                    style: ["font-bold"],
                  },
                  setGroupQuantity(
                    groupE?.quantity,
                    groupE?.unit,
                    groupE?.frequency
                  ),
                ],
                margin: [0, 5, 0, 0],
              },
              {
                text: "4. ACONDICIONAMENTO DOS RESÍDUOS – Obrigações Legais",
                style: ["font-bold"],
                margin: [0, 25, 0, 0],
              },
              {
                text: "Os resíduos deste estabelecimento serão acondicionados e armazenados da seguinte forma, de acordo com as Resoluções RDC – ANVISA nº 306/2004, CONAMA nº 358/2005 e normas pertinentesda ABNT e do município sede do estabelecimento:",
                margin: [0, 5, 0, 0],
              },
              {
                lineHeight: 1.3,
                stack: [
                  {
                    margin: [0, 25, 0, 0],
                    text: "GRUPO A: Resíduos Infectantes",
                    style: ["font-bold"],
                  },
                  {
                    text: "São acondicionados em sacos plásticos, impermeáveis e resistentes, de cor branca leitosa, com simbologia de resíduo infectante. (observar a necessidade de utilização de sacos vermelhos – RDC 306/04 – ANVISA)",
                  },
                  "São armazenados em recipientes estanques, metálicos ou de plástico, com tampa, de fácil higienização e manuseio.",
                  {
                    margin: [0, 25, 0, 0],
                    text: "GRUPO B: Resíduos Químicos",
                    style: ["font-bold"],
                  },
                  "São acondicionados em duplo saco plástico de cor branca leitosa, com identificação do resíduo e dos riscos; ou acondicionados em recipiente rígido e estanque, compatível com as características físico-químicas do resíduo ou produto a ser descartado, identificando de forma visível com o nome do conteúdo e suas principais características.",
                  {
                    margin: [0, 25, 0, 0],
                    text: "GRUPO D: Resíduos Comuns",
                    style: ["font-bold"],
                  },
                  "São acondicionados em sacos pretos resistentes de modo a evitar derramamento durante o manuseio. Os resíduos comuns recicláveis (papel, papelão, plástico e vidro) podem ser separados e destinados à reciclagem.",
                  {
                    margin: [0, 25, 0, 0],
                    text: "GRUPO E: Resíduos Perfurantes ou escarificantes",
                    style: ["font-bold"],
                  },
                  "Os resíduos perfurantes e cortantes do Grupo A são acondicionados e armazenados em recipientes rígidos, resistentes à punctura, rompimento e vazamento, com tampa, devidamente identificados com a simbologia de resíduo infectante e perfurocortante.",
                  {
                    margin: [0, 25, 0, 0],
                    text: "5. COLETA INTENA DOS RESÍDUOS – Obrigações Legais",
                    style: ["font-bold"],
                  },
                  {
                    text: "Os resíduos deverão seguir os seguintes procedimentos ao serem transportados dentro do estabelecimento, de acordo com as Resoluções RDC – ANVISA nº 306/2004, CONAMA nº 358/2005 e normas pertinentesda ABNT e do município sede do estabelecimento.",
                  },
                  {
                    separator: ")",
                    lineHeight: 1.3,
                    margin: [0, 15, 0, 0],
                    ol: [
                      "O transporte dos recipientes deve se realizado sem esforço excessivo ou risco de acidente para o funcionário.",
                      {
                        text: "Os procedimentos devem ser realizados de forma a não permitir o rompimento dos recipientes. No caso de acidente ou derramamento, deve-se imediatamente realizar a limpeza e desinfecção simultânea do local, e notificar a chefia da unidade.",
                        margin: [0, 20, 0, 0],
                      },
                    ],
                  },
                  {
                    margin: [0, 25, 0, 0],
                    text: "6. ABRIGO DOS RESÍDUOS – Obrigações Legais",
                    style: ["font-bold"],
                  },
                  {
                    text: "Os resíduos deverão seguir os seguintes procedimentos ao serem transportados dentro do estabelecimento, de acordo com as Resoluções RDC – ANVISA nº 306/2004, CONAMA nº 358/2005 e normas pertinentesda ABNT e do município sede do estabelecimento.",
                    margin: [0, 5, 0, 0],
                  },
                  {
                    separator: ")",
                    lineHeight: 1.3,
                    margin: [0, 15, 0, 0],
                    ol: [
                      "O abrigo de resíduos deve ser constituído de um local fechado, ser exclusivo para guarda temporária de resíduos de serviços de saúde, devidamente acondicionados em recipientes.",
                      {
                        text: "As dimensões do abrigo devem ser suficientes para armazenar a produção de resíduos de até três dias, sem empilhamento dos recipientes acima de 1,20 m.",
                        margin: [0, 10, 0, 0],
                      },
                      {
                        text: "O piso, paredes, porta e teto devem ser de material liso, impermeável, lavável e de cor branca.",
                        margin: [0, 10, 0, 0],
                      },
                      {
                        text: "A porta deve ostentar o símbolo de substância infectante.",
                        margin: [0, 10, 0, 0],
                      },
                      {
                        text: "O abrigo de resíduo deve ser higienizado após a coleta externa ou sempre que ocorrer derramamento.",
                        margin: [0, 10, 0, 0],
                      },
                    ],
                  },
                  {
                    margin: [0, 25, 0, 0],
                    text: "7. TRATAMENTO E DESTINO FINAL DOS RESÍDUOS – Obrigações Legais",
                    style: ["font-bold"],
                  },
                  {
                    text: "Os resíduos deverão ser tratados e destinados da seguinte forma, de acordo com Resoluções RDC – ANVISA nº 306/2004, CONAMA nº 358/2005 e normas pertinentesda ABNT e do município sede do estabelecimento.",
                    margin: [0, 5, 0, 0],
                  },
                  {
                    margin: [0, 25, 0, 0],
                    text: "8.COLETA EXTERNA DOS RESIDUOS",
                    style: ["font-bold"],
                  },
                  {
                    text: "Indique a entidade, devidamente licenciada pelo órgão ambiental, que realiza a coleta e transporte externo de cada tipo de resíduo, até a sua destinação final.",
                    margin: [0, 5, 0, 0],
                  },
                  {
                    margin: [15, 15, 0, 0],
                    stack: [
                      {
                        text: "GRUPO A: Resíduos Infectantes",
                        style: ["font-bold"],
                      },
                      {
                        text: [
                          {
                            text: "Responsável pelo transporte: ",
                            style: ["font-bold"],
                          },
                          groupA ? getCompaniesTransport(groupA) : FIELD_EMPTY,
                        ],
                      },
                      {
                        text: [
                          {
                            text: "Veículo utilizado: ",
                            style: ["font-bold"],
                          },
                          groupA ? "Caminhão" : FIELD_EMPTY,
                        ],
                      },
                      {
                        text: [
                          {
                            text: "Freqüência de coleta: ",
                            style: ["font-bold"],
                          },
                          groupA?.collectionFrequency !== undefined
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
                          groupA.treatment !== undefined
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
                          groupA
                            ? getCompaniesDestination(groupA)
                            : FIELD_EMPTY,
                        ],
                      },
                      {
                        text: "GRUPO B: Resíduos Químicos",
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
                          groupB ? "Caminhão" : FIELD_EMPTY,
                        ],
                      },
                      {
                        text: [
                          {
                            text: "Freqüência de coleta: ",
                            style: ["font-bold"],
                          },
                          groupB?.collectionFrequency !== undefined
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
                          groupB?.treatment !== undefined
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
                          groupB
                            ? getCompaniesDestination(groupB)
                            : FIELD_EMPTY,
                        ],
                      },
                      {
                        text: "GRUPO D: Resíduos Comuns Não Recicláveis",
                        style: ["font-bold"],
                        margin: [0, 15, 0, 0],
                      },
                      {
                        text: [
                          {
                            text: "Responsável pelo transporte: ",
                            style: ["font-bold"],
                          },
                          groupDNr
                            ? getCompaniesTransport(groupDNr)
                            : FIELD_EMPTY,
                        ],
                      },
                      {
                        text: [
                          {
                            text: "Veículo utilizado: ",
                            style: ["font-bold"],
                          },
                          groupDNr ? "Caminhão" : FIELD_EMPTY,
                        ],
                      },
                      {
                        text: [
                          {
                            text: "Freqüência de coleta: ",
                            style: ["font-bold"],
                          },
                          groupDNr?.collectionFrequency !== undefined
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
                          groupDNr
                            ? getCompaniesDestination(groupDNr)
                            : FIELD_EMPTY,
                        ],
                      },
                      {
                        text: "GRUPO D: Resíduos Recicláveis",
                        style: ["font-bold"],
                        margin: [0, 15, 0, 0],
                      },
                      {
                        text: [
                          {
                            text: "Responsável pelo transporte: ",
                            style: ["font-bold"],
                          },
                          groupDR
                            ? getCompaniesTransport(groupDR)
                            : FIELD_EMPTY,
                        ],
                      },
                      {
                        text: [
                          {
                            text: "Veículo utilizado: ",
                            style: ["font-bold"],
                          },
                          groupDR ? "Caminhão" : FIELD_EMPTY,
                        ],
                      },
                      {
                        text: [
                          {
                            text: "Freqüência de coleta: ",
                            style: ["font-bold"],
                          },
                          groupDR?.collectionFrequency !== undefined
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
                          groupDR
                            ? getCompaniesDestination(groupDR)
                            : FIELD_EMPTY,
                        ],
                      },
                      {
                        text: "GRUPO E: Resíduos Perfurantes ou escarificantes",
                        style: ["font-bold"],
                        margin: [0, 15, 0, 0],
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
                          groupE ? "Caminhão" : FIELD_EMPTY,
                        ],
                      },
                      {
                        text: [
                          {
                            text: "Freqüência de coleta: ",
                            style: ["font-bold"],
                          },
                          groupE?.collectionFrequency !== undefined
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
                          groupE?.treatment !== undefined
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
                          groupE
                            ? getCompaniesDestination(groupE)
                            : FIELD_EMPTY,
                        ],
                      },
                    ],
                  },
                  {
                    margin: [0, 25, 0, 0],
                    text: "9. SAÚDE E SEGURANÇA OCUPACIONAL – Obrigações legais e recomendações",
                    style: ["font-bold"],
                  },
                  {
                    text: "As seguintes medidas serão implantadas neste estabelecimento, de acordo com Resoluções RDC – ANVISA nº 306/2004, CONAMA nº 358/2005 e normas pertinentesda ABNT e do município sede do estabelecimento",
                    margin: [0, 15, 0, 0],
                  },
                  {
                    text: "1) Durante o manuseio dos resíduos o funcionário deverá utilizar os seguintes equipamentos de proteção individual: luvas: de PVC ou borracha, impermeáveis, resistentes, de cor clara, antiderrapantes e de cano longo; e avental: de PVC, impermeável e de médio comprimento.",
                  },
                  {
                    text: "2) Após a coleta interna, o funcionário deve lavar as mãos ainda enluvadas, retirando as luvas e colocando-as em local apropriado. O funcionário deve lavar as mãos antes de calçar as luvas e depois de retirá-las.",
                  },
                  {
                    text: "3) Em caso de ruptura das luvas, o funcionário deve descartá-las imediatamente, não as reutilizando.",
                  },
                  {
                    text: "4) Estes equipamentos de proteção individual devem ser lavados e desinfetados diariamente. Sempre que houver contaminação com material infectante, devem ser substituídos imediatamente, lavados e esterilizados.",
                  },
                  {
                    text: "As pessoas envolvidas com o manuseio de resíduos devem ser submetidas a exame admissional, periódico, de retorno ao trabalho, mudança de função e demissional. Os exames e avaliações que devem ser submetidas são: Anamnese ocupacional, Exame físico, Exame mental. Os funcionários também devem ser vacinados contra tétano, hepatite e outras considerações importantes pela Vigilância Sanitária.",
                  },
                  {
                    text: "Para a prevenção de acidentes e exposição do trabalhador e agentes biológicos devem ser adotadas as seguintes medidas:",
                  },
                  {
                    text: "1) Realizar anti-sepsia das mãos sempre que houver contato da pele com sangue e secreções",
                    margin: [0, 15, 0, 0],
                  },
                  {
                    text: "2) Usar luvas sempre e, após retirá-las realizar lavagem das mãos",
                  },
                  {
                    text: "3) Não fumar e não alimentar-se durante o manuseio com resíduos.",
                  },
                  {
                    text: "4) Retirar as luvas e lavar as mãos sempre que exercer outra atividade não relacionada aos resíduos (ir ao sanitário, atender o telefone, beber água, etc.)",
                  },
                  {
                    text: "5) Manter o ambiente sempre limpo.",
                  },
                  {
                    text: "Em caso de acidente com perfurantes e cortantes, as seguintes medidas serão tomadas:",
                    margin: [0, 15, 0, 0],
                  },
                  {
                    text: "1) Lavar bem o local com solução de detergente neutro.",
                  },
                  {
                    text: "2) Aplicar solução anti-séptica (álcool iodado, álcool glicerinado a 70%) de 30segundos a 2 minutos.",
                  },
                  {
                    text: "3) Notificar imediatamente a chefia da unidade, e encaminhar para o pronto atendimento se necessário.",
                  },
                ],
              },
            ],
          },
          {
            pageBreak: "before",
            style: ["text-justify"],
            stack: [
              {
                text: "10. BIBLIOGRAFIA",
                style: ["font-bold"],
              },
              {
                text: "Para fins de atendimento de apresentação do Plano de Gerenciamento de Resíduos Sólidos Sépticos, deverão ser observadas as seguintes Legislações e Normas Técnicas:",
                margin: [0, 15, 0, 0],
              },
              {
                text: "LEI FEDERAL Nº 9605/98 – Dispõe sobre crimes ambientais.",
                margin: [0, 15, 0, 0],
              },
              {
                text: "RESOLUÇÃO CONAMA Nº 01/86 – Estabelece definições, responsabilidade, critérios básicos, e diretrizes da avaliação do impacto ambiental , determina que aterros sanitários, processamento e destino final de resíduos tóxicos ou perigosos são passiveis de avaliação.",
                margin: [0, 15, 0, 0],
              },
              {
                text: "RESOLUÇÃO CONAMA Nº 05/88 – Especifica licenciamento de obras de unidade de transferências, tratamento e disposição final de resíduos sólidos de origem domésticas, públicas, industriais e de origem hospitalar.",
                margin: [0, 15, 0, 0],
              },
              {
                text: "RESOLUÇÃO CONAMA Nº 05/93 – dispões sobre destinação dos resíduos sólidos de serviço de saúde, portos, aeroportos, terminais rodoviários e ferroviários. Onde define a responsabilidade do gerador quanto o gerenciamento dos resíduos desde a geração até a disposição final.",
                margin: [0, 15, 0, 0],
              },
              {
                text: "RESOLUÇÃO CONAMA Nº 358/2005 – Dispõe sobre o tratamento a destinação final dos resíduos dos serviços de saúde.",
                margin: [0, 15, 0, 0],
              },
              {
                text: "RESOLUÇÃO ANVISA RDC 306/04 – Dispõe sobre o regulamento técnico para o gerenciamento de resíduos dos serviços de saúde.",
                margin: [0, 15, 0, 0],
              },
              {
                text: "NBR 10.004/87 – Classifica os resíduos sólidos quanto aos seus riscos potenciais ao meio ambiente e à sua saúde.",
                margin: [0, 15, 0, 0],
              },
              {
                text: "NBR 7.500/87 – Símbolos de risco e manuseio para o transporte e armazenamento de resíduos sólidos.",
                margin: [0, 15, 0, 0],
              },
              {
                text: "NBR 12.235/92 – Armazenamento de resíduos sólidos perigosos definidos na NBR 10.004 – procedimentos",
                margin: [0, 15, 0, 0],
              },
              {
                text: "NBR 12807/93 – Resíduos de serviços de saúde – terminologia.",
                margin: [0, 15, 0, 0],
              },
              {
                text: "NBR 12808/93 – Resíduos de serviços de saúde – classificação.",
                margin: [0, 15, 0, 0],
              },
              {
                text: "NBR 12809/93 – Manuseio de resíduos de serviços de saúde – procedimentos.",
                margin: [0, 15, 0, 0],
              },
              {
                text: "NBR 12810/93 – Coleta de resíduos de serviços de saúde – procedimentos.",
                margin: [0, 15, 0, 0],
              },
              {
                text: "NBR 12980/93 – Coleta, varrição e acondicionamento de resíduos sólidos urbanos terminologia.",
                margin: [0, 15, 0, 0],
              },
              {
                text: "NBR 11.175/90 – Fixa as condições exigíveis de desempenho do equipamento para incineração de resíduos sólidos perigosos.",
                margin: [0, 15, 0, 0],
              },
              {
                text: "NBR 13.853/97 – Coletores para resíduos de seviços de saúde perfurantes ou cortantes – requisitos e métodos de ensaio.",
                margin: [0, 15, 0, 0],
              },
              {
                text: "CNEN – NE 6.05/98 gerência dos rejeitos radioativos",
                style: ["font-bold"],
                margin: [0, 15, 0, 0],
              },
              {
                text: "11. CONSIDERAÇÕES FINAIS",
                style: ["font-bold"],
                margin: [0, 25, 0, 0],
              },
              {
                text: "Este estabelecimento se compromete a seguir as disposições e implantar as medidas contidas neste plano.",
                margin: [0, 15, 0, 0],
              },
              {
                text: `Local: Irati - PR.               Data: ${new Date().toLocaleString(
                  "pt-BR",
                  { month: "long", year: "numeric", day: "numeric" }
                )}.`,
                margin: [0, 15, 0, 0],
              },
              {
                margin: [0, 35, 0, 0],
                columns: [
                  {
                    text: "",
                    width: 200,
                  },
                  {
                    style: ["text-center"],
                    width: 220,
                    stack: [
                      "______________________________",
                      "Assinatura do Responsável pelo Estabelecimento Gerador",
                    ],
                  },
                ],
              },
              {
                margin: [0, 35, 0, 0],
                columns: [
                  {
                    text: "",
                    width: 200,
                  },
                  {
                    style: ["text-center"],
                    width: 220,
                    stack: [
                      "______________________________",
                      "Assinatura do Responsável Técnico pelo Plano de Gerenciamento",
                    ],
                  },
                ],
              },
            ],
          },
          {
            pageBreak: "before",
            style: ["text-justify"],
            lineHeight: 1.3,
            stack: [
              {
                text: "ANEXO II",
                style: ["font-bold", "text-center"],
              },
              {
                fontSize: 14,
                text: "TERMO DE REFERÊNCIA COM AS DIRETRIZES PARA ELABORAÇÃO E APRESENTAÇÃO DO PLANO DE GERENCIAMENTO DE RESÍDUOS DE SERVIÇOS DE SAÚDE – P.G.R.S.S.",
                margin: [0, 15, 0, 0],
                style: ["text-justify", "font-italics"],
              },
              {
                text: "Acima 30 litros/semana",
                margin: [0, 5, 0, 0],
                style: ["font-bold", "text-center"],
              },
              {
                text: "(aplicável para estabelecimentos que geram resíduos quimioterápicos e radioativos)",
                margin: [0, 15, 0, 0],
                style: ["font-italics"],
              },
              {
                text: "1 - IDENTIFICAÇÃO",
                margin: [0, 15, 0, 0],
                style: ["font-bold"],
              },
              {
                text: "Razão Social, Nome Fantasia, CNPJ, Endereço, CEP, Município, Telefone, Fax, E-mail, Identificação do Responsável Legal pelo Estabelecimento.",
                margin: [0, 5, 0, 0],
              },
              {
                text: "2 - INFORMAÇÕES GERAIS",
                margin: [0, 15, 0, 0],
                style: ["font-bold"],
              },
              {
                margin: [15, 5, 0, 0],
                stack: [
                  "2.1 - Nº de Leitos (total e por especialidade médica).",
                  "2.2 - Área construída (m²)",
                  "2.3 - Área total do terreno (m²)",
                  "2.4 - Especialidades médicas",
                  "2.5 - Nº de funcionários (inclusive copo clínico, serviços terciais e prestadores de serviços)",
                  "2.6 - Horários de funcionamento",
                  "2.7 - Data de início do funcionamento",
                  "2.8 - Volumes médios de resíduos produzidos, por tipo e intervalos de coletas",
                  "2.9 - Intervalos entre as coletas internas e externas.",
                ],
              },
              {
                margin: [0, 25, 0, 0],
                text: "3 - INFORMAÇÕES TÉCNICAS",
                style: ["font-bold"],
              },
              {
                text: "3.1 - Classificação dos Resíduos",
                style: ["font-bold", "text-underline"],
                margin: [15, 15, 0, 0],
              },
              {
                text: [
                  { text: " " },
                  "  Descrever o manejo dos resíduos sólidos, desde o local de geração, segregação, quantificação diária, acondicionamento interno, coleta interna, transporte interno, armazenamento interno, tratamento interno, coleta externa, armazenamento externo, transporte externo, tratamento externo e disposição final segundo a seguinte classificação:",
                ],
              },
              {
                margin: [0, 15, 0, 0],
                text: [
                  " ",
                  { text: "     3.1.1 - GRUPO “A”", style: ["font-bold"] },
                  " - Resíduos com a possível presença de agentes biológicos que, por suas características, podem apresentar risco de infecção.",
                ],
              },
              {
                text: [" ", "      A1"],
                margin: [0, 15, 0, 0],
                style: ["font-bold"],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Culturas e estoques de microrganismos resíduos de fabricação de produtos biológicos, exceto os hemoderivados; descarte de vacinas de microrganismos vivos ou atenuados; meios de cultura e instrumentais utilizados para transferência, inoculação ou mistura de culturas; resíduos de laboratórios de manipulação genética.",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Resíduos resultantes da atenção à saúde de indivíduos ou animais, com suspeita ou certeza de contaminação biológica por agentes Classe de Risco 4 (Apêndice II), microrganismos com relevância epidemiológica e risco de disseminação ou causador de doença emergente que se torne epidemiologicamente importante ou cujo mecanismo de transmissão seja desconhecido.",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Bolsas transfusionais contendo sangue ou hemocomponentes rejeitadas por contaminação ou por má conservação, ou com prazo de validade vencido, e aquelas oriundas de coleta incompleta.",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Sobras de amostras de laboratório contendo sangue ou líquidos corpóreos, recipientes e materiais resultantes do processo de assistência à saúde, contendo sangue ou líquidos corpóreos na forma livre.",
                ],
              },
              {
                text: [" ", "      A2"],
                margin: [0, 15, 0, 0],
                style: ["font-bold"],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Carcaças, peças anatômicas, vísceras e outros resíduos provenientes de animais submetidos a processos de experimentação com inoculação de microorganismos, bem como suas forrações, e os cadáveres de animais suspeitos de serem portadores de microrganismos de relevância epidemiológica e com risco de disseminação, que foram submetidos ou não a estudo anátomo-patológico ou confirmação diagnóstica.",
                ],
              },
              {
                text: [" ", "      A3"],
                margin: [0, 15, 0, 0],
                style: ["font-bold"],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Peças anatômicas (membros) do ser humano; produto de fecundação sem sinais vitais, com peso menor que 500 gramas ou estatura menor que 25 centímetros ou idade gestacional menor que 20 semanas, que não tenham valor científico ou legal e não tenha havido requisição pelo paciente ou familiares.",
                ],
              },
              {
                text: [" ", "      A4"],
                margin: [0, 15, 0, 0],
                style: ["font-bold"],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Kits de linhas arteriais, endovenosas e dialisadores, quando descartados.",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Filtros de ar e gases aspirados de área contaminada; membrana filtrante de equipamento médico-hospitalar e de pesquisa, entre outros similares.",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Sobras de amostras de laboratório e seus recipientes contendo fezes, urina e secreções, provenientes de pacientes que não contenham e nem sejam suspeitos de conter agentes Classe de Risco 4, e nem apresentem relevância epidemiológica e risco de disseminação, ou microrganismo causador de doença emergente que se torne epidemiologicamente importante ou cujo mecanismo de transmissão seja desconhecido ou com suspeita de contaminação com príons.",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Resíduos de tecido adiposo proveniente de lipoaspiração, lipoescultura ou outro procedimento de cirurgia plástica que gere este tipo de resíduo.",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Recipientes e materiais resultantes do processo de assistência à saúde, que não contenha sangue ou líquidos corpóreos na forma livre.",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Peças anatômicas (órgãos e tecidos) e outros resíduos provenientes de procedimentos cirúrgicos ou de estudos anátomo-patológicos ou de confirmação diagnóstica.",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Carcaças, peças anatômicas, vísceras e outros resíduos provenientes de animais não submetidos a processos de experimentação com inoculação de microorganismos, bem como suas forrações.",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Bolsas transfusionais vazias ou com volume residual pós-transfusão.",
                ],
              },
              {
                text: [" ", "      A5"],
                margin: [0, 15, 0, 0],
                style: ["font-bold"],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Órgãos, tecidos, fluidos orgânicos, materiais perfurocortantes ou escarificantes e demais materiais resultantes da atenção à saúde de indivíduos ou animais, com suspeita ou certeza de contaminação com príons.",
                ],
              },
              {
                margin: [0, 15, 0, 0],
                text: [
                  " ",
                  { text: '     3.1.2 - GRUPO "B" - ', style: ["font-bold"] },
                  "Resíduos contendo substâncias químicas que podem apresentar risco à saúde pública ou ao meio ambiente, dependendo de suas características de inflamabilidade, corrosividade, reatividade e toxicidade.",
                ],
              },
              {
                margin: [0, 10, 0, 0],
                columns: [
                  { text: "-", width: 15 },
                  "Produtos hormonais e produtos antimicrobianos; citostáticos; antineoplásicos;",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Imunossupressores; digitálicos; imunomoduladores; anti-retrovirais, quando descartados por serviços de saúde, farmácias, drogarias e distribuidores de medicamentos ou apreendidos e os resíduos e insumos farmacêuticos dos Medicamentos controlados pela Portaria MS 344/98 e suas atualizações.",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Resíduos de saneantes, desinfetantes, desinfestantes; resíduos contendo metais pesados; reagentes para laboratório, inclusive os recipientes contaminados por estes.",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Efluentes de processadores de imagem (reveladores e fixadores).",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Efluentes dos equipamentos automatizados utilizados em análises clínicas",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "Demais produtos considerados perigosos, conforme classificação da NBR 10.004 da ABNT (tóxicos, corrosivos, inflamáveis e reativos).",
                ],
              },
              {
                margin: [0, 15, 0, 0],
                text: [
                  " ",
                  { text: '     3.1.3 - GRUPO "C" - ', style: ["font-bold"] },
                  {
                    text: "Quaisquer materiais resultantes de atividades humanas que  contenham radionuclídeos em quantidades superiores aos limites de isenção  especificados nas normas do CNEN e para os quais a reutilização é imprópria ou não  prevista.",
                  },
                ],
              },
              {
                margin: [0, 10, 0, 0],
                columns: [
                  { text: "-", width: 15 },
                  "Enquadram-se neste grupo os rejeitos radioativos ou contaminados com radionuclídeos, provenientes de laboratórios de análises clinicas, serviços de medicina nuclear e radioterapia, segundo a resolução CNEN-6.05.",
                ],
              },
              {
                margin: [0, 15, 0, 0],
                text: [
                  " ",
                  { text: '     3.1.4 - GRUPO "D" - ', style: ["font-bold"] },
                  {
                    text: "Resíduos que não apresentam risco biológico, químico ou radiológico à saúde ou ao meio ambiente, podendo ser equiparados aos resíduos domiciliares.",
                  },
                ],
              },
              {
                margin: [0, 10, 0, 0],
                columns: [
                  { text: "-", width: 15 },
                  "papel de uso sanitário e fralda, absorventes higiênicos, peças descartáveis de vestuário, resto alimentar de paciente, material utilizado em anti-sepsia e hemostasia de venóclises equipo de soro e outros similares não classificados como A1;",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "sobras de alimentos e do preparo de alimentos;",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "resto alimentar de refeitório;",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "resíduos provenientes das áreas administrativas;",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "resíduos de varrição, flores, podas e jardins;",
                ],
              },
              {
                columns: [
                  { text: "-", width: 15 },
                  "resíduos de gesso provenientes de assistência à saúde.",
                ],
              },
              {
                text: [
                  " ",
                  "     Deverá ser considerado, o princípio que conduzam à reciclagem dos resíduos comuns recicláveis (papel, papelão, metais, plásticos e vidros), devendo ser realizada a sua segregação nos locais de geração dos resíduos.",
                ],
                margin: [0, 15, 0, 0],
              },
              {
                text: [
                  " ",
                  "     a) os resíduos recicláveis serão encaminhados para armazenamento à espera do destino final e deverão ter suas destinações especificadas no PGRSS.",
                ],
              },
              {
                text: [
                  " ",
                  "     b) os resíduos não recicláveis deverão ter a sua destinação e tratamento especificado no PGRSS.",
                ],
              },
              {
                margin: [0, 15, 0, 0],
                text: [
                  " ",
                  { text: "     3.1.5 -GRUPO “E” - ", style: ["font-bold"] },
                  {
                    text: "Materiais perfurocortantes ou escarificantes, tais como: Lâminas de barbear, agulhas, escalpes, ampolas de vidro, brocas, limas endodônticas, pontas diamantadas, lâminas de bisturi, lancetas; tubos capilares; micropipetas; lâminas e lamínulas; espátulas; e todos os utensílios de vidro quebrados no laboratório (pipetas, tubos de coleta sanguínea e placas de Petri) e outros similares.",
                  },
                ],
              },
              {
                margin: [20, 15, 0, 0],
                text: [
                  "3.2 – ",
                  { text: "Informações Adicionais", style: ["text-underline"] },
                ],
                style: ["font-bold"],
              },
              {
                margin: [35, 15, 0, 0],
                stack: [
                  {
                    text: "a) Adotar, as normas da ABNT para acondicionamento, coleta, transporte, armazenamento, tratamento e disposição final;",
                  },
                  {
                    text: "b) Descrever e apresentar as condições sobre o acondicionamento de resíduos dos diferentes grupos, considerando volume produzido, embalagens e recipientes de coleta e acondicionamento;",
                  },
                  {
                    text: "c) Descrever e apresentar as condições sobre o meio de transporte interno dos resíduos do ponto gerador à sala de resíduos;",
                  },
                  {
                    text: "d) Descrever e apresentar as condições sobre o meio de transporte interno dos resíduos da sala de resíduos ao abrigo de resíduos externos;",
                  },
                  {
                    text: " e) Descrever e definir as condições e modo de higienização do local de armazenamento interno dos resíduos (sala de resíduos);",
                  },
                  {
                    text: " f) Descrever e definir as condições e modo de higienização do local de armazenamento externo dos resíduos (abrigo de resíduos externos) a espera da coleta e destinação final adequada;",
                  },
                  {
                    text: "g) Apresentar as condições e modo de higienização dos containeres;",
                  },
                  {
                    text: "h) Apresentar a forma de transporte externo dos resíduos até o seu tratamento e disposição final, descrever as características dos veículos coletores;",
                  },
                  {
                    text: "i) Definir o sistema de tratamento e disposição final dos resíduos infectantes pertencentes ao Grupo “A”, indicar o nome e endereço da Empresa contratada, anexar cópia do contrato e o licenciamento ambiental do órgão competente;",
                  },
                  {
                    text: "j) Encaminhar projeto do sistema de tratamento ou pré-tratamento dos resíduos infectantes pertencentes ao Grupo “A”;",
                  },
                  {
                    text: "k) Encaminhar projeto do sistema de tratamento dos efluentes líquidos, contendo no mínimo as diretrizes abaixo:",
                  },
                ],
              },
              {
                margin: [65, 15, 0, 0],
                stack: [
                  {
                    margin: [-15, 0, 0, 0],
                    text: [
                      { text: "1 – ", style: ["font-bold"] },
                      {
                        text: "Informações dos Efluentes Líquidos:",
                        style: ["text-underline"],
                      },
                    ],
                  },
                  "-Descrição do sistema de captação e disposição de águas pluviais",
                  "-Informações sobre o destino final dos esgotos sanitários",
                  "-Informações sobre a quantidade e qualidade (caracterização) dos efluentes líquidos.",
                  {
                    margin: [-15, 0, 0, 0],
                    text: [
                      { text: "2 – ", style: ["font-bold"] },
                      {
                        text: "Projeto Hidráulico do Tratamento de Efluentes Líquidos:",
                        style: ["text-underline"],
                      },
                    ],
                  },
                  "-Descrição(s) do sistema(s) de tratamento(s) adotado(s) para o tratamento de efluentes líquidos e domésticos;",
                  "-Dimensionamento (memorial de cálculo) das unidades que compõem o sistema.",
                ],
              },
              {
                margin: [35, 15, 0, 0],
                stack: [
                  {
                    text: "l) Definir e descrever os EPI’s – Equipamentos de Proteção Individual;",
                  },
                  {
                    text: "m)Informar sobre o destino dos resíduos quimioterápicos e fármacos pertencentes ao Grupo “B”, conforme diretrizes estabelecidas na Lei Estadual Nº 13.039/01, para os resíduos fármacos;",
                  },
                  {
                    text: "n) Descrever e informar sobre os resíduos de Raio X e seu destino final, quando vendido, indicar nome e endereço da Empresa compradora, anexar cópia do licenciamento ambiental do órgão competente;",
                  },
                  {
                    text: "o) Se o estabelecimento possui caldeira, descrever e apresentar as condições técnicas de desempenho, tais como: temperatura, pressão, duração de trabalho, capacidade, tipo de alimentação e equipamentos de controle;",
                  },
                  {
                    text: "p) Informar o cumprimento das normas da CNEN 6.05 - Comissão Nacional de Energia Nuclear, para os rejeitos radioativos pertencentes ao Grupo C;",
                  },
                  {
                    text: "q) Descrever e informar a existência de equipamentos que produzam resíduos gasosos ou atmosféricos, tais como: lavanderia, cozinha, padaria, geradores de energia ou vapor, central de esterilização pelo processo de óxido de etileno;",
                  },
                  {
                    text: "r) Descrever e apresentar o Plano de Auto-monitoramento;",
                  },
                  {
                    text: "s) Descrever e apresentar o Plano de Contingência – que é o plano de emergência que será utilizado pelo estabelecimento de saúde caso haja falha ou falta de coleta externa dos resíduos.",
                  },
                ],
              },
              {
                margin: [20, 15, 0, 0],
                text: [
                  "3.3 – ",
                  { text: "Complementações", style: ["text-underline"] },
                ],
                style: ["font-bold"],
              },
              {
                margin: [20, 15, 0, 0],
                text: [
                  " ",
                  { text: "         3.3.1", style: ["font-bold"] },
                  " – O Plano de Gerenciamento de Resíduos de Serviço de Saúde – P.G.R.S.S., deverá ser encaminhado ao órgão ambiental competente, sendo documento integrante do procedimento de Licenciamento Ambiental, junto com os demais documentos necessários à instrução do procedimento.",
                ],
              },
              {
                margin: [20, 15, 0, 0],
                text: [
                  " ",
                  { text: "         3.3.2", style: ["font-bold"] },
                  " – O plano de gerenciamento de resíduos deverá ser de responsabilidade e subscrito por um responsável técnico devidamente registrado em conselho profissional, com indicação expressa do nome, nº de registro do Conselho e endereço completo e anotação ou certidão de responsabilidade técnica expedida pelo respectivo conselho, o qual será responsável pelo correto gerenciamento dos resíduos gerados em decorrência de suas atividades. Caso o responsável técnico pela elaboração do plano de gerenciamento não seja o mesmo responsável técnico pela sua execução, deverá ser descrito conforme citadas acima as especificações de ambos.",
                ],
              },
              {
                margin: [20, 15, 0, 0],
                text: [
                  " ",
                  { text: "         3.3.3", style: ["font-bold"] },
                  " – A análise e aprovação do PGRSS se efetuarão pelos órgãos de meio ambiente e de saúde competentes, conforme os critérios técnicos definidos pela legislação vigente.",
                ],
              },
              {
                margin: [20, 15, 0, 0],
                text: [
                  " ",
                  { text: "         3.3.4", style: ["font-bold"] },
                  " – Durante a análise do Plano de Gerenciamento de Resíduos, poderão ser convocados para esclarecimentos adicionais os responsáveis técnicos pelo plano e sua elaboração, pelo gerenciamento e sua execução, pelo estabelecimento, individualmente ou em conjunto.",
                ],
              },
              {
                margin: [20, 15, 0, 0],
                text: [
                  " ",
                  { text: "         3.3.5", style: ["font-bold"] },
                  " – Deverá ser informado imediatamente aos órgãos de meio ambiente e de saúde competentes, sobre quaisquer modificações em seu tratamento normal dos resíduos gerados pelo estabelecimento, bem como sua disposição final.",
                ],
              },
              {
                margin: [20, 15, 0, 0],
                text: [
                  { text: "4 – ", style: ["font-bold"] },
                  "O Plano de Gerenciamento de Resíduos de Serviço de Saúde – P.G.R.S.S, deverá ser elaborado e apresentado conforme esteTermo de Referência, além das diretrizes contidas nas ",
                  {
                    text: "RESOLUÇÕES ANVISA/RDC/Nº 306/04, CONAMA Nº 05/93, CONAMA Nº 275/01, CONAMA Nº 357/05, CONAMA 358/05, LEI ESTADUAL Nº 13.039/01, ABNT - NBR 10.004/87, NBR 9.800/87, NBR 7.500/87,NBR 12.235/92, NBR 12.807/93, NBR 12.808/93, NBR 12.809/93, NBR 12.810/93, NBR 13.853/97, além de outras normas pertinentes da ABNT e do município sede do estabelecimento.",
                    style: ["font-bold"],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    images: {
      header,
    },
    styles: {
      "text-underline": {
        decoration: "underline",
      },
      "text-center": {
        alignment: "center",
      },
      "text-justify": {
        alignment: "justify",
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
