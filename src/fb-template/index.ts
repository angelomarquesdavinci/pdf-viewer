import {
  ContentText,
  TDocumentDefinitions,
  TableCell,
  TableLayout,
} from "pdfmake/interfaces";
import {
  DOCUMENT_FREQUENCY,
  DOCUMENT_WASTE_ATTRIBUTES,
  DOCUMENT_WASTE_DESTINATION,
  DOCUMENT_WASTE_FREQUENCY,
  DOCUMENT_WASTE_ORIGIN_POINT,
  DOCUMENT_WASTE_PACKING,
  DOCUMENT_WASTE_STORAGE,
  DOCUMENT_WASTE_TREATMENT,
  DOCUMENT_WASTE_TREATMENT_SYSTEMS,
  DOCUMENT_WASTE_UNIT,
  DOCUMENT_WASTE_USED_HARDWARE,
} from "../resource";
import {
  DocumentRefectoryPrepare,
  DocumentWasteClass,
  IDocument,
  IDocumentApprovedTimeline,
  IDocumentCompanyLicense,
  IDocumentRefectory,
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
  getCnaeIdList,
  getMarkedAnswer,
  getWeekDays,
  getWorkHours,
  phoneMask,
  setUpAddress,
} from "../utils";
const FIELD_EMPTY = "[###]";

const logo = "http://localhost:5173/francisco-beltrao-pr.jpg";

