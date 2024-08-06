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
  DOCUMENT_WASTE_FREQUENCY,
  DOCUMENT_WASTE_INTERNAL_TRANSPORTATION,
  DOCUMENT_WASTE_ORIGIN_POINT,
  DOCUMENT_WASTE_PACKING,
  DOCUMENT_WASTE_STORAGE,
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

const noBorderLayout: TableLayout = {
  hLineWidth: function () {
    return 0;
  },
  vLineWidth: function () {
    return 0;
  },
  paddingBottom: function () {
    return 2;
  },
  paddingLeft: function () {
    return 2;
  },
  paddingRight: function () {
    return 2;
  },
  paddingTop: function () {
    return 2;
  },
};

export function render({ classifications, document }: IRenderReq) {
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
    const wastesToRender =
      document?.wastes?.filter((item) => item.class === wasteClass) ?? [];
    let tableRows: TableCell[][] = [];

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
            text: "Resíduo Gerado: ",
            bold: true,
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
            ? wastesGroup[0]?.dangers
                .map((item) => DOCUMENT_WASTE_DANGERS(item))
                .join(", ")
            : "-",
          wastesGroup[1]?.dangers !== undefined
            ? wastesGroup[1]?.dangers
                .map((item) => DOCUMENT_WASTE_DANGERS(item))
                .join(", ")
            : "-",
          wastesGroup[2]?.dangers !== undefined
            ? wastesGroup[2]?.dangers
                .map((item) => DOCUMENT_WASTE_DANGERS(item))
                .join(", ")
            : "-",
        ],
        [
          {
            text: "Ponto de Geração: ",
            bold: true,
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
            text: "Volume: ",
            bold: true,
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
            text: "Acondicionamento interno: ",
            bold: true,
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
            text: "Armazenamento externo: ",
            bold: true,
          },
          wastesGroup[0]?.storage !== undefined
            ? DOCUMENT_WASTE_STORAGE(wastesGroup[0].storage)
            : "-",
          wastesGroup[1]?.storage !== undefined
            ? DOCUMENT_WASTE_STORAGE(wastesGroup[1].storage)
            : "-",
          wastesGroup[2]?.storage !== undefined
            ? DOCUMENT_WASTE_STORAGE(wastesGroup[2].storage)
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
            text: "Forma de transporte interno: ",
            bold: true,
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
            text: "Freqüência de coleta externa (quando o resíduo sai da empresa): ",
            bold: true,
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
            text: "Destinação: ",
            bold: true,
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
        ...renderCompaniesTransportTable(wastesGroup),
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
        ...renderCompaniesDestinationTable(wastesGroup),
      ];
    }

    return tableRows;
  }

  function renderCompaniesDestinationTable(
    wastesGroup: IDocumentWaste[]
  ): TableCell[][] {
    const rows: TableCell[][] = [
      [
        {
          text: "Razão social (1)",
          bold: true,
        },
        "-",
        "-",
        "-",
      ],
    ];

    wastesGroup.forEach((waste, wasteIndex) => {
      if (!waste || waste.companyDestination === undefined) return "-";

      if (waste.companyDestination !== DocumentWasteCompanyLicense.OUTSOURCED) {
        rows[0][wasteIndex + 1] = DOCUMENT_WASTE_COMPANY_LICENSE(
          waste.companyDestination
        );
      }

      waste.companiesDestination?.forEach((company, companyIndex) => {
        if (!rows[companyIndex]) {
          rows.push([
            {
              text: `Razão social (${companyIndex + 1})`,
              bold: true,
            },
            "-",
            "-",
            "-",
          ]);
        }

        rows[companyIndex][wasteIndex + 1] = company.name;
      });
    });

    return rows;
  }

  function renderCompaniesTransportTable(
    wastesGroup: IDocumentWaste[]
  ): TableCell[][] {
    const rows: TableCell[][] = [
      [
        {
          text: "Razão social (1)",
          bold: true,
        },
        "-",
        "-",
        "-",
      ],
    ];

    wastesGroup.forEach((waste, wasteIndex) => {
      if (!waste || waste.companyTransport === undefined) return "-";

      if (waste.companyTransport !== DocumentWasteCompanyLicense.OUTSOURCED) {
        rows[0][wasteIndex + 1] = DOCUMENT_WASTE_COMPANY_LICENSE(
          waste.companyTransport
        );
      }

      waste.companiesTransport?.forEach((company, companyIndex) => {
        if (!rows[companyIndex]) {
          rows.push([
            {
              text: `Razão social (${companyIndex + 1})`,
              bold: true,
            },
            "-",
            "-",
            "-",
          ]);
        }

        rows[companyIndex][wasteIndex + 1] = company.name;
      });
    });

    return rows;
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
    pageMargins: [55, 50],
    defaultStyle: {
      font: "Arial",
      fontSize: 11,
      lineHeight: 1.25,
    },
    content: [
      {
        fontSize: 12,
        stack: [
          {
            alignment: "center",
            stack: [
              { text: "INSTRUÇÃO PARA", bold: true },
              {
                margin: [0, 15, 0, 0],
                text: "DECLARAÇÃO ANUAL DE RESÍDUOS SÓLIDOS - DARS",
                bold: true,
              },
            ],
          },
          {
            alignment: "justify",
            margin: [0, 15, 0, 0],
            stack: [
              "Este formulário deve ser completamente preenchido por um responsável técnico habilitado, conforme Lei Estadual nº 16.346/2009, e acompanhado dos seguintes documentos em formato PDF, preferencialmente pesquisável:",
              {
                type: "lower-alpha",
                separator: ")",
                ol: [
                  "Licença ambiental vigente da empresa;",
                  "Licenças ambientais vigentes das empresas de transporte e de destinação final dos resíduos;",
                  "Notas Fiscais e outros comprovantes de coleta e destinação final de todos os resíduos, dos últimos 12 meses;",
                ],
              },
              "A ausência de algum dos documentos acima deve ser justificada no campo de Observações do formulário.",
              "Em casos de denúncias ou suspeita de irregularidade, em qualquer momento a SAMA poderá solicitar à empresa a apresentação de outros documentos não listados.",
              {
                text: "Orientação para preenchimento do formulário",
                margin: [0, 15, 0, 0],
              },
              {
                type: "upper-roman",
                ol: [
                  "O plano deve estar completamente preenchido, conforme o formulário de orientação existente na mesma página deste formulário.",
                  "Caso necessário, copiar a tabela e inseri-la imediatamente abaixo da primeira, sem alterar o formato original, atentando-se com a classificação dos resíduos (I, IIA ou IIB).",
                  "Os resíduos que voltam à cadeia produtiva interna ou cuja disposição final ocorra dentro da própria empresa devem passar pela gravimetria e ser mencionados nas tabelas.",
                  "Informar os materiais recicláveis separadamente, de acordo com sua natureza (um em cada coluna). Ex: papel/papelão, metal, plástico, vidro.",
                  "Os resíduos orgânicos e rejeitos devem ser apresentados em litros/semana, sendo permitido o acréscimo de outras unidades de medida e de tempo na mesma quadrícula.",
                ],
              },
              "Nos demais resíduos, a unidade de medida e de tempo fica livre. Entende-se os casos em que a densidade de determinados resíduos é questionável; por isso, será considerado o espaço ocupado pelos resíduos em seus recipientes ou ambientes de armazenamento e não o seu peso.",
            ],
          },
        ],
      },
      {
        margin: [0, 15, 0, 0],
        stack: [
          {
            fontSize: 12,
            text: "DECLARAÇÃO ANUAL DE RESÍDUOS SÓLIDOS - DARS",
            bold: true,
            alignment: "center",
          },
          {
            layout: thinBorderLayout,
            margin: [0, 30, 0, 0],
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "1. IDENTIFICAÇÃO DO EMPREENDIMENTO",
                    style: ["sectionTitle", "grayDark"],
                  },
                ],
              ],
            },
          },
          {
            margin: [0, 20, 0, 0],
            layout: noBorderLayout,
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: [
                      { text: "Razão social: ", bold: true },
                      document.company?.name,
                    ],
                  },
                ],
                [
                  {
                    text: [
                      { text: "Nome de fantasia: ", bold: true },
                      document.company?.businessName,
                    ],
                  },
                ],
                [
                  {
                    text: [
                      { text: "Endereço completo: ", bold: true },
                      setUpAddress(document.company?.address),
                    ],
                  },
                ],
                [{ text: [{ text: "URL do Google Maps: ", bold: true }, ""] }],
                [
                  {
                    text: [
                      { text: "Telefone: ", bold: true },
                      document.company?.phone
                        ? phoneMask(document.company?.phone)
                        : "",
                    ],
                  },
                ],
                [
                  {
                    margin: [0, 20, 0, 0],
                    text: [
                      { text: "E-mail: ", bold: true },
                      document.company?.email,
                    ],
                  },
                ],
                [
                  {
                    text: [
                      { text: "CNPJ: ", bold: true },
                      cnpjMask(document.company?.identifier),
                    ],
                  },
                ],
                [
                  {
                    text: [
                      { text: "Alvará de funcionamento nº: ", bold: true },
                      document.company?.licenseNumber,
                    ],
                  },
                ],
                [
                  {
                    text: [
                      { text: "Área do terreno (m2): ", bold: true },
                      document.company?.totalArea,
                    ],
                  },
                ],
                [
                  {
                    text: [
                      { text: "Área construída (m2): ", bold: true },
                      document.company?.builtArea,
                    ],
                  },
                ],
                [
                  {
                    margin: [0, 20, 0, 0],
                    text: [
                      {
                        text: "Dias e horários de funcionamento (informando períodos de intervalos/paradas): ",
                        bold: true,
                      },
                      daysOfWeekAndHours(),
                    ],
                  },
                ],
                [
                  {
                    margin: [0, 20, 0, 0],
                    text: [
                      {
                        alignment: "justify",
                        text: "Número de pessoas envolvidas à geração de resíduos (considerar administradores, colaboradores clientes, estudantes e pessoas de frequência ou permanência eventual, discriminando cada grupo): ",
                        bold: true,
                      },
                      `${
                        document.company?.totalEmployeesCount ?? 0
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
                  },
                ],
              ],
            },
          },
          {
            layout: thinBorderLayout,
            margin: [0, 15, 0, 0],
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "2. RESPONSÁVEL LEGAL PELO EMPREENDIMENTO",
                    style: ["sectionTitle", "grayDark"],
                  },
                ],
              ],
            },
          },
          {
            margin: [0, 20, 0, 0],
            layout: noBorderLayout,
            table: {
              widths: ["*", 220],
              body: [
                [
                  {
                    colSpan: 2,
                    text: [
                      { text: "Nome: ", bold: true },
                      document.responsibles?.legal?.name,
                    ],
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "CPF: ", bold: true },
                      document.responsibles?.legal?.taxpayerNumber
                        ? cpfMask(document.responsibles?.legal?.taxpayerNumber)
                        : "",
                    ],
                  },
                  {
                    text: [
                      { text: "Telefone direto: ", bold: true },
                      document.responsibles?.legal?.phone
                        ? phoneMask(document.responsibles?.legal?.phone)
                        : "",
                    ],
                  },
                ],
              ],
            },
          },
          {
            layout: thinBorderLayout,
            margin: [0, 15, 0, 0],
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "3. TÉCNICO RESPONSÁVEL PELA ELABORAÇÃO DO PGRS",
                    style: ["sectionTitle", "grayDark"],
                  },
                ],
              ],
            },
          },
          {
            margin: [0, 20, 0, 0],
            layout: noBorderLayout,
            table: {
              widths: ["*", 175, 90],
              body: [
                [
                  {
                    colSpan: 3,
                    text: [{ text: "Nome: ", bold: true }, TECNICAL.name],
                  },
                  "",
                  "",
                ],
                [
                  {
                    colSpan: 3,
                    text: [
                      { text: "CPF: ", bold: true },
                      cpfMask(TECNICAL.taxpayerNumber),
                    ],
                  },
                  "",
                  "",
                ],
                [
                  {
                    text: [
                      { text: "Profissão: ", bold: true },
                      TECNICAL.position,
                    ],
                  },
                  {
                    text: "Registro no Conselho de Classe: ",
                    bold: true,
                    alignment: "right",
                  },
                  TECNICAL.class,
                ],
                [
                  {
                    colSpan: 3,
                    text: [
                      { text: "Endereço completo: ", bold: true },
                      setUpAddress(TECNICAL.company.address),
                    ],
                  },
                  "",
                  "",
                ],
                [
                  {
                    colSpan: 3,
                    text: [
                      {
                        text: "Empresa de consultoria (razão social): ",
                        bold: true,
                      },
                      TECNICAL.company?.name,
                    ],
                  },
                  "",
                  "",
                ],
                [
                  {
                    colSpan: 3,
                    text: [
                      {
                        text: "Empresa de consultoria (nome de fantasia): ",
                        bold: true,
                      },
                      TECNICAL.company?.tradeName,
                    ],
                  },
                  "",
                  "",
                ],
                [
                  {
                    colSpan: 3,
                    text: [
                      {
                        text: "CNPJ: ",
                        bold: true,
                      },
                      cnpjMask(TECNICAL.company.identity),
                    ],
                  },
                  "",
                  "",
                ],
                [
                  {
                    text: [
                      {
                        text: "Telefone fixo direto: ",
                        bold: true,
                      },
                      "-",
                    ],
                  },
                  {
                    text: [
                      {
                        text: "Telefone celular: ",
                        bold: true,
                        alignment: "right",
                      },
                      TECNICAL.phone,
                    ],
                  },
                  "",
                ],
                [
                  {
                    colSpan: 3,
                    margin: [0, 10, 0, 0],
                    text: [
                      {
                        text: "E-mail: ",
                        bold: true,
                      },
                      TECNICAL.company.email,
                    ],
                  },
                  "",
                  "",
                ],
              ],
            },
          },
          {
            layout: thinBorderLayout,
            margin: [0, 15, 0, 0],
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "DESCRIÇÃO DAS ATIVIDADES DA EMPRESA",
                    style: "grayDark",
                    bold: true,
                    margin: [35, 0, 0, 10],
                  },
                ],
              ],
            },
          },
          {
            text: document.company?.activityDescription ?? "-",
            margin: [0, 20, 0, 0],
          },
          {
            layout: thinBorderLayout,
            margin: [0, 80, 0, 0],
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "4. GERENCIAMENTO DOS RESÍDUOS GERADOS PELA EMPRESA",
                    style: ["sectionTitle", "grayDark"],
                  },
                ],
              ],
            },
          },
          {
            margin: [0, 15, 0, 0],
            layout: thinBorderLayout,
            fontSize: 9,
            table: {
              widths: [90, "*", "*", "*"],
              dontBreakRows: true,
              body: [
                [
                  {
                    text: "1. RESÍDUOS PERIGOSOS (CLASSE I)",
                    bold: true,
                    colSpan: 4,
                    style: "grayLight",
                    margin: [30, 0, 0, 0],
                    fontSize: 11,
                  },
                  "",
                  "",
                  "",
                ],
                [
                  {
                    text: "",
                    margin: [0, 5],
                    colSpan: 4,
                    border: borderOptions.noBorder,
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
            layout: thinBorderLayout,
            pageBreak: "before",
            fontSize: 9,
            table: {
              widths: [90, "*", "*", "*"],
              dontBreakRows: true,
              body: [
                [
                  {
                    text: "2. RESÍDUOS NÃO-INERTES (CLASSE IIA)",
                    bold: true,
                    colSpan: 4,
                    style: "grayLight",
                    margin: [30, 0, 0, 0],
                    fontSize: 11,
                  },
                  "",
                  "",
                  "",
                ],
                [
                  {
                    text: "",
                    margin: [0, 5],
                    colSpan: 4,
                    border: borderOptions.noBorder,
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
            layout: thinBorderLayout,
            fontSize: 9,
            pageBreak: "before",
            table: {
              widths: [90, "*", "*", "*"],
              dontBreakRows: true,
              body: [
                [
                  {
                    text: "3. RESÍDUOS INERTES (CLASSE IIB)",
                    bold: true,
                    colSpan: 4,
                    style: "grayLight",
                    margin: [30, 0, 0, 0],
                    fontSize: 11,
                  },
                  "",
                  "",
                  "",
                ],
                [
                  {
                    text: "",
                    margin: [0, 5],
                    colSpan: 4,
                    border: borderOptions.noBorder,
                  },
                  "",
                  "",
                  "",
                ],
                ...renderWastesTable(DocumentWasteClass.CLASS2B),
              ],
            },
          },
        ],
      },
      {
        stack: [
          {
            layout: thinBorderLayout,
            margin: [0, 25, 0, 0],
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "5. AÇÕES PREVENTIVAS E CORRETIVAS A SEREM EXECUTADAS EM SITUAÇÕES DE GERENCIAMENTO INCORRETO OU ACIDENTES",
                    style: ["sectionTitle", "grayDark"],
                  },
                ],
              ],
            },
          },
          {
            ul: document.approved?.preventionActions?.map((item) =>
              DOCUMENT_APPROVED_PREVENTION_ACTIONS(item)
            ) ?? ["-"],
            // text: "Descrever as ações solicitadas acima, os recursos humanos necessários e os equipamentos de proteção individual e coletiva.",
            margin: [0, 20, 0, 0],
          },
        ],
      },
      {
        stack: [
          {
            layout: thinBorderLayout,
            margin: [0, 25, 0, 0],
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "6. PROCEDIMENTOS VISANDO: REDUZIR A GERAÇÃO, A REUTILIZAÇÃO, A RECICLAGEM E A PERICULOSIDADE DE RESÍDUOS",
                    style: ["sectionTitle", "grayDark"],
                  },
                ],
              ],
            },
          },
          {
            text: document.approved?.recyclingProcedure ?? "-",
            // text: "Breve descrição dos procedimentos solicitados acima.",
            margin: [0, 20, 0, 0],
          },
        ],
      },
      {
        stack: [
          {
            layout: thinBorderLayout,
            margin: [0, 25, 0, 0],
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "7. CRONOGRAMA DE IMPLANTAÇÃO OU READEQUAÇÃO DO PGRS NO EMPREENDIMENTO",
                    style: ["sectionTitle", "grayDark"],
                  },
                ],
              ],
            },
          },
          //   {
          //     text: "Assinalar no quadro abaixo a previsão de datas para as ações da gestão de resíduos dentro do empreendimento. Informar “já implantado” onde for o caso.",
          //     margin: [0, 20, 0, 0],
          //   },
        ],
      },
      {
        layout: thinBorderLayout,
        margin: [0, 15, 0, 0],
        table: {
          widths: ["*", "*"],
          dontBreakRows: true,
          body: [
            [
              {
                text: "Ação",
                alignment: "center",
                bold: "true",
                style: "gray",
              },
              {
                text: "Mês / ano",
                alignment: "center",
                bold: "true",
                style: "gray",
              },
            ],
            ...timeline,
          ],
        },
      },
      {
        stack: [
          {
            layout: thinBorderLayout,
            margin: [0, 25, 0, 0],
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "8. OBSERVAÇÕES",
                    style: ["sectionTitle", "grayDark"],
                  },
                ],
              ],
            },
          },
          {
            text: document.approved?.observation ?? "-",
            margin: [0, 25, 0, 0],
          },
          //   {
          //     text: "Este campo é destinado a informações que não se adequaram aos campos anteriores, inclusive justificativas de ausência de documentos solicitados.",
          //     margin: [0, 10, 0, 0],
          //   },
        ],
      },
    ],
    styles: {
      sectionTitle: {
        bold: true,
        margin: [25, 0, 0, 0],
      },
      grayDark: {
        fillColor: "#808080",
      },
      gray: {
        fillColor: "#B3B3B3",
      },
      grayLight: {
        fillColor: "#D9D9D9",
      },
    },
  };

  return template;
}
