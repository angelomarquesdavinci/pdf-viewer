import {
  TDocumentDefinitions,
  TableCell,
  TableLayout,
} from "pdfmake/interfaces";
import {
  DOCUMENT_APPROVED_PREVENTION_ACTIONS,
  DOCUMENT_FREQUENCY,
  DOCUMENT_WASTE_COMPANY_LICENSE,
  DOCUMENT_WASTE_CONTAINMENT_ACCIDENT,
  DOCUMENT_WASTE_DANGERS,
  DOCUMENT_WASTE_EXTERNAL_PACKAGING,
  DOCUMENT_WASTE_FREQUENCY,
  DOCUMENT_WASTE_INTERNAL_TRANSPORTATION,
  DOCUMENT_WASTE_ORIGIN_POINT,
  DOCUMENT_WASTE_PACKING,
  DOCUMENT_WASTE_TREATMENT,
  DOCUMENT_WASTE_UNIT,
  DOCUMENT_WASTE_WEEKDAYS,
} from "../resource";
import {
  DocumentCompanyPeoplesInvolved,
  DocumentWasteClass,
  DocumentWasteCompanyLicense,
  IDocumentWaste,
  IRenderReq,
} from "../types/document/interface";
import {
  TECNICAL,
  cnpjMask,
  cpfMask,
  dateFormat,
  getClassificationId,
  getCnaeId,
  phoneMask,
  setUpAddress,
} from "../utils";

const FIELD_EMPTY = "[###]";

// const logo = "http://localhost:5173/francisco-beltrao-pr.jpg";

const borderOptions = {
  noBottom: [true, true, true, false],
  noTop: [true, false, true, true],
  horizontalOnly: [true, false, true, false],
  leftBottomOnly: [true, false, false, true],
  noBorder: [false, false, false, false],
  noRight: [true, true, false, true],
  noLeft: [false, true, true, true],
};

const thinBorderLayout: TableLayout = {
  hLineWidth: function () {
    return 0.1;
  },
  vLineWidth: function () {
    return 0.1;
  },
};