const borderOptions = {
  noBottom: [true, true, true, false],
  noTop: [true, false, true, true],
  horizontalOnly: [true, false, true, false],
  leftBottomOnly: [true, false, false, true],
  noBorder: [false],
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

export function render({ document, classifications, cnaes }: IRenderReq) {
  function getMealAmount(refectory?: IDocumentRefectory): string {
    if (!refectory) return "______";

    return String(refectory.amount);
  }
  function renderWasteItem(
    waste: IDocumentWaste,
    classLabel: string
  ): TableCell[] {
    return [
      {
        text: (waste.originPoint || []).map((origin) =>
          DOCUMENT_WASTE_ORIGIN_POINT(origin)
        ),
        border: borderOptions.noTop,
        margin: [0, 4],
      },
      {
        text: getClassificationId(classifications, waste.classificationId!),
        border: borderOptions.noTop,
        margin: [0, 4],
      },
      {
        text: `${waste.quantity} ${DOCUMENT_WASTE_UNIT(
          waste.unit!
        )}/${DOCUMENT_WASTE_FREQUENCY(waste.frequency!)}`,
        border: borderOptions.noTop,
        margin: [0, 4],
      },
      { text: classLabel, border: borderOptions.noTop, margin: [0, 4] },
      {
        text: DOCUMENT_WASTE_PACKING(waste.packing!),
        border: borderOptions.noTop,
        margin: [0, 4],
      },
      {
        text: DOCUMENT_WASTE_STORAGE(waste.storage!),
        border: borderOptions.noTop,
        margin: [0, 4],
      },
      {
        text:
          waste.collectionFrequency !== undefined
            ? DOCUMENT_FREQUENCY(waste.collectionFrequency!)
            : "",
        border: borderOptions.noTop,
        margin: [0, 4],
      },
      {
        text:
          waste.treatment !== undefined
            ? DOCUMENT_WASTE_TREATMENT(waste.treatment)
            : undefined,
        border: borderOptions.noTop,
        margin: [0, 4],
      },
      {
        text: getCompaniesDestination(waste),
        border: borderOptions.noTop,
        margin: [0, 4],
      },
    ];
  }

  function renderEffluentWasteItem(waste: IDocumentWaste): TableCell[] {
    function getEfficiencyAnswer(efficient?: boolean) {
      switch (efficient) {
        case true:
          return "SIM";
        case false:
          return "NÃO";
        default:
          return "";
      }
    }
    return [
      {
        text: (waste.originPoint || []).map((origin) =>
          DOCUMENT_WASTE_ORIGIN_POINT(origin)
        ),
        border: borderOptions.noTop,
        margin: [0, 4],
      },
      {
        text:
          waste.wasteAttributes !== undefined
            ? DOCUMENT_WASTE_ATTRIBUTES(waste.wasteAttributes)
            : "",
        border: borderOptions.noTop,
        margin: [0, 4],
      },
      {
        text:
          waste.treatmentSystems !== undefined
            ? DOCUMENT_WASTE_TREATMENT_SYSTEMS(waste.treatmentSystems)
            : "",
        border: borderOptions.noTop,
        margin: [0, 4],
      },
      {
        text:
          waste.usedHardware !== undefined
            ? DOCUMENT_WASTE_USED_HARDWARE(waste.usedHardware)
            : "",
        border: borderOptions.noTop,
        margin: [0, 4],
      },
      {
        text: waste.treatmentSystemsDimensions,
        border: borderOptions.noTop,
        margin: [0, 4],
      },
      {
        text:
          waste.destination !== undefined
            ? DOCUMENT_WASTE_DESTINATION(waste.destination)
            : "",
        border: borderOptions.noTop,
        margin: [0, 4],
      },
      {
        text: "( ) SIM ( ) NÃO",
        border: borderOptions.noTop,
        margin: [0, 4],
        alignment: "center",
      },
      {
        text: getEfficiencyAnswer(waste.treatmentSystemsEfficient),
        border: borderOptions.noTop,
        margin: [0, 4],
      },
    ];
  }

  function renderWastesTable(
    wasteClass: DocumentWasteClass,
    wastes?: IDocumentWaste[]
  ): TDocumentDefinitions["content"] {
    let classificationSectionDescription: string = "";
    let tableTitle: string | Array<ContentText> = "";
    let classSectionDescription: string = "";
    let classLabel: string = "";
    const wastesToRender = (wastes || []).filter(
      (item) => item.class === wasteClass
    );

    switch (wasteClass) {
      case DocumentWasteClass.CLASS2A:
        classificationSectionDescription =
          "Descrever somente os resíduos que de fato são gerados. Ex.: papel sujo, rejeitos sanitários, restos de alimentos, clipes, grampos, etc.";
        tableTitle = [
          { text: "A) RESÍDUOS NÃO RECICLÁVEIS - REJEITOS:", bold: true },
        ];
        classSectionDescription =
          " Resolução Conama 313/2002 e NBR 10.004/2004";
        classLabel = "CLASSE IIA";
        break;
      case DocumentWasteClass.CLASS2B:
        classificationSectionDescription =
          "Descrever somente os resíduos que de fato são gerados. Ex.: papel, plástico, vidro, metal, etc.";
        tableTitle = [
          { text: "B) RESÍDUOS RECICLÁVEIS - CLASSE IIA / IIB (", bold: true },
          { text: "NBR 10.004/2004", italics: true },
          { text: "):", bold: true },
        ];
        classSectionDescription =
          " Resolução Conama 313/2002 e NBR 10.004/2004";
        classLabel = "CLASSE IIB";
        break;
      case DocumentWasteClass.CLASS1:
        classificationSectionDescription =
          "Descrever somente os resíduos que de fato são gerados. Ex.: óleo, pilhas e baterias, lâmpadas, entre outros";
        tableTitle = [
          { text: "C) RESÍDUOS PERIGOSOS - CLASSE I (", bold: true },
          { text: "NBR 10.004/2004", italics: true },
          { text: "):", bold: true },
        ];
        classSectionDescription =
          "      de acordo com NBR 10.004/2004 e Resolução Conama 313/2002";
        classLabel = "CLASSE I";
        break;
    }

    return [
      {
        pageBreak: "before",
        margin: [0, 30, 0, 0],
        layout: thinBorderLayout,
        table: {
          dontBreakRows: true,
          headerRows: 5,
          widths: ["*", "*", "*", "*", "*", "*", 80, "*", 80],
          body: [
            [
              {
                text: "2) MANEJO DOS RESÍDUOS GERADOS, CONFORME LEGISLAÇÃO VIGENTE, NOS DIFERENTES SETORES DO EMPREENDIMENTO:",
                bold: true,
                colSpan: 9,
                margin: [40, 12],
                style: "blue",
              },
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ],
            [
              {
                text: tableTitle,
                margin: [40, 12],
                colSpan: 6,
                style: "blue",
                border: borderOptions.noTop,
                rowSpan: 3,
              },
              "",
              "",
              "",
              "",
              "",
              {
                text: "O estabelecimento gera este tipo de resíduo:",
                colSpan: 3,
                style: "blue",
                border: borderOptions.noTop,
                alignment: "center",
              },
              "",
              "",
            ],
            [
              "",
              "",
              "",
              "",
              "",
              "",
              {
                text: `(${getMarkedAnswer(
                  wastesToRender.length > 0,
                  true
                )}) SIM (${getMarkedAnswer(
                  wastesToRender.length > 0,
                  false
                )}) NÃO`,
                colSpan: 3,
                border: borderOptions.horizontalOnly,
                alignment: "center",
              },
              "",
              "",
            ],
            [
              "",
              "",
              "",
              "",
              "",
              "",
              {
                text: "Se assinalar sim, complete o quadro abaixo",
                colSpan: 3,
                border: borderOptions.noTop,
                alignment: "center",
              },
              "",
              "",
            ],
            [
              {
                text: [
                  { text: "Ponto de geração", bold: true },
                  {
                    text: " Identificar o setor onde são gerados os resíduos. Ex.: administração, refeitório, produção, etc.",
                    italics: true,
                  },
                ],
                border: borderOptions.noTop,
                style: ["blue", "wastesSectionTitle"],
              },
              {
                text: [
                  { text: "Resíduos Gerados", bold: true },
                  {
                    text: ` ${classificationSectionDescription}`,
                    italics: true,
                  },
                ],
                border: borderOptions.noTop,
                style: ["blue", "wastesSectionTitle"],
              },
              {
                text: [
                  { text: "Quantificação", bold: true },
                  {
                    text: " Quantificar os resíduos gerados por Kg/mês, litros/mês, ou unidade/mês.",
                    italics: true,
                  },
                ],
                border: borderOptions.noTop,
                style: ["blue", "wastesSectionTitle"],
              },
              {
                text: [
                  { text: "Classificação", bold: true },
                  {
                    text: classSectionDescription,
                    italics: true,
                  },
                ],
                border: borderOptions.noTop,
                style: ["blue", "wastesSectionTitle"],
              },
              {
                text: [
                  { text: "Forma de acondicionamento", bold: true },
                  {
                    text: " Descrever os sacos plásticos e recipientes utilizados (lixeiras, bombonas, etc)",
                    italics: true,
                  },
                ],
                border: borderOptions.noTop,
                style: ["blue", "wastesSectionTitle"],
              },
              {
                text: [
                  { text: "Forma de armazenamento", bold: true },
                  {
                    text: " Descrever o local de armazenamento. Ex.: área externa, coberta, piso impermeável.",
                    italics: true,
                  },
                ],
                border: borderOptions.noTop,
                style: ["blue", "wastesSectionTitle"],
              },
              {
                text: [
                  { text: "Frequência de coleta", bold: true },
                  {
                    text: "                 Inserir a frequência de coleta dos resíduos. Ex.:semanal, trimestral, anual",
                    italics: true,
                  },
                ],
                border: borderOptions.noTop,
                style: ["blue", "wastesSectionTitle"],
              },
              {
                text: [
                  { text: "Destino final", bold: true },
                  {
                    text: " Inserir o destino final do resíduo. Ex.: Aterro Sanitário, Aterro Industrial",
                    italics: true,
                  },
                ],
                border: borderOptions.noTop,
                style: ["blue", "wastesSectionTitle"],
              },
              {
                text: [
                  {
                    text: "Empresa responsável pela disposição final",
                    bold: true,
                  },
                  {
                    text: " Inserir Razão social da empresa responsável pela disposição final",
                    italics: true,
                  },
                ],
                border: borderOptions.noTop,
                style: ["blue", "wastesSectionTitle"],
              },
            ],
            ...wastesToRender.map((item) => renderWasteItem(item, classLabel)),
          ],
        },
      },
      {
        text: "Obs.: Duplicar esta folha caso o número de linhas não seja suficiente para informar os resíduos gerados.",
        bold: true,
        margin: [20, 1],
      },
    ];
  }

  function renderEffluentsTable(
    wastes?: IDocumentWaste[]
  ): TDocumentDefinitions["content"] {
    const effluentWastes = (wastes || []).filter(
      (item) => item.class === DocumentWasteClass.EFFLUENT
    );

    return [
      {
        pageBreak: "before",
        margin: [0, 30, 0, 0],
        layout: thinBorderLayout,
        table: {
          dontBreakRows: true,
          headerRows: 5,
          widths: ["*", "*", "*", "*", "*", "*", 160, "*"],
          body: [
            [
              {
                text: "2) MANEJO DOS RESÍDUOS GERADOS, CONFORME LEGISLAÇÃO VIGENTE, NOS DIFERENTES SETORES DO EMPREENDIMENTO:",
                bold: true,
                margin: [40, 12],
                style: "blue",
                colSpan: 8,
              },
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ],
            [
              {
                text: "D) EFLUENTES:",
                bold: true,
                margin: [40, 12],
                colSpan: 6,
                style: "blue",
                border: borderOptions.noTop,
                rowSpan: 3,
              },
              "",
              "",
              "",
              "",
              "",
              {
                text: "O estabelecimento gera este tipo de resíduo:",
                colSpan: 2,
                style: "blue",
                border: borderOptions.noTop,
                alignment: "center",
              },
              "",
            ],
            [
              "",
              "",
              "",
              "",
              "",
              "",
              {
                text: `(${getMarkedAnswer(
                  effluentWastes.length > 0,
                  true
                )}) SIM (${getMarkedAnswer(
                  effluentWastes.length > 0,
                  false
                )}) NÃO`,
                colSpan: 2,
                border: borderOptions.horizontalOnly,
                alignment: "center",
              },
              "",
            ],
            [
              "",
              "",
              "",
              "",
              "",
              "",
              {
                text: "Se assinalar sim, complete o quadro abaixo",
                colSpan: 2,
                border: borderOptions.noTop,
                alignment: "center",
              },
              "",
            ],
            [
              {
                stack: [
                  { text: "Origem do Efluente", bold: true },
                  {
                    text: "Local onde são gerados os efluentes",
                    italics: true,
                  },
                ],
                border: borderOptions.noTop,
                style: ["blue", "wastesSectionTitle"],
              },
              {
                stack: [
                  { text: "Caracterização do efluente bruto", bold: true },
                  {
                    text: "Descrever do que o efluente é constituido",
                    italics: true,
                  },
                ],
                border: borderOptions.noTop,
                style: ["blue", "wastesSectionTitle"],
              },
              {
                stack: [
                  { text: "Sistema de tratamento utilizado", bold: true },
                  {
                    text: "Qual é a estrutura do tratamento. Ex: bacia de contenção, CSAO, SSAO, etc",
                    italics: true,
                  },
                ],
                border: borderOptions.noTop,
                style: ["blue", "wastesSectionTitle"],
              },
              {
                stack: [
                  {
                    text: "Equipamentos utilizados no processo de tratamento",
                    bold: true,
                  },
                  {
                    text: "Descrever os componentes. Ex.: Placas, filtro, decantador, etc.",
                    italics: true,
                  },
                ],
                border: borderOptions.noTop,
                style: ["blue", "wastesSectionTitle"],
              },
              {
                stack: [
                  {
                    text: "Dimensões do sistema de tratamento",
                    bold: true,
                  },
                  {
                    text: "Largura, altura, compriment e volume útil",
                    italics: true,
                  },
                ],
                border: borderOptions.noTop,
                style: ["blue", "wastesSectionTitle"],
              },
              {
                stack: [
                  {
                    text: "Destino final do efluente tratado",
                    bold: true,
                  },
                  {
                    text: "Descrever qual é o destino do efluente tratado",
                    italics: true,
                  },
                ],
                border: borderOptions.noTop,
                style: ["blue", "wastesSectionTitle"],
              },
              {
                text: "Análise físico-química em anexo?",
                bold: true,
                border: borderOptions.noTop,
                style: ["blue", "wastesSectionTitle"],
                margin: [0, 36],
              },
              {
                text: "O sistema de tratamento é eficiente?",
                bold: true,
                border: borderOptions.noTop,
                style: ["blue", "wastesSectionTitle"],
                margin: [0, 24],
              },
            ],
            ...effluentWastes.map((item) => renderEffluentWasteItem(item)),
            [
              {
                text: "Outras informações importantes:",
                bold: true,
                border: borderOptions.noTop,
                fontSize: 10,
                colSpan: 8,
                margin: [0, 0, 0, 50],
              },
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ],
          ],
        },
      },
      {
        text: "Obs.: Duplicar esta folha caso o número de linhas não seja suficiente para informar os resíduos gerados.",
        bold: true,
        margin: [20, 1],
      },
    ];
  }

  function renderTimelineItem(
    timeline: IDocumentApprovedTimeline
  ): TableCell[] {
    return [
      { text: timeline.action, border: borderOptions.noTop, margin: [0, 10] },
      {
        text: dateFormat(timeline.inicialDate),
        border: borderOptions.noTop,
        margin: [0, 10],
      },
      {
        text: dateFormat(timeline.expirationDate),
        border: borderOptions.noTop,
        margin: [0, 10],
      },
    ];
  }

  function renderCompaniesTransportDestinationData(
    wastes?: IDocumentWaste[]
  ): TableCell[] {
    function getCompanyWastes(
      wastes?: IDocumentWaste[]
    ): IDocumentCompanyLicense[] {
      const companies: IDocumentCompanyLicense[] = [];

      (wastes || []).forEach((waste) => {
        waste.companiesDestination?.forEach((company) => {
          const repeatDestination = companies.some(
            (e) => company.identifier === e.identifier
          );

          if (company.identifier && !repeatDestination) {
            companies.push(company);
          }
        });

        waste.companiesTransport?.forEach((company) => {
          const repeatTransport = companies.some(
            (e) => company.identifier === e.identifier
          );

          if (company.identifier && !repeatTransport) {
            companies.push(company);
          }
        });
      });

      return companies;
    }

    function renderCompanyDataItem(
      company: IDocumentCompanyLicense
    ): TableCell[] {
      return [
        { text: company.name, border: borderOptions.noTop, margin: [0, 4] },
        { text: company.name, border: borderOptions.noTop, margin: [0, 4] },
        {
          text:
            company.identifier.length === 11
              ? `CPF: ${cpfMask(company.identifier)}`
              : `CNPJ: ${cnpjMask(company.identifier)}`,
          border: borderOptions.noTop,
          margin: [0, 4],
        },
        {
          text: `${company.license} - ${dateFormat(
            company.licenseExpirationDate
          )}`,
          border: borderOptions.noTop,
          margin: [0, 4],
        },
      ];
    }

    const companies = getCompanyWastes(wastes);

    return [
      {
        pageBreak: "before",
        margin: [0, 30, 0, 0],
        layout: thinBorderLayout,
        table: {
          widths: ["*", 220, "*", "*"],
          body: [
            [
              {
                text: "3) DADOS DAS EMPRESAS CONTRATADAS PARA COLETA, TRANSPORTE E DISPOSIÇÃO FINAL DOS RESÍDUOS GERADOS",
                colSpan: 4,
                margin: [40, 6],
                style: "blue",
                bold: true,
              },
              "",
              "",
              "",
            ],
            [
              {
                text: "Razão Social",
                style: "blue",
                bold: true,
                margin: [0, 10, 0, 4],
                alignment: "center",
              },
              {
                text: "Nome Fantasia",
                style: "blue",
                bold: true,
                margin: [0, 10, 0, 4],
                alignment: "center",
              },
              {
                text: "CNPJ",
                style: "blue",
                bold: true,
                margin: [0, 10, 0, 4],
                alignment: "center",
              },
              {
                text: "Número e data de validade da licença de operação*",
                style: "blue",
                bold: true,
                margin: [5, 0],
                alignment: "center",
              },
            ],
            ...companies.map((item) => renderCompanyDataItem(item)),
          ],
        },
      },
      {
        layout: thinBorderLayout,
        table: {
          widths: ["*"],
          body: [
            [
              {
                text: "3.1) EM CASO DE SOLUÇÃO CONSORCIADA, FAVOR PREENCHER OS DADOS ABAIXO:",
                margin: [40, 6],
                style: "blue",
                bold: true,
                border: borderOptions.noTop,
              },
            ],
          ],
        },
      },
      {
        layout: thinBorderLayout,
        table: {
          widths: [70, 290, 70, "*"],
          body: [
            [
              {
                text: "Razão Social:",
                margin: [4, 6],
                style: "blue",
                border: borderOptions.noTop,
              },
              {
                text: "",
                border: borderOptions.noTop,
              },
              {
                text: "CNPJ:",
                margin: [4, 6],
                style: "blue",
                border: borderOptions.noTop,
                alignment: "center",
              },
              {
                text: "",
                border: borderOptions.noTop,
              },
            ],
          ],
        },
      },
      {
        layout: thinBorderLayout,
        table: {
          widths: [100, 240, 60, 100, 50, "*"],
          body: [
            [
              {
                text: "Endereço completo:",
                margin: [4, 6],
                style: "blue",
                border: borderOptions.noTop,
              },
              {
                text: "",
                border: borderOptions.noTop,
              },
              {
                text: "Telefone:",
                margin: [4, 6],
                style: "blue",
                border: borderOptions.noTop,
                alignment: "center",
              },
              {
                text: "",
                border: borderOptions.noTop,
              },
              {
                text: "E-mail:",
                margin: [4, 6],
                style: "blue",
                border: borderOptions.noTop,
                alignment: "center",
              },
              {
                text: "",
                border: borderOptions.noTop,
              },
            ],
          ],
        },
      },
      {
        layout: thinBorderLayout,
        table: {
          widths: [130, 230, 70, "*"],
          body: [
            [
              {
                text: "Responsável pela empresa:",
                margin: [4, 6],
                style: "blue",
                border: borderOptions.noTop,
              },
              {
                text: "",
                border: borderOptions.noTop,
              },
              {
                text: "CPF:",
                margin: [4, 6],
                style: "blue",
                border: borderOptions.noTop,
                alignment: "center",
              },
              {
                text: "",
                border: borderOptions.noTop,
              },
            ],
          ],
        },
      },
      {
        text: "Obs.: Deverá apresentar cópias de todas as licenças ou autorizações ambientais.",
        bold: true,
        margin: [20, 1],
      },
      {
        text: "*As licenças devem estar dentro do prazo de validade.",
        bold: true,
        margin: [20, 15, 0, 0],
      },
    ];
  }

  function renderAttachmentsTable(
    document: Partial<IDocument>
  ): TDocumentDefinitions["content"] {
    return [
      {
        pageBreak: "before",
        margin: [0, 30, 0, 0],
        layout: thinBorderLayout,
        table: {
          dontBreakRows: true,
          headerRows: 2,
          widths: [65, "*", 100, 200],
          body: [
            [
              {
                text: "8) ANEXOS DO PLANO DE GERENCIAMENTO DE RESÍDUOS",
                margin: [0, 20],
                style: "blue",
                bold: true,
                alignment: "center",
                rowSpan: 2,
                colSpan: 2,
              },
              "",
              {
                text: "Documento Anexado",
                margin: [8, 4],
                style: "blue",
                bold: true,
                alignment: "center",
                border: borderOptions.noBottom,
              },
              {
                text: "Se NÃO, justifique:",
                margin: [0, 20],
                style: "blue",
                bold: true,
                rowSpan: 2,
              },
            ],
            [
              "",
              "",
              {
                text: "SIM ou NÃO",
                margin: [8, 0],
                style: "blue",
                bold: true,
                alignment: "center",
                border: borderOptions.noTop,
              },
              "",
            ],
            [
              {
                text: "ANEXO I",
                margin: [4, 8, 0, 2],
                style: "blue",
                bold: true,
                border: borderOptions.noTop,
              },
              {
                text: "Anotação de Responsabilidade Técnica pela elaboração do PGR- ART.",
                margin: [4, 8, 0, 2],
              },
              {
                text: document.approved?.artLink ? "SIM" : "NÃO",
                margin: [0, 8, 0, 2],
              },
              "",
            ],
            [
              {
                text: "ANEXO II",
                margin: [4, 8, 0, 2],
                style: "blue",
                bold: true,
                border: borderOptions.noTop,
              },
              {
                text: "Contratos com as empresas terceirizadas e, caso haja, soluções consorciadas.",
                margin: [4, 8, 0, 2],
              },
              {
                text: document.attachments?.contracts?.urls?.length
                  ? "SIM"
                  : "NÃO",
                margin: [0, 8, 0, 2],
              },
              {
                text: document.attachments?.contracts?.justification ?? "",
                margin: [0, 2],
              },
            ],
            [
              {
                text: "ANEXO III",
                margin: [4, 8, 0, 2],
                style: "blue",
                bold: true,
                border: borderOptions.noTop,
              },
              {
                text: "Comprovantes recentes de coleta e destinação final de todos os resíduos gerados.",
                margin: [4, 8, 0, 2],
              },
              {
                text: document.attachments?.collect?.urls?.length
                  ? "SIM"
                  : "NÃO",
                margin: [0, 8, 0, 2],
              },
              {
                text: document.attachments?.collect?.justification ?? "",
                margin: [0, 2],
              },
            ],
            [
              {
                text: "ANEXO IV",
                margin: [4, 8, 0, 2],
                style: "blue",
                bold: true,
                border: borderOptions.noTop,
              },
              {
                text: "Licenças de Operação ou Autorizações Ambientais das empresas terceirizadas.",
                margin: [4, 8, 0, 2],
              },
              {
                text: document.attachments?.licenses?.urls?.length
                  ? "SIM"
                  : "NÃO",
                margin: [0, 8, 0, 2],
              },
              {
                text: document.attachments?.licenses?.justification ?? "",
                margin: [0, 2],
              },
            ],
            [
              {
                text: "ANEXO V ",
                margin: [4, 8, 0, 2],
                style: "blue",
                bold: true,
                border: borderOptions.noTop,
              },
              {
                text: "Fotos dos locais de acondicionamento e armazenamento de resíduos e croqui.",
                margin: [4, 8, 0, 2],
              },
              {
                text: document.attachments?.photos?.urls?.length
                  ? "SIM"
                  : "NÃO",
                margin: [0, 8, 0, 2],
              },
              {
                text: document.attachments?.photos?.justification ?? "",
                margin: [0, 2],
              },
            ],
            [
              {
                text: "ANEXO VI",
                margin: [4, 8, 0, 2],
                style: "blue",
                bold: true,
                border: borderOptions.noTop,
              },
              {
                text: "Planta baixa com fluxograma do empreendimento.",
                margin: [4, 8, 0, 2],
              },
              {
                text: document.attachments?.flowchart?.urls?.length
                  ? "SIM"
                  : "NÃO",
                margin: [0, 8, 0, 2],
              },
              {
                text: document.attachments?.flowchart?.justification ?? "",
                margin: [0, 2],
              },
            ],
            [
              {
                text: "ANEXO VII",
                margin: [4, 8, 0, 2],
                style: "blue",
                bold: true,
                border: borderOptions.noTop,
              },
              {
                text: "Análises fisico-químicas do efluente na entrada e saída do sistema de tratamento conforme Resolução CONAMA 430/2011.",
                margin: [4, 0, 0, 0],
              },
              {
                text: document.attachments?.physicochemical?.urls?.length
                  ? "SIM"
                  : "NÃO",
                margin: [0, 8, 0, 2],
              },
              {
                text:
                  document.attachments?.physicochemical?.justification ?? "",
                margin: [0, 2],
              },
            ],
            [
              {
                text: "ANEXO VIII",
                margin: [4, 8, 0, 2],
                style: "blue",
                bold: true,
                border: borderOptions.noTop,
              },
              {
                text: "Planta e fotos do sistema de tratamento.",
                margin: [4, 8, 0, 2],
              },
              {
                text: document.attachments?.floorplan?.urls?.length
                  ? "SIM"
                  : "NÃO",
                margin: [0, 8, 0, 2],
              },
              {
                text: document.attachments?.floorplan?.justification ?? "",
                margin: [0, 2],
              },
            ],
            [
              {
                text: "ANEXO IX",
                margin: [4, 8, 0, 2],
                style: "blue",
                bold: true,
                border: borderOptions.noTop,
              },
              {
                text: "Memorial de cálculo do sistema de tratamento: Vazão, regime de entrada, volume em cada etapa, tempo de detenção hidráulica e eficiência esperada.",
                margin: [4, 0, 0, 0],
              },
              {
                text: document.attachments?.calculus?.urls?.length
                  ? "SIM"
                  : "NÃO",
                margin: [0, 8, 0, 2],
              },
              {
                text: document.attachments?.calculus?.justification ?? "",
                margin: [0, 2],
              },
            ],
            [
              {
                text: "ANEXO X ",
                margin: [4, 8, 0, 2],
                style: "blue",
                bold: true,
                border: borderOptions.noTop,
              },
              {
                text: "Outras fotos, se julgar necessário.",
                margin: [4, 8, 0, 2],
              },
              "",
              "",
            ],
          ],
        },
      },
    ];
  }

  const template: TDocumentDefinitions = {
    pageSize: "A4",
    pageOrientation: "landscape",
    pageMargins: [30, 20],
    defaultStyle: { font: "TimesNewRoman", fontSize: 10 },
    footer: function (currentPage, pageCount) {
      return {
        columns: [
          "",
          {
            text: [
              "Página ",
              { text: currentPage, bold: true },
              " de ",
              { text: pageCount, bold: true },
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
        stack: [
          {
            columns: [
              { image: "logo", width: 60, absolutePosition: { x: 195, y: 12 } },
              {
                margin: [-60, 0, 0, 0],
                stack: [
                  {
                    text: "MUNICÍPIO DE FRANCISCO BELTRÃO",
                    style: "headerTitle",
                  },
                  { text: "Estado do Paraná", style: "headerTitle" },
                  {
                    text: "SECRETARIA MUNICIPAL DE MEIO AMBIENTE",
                    style: "headerSubtitle",
                    bold: true,
                  },
                  {
                    text: "Modelo de Referência - Plano de Gerenciamento de Resíduos Sólidos– PGRS",
                    style: "headerSubtitle",
                    bold: true,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        margin: [0, 10, 0, 0],
        style: "blue",
        fontSize: 12,
        layout: thinBorderLayout,
        table: {
          widths: ["*"],
          body: [
            [
              {
                stack: [
                  {
                    text: "ATENÇÃO:",
                    border: borderOptions.noBottom,
                    // lineHeight: 0.5,
                    bold: true,
                  },
                  {
                    text: "Este formulário é um modelo para que os dados relativos ao empreendimento sejam preenchidos de forma correta.",
                    italics: true,
                  },
                  {
                    text: "Assim sendo, o PGRS deve contemplar NO MÍNIMO os dados solicitados neste instrumento, porém pode ser complementado com outras informações consideradas relevantes no campo “7) OBSERVAÇÕES GERAIS”.",
                    italics: true,
                  },
                  {
                    text: "A partir do mês de maio de 2020, somente serão aceitos para análise os PGRS apresentados conforme formulário próprio desta SMMA.",
                    border: borderOptions.horizontalOnly,
                    margin: [0, 4, 0, 0],
                    italics: true,
                  },
                  {
                    text: "OBSERVAÇÕES IMPORTANTES QUANTO AO PGRS:",
                    border: borderOptions.horizontalOnly,
                    bold: true,
                    margin: [0, 8, 0, 0],
                  },
                  {
                    text: "1) O PGRS deverá ser apresentado em duas vias encadernadas, em formato paisagem, com fonte Times New Roman ou Arial, tamanho mínimo de fonte “10”. Não será aceito documento manuscrito;",
                    border: borderOptions.horizontalOnly,
                  },
                  {
                    text: "2) O documento deve ser paginado, com as assinaturas dos responsáveis pelo empreendimento e pelo PGRS, com data de elaboração;",
                    border: borderOptions.horizontalOnly,
                  },
                  {
                    text: "3) Quando solicitadas complementações, estas deverão ser apresentadas diretamente na Secretaria Municipal de Meio Ambiente, em um prazo máximo de 30 dias.",
                    border: borderOptions.horizontalOnly,
                  },
                  {
                    text: [
                      "4) Caso o empreendimento apresente Sistema de Tratamento de Efluentes, deve ser preenchido o item ",
                      {
                        text: "“2) MANEJO DOS RESÍDUOS GERADOS, CONFORME LEGISLAÇÃO VIGENTE, NOS DIFERENTES SETORES DO EMPREENDIMENTO - D) EFLUENTES”",
                        italics: true,
                      },
                      ", inserindo informações quanto a geração destes resíduos, seu tratamento e destinação",
                    ],
                    border: borderOptions.noTop,
                  },
                ],
              },
            ],
          ],
        },
      },
      {
        margin: [0, 10, 0, 0],
        style: "blue",
        fontSize: 12,
        layout: thinBorderLayout,
        table: {
          widths: ["*"],
          body: [
            [
              {
                stack: [
                  {
                    text: "DOCUMENTOS A SEREM APRESENTADOS ANEXOS AOS PGRS:",
                    border: borderOptions.noBottom,
                    bold: true,
                  },
                  {
                    text: "1) Contrato(s) com a(s) empresa(s) terceirizada(s) devidamente licenciadas com validade vigente, constando as devidas assinaturas;",
                    border: borderOptions.horizontalOnly,
                  },
                  {
                    text: "2) Comprovante(s) recente(s) de coleta e destinação final, emitido(s) pela(s) empresa(s) terceirizada(s) no caso de empresas existentes;",
                    border: borderOptions.horizontalOnly,
                  },
                  {
                    text: "3) Licença(s) de Operação ou Autorização(ões) Ambiental(ais) da(s) empresa(s) terceirizada(s), dentro do prazo de validade;",
                    border: borderOptions.horizontalOnly,
                  },
                  {
                    text: "4) Anotação de Responsabilidade Técnica do profissional responsável pela elaboração do PGRS;",
                    border: borderOptions.horizontalOnly,
                  },
                  {
                    text: "5) Registro fotográfico apontando o local de acondicionamento e armazenamento dos resíduos",
                    border: borderOptions.horizontalOnly,
                  },
                  {
                    text: "6) Em caso de geração de efluentes e/ou material particulado atmosférico, apresentar projeto e/ou fotos do sistema de tratamento implantados no empreendimento;",
                    border: borderOptions.horizontalOnly,
                  },
                  {
                    text: [
                      "7) Em caso de geração de efluentes apresentar Memorial de Cálculo e Análises físico-químicas conforme Resolução CONAMA 357/2005 e 430/2011 e comprovantes de destinação do ",
                      { text: "lodo", italics: true },
                      " gerado;",
                    ],
                    border: borderOptions.noTop,
                  },
                ],
              },
            ],
          ],
        },
      },
      {
        margin: [0, 10, 0, 0],
        style: "blueDark",
        fontSize: 12,
        layout: thinBorderLayout,
        table: {
          widths: ["*"],
          body: [
            [
              {
                text: "PARA CASOS DE ATUALIZAÇÃO:",
                border: borderOptions.noBottom,
                lineHeight: 0.5,
                bold: true,
              },
            ],
            [
              {
                text: "1) A atualização do PGRS deve ocorrer anualmente, poderá ser feita por ato declaratório conforme artigo 23, da Lei Federal 12.305/2010, formalizado por Termo de Responsabilidade, emitido pelo responsável e anexos de comprovantes referentes ao período que se refere no PGRS.",
                border: borderOptions.horizontalOnly,
              },
            ],
            [
              {
                text: [
                  "2) Deve ser apresentado em duas vias encadernadas, em formato paisagem, com fonte ",
                  { text: "Times New Roman", italics: true },
                  " ou ",
                  { text: "Arial", italics: true },
                  ", tamanho mínimo de fonte “10”. Não será aceito documento manuscrito;",
                ],
                border: borderOptions.horizontalOnly,
              },
            ],
            [
              {
                text: [
                  "3) Para casos de empreendimentos com lançamento de efluentes líquidos tratados, deve-se apontar além do corpo hídrico ou galeria de lançamento final, as análises físico-químicas conforme Resolução CONAMA 357/2005 e 430/2011 e comprovantes de destinação do ",
                  { text: "lodo", italics: true },
                  " gerado.",
                ],
                border: borderOptions.noTop,
              },
            ],
          ],
        },
      },
      {
        stack: [
          {
            pageBreak: "before",
            layout: thinBorderLayout,
            margin: [0, 30, 0, 0],
            table: {
              widths: ["*", 100, 120],
              body: [
                [
                  { border: borderOptions.noBottom, text: "", style: "blue" },
                  {
                    text: "CAMPO A SER PREENCHIDO PELA SMMA",
                    style: ["subTitle", "blue"],
                    italics: true,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: "1)   IDENTIFICAÇÃO",
                    border: borderOptions.horizontalOnly,
                    lineHeight: 0.5,
                    style: "blue",
                    bold: true,
                  },
                  {
                    text: "Nº DE PROTOCOLO",
                    italics: true,
                    style: ["subTitle", "blue"],
                  },
                  {
                    text: "DATA DE APROVAÇÃO",
                    italics: true,
                    style: ["subTitle", "blue"],
                  },
                ],
                [
                  {
                    text: "1.1) DADOS DO EMPREENDIMENTO:",
                    bold: true,
                    margin: [19, 0, 0, 0],
                    border: borderOptions.horizontalOnly,
                    style: "blue",
                  },
                  { text: "", rowSpan: 2 },
                  { text: "", rowSpan: 2 },
                ],
                [
                  {
                    text: "",
                    border: borderOptions.leftBottomOnly,
                    style: "blue",
                  },
                  "",
                  "",
                ],
              ],
            },
          },
          {
            layout: thinBorderLayout,
            table: {
              widths: [120, 270, 50, "*"],
              body: [
                [
                  {
                    text: "Razão social:",
                    border: borderOptions.noTop,
                    margin: [0, 8],
                    style: "blue",
                  },
                  {
                    text: document.company?.name,
                    border: borderOptions.noTop,
                    margin: [0, 8],
                  },
                  {
                    text: "CNPJ/CPF:",
                    border: borderOptions.noTop,
                    margin: [0, 8],
                    alignment: "right",
                    style: "blue",
                  },
                  {
                    text: cnpjMask(document.company?.identifier),
                    border: borderOptions.noTop,
                    margin: [0, 8],
                  },
                ],
                [
                  {
                    text: "Nome fantasia:",
                    border: borderOptions.noTop,
                    margin: [0, 8],
                    style: "blue",
                  },
                  {
                    text: document.company?.businessName,
                    border: borderOptions.noTop,
                    margin: [0, 8],
                  },
                  {
                    text: "Inscrição Estadual:",
                    margin: [0, 8, 0, 4],
                    alignment: "right",
                    style: "blue",
                  },
                  {
                    text: document.company?.stateRegistration,
                    border: borderOptions.noTop,
                    margin: [0, 8, 0, 4],
                  },
                ],
              ],
            },
          },
          {
            layout: thinBorderLayout,
            table: {
              widths: [160, "*"],
              body: [
                [
                  {
                    text: "Ramo de atividade e descrição sucinta dos serviços prestados",
                    border: borderOptions.noTop,
                    margin: [0, 4],
                    style: "blue",
                  },
                  {
                    text: document.company?.cnaeId
                      ? getCnaeId(cnaes, document?.company?.cnaeId)
                      : FIELD_EMPTY,
                    border: borderOptions.noTop,
                    margin: [0, 8],
                  },
                ],
                [
                  {
                    text: "Atividades inseridas no CNPJ porém não executadas:",
                    border: borderOptions.noTop,
                    margin: [0, 4],
                    style: "blue",
                  },
                  {
                    text: getCnaeIdList(cnaes, document.company?.cnaeIds || []),
                    border: borderOptions.noTop,
                  },
                ],
              ],
            },
          },
          {
            layout: thinBorderLayout,
            table: {
              widths: [120, "*"],
              body: [
                [
                  {
                    text: "Endereço completo:",
                    border: borderOptions.noTop,
                    margin: [0, 8],
                    style: "blue",
                  },
                  {
                    text: setUpAddress(document.company?.address),
                    border: borderOptions.noTop,
                    margin: [0, 8],
                  },
                ],
              ],
            },
          },
          {
            layout: thinBorderLayout,
            table: {
              widths: [120, 200, 62, 110, 70, "*"],
              body: [
                [
                  {
                    text: "Dias de funcionamento:",
                    border: borderOptions.noTop,
                    margin: [0, 8],
                    style: "blue",
                  },
                  {
                    text: getWeekDays(document.company?.weekDays || []),
                    border: borderOptions.noTop,
                    margin: [0, 8],
                  },
                  {
                    text: "Telefone:",
                    border: borderOptions.noTop,
                    margin: [0, 8],
                    style: "blue",
                  },
                  {
                    text: phoneMask(document.company?.phone || ""),
                    border: borderOptions.noTop,
                    margin: [0, 8],
                  },
                  {
                    text: "E-mail:",
                    border: borderOptions.noTop,
                    margin: [0, 8],
                    style: "blue",
                  },
                  {
                    text: document.company?.email,
                    border: borderOptions.noTop,
                    margin: [0, 8],
                  },
                ],
              ],
            },
          },
          {
            layout: thinBorderLayout,
            table: {
              widths: [120, 270, 110, "*"],
              body: [
                [
                  {
                    text: "Horário de funcionamento:",
                    border: borderOptions.noTop,
                    margin: [0, 8],
                    style: "blue",
                  },
                  {
                    text: getWorkHours(document.company),
                    border: borderOptions.noTop,
                    margin: [0, 8],
                  },
                  {
                    text: "Nº de colaboradores:",
                    margin: [0, 8],
                    border: borderOptions.noTop,
                    style: "blue",
                  },
                  {
                    text: "",
                    border: borderOptions.noTop,
                    margin: [0, 8],
                  },
                ],
              ],
            },
          },
          {
            layout: thinBorderLayout,
            table: {
              widths: [120, 70, 90, 122, 110, "*"],
              body: [
                [
                  {
                    text: "Área construída (m²):",
                    border: borderOptions.noTop,
                    margin: [0, 8],
                    style: "blue",
                  },
                  {
                    text: document.company?.builtArea,
                    border: borderOptions.noTop,
                    margin: [0, 8],
                  },
                  {
                    text: "Área do terreno (m²):",
                    margin: [0, 8],
                    border: borderOptions.noTop,
                    style: "blue",
                  },
                  {
                    text: document.company?.totalArea,
                    border: borderOptions.noTop,
                    margin: [0, 8],
                  },
                  {
                    text: "Perspectiva de reforma ou ampliação:",
                    margin: [0, 4],
                    border: borderOptions.noTop,
                    style: "blue",
                  },
                  { text: "", border: borderOptions.noTop },
                ],
              ],
            },
          },
          {
            layout: thinBorderLayout,
            table: {
              widths: [120, 270, 50, "*"],
              body: [
                [
                  {
                    text: "Responsável pelo empreendimento:",
                    border: borderOptions.noTop,
                    margin: [0, 4],
                    style: "blue",
                  },
                  {
                    text: document.responsibles?.legal?.name,
                    border: borderOptions.noTop,
                    margin: [0, 4],
                  },
                  {
                    text: "Cargo:",
                    margin: [0, 8],
                    border: borderOptions.noTop,
                    style: "blue",
                  },
                  {
                    text: document.responsibles?.legal?.position,
                    border: borderOptions.noTop,
                    margin: [0, 4],
                  },
                ],
              ],
            },
          },
          {
            layout: thinBorderLayout,
            table: {
              widths: [170, 220, 50, "*"],
              body: [
                [
                  {
                    text: "Responsável pela implantação do PGRS no empreendimento: ",
                    border: borderOptions.noTop,
                    margin: [0, 4],
                    style: "blue",
                  },
                  {
                    text: document.responsibles?.implementation?.name,
                    border: borderOptions.noTop,
                    margin: [0, 4],
                  },
                  {
                    text: "Cargo:",
                    margin: [0, 8],
                    border: borderOptions.noTop,
                    style: "blue",
                  },
                  {
                    text: document.responsibles?.implementation?.position,
                    border: borderOptions.noTop,
                    margin: [0, 4],
                  },
                ],
              ],
            },
          },
          {
            layout: thinBorderLayout,
            table: {
              widths: [140, 110, 132, 110, "*"],
              body: [
                [
                  {
                    text: "Possui refeitório na empresa?",
                    border: borderOptions.noTop,
                    style: "blue",
                  },
                  {
                    text: "São servidas refeições diárias:",
                    border: borderOptions.noTop,
                    rowSpan: 2,
                    style: "blue",
                  },
                  {
                    text: `(${getMarkedAnswer(
                      document.company?.refectory?.amount,
                      undefined
                    )}) Não`,
                    border: borderOptions.horizontalOnly,
                  },
                  {
                    text: "Preparo das refeições:",
                    border: borderOptions.noTop,
                    rowSpan: 2,
                    margin: [0, 8],
                    style: "blue",
                  },
                  {
                    text: `(${getMarkedAnswer(
                      document.company?.refectory?.prepare,
                      DocumentRefectoryPrepare.LOCAL
                    )}) No local (${getMarkedAnswer(
                      document.company?.refectory?.prepare,
                      DocumentRefectoryPrepare.OUTSOURCED
                    )}) Terceirizado`,
                    border: borderOptions.noTop,
                    rowSpan: 2,
                    margin: [0, 8],
                  },
                ],
                [
                  {
                    text: `(${getMarkedAnswer(
                      document.company?.refectory !== undefined,
                      true
                    )}) SIM (${getMarkedAnswer(
                      document.company?.refectory === undefined,
                      true
                    )}) NÃO`,
                    border: borderOptions.noTop,
                    alignment: "center",
                  },
                  "",
                  {
                    text: `(${getMarkedAnswer(
                      document.company?.refectory?.amount !== undefined,
                      true
                    )}) Sim ${getMealAmount(
                      document.company?.refectory
                    )} unidades/dia `,
                    border: borderOptions.noTop,
                  },
                  "",
                  "",
                ],
              ],
            },
          },
        ],
      },
      {
        layout: thinBorderLayout,
        pageBreak: "before",
        margin: [0, 30, 0, 0],
        table: {
          widths: ["*"],
          body: [
            [
              {
                text: "1.2) DADOS DO(A) RESPONSÁVEL TÉCNICO(A) PELA ELABORAÇÃO DO PGRS:",
                bold: true,
                margin: [20, 2, 0, 2],
                style: "blue",
              },
            ],
          ],
        },
      },
      {
        layout: thinBorderLayout,
        table: {
          widths: [170, 300, 120, "*"],
          body: [
            [
              {
                text: "Nome do(a) Responsável Técnico(a):",
                margin: [0, 2],
                border: borderOptions.noTop,
                style: "blue",
              },
              {
                text: TECNICAL.name,
                border: borderOptions.noTop,
                margin: [0, 2],
              },
              {
                text: "Conselho de Classe/n°",
                margin: [0, 2],
                border: borderOptions.noTop,
                style: "blue",
              },
              {
                text: TECNICAL.class,
                border: borderOptions.noTop,
                margin: [0, 2],
              },
            ],
          ],
        },
      },
      {
        layout: thinBorderLayout,
        table: {
          widths: [225, 210, 200, "*"],
          body: [
            [
              {
                text: "Área de Formação do(a) Responsável Técnico(a):",
                margin: [0, 2],
                border: borderOptions.noTop,
                style: "blue",
              },
              {
                text: TECNICAL.position,
                border: borderOptions.noTop,
                margin: [0, 2],
              },
              {
                text: "Nº da ART, RRT ou documento equivalente:",
                margin: [0, 2],
                border: borderOptions.noTop,
                style: "blue",
              },
              {
                text: "",
                border: borderOptions.noTop,
                margin: [0, 2],
              },
            ],
          ],
        },
      },
      {
        layout: thinBorderLayout,
        table: {
          widths: [50, 340, 45, 100, 30, "*"],
          body: [
            [
              {
                text: "Endereço:",
                margin: [0, 2],
                border: borderOptions.noTop,
                style: "blue",
              },
              {
                text: setUpAddress(TECNICAL.company.address),
                margin: [0, 2],
                border: borderOptions.noTop,
              },
              {
                text: "Telefone:",
                margin: [0, 2],
                border: borderOptions.noTop,
                style: "blue",
              },
              {
                text: TECNICAL.phone,
                margin: [0, 2],
                border: borderOptions.noTop,
              },
              {
                text: "E-mail:",
                margin: [0, 2],
                border: borderOptions.noTop,
                style: "blue",
              },
              {
                text: TECNICAL.company.email,
                margin: [0, 2],
                border: borderOptions.noTop,
              },
            ],
          ],
        },
      },
      {
        layout: thinBorderLayout,
        table: {
          widths: [170, 295, 30, "*"],
          body: [
            [
              {
                text: "Empresa Responsável (se for o caso):",
                margin: [0, 2],
                border: borderOptions.noTop,
                style: "blue",
              },
              {
                text: TECNICAL.company.name,
                margin: [0, 2],
                border: borderOptions.noTop,
              },
              {
                text: "CNPJ:",
                margin: [0, 2],
                border: borderOptions.noTop,
                style: "blue",
              },
              {
                text: cnpjMask(TECNICAL.company.identity),
                margin: [0, 2],
                border: borderOptions.noTop,
              },
            ],
          ],
        },
      },
      {
        layout: thinBorderLayout,
        margin: [0, 40, 0, 0],
        table: {
          widths: ["*"],
          body: [
            [
              {
                text: "1.3) DECLARAÇÃO DE CIÊNCIA E ASSINATURA DOS RESPONSÁVEIS:",
                margin: [30, 4, 0, 4],
                bold: true,
                style: "blue",
              },
            ],
            [
              {
                text: "Declaro a autenticidade das informações prestadas e das cópias de documentação em anexo e estou ciente de que a falsidade das informações",
                margin: [45, 10, 0, 0],
                border: borderOptions.noBottom,
                lineHeight: 0.5,
              },
            ],
            [
              {
                text: "apresentadas implicará em penalidades cabíveis conforme legislação vigente.",
                margin: [0, 0, 0, 10],
                border: borderOptions.noTop,
              },
            ],
          ],
        },
      },
      {
        layout: thinBorderLayout,
        table: {
          widths: [150, 200, 100, 100, "*"],
          body: [
            [
              {
                text: "",
                border: borderOptions.noTop,
                style: "blue",
              },
              {
                text: "Nome",
                margin: [0, 2],
                bold: true,
                border: borderOptions.noTop,
                alignment: "center",
                style: "blue",
              },
              {
                text: "CPF",
                margin: [0, 2],
                bold: true,
                border: borderOptions.noTop,
                alignment: "center",
                style: "blue",
              },
              {
                text: "Cargo",
                margin: [0, 2],
                bold: true,
                border: borderOptions.noTop,
                alignment: "center",
                style: "blue",
              },
              {
                text: "Assinatura",
                margin: [0, 2],
                bold: true,
                border: borderOptions.noTop,
                alignment: "center",
                style: "blue",
              },
            ],
            [
              {
                text: "Responsável pelo empreendimento:",
                margin: [0, 4],
                bold: true,
                border: borderOptions.noTop,
                alignment: "center",
                style: "blue",
              },
              {
                text: document.responsibles?.legal?.name,
                margin: [0, 4],
                border: borderOptions.noTop,
              },
              {
                text: cpfMask(
                  document.responsibles?.legal?.identityNumber || ""
                ),
                margin: [0, 4],
                border: borderOptions.noTop,
              },
              {
                text: document.responsibles?.legal?.position,
                margin: [0, 4],
                border: borderOptions.noTop,
              },
              {
                text: "",
                border: borderOptions.noTop,
              },
            ],
            [
              {
                text: "Responsável pela implantação e execução do PGRS na empresa:",
                margin: [10, 0],
                bold: true,
                border: borderOptions.noTop,
                alignment: "center",
                style: "blue",
              },
              {
                text: document.responsibles?.implementation?.name,
                margin: [0, 4],
                border: borderOptions.noTop,
              },
              {
                text: cpfMask(
                  document.responsibles?.implementation?.identityNumber || ""
                ),
                margin: [0, 4],
                border: borderOptions.noTop,
              },
              {
                text: document.responsibles?.implementation?.position,
                margin: [0, 4],
                border: borderOptions.noTop,
              },
              {
                text: "",
                border: borderOptions.noTop,
              },
            ],
            [
              {
                text: "Responsável Técnico(a) pela elaboração do PGRS:",
                margin: [10, 4],
                bold: true,
                border: borderOptions.noTop,
                alignment: "center",
                style: "blue",
              },
              {
                text: TECNICAL.name,
                margin: [0, 4],
                border: borderOptions.noTop,
              },
              {
                text: cpfMask(TECNICAL.taxpayerNumber),
                margin: [0, 4],
                border: borderOptions.noTop,
              },
              {
                text: TECNICAL.position,
                margin: [0, 4],
                border: borderOptions.noTop,
              },
              {
                text: "",
                border: borderOptions.noTop,
              },
            ],
          ],
        },
      },
      ...(renderWastesTable(DocumentWasteClass.CLASS2A, document.wastes) as []),
      ...(renderWastesTable(DocumentWasteClass.CLASS2B, document.wastes) as []),
      ...(renderWastesTable(DocumentWasteClass.CLASS1, document.wastes) as []),
      ...(renderEffluentsTable(document.wastes) as []),
      ...(renderCompaniesTransportDestinationData(document.wastes) as []),
      {
        pageBreak: "before",
        margin: [0, 30, 0, 0],
        layout: thinBorderLayout,
        table: {
          heights: ["auto", "auto", 450],
          widths: ["*"],
          body: [
            [
              {
                text: "4) DESCREVER PONTOS DE DESPERDÍCIO, PERDAS, NÃO SEGRAGAÇÃO, FORMAS NÃO ADEQUADAS DE ACONDICIONAMENTOS, ARMAZENAMENTO, TRANSPORTE, TRATAMENTO E DESTINAÇÃO FINAL DOS RESÍDUOS OU OUTRAS INFORMAÇÕES QUE APONTEM DISCORDÂNCIA COM A LEGISLAÇÃO VIGENTE",
                margin: [0, 4, 0, 0],
                style: "blue",
                bold: true,
                border: borderOptions.noBottom,
              },
            ],
            [
              {
                text: "Inserir informações de situações não adequadas e apontar medidas corretivas para estas situações.",
                margin: [0, -6, 0, 4],
                style: "blue",
                bold: true,
                italics: true,
                border: borderOptions.noTop,
              },
            ],
            [
              {
                text: document?.approved?.wastagePointsDescription,
              },
            ],
          ],
        },
      },
      {
        pageBreak: "before",
        margin: [0, 30, 0, 0],
        layout: thinBorderLayout,
        table: {
          widths: ["*", 50, 150],
          body: [
            [
              {
                text: "5) TREINAMENTO DE PESSOAL E CAPACITAÇÃO PARA SEGREGAÇÃO DOS RESÍDUOS NA EMPRESA",
                colSpan: 3,
                margin: [40, 6],
                style: "blue",
                bold: true,
              },
              "",
              "",
            ],
            [
              {
                text: "O empreendimento oferta capacitação referente ao gerenciamento de resíduos?",
                style: "blue",
                bold: true,
                margin: [0, 8, 0, 4],
                alignment: "center",
              },
              {
                text: `(${getMarkedAnswer(
                  document.approved?.training,
                  true
                )}) SIM`,
                margin: [0, 8, 0, 4],
                alignment: "center",
                border: borderOptions.noRight,
              },
              {
                text: `(${getMarkedAnswer(
                  document.approved?.training,
                  false
                )}) NÃO`,
                margin: [0, 8, 0, 4],
                border: borderOptions.noLeft,
              },
            ],
          ],
        },
      },
      {
        layout: thinBorderLayout,
        table: {
          widths: [70, "*", 130, 208],
          body: [
            [
              {
                text: "Freqüência:",
                margin: [0, 2],
                style: "blue",
                border: borderOptions.noTop,
              },
              {
                text:
                  document.approved?.frequency !== undefined
                    ? DOCUMENT_FREQUENCY(document.approved.frequency)
                    : FIELD_EMPTY,
                margin: [0, 2],
                border: borderOptions.noTop,
              },
              {
                text: "Nº de funcionários treinados:",
                margin: [0, 2],
                style: "blue",
                border: borderOptions.noTop,
              },
              {
                text: document.approved?.trainedEmployees ?? 0,
                margin: [0, 2],
                border: borderOptions.noTop,
              },
            ],
          ],
        },
      },
      {
        layout: thinBorderLayout,
        table: {
          widths: [150, "*", 120, 208],
          body: [
            [
              {
                text: "Responsável/cargo/formação:",
                margin: [0, 10],
                style: "blue",
                border: borderOptions.noTop,
                rowSpan: 2,
              },
              {
                text: document.approved?.responsible,
                margin: [0, 4],
                border: borderOptions.noTop,
                rowSpan: 2,
              },
              {
                text: "Conselho de Classe/n°:",
                style: "blue",
                border: borderOptions.noTop,
              },
              {
                text: document.approved?.classCouncil,
                margin: [0, 2],
                border: borderOptions.noTop,
              },
            ],
            [
              "",
              "",
              {
                text: "Vinculo com a empresa:",
                margin: [0, 2],
                style: "blue",
                border: borderOptions.noTop,
              },
              {
                text: "",
                border: borderOptions.noTop,
              },
            ],
            [
              {
                text: "Se marcar NÃO, justifique:",
                margin: [0, 4],
                style: "blue",
                bold: true,
                border: borderOptions.noTop,
              },
              {
                text: "",
                border: borderOptions.noTop,
                colSpan: 3,
              },
            ],
          ],
        },
      },
      {
        margin: [0, 15],
        layout: thinBorderLayout,
        table: {
          widths: ["*", 120, 120],
          body: [
            [
              {
                text: "6) CRONOGRAMA DE IMPLANTAÇÃO, EXECUÇÃO, OPERAÇÃO, REVISÃO E ATUALIZAÇÃO DO PGRS",
                colSpan: 3,
                margin: [40, 8],
                style: "blue",
                bold: true,
              },
              "",
              "",
            ],
            [
              {
                text: "Ações a serem realizadas ",
                style: "blue",
                bold: true,
                margin: [0, 10, 0, 2],
                alignment: "center",
              },
              {
                text: "Prazo para iniciar as ações",
                style: "blue",
                bold: true,
                margin: [0, 2, 0, 2],
                alignment: "center",
              },
              {
                text: "Prazo para finalizar as ações",
                style: "blue",
                bold: true,
                margin: [0, 2, 0, 2],
                alignment: "center",
              },
            ],
            ...((document.approved?.timeline || []).map((item) =>
              renderTimelineItem(item)
            ) as []),
          ],
        },
      },
      {
        pageBreak: "before",
        margin: [0, 30, 0, 0],
        layout: thinBorderLayout,
        table: {
          heights: ["auto", "auto", 450],
          widths: ["*"],
          body: [
            [
              {
                text: "7 ) OBSERVAÇÕES GERAIS:",
                margin: [20, 4, 0, 0],
                style: "blue",
                bold: true,
                border: borderOptions.noBottom,
              },
            ],
            [
              {
                text: "Descrever outras informações relevantes ao PGRS",
                margin: [20, 0, 0, 4],
                style: "blue",
                italics: true,
                border: borderOptions.noTop,
              },
            ],
            [
              {
                text: document.approved?.observation,
              },
            ],
          ],
        },
      },
      ...(renderAttachmentsTable(document) as []),
    ],
    images: {
      logo,
    },
    styles: {
      headerTitle: {
        alignment: "center",
        fontSize: 16,
        italics: true,
      },
      headerSubtitle: {
        alignment: "center",
        fontSize: 12,
      },
      blue: {
        fillColor: "#DAEEF3",
      },
      blueDark: {
        fillColor: "#B6DDE8",
      },
      wastesSectionTitle: {
        alignment: "center",
      },
      subTitle: {
        alignment: "center",
      },
    },
  };

  return template;
}