export function render({ classifications, cnaes, document }: IRenderReq) {
  const timeline: TableCell[][] = [];

  function daysOfWeekAndHours() {
    const days = (document.company?.weekDays ?? [])
      .sort()
      .map((day) => DOCUMENT_WASTE_WEEKDAYS(day))
      .join(", ");

    return `${days ?? FIELD_EMPTY} - ${
      document.company?.hoursDayStart ?? FIELD_EMPTY
    }h-${document.company?.hoursDayEnd ?? FIELD_EMPTY}h`;
  }

  function getPeopleInvolved(value: DocumentCompanyPeoplesInvolved): string {
    const res = document.company?.peopleInvolved?.types?.includes(value);

    return res ? "X" : " ";
  }

  function renderWastesTable(wasteClass: DocumentWasteClass): TableCell[][] {
    let classificationDescription = "";
    const wastesToRender =
      document?.wastes?.filter((item) => item.class === wasteClass) ?? [];
    let tableRows: TableCell[][] = [];

    switch (wasteClass) {
      case DocumentWasteClass.CLASS1:
        classificationDescription =
          "Ex: óleo lubrificante, pilha, lâmpada, material contaminado, substância química, tinta ou borra, lodo, lama, filtros de óleo";
        break;
      case DocumentWasteClass.CLASS2A:
        classificationDescription =
          "Ex: Orgânicos, cinza, óleo vegetal, papel, plástico, metal, lixa, gesso, madeira, rejeitos de varrição e de banheiro, tecido, embalagens longa vida";
        break;
      case DocumentWasteClass.CLASS2B:
        classificationDescription =
          "Ex: Vidro, cerâmica, concreto, areia, pneu";
        break;
    }

    for (let i = 0; i < wastesToRender.length; i += 3) {
      const wastesGroup = wastesToRender.slice(i, i + 3);

      tableRows = [
        ...tableRows,
        [
          { border: borderOptions.noBorder, text: "" },
          {
            text: `Resíduo ${i + 1}`,
            bold: true,
            alignment: "center",
            style: "grayLight",
          },
          {
            text: `Resíduo ${i + 2}`,
            bold: true,
            alignment: "center",
            style: "grayLight",
          },
          {
            text: `Resíduo ${i + 3}`,
            bold: true,
            alignment: "center",
            style: "grayLight",
          },
        ],
        [
          {
            text: [
              { text: "Resíduo Gerado: ", bold: true },
              classificationDescription,
            ],
          },
          wastesGroup[0]?.classificationId !== undefined
            ? getClassificationId(
                classifications,
                wastesGroup[0].classificationId
              )
            : "-",
          wastesGroup[1]?.classificationId !== undefined
            ? getClassificationId(
                classifications,
                wastesGroup[1].classificationId
              )
            : "-",
          wastesGroup[2]?.classificationId !== undefined
            ? getClassificationId(
                classifications,
                wastesGroup[2].classificationId
              )
            : "-",
        ],
        [
          {
            text: "Características do resíduo e risco ambiental, se descartado incorretamente",
            bold: true,
          },
          wastesGroup[0]?.dangers !== undefined
            ? DOCUMENT_WASTE_DANGERS(wastesGroup[0].dangers)
            : "-",
          wastesGroup[1]?.dangers !== undefined
            ? DOCUMENT_WASTE_DANGERS(wastesGroup[1].dangers)
            : "-",
          wastesGroup[2]?.dangers !== undefined
            ? DOCUMENT_WASTE_DANGERS(wastesGroup[2].dangers)
            : "-",
        ],
        [
          {
            stack: [
              { text: "Ponto de Geração: ", bold: true },
              "Ex: Refeitório, administração, área de produção",
            ],
          },
          (wastesGroup[0]?.originPoint || [])
            .map((origin) => DOCUMENT_WASTE_ORIGIN_POINT(origin))
            .join(", "),
          (wastesGroup[1]?.originPoint || [])
            .map((origin) => DOCUMENT_WASTE_ORIGIN_POINT(origin))
            .join(", "),
          (wastesGroup[2]?.originPoint || [])
            .map((origin) => DOCUMENT_WASTE_ORIGIN_POINT(origin))
            .join(", "),
        ],
        [
          {
            stack: [
              { text: "Volume: ", bold: true },
              {
                text: [
                  "Quantificar os resíduos em litros/semana ",
                  { text: "ou", bold: true, decoration: "underline" },
                  " outra unidade/período",
                ],
              },
            ],
            margin: [0, 0, 15, 0],
          },
          wastesGroup[0]
            ? `${wastesGroup[0].quantity} ${DOCUMENT_WASTE_UNIT(
                wastesGroup[0].unit!
              )}/${DOCUMENT_WASTE_FREQUENCY(wastesGroup[0].frequency!)}`
            : "-",
          wastesGroup[1]
            ? `${wastesGroup[1].quantity} ${DOCUMENT_WASTE_UNIT(
                wastesGroup[1].unit!
              )}/${DOCUMENT_WASTE_FREQUENCY(wastesGroup[1].frequency!)}`
            : "-",
          wastesGroup[2]
            ? `${wastesGroup[2].quantity} ${DOCUMENT_WASTE_UNIT(
                wastesGroup[2].unit!
              )}/${DOCUMENT_WASTE_FREQUENCY(wastesGroup[2].frequency!)}`
            : "-",
        ],
        [
          {
            stack: [
              { text: "Acondicionamento interno: ", bold: true },
              "Informar o local de primeira disposição dos resíduos. Ex: lixeira, caçamba.",
            ],
          },
          wastesGroup[0]?.packing !== undefined
            ? DOCUMENT_WASTE_PACKING(wastesGroup[0].packing)
            : "-",
          wastesGroup[1]?.packing !== undefined
            ? DOCUMENT_WASTE_PACKING(wastesGroup[1].packing)
            : "-",
          wastesGroup[2]?.packing !== undefined
            ? DOCUMENT_WASTE_PACKING(wastesGroup[2].packing)
            : "-",
        ],
        [
          {
            stack: [
              { text: "Armazenamento externo: ", bold: true },
              "Descrever a Att. Ex: área fechada, coberta, piso impermeável",
            ],
          },
          wastesGroup[0]?.externalPackaging !== undefined
            ? DOCUMENT_WASTE_EXTERNAL_PACKAGING(
                wastesGroup[0].externalPackaging
              )
            : "-",
          wastesGroup[1]?.externalPackaging !== undefined
            ? DOCUMENT_WASTE_EXTERNAL_PACKAGING(
                wastesGroup[1].externalPackaging
              )
            : "-",
          wastesGroup[2]?.externalPackaging !== undefined
            ? DOCUMENT_WASTE_EXTERNAL_PACKAGING(
                wastesGroup[2].externalPackaging
              )
            : "-",
        ],
        [
          {
            text: "Medidas de contenção em caso de acidente:",
            margin: [0, 0, 0, 25],
            bold: true,
          },
          wastesGroup[0]?.containmentAccident
            ?.map((item) => DOCUMENT_WASTE_CONTAINMENT_ACCIDENT(item))
            .join("; ") ?? "-",
          wastesGroup[1]?.containmentAccident
            ?.map((item) => DOCUMENT_WASTE_CONTAINMENT_ACCIDENT(item))
            .join("; ") ?? "-",
          wastesGroup[2]?.containmentAccident
            ?.map((item) => DOCUMENT_WASTE_CONTAINMENT_ACCIDENT(item))
            .join("; ") ?? "-",
        ],
        [
          {
            stack: [
              { text: "Forma de transporte interno: ", bold: true },
              "Descrever como o resíduo é retirado da origem e levado até a área de tratamento ou armazenamento",
            ],
          },
          wastesGroup[0]?.internalTransportation !== undefined
            ? DOCUMENT_WASTE_INTERNAL_TRANSPORTATION(
                wastesGroup[0].internalTransportation
              )
            : "-",
          wastesGroup[1]?.internalTransportation !== undefined
            ? DOCUMENT_WASTE_INTERNAL_TRANSPORTATION(
                wastesGroup[1].internalTransportation
              )
            : "-",
          wastesGroup[2]?.internalTransportation !== undefined
            ? DOCUMENT_WASTE_INTERNAL_TRANSPORTATION(
                wastesGroup[2].internalTransportation
              )
            : "-",
        ],
        [
          {
            stack: [
              {
                text: "Freqüência de coleta externa (quando o resíduo sai da empresa): ",
                bold: true,
              },
              "Ex: diária, a cada 2 dias, mensal",
            ],
          },
          wastesGroup[0]?.collectionFrequency !== undefined
            ? DOCUMENT_FREQUENCY(wastesGroup[0].collectionFrequency)
            : "-",
          wastesGroup[1]?.collectionFrequency !== undefined
            ? DOCUMENT_FREQUENCY(wastesGroup[1].collectionFrequency)
            : "-",
          wastesGroup[2]?.collectionFrequency !== undefined
            ? DOCUMENT_FREQUENCY(wastesGroup[2].collectionFrequency)
            : "-",
        ],
        [
          {
            stack: [
              {
                text: "Destinação: ",
                bold: true,
              },
              "Ex: reciclagem, coprocessamento, incineração, aterro, reaproveitamento interno, compostagem, autoclavagem, etc.",
            ],
          },
          wastesGroup[0]?.treatment !== undefined
            ? DOCUMENT_WASTE_TREATMENT(wastesGroup[0].treatment)
            : "-",
          wastesGroup[1]?.treatment !== undefined
            ? DOCUMENT_WASTE_TREATMENT(wastesGroup[1].treatment)
            : "-",
          wastesGroup[2]?.treatment !== undefined
            ? DOCUMENT_WASTE_TREATMENT(wastesGroup[2].treatment)
            : "-",
        ],
        [
          {
            text: "Empresa responsável pelo transporte dos resíduos",
            bold: true,
            style: "gray",
            colSpan: 4,
            alignment: "center",
          },
          "",
          "",
          "",
        ],
        [
          {
            text: "Razão social",
            bold: true,
          },
          getCompaniesTransport(wastesGroup[0]),
          getCompaniesTransport(wastesGroup[1]),
          getCompaniesTransport(wastesGroup[2]),
        ],
        [
          {
            text: "Nome de fantasia",
            bold: true,
          },
          getCompaniesTransport(wastesGroup[0]),
          getCompaniesTransport(wastesGroup[1]),
          getCompaniesTransport(wastesGroup[2]),
        ],
        [
          {
            text: "Empresa responsável pelo destino dos resíduos",
            bold: true,
            style: "gray",
            colSpan: 4,
            alignment: "center",
          },
          "",
          "",
          "",
        ],
        [
          {
            text: "Razão social",
            bold: true,
          },
          getCompaniesDestination(wastesGroup[0]),
          getCompaniesDestination(wastesGroup[1]),
          getCompaniesDestination(wastesGroup[2]),
        ],
        [
          {
            text: "Nome de fantasia",
            bold: true,
          },
          getCompaniesDestination(wastesGroup[0]),
          getCompaniesDestination(wastesGroup[1]),
          getCompaniesDestination(wastesGroup[2]),
        ],
      ];
    }

    return tableRows;
  }

  function getCompaniesDestination(waste?: IDocumentWaste): string {
    if (!waste || waste.companyDestination === undefined) return "-";

    if (waste.companyDestination === DocumentWasteCompanyLicense.OUTSOURCED) {
      return (
        waste.companiesDestination?.map((company) => company.name).join(", ") ??
        ""
      );
    }

    return DOCUMENT_WASTE_COMPANY_LICENSE(waste.companyDestination!);
  }

  function getCompaniesTransport(waste?: IDocumentWaste): string {
    if (!waste || waste.companyTransport === undefined) return "-";

    if (waste.companyTransport === DocumentWasteCompanyLicense.OUTSOURCED) {
      return (
        waste.companiesTransport?.map((company) => company.name).join(", ") ??
        ""
      );
    }

    return DOCUMENT_WASTE_COMPANY_LICENSE(waste.companyTransport!);
  }

  function setTimeline() {
    document.approved?.timeline?.forEach((e) => {
      const row = [
        {
          text: e.action,
        },
        {
          text: `${dateFormat(e.inicialDate)?.substring(3)}`,
          alignment: "center",
          margin: [0, 6, 0, 6],
        },
      ];

      timeline.push(row);
    });
  }
  setTimeline();

  const template: TDocumentDefinitions = {
    pageSize: "A4",
    pageOrientation: "portrait",
    pageMargins: [30, 20],
    defaultStyle: { font: "TimesNewRoman", fontSize: 12 },
    content: [
      {
        margin: [0, 40],
        stack: [
          {
            stack: [
              {
                text: "ANEXO VI – MODELO DE PGRS",
                style: "header",
              },
              {
                text: "PLANO DE GERENCIAMENTO DE RESÍDUOS SÓLIDOS – PGRS",
                style: "header",
                margin: [0, 12, 0, 0],
              },
              {
                text: "Formulário para Elaboração",
                style: "header",
              },
            ],
          },
          {
            margin: [0, 20, 0, 0],
            layout: thinBorderLayout,
            table: {
              widths: ["*", "*"],
              body: [
                [
                  {
                    text: "1. IDENTIFICAÇÃO DO EMPREENDIMENTO",
                    bold: true,
                    style: "grayDark",
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "Razão social: ", bold: true },
                      document.company?.name,
                    ],
                    border: borderOptions.noBorder,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "Nome de fantasia: ", bold: true },
                      document.company?.businessName,
                    ],
                    border: borderOptions.noBorder,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "CNAE com descrição: ", bold: true },
                      document.company?.cnaeId
                        ? getCnaeId(cnaes, document?.company?.cnaeId)
                        : FIELD_EMPTY,
                    ],
                    border: borderOptions.noBorder,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "Endereço completo: ", bold: true },
                      setUpAddress(document.company?.address),
                    ],
                    border: borderOptions.noBorder,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "URL do Google Maps: ", bold: true },
                      document.company?.googleMapUrl ?? "-",
                    ],
                    border: borderOptions.noBorder,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "Telefone: ", bold: true },
                      document.company?.phone
                        ? phoneMask(document.company?.phone)
                        : "-",
                    ],
                    border: borderOptions.noBorder,
                  },
                  {
                    text: [
                      { text: "E-mail: ", bold: true },
                      document.company?.email,
                    ],
                    border: borderOptions.noBorder,
                  },
                ],
                [
                  {
                    text: [
                      { text: "CNPJ: ", bold: true },
                      document?.company?.identifier.length === 11
                        ? cpfMask(document.company?.identifier)
                        : cnpjMask(document.company?.identifier),
                    ],
                    border: borderOptions.noBorder,
                  },
                  {
                    text: [
                      { text: "Alvará de funcionamento nº: ", bold: true },
                      document.company?.licenseNumber,
                    ],
                    border: borderOptions.noBorder,
                  },
                ],
                [
                  {
                    text: [
                      "Área do terreno (m",
                      { text: "2", sup: { offset: "30%", fontSize: 12 } },
                      "): ",
                      { text: document.company?.totalArea ?? "-", bold: false },
                    ],
                    bold: true,
                    border: borderOptions.noBorder,
                  },
                  {
                    text: [
                      "Área construída (m",
                      { text: "2", sup: { offset: "30%", fontSize: 12 } },
                      "): ",
                      { text: document.company?.builtArea ?? "-", bold: false },
                    ],
                    bold: true,
                    border: borderOptions.noBorder,
                  },
                ],
                [
                  {
                    text: [
                      { text: "Licença ambiental: ", bold: true },
                      document.company?.license,
                    ],
                    border: borderOptions.noBorder,
                  },
                  {
                    text: [
                      { text: "Validade: ", bold: true },
                      dateFormat(document.company?.licenseExpirationDate),
                    ],
                    border: borderOptions.noBorder,
                  },
                ],
                [
                  {
                    stack: [
                      {
                        text: "Dias e horários de funcionamento (informando períodos de intervalos/paradas): ",
                        bold: true,
                      },
                      daysOfWeekAndHours(),
                    ],
                    border: borderOptions.noBorder,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    stack: [
                      {
                        text: "Número de pessoas envolvidas à geração de resíduos (considerar administradores, colaboradores clientes, estudantes e pessoas de frequência ou permanência eventual, discriminando cada grupo):",
                        bold: true,
                      },
                      `${
                        document.company?.peopleInvolved?.total !== undefined
                          ? document.company?.peopleInvolved.total
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
                    ],
                    border: borderOptions.noBorder,
                    colSpan: 2,
                  },
                  "",
                ],
              ],
            },
          },
          {
            margin: [0, 15, 0, 0],
            layout: thinBorderLayout,
            table: {
              widths: ["*", "*"],
              body: [
                [
                  {
                    text: "2. RESPONSÁVEL LEGAL PELO EMPREENDIMENTO",
                    bold: true,
                    style: "grayDark",
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "Nome: ", bold: true },
                      document.responsibles?.legal?.name,
                    ],
                    border: borderOptions.noBorder,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "CPF: ", bold: true },
                      document.responsibles?.legal?.taxpayerNumber
                        ? cpfMask(document.responsibles?.legal?.taxpayerNumber)
                        : "-",
                    ],
                    border: borderOptions.noBorder,
                  },
                  {
                    text: [
                      { text: "Telefone direto: ", bold: true },
                      document.responsibles?.legal?.phone
                        ? phoneMask(document.responsibles?.legal?.phone)
                        : "-",
                    ],
                    border: borderOptions.noBorder,
                  },
                ],
              ],
            },
          },
          {
            margin: [0, 15, 0, 0],
            layout: thinBorderLayout,
            table: {
              widths: [195, "*"],
              body: [
                [
                  {
                    text: "3. TÉCNICO RESPONSÁVEL PELA ELABORAÇÃO DO PGRS",
                    bold: true,
                    style: "grayDark",
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [{ text: "Nome: ", bold: true }, TECNICAL.name],
                    border: borderOptions.noBorder,
                  },
                  {
                    text: [
                      { text: "CPF: ", bold: true },
                      TECNICAL.taxpayerNumber,
                    ],
                    margin: [65, 0, 0, 0],
                    border: borderOptions.noBorder,
                  },
                ],
                [
                  {
                    text: [
                      { text: "Profissão: ", bold: true },
                      TECNICAL.position,
                    ],
                    border: borderOptions.noBorder,
                  },
                  {
                    text: [
                      { text: "Registro no Conselho de Classe: ", bold: true },
                      TECNICAL.class,
                    ],
                    border: borderOptions.noBorder,
                  },
                ],
                [
                  {
                    text: [
                      { text: "Endereço completo: ", bold: true },
                      setUpAddress(TECNICAL.company.address),
                    ],
                    border: borderOptions.noBorder,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      {
                        text: "Empresa de consultoria (razão social): ",
                        bold: true,
                      },
                      TECNICAL.company.name,
                    ],
                    border: borderOptions.noBorder,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      {
                        text: "Empresa de consultoria (nome de fantasia): ",
                        bold: true,
                      },
                      "-",
                    ],
                    border: borderOptions.noBorder,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "CNPJ: ", bold: true },
                      cnpjMask(TECNICAL.company.identity),
                    ],
                    border: borderOptions.noBorder,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [{ text: "Telefone fixo direto: ", bold: true }, "-"],
                    border: borderOptions.noBorder,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "Telefone celular: ", bold: true },
                      TECNICAL.phone,
                    ],
                    border: borderOptions.noBorder,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "E-mail: ", bold: true },
                      TECNICAL.company.email,
                    ],
                    border: borderOptions.noBorder,
                    colSpan: 2,
                  },
                  "",
                ],
              ],
            },
          },
          {
            margin: [0, 15, 0, 0],
            layout: thinBorderLayout,
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "4. CARACTERIZAÇÃO E JUSTIFICATIVA DO EMPREENDIMENTO / ATIVIDADE",
                    bold: true,
                    style: "grayDark",
                  },
                ],
              ],
            },
          },
          {
            text: document.company?.activityDescription ?? "-",
            // text: "Apresentar os objetivos do empreendimento/atividade e sua importância no contexto socioeconômico do Município de Marechal Cândido Rondon e região, inclusive a geração de empregos e outros benefícios à comunidade local e regional, bem como ao setor produtivo correspondente",
          },
          {
            margin: [0, 15, 0, 0],
            layout: thinBorderLayout,
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "5. OBJETIVO E JUSTIFICATIVA DO PLANO DE GERENCIAMENTO DE RESÍDUOS SÓLIDOS",
                    bold: true,
                    style: "grayDark",
                  },
                ],
              ],
            },
          },
          {
            text: document.approved?.goalsAndJustifications ?? "-",
            // stack: [
            //   "Apontar as contribuições do PGRS na gestão da empresa.",
            //   "Justificar a finalidade do PGRS diante dos órgãos ambientais, bem como a responsabilidade dos profissionais envolvidos na sua elaboração e execução.",
            //   "No caso de empreendimento já em atividade, apresentar um diagnóstico da situação atual dos resíduos, considerando aspectos como: tipo, origem, quantidade, tratamento eventualmente dado e locais onde os mesmos são dispostos. Informar, inclusive, se há passivos ambientais deixados por empreendimentos / atividades anteriores e planos para solucionar o problema.",
            //   "Informar planos / sistemas / tecnologias já adotadas pelo empreendimento para a gestão ambiental interna ou os que se planeja implantar. Informar se há previsão de ampliação, demolição ou reforma da área construída.",
            // ],
          },
          {
            layout: thinBorderLayout,
            margin: [0, 25, 0, 0],
            table: {
              dontBreakRows: true,
              widths: [190, "*", "*", "*"],
              body: [
                [
                  {
                    text: "6. GERENCIAMENTO DOS RESÍDUOS GERADOS PELA EMPRESA",
                    bold: true,
                    style: "grayDark",
                    colSpan: 4,
                  },
                  "",
                  "",
                  "",
                ],
              ],
            },
          },
          {
            margin: [0, 10, 0, 0],
            layout: thinBorderLayout,
            table: {
              widths: [190, "*", "*", "*"],
              dontBreakRows: true,
              body: [
                [
                  {
                    text: "A. RESÍDUOS PERIGOSOS (CLASSE I)",
                    bold: true,
                    colSpan: 4,
                    style: "grayLight",
                  },
                  "",
                  "",
                  "",
                ],
                ...renderWastesTable(DocumentWasteClass.CLASS1),
              ],
            },
          },
          {
            pageBreak: "before",
            layout: thinBorderLayout,
            table: {
              widths: [190, "*", "*", "*"],
              dontBreakRows: true,
              body: [
                [
                  {
                    text: "B. RESÍDUOS NÃO-INERTES (CLASSE IIA)",
                    bold: true,
                    colSpan: 4,
                    style: "grayLight",
                  },
                  "",
                  "",
                  "",
                ],
                ...renderWastesTable(DocumentWasteClass.CLASS2A),
              ],
            },
          },
          {
            pageBreak: "before",
            layout: thinBorderLayout,
            table: {
              widths: [190, "*", "*", "*"],
              dontBreakRows: true,
              body: [
                [
                  {
                    text: "C. RESÍDUOS INERTES (CLASSE IIB)",
                    bold: true,
                    colSpan: 4,
                    style: "grayLight",
                  },
                  "",
                  "",
                  "",
                ],
                ...renderWastesTable(DocumentWasteClass.CLASS2B),
              ],
            },
          },
          {
            pageBreak: "before",
            margin: [0, 15, 0, 0],
            layout: thinBorderLayout,
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "7. AÇÕES PREVENTIVAS E CORRETIVAS A SEREM EXECUTADAS EM SITUAÇÕES DE GERENCIAMENTO INCORRETO OU ACIDENTES",
                    bold: true,
                    style: "grayDark",
                  },
                ],
                [
                  {
                    stack:
                      document.approved?.preventionActions?.map((item) =>
                        DOCUMENT_APPROVED_PREVENTION_ACTIONS(item)
                      ) ?? "-",
                    // text: "Descrever as ações solicitadas acima, os recursos humanos necessários e os equipamentos de proteção individual e coletiva.",
                    border: borderOptions.noBorder,
                    margin: [0, 10],
                  },
                ],
              ],
            },
          },
          {
            margin: [0, 15, 0, 0],
            layout: thinBorderLayout,
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "8. PROCEDIMENTOS VISANDO: REDUZIR A GERAÇÃO, A REUTILIZAÇÃO, A RECICLAGEM E A PERICULOSIDADE DE RESÍDUOS",
                    bold: true,
                    style: "grayDark",
                  },
                ],
                [
                  {
                    text: document.approved?.recyclingProcedure ?? "-",
                    // text: "Breve descrição dos procedimentos solicitados acima.",
                    border: borderOptions.noBorder,
                    margin: [0, 10],
                  },
                ],
              ],
            },
          },
          {
            margin: [0, 15, 0, 0],
            layout: thinBorderLayout,
            table: {
              widths: ["*", "*"],
              body: [
                [
                  {
                    text: "9. CRONOGRAMA DE IMPLANTAÇÃO OU READEQUAÇÃO DO PGRS NO EMPREENDIMENTO",
                    bold: true,
                    style: "grayDark",
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: "Assinalar no quadro abaixo a previsão de datas para as ações da gestão de resíduos dentro do empreendimento. Informar “já implantado” onde for o caso",
                    border: borderOptions.noBorder,
                    margin: [0, 10],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: "Ação",
                    bold: true,
                    alignment: "center",
                    style: "gray",
                  },
                  {
                    text: "Mês / ano",
                    bold: true,
                    alignment: "center",
                    style: "gray",
                  },
                ],
                ...timeline,
              ],
            },
          },
          {
            margin: [0, 15, 0, 0],
            layout: thinBorderLayout,
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "10. OBSERVAÇÕES",
                    bold: true,
                    style: "grayDark",
                  },
                ],
                [
                  {
                    text: document.approved?.observation ?? "-",
                    // text: "Este campo é destinado a informações que não se adequaram aos campos anteriores, inclusive justificativas de ausência de documentos solicitados.",
                    border: borderOptions.noBorder,
                    margin: [0, 10],
                  },
                ],
              ],
            },
          },
          {
            margin: [0, 15, 0, 0],
            layout: thinBorderLayout,
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "11. LEGISLAÇÃO",
                    bold: true,
                    style: "grayDark",
                  },
                ],
              ],
            },
          },
          {
            margin: [0, 10],
            ul: [
              {
                text: [
                  { text: "Lei Federal nº 12.305/2010", bold: true },
                  " - Institui a Política Nacional de Resíduos Sólidos; altera a Lei Federal nº 9.605, de 12 de fevereiro de 1998, e dá outras providências.",
                ],
              },
              {
                text: [
                  { text: "Decreto Federal nº 7.404/2010", bold: true },
                  " - Regulamenta a Lei Federal nº 12.305, de 2 de agosto de 2010, que institui a Política Nacional de Resíduos Sólidos, cria o Comitê Interministerial da Política Nacional de Resíduos Sólidos e o Comitê Orientador para a Implantação dos Sistemas de Logística Reversa, e dá outras providências.",
                ],
              },
              {
                text: [
                  {
                    text: "Decreto Federal nº 96.044/1988",
                    bold: true,
                  },
                  " - Regulamenta o Transporte Rodoviário de Produtos Perigosos.",
                ],
              },
              {
                text: [
                  {
                    text: "Resolução CONAMA nº 06/1988",
                    bold: true,
                  },
                  " - Dispõe sobre a geração de resíduos nas atividades industriais.",
                ],
              },
              {
                text: [
                  {
                    text: "Resolução CONAMA nº 313/2002",
                    bold: true,
                  },
                  " - Revoga a Resolução CONAMA nº 06/1988 - Dispõe sobre o Inventário Nacional de Resíduos Sólidos Industriais.",
                ],
              },
              {
                text: [
                  {
                    text: "Resolução CONAMA nº 05/1993",
                    bold: true,
                  },
                  " - Estabelece normas relativas aos resíduos sólidos oriundos de serviços de saúde, portos, aeroportos, terminais ferroviários e rodoviários.",
                ],
              },
              {
                text: [
                  {
                    text: "Resolução CONAMA nº 09/1993",
                    bold: true,
                  },
                  " - Dispõe sobre uso, reciclagem, destinação rerefino de óleos lubrificantes.",
                ],
              },
              {
                text: [
                  {
                    text: "Resolução CONAMA nº 283/2001",
                    bold: true,
                  },
                  " - Dispõe sobre o tratamento e destinação final dos RSS.",
                ],
              },
              {
                text: [
                  {
                    text: "Portaria MINTER nº 53/1979",
                    bold: true,
                  },
                  " - Dispõe sobre o destino e tratamento de resíduos.",
                ],
              },
              {
                text: [
                  {
                    text: "Portaria INMETRO nº 221/1991",
                    bold: true,
                  },
                  " - Aprova o Regulamento Técnico “Inspeção em equipamentos destinados ao transporte de produtos perigosos a granel não incluídos regulamentos”.",
                ],
              },
              {
                text: [
                  {
                    text: "CONTRAN nº 404",
                    bold: true,
                  },
                  " - Classifica a periculosidade das mercadorias a serem transportadas.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 10004/87",
                    bold: true,
                  },
                  " - Resíduos sólidos - Classificação.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 10005/87",
                    bold: true,
                  },
                  " - Lixiviação de resíduos - Procedimento.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 10006/87",
                    bold: true,
                  },
                  " - Solubilização de resíduos - Procedimento.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 10007/87",
                    bold: true,
                  },
                  " - Amostragem de resíduos - Procedimento.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 12235/87",
                    bold: true,
                  },
                  " - Armazenamento de resíduos sólidos perigosos.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 7500",
                    bold: true,
                  },
                  " - Transporte de produtos perigosos.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 7501/83",
                    bold: true,
                  },
                  " - Transporte de cargas perigosas.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 7503/82",
                    bold: true,
                  },
                  " - Ficha de emergência para transporte de cargas perigosas.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 7504/83",
                    bold: true,
                  },
                  " - Envelope para transporte de cargas perigosas. Características e dimensões.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 8285/96",
                    bold: true,
                  },
                  " - Preenchimento da ficha de emergência.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 8286/87",
                    bold: true,
                  },
                  " - Emprego da simbologia para o transporte rodoviário de produtos perigosos.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 11174/89",
                    bold: true,
                  },
                  " - Armazenamento de resíduos classes II (não inertes) e III (inertes).",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 13221/94",
                    bold: true,
                  },
                  " - Transporte de resíduos - Procedimento.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 13463/95",
                    bold: true,
                  },
                  " - Coleta de resíduos sólidos - Classificação.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 12807/93",
                    bold: true,
                  },
                  " - Resíduos de serviço de saúde - Terminologia.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 12809/93",
                    bold: true,
                  },
                  " - Manuseio de resíduos de serviços de saúde - Procedimentos.",
                ],
              },
              {
                text: [
                  {
                    text: "NR-25",
                    bold: true,
                  },
                  " - Resíduos industriais",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 12235/92",
                    bold: true,
                  },
                  " - Armazenamento de Resíduos Sólidos Perigosos.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 7500/00",
                    bold: true,
                  },
                  " - Símbolos de risco e manuseio para o transporte e armazenamento de materiais.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 10157/87",
                    bold: true,
                  },
                  " - Aterros de resíduos perigosos - Critérios para projetos, construção e operação.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 8418/83",
                    bold: true,
                  },
                  " - Apresentação de projetos de aterros de resíduos industriais perigosos.",
                ],
              },
              {
                text: [
                  {
                    text: "NBR 11175/90",
                    bold: true,
                  },
                  " - Incineração de resíduos sólidos perigosos - Padrões de desempenho (antiga NB 1265).",
                ],
              },
              {
                text: [
                  {
                    text: "Lei Estadual nº 17.232/2012",
                    bold: true,
                  },
                  " - Estabelece diretrizes para coleta seletiva contínua de resíduos sólidos oriundos de embalagens de produtos que compõem a linha branca no território paranaense.",
                ],
              },
              {
                text: [
                  {
                    text: "Lei Estadual nº 16.346/2009",
                    bold: true,
                  },
                  " - Dispõe sobre a obrigatoriedade das empresas potencialmente poluidoras de contratarem responsável técnico em meio ambiente.",
                ],
              },
              {
                text: [
                  {
                    text: "Lei Estadual nº 12.493/1999",
                    bold: true,
                  },
                  " - Estabelece princípios, procedimentos, normas e critérios referentes a geração, acondicionamento, armazenamento, coleta, transporte, tratamento e destinação final dos resíduos sólidos no Estado do Paraná, visando controle da poluição, da contaminação e  minimização de seus impactos ambientais e adota outras providências.",
                ],
              },
              {
                text: [
                  {
                    text: "Lei Municipal nº 4819/2015",
                    bold: true,
                  },
                  " - Política Municipal de Resíduos Sólidos.",
                ],
              },
              {
                text: [
                  {
                    text: "Lei Municipal nº 053/2008",
                    bold: true,
                  },
                  " - Plano Diretor Municipal de Marechal Cândido Rondon",
                ],
              },
            ],
          },
        ],
      },
    ],
    styles: {
      header: {
        alignment: "center",
        bold: true,
      },
      grayDark: {
        fillColor: "#7F7F7F",
      },
      gray: {
        fillColor: "#B2B2B2",
      },
      grayLight: {
        fillColor: "#D9D9D9",
      },
    },
  };

  return template;
}
