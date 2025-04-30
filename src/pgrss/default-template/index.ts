import { TDocumentDefinitions, TableCell } from "pdfmake/interfaces";
import {
  DOCUMENT_FREQUENCY,
  DOCUMENT_WASTE_COMPANY_LICENSE,
  DOCUMENT_WASTE_FREQUENCY,
  DOCUMENT_WASTE_TREATMENT,
  DOCUMENT_WASTE_UNIT,
  DOCUMENT_WASTE_WEEKDAYS,
  LOCALE,
} from "../../resource";
import {
  DocumentHealthAdditionsQuestionType,
  DocumentHealthAdditionsSanitizationProducts,
  DocumentHealthSanitizationType,
  DocumentHealthWasteClass,
  DocumentWasteCompanyLicense,
} from "../../types/document/enum";
import {
  IDocumentCompanyLicense,
  IDocumentHealthAdditions,
  IDocumentHealthAdditionsParsed,
  IDocumentHealthAdditionsStorageParsed,
  IDocumentHealthWaste,
  IDocumentHealthWasteClassA,
  IDocumentHealthWasteClassE,
} from "../../types/document/interface";
import {
  DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_DOOR_LOCK_SYSTEM,
  DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_MATERIALS_USED,
  DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PROCEDURES,
  DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PRODUCTS,
  DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PROTECTION_GEAR,
  DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_VENTILATION,
  DOCUMENT_HEALTH_WASTE_ORIGIN_POINT,
  DOCUMENT_HEALTH_WASTE_PACKING,
  DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_COOLING_SYSTEM,
  DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION,
} from "../../types/document/resource";
import {
  IHealthWasteClassLabel,
  IRenderReq,
} from "../../types/template/interface";
import { groupKeyMap } from "../../types/template/utils";
import {
  cnpjMask,
  cpfMask,
  dateFormat,
  getCnaeId,
  getCnaeIdList,
  getDateSec,
  phoneMask,
  setUpAddress,
} from "../../utils";

export const FIELD_EMPTY = "- ";

const logo = "http://localhost:5173/davinci-logo.png";
const headerImg = "http://localhost:5173/default-header.png";
const footerImg = "http://localhost:5173/default-footer.png";
const checkImg = "http://localhost:5173/check.png";

const borderOptions = {
  noBottom: [true, true, true, false],
  noTop: [true, false, true, true],
  horizontalOnly: [true, false, true, false],
  leftBottomOnly: [true, false, false, true],
  noBorder: [false, false, false, false],
  noRight: [true, true, false, true],
  noLeft: [false, true, true, true],
  bottomOnly: [false, false, false, true],
};

function parseHealthAdditions(
  data?: IDocumentHealthAdditions
): IDocumentHealthAdditionsParsed | undefined {
  if (!data) return undefined;

  const { homeCare, sanitization, storage } = data;

  const parsedSanitizationItems = sanitization.items.reduce((acc, item) => {
    const { type, ...restItem } = item;

    acc[type] = {
      ...restItem,
      type,
    };

    return acc;
  }, {} as Omit<IDocumentHealthAdditionsParsed["sanitization"], "effluent">);

  const parsedStorage = storage?.questions?.reduce((acc, item) => {
    const { type, ...restItem } = item;

    switch (type) {
      case DocumentHealthAdditionsQuestionType.FLOOR_DRAIN:
        return { ...acc, floorDrain: { ...restItem, type } };
      case DocumentHealthAdditionsQuestionType.COVERAGE:
        return { ...acc, coverage: { ...restItem, type } };
      case DocumentHealthAdditionsQuestionType.VENTILATION:
        return { ...acc, ventilation: { ...restItem, type } };
      case DocumentHealthAdditionsQuestionType.ILLUMINATION:
        return { ...acc, illumination: { ...restItem, type } };
      case DocumentHealthAdditionsQuestionType.DOOR_LOCK_SYSTEM:
        return { ...acc, doorLockSystem: { ...restItem, type } };
      case DocumentHealthAdditionsQuestionType.PROTECTED_FLOOR_MATERIALS:
        return {
          ...acc,
          protectedFloorMaterials: { ...restItem, type },
        };
    }
  }, {} as any) as Omit<
    IDocumentHealthAdditionsStorageParsed,
    | "shared"
    | "exists"
    | "wasteClasses"
    | "wasteTypesIdentification"
    | "wasteByType"
    | "area"
  >;

  return {
    homeCare,
    sanitization: {
      effluent: sanitization.effluent,
      ...parsedSanitizationItems,
    },
    storage: {
      exists: storage.exists,
      wasteClasses: storage.wasteClasses,
      wasteTypesIdentification: storage.wasteTypesIdentification,
      wasteByType: storage.wasteByType,
      area: storage.area,
      shared: storage.shared,
      ...parsedStorage,
    },
  };
}

export function render({
  classifications,
  document,
  techinical,
  cnaes,
}: IRenderReq) {
  const companies: TableCell[][] = [];
  const timeline: TableCell[][] = [];

  const groups: IHealthWasteClassLabel = {};
  const parsedHealthAdditions = parseHealthAdditions(document.healthAdditions);

  if (document.healthWastes) {
    for (let i = 0; i < document.healthWastes.length; i++) {
      const currentWaste = document.healthWastes[i];
      const groupType = currentWaste.group as DocumentHealthWasteClass;
      const key = groupKeyMap[groupType];

      if (key === "groupA") {
        groups[key] = currentWaste as IDocumentHealthWasteClassA;
      } else if (key === "groupE") {
        groups[key] = currentWaste as IDocumentHealthWasteClassE;
      } else {
        groups[key] = currentWaste;
      }
    }
  }

  const { groupA, groupB, groupC, groupDNR, groupDR, groupE } = groups;

  const sanitizationItemContainer =
    document.healthAdditions?.sanitization?.items?.find(
      (item) => item.type === DocumentHealthSanitizationType.CONTAINER
    );

  const resultSanitizationItemContainer =
    sanitizationItemContainer?.product !== undefined
      ? sanitizationItemContainer.product ===
        DocumentHealthAdditionsSanitizationProducts.OTHER
        ? sanitizationItemContainer.otherProduct ?? FIELD_EMPTY
        : DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PRODUCTS(
            sanitizationItemContainer.product
          )
      : FIELD_EMPTY;

  const sanitizationItemInternal =
    document.healthAdditions?.sanitization?.items?.find(
      (item) => item.type === DocumentHealthSanitizationType.INTERNAL_STORAGE
    );

  const resultSanitizationItemInternal =
    sanitizationItemInternal?.product !== undefined
      ? sanitizationItemInternal.product ===
        DocumentHealthAdditionsSanitizationProducts.OTHER
        ? sanitizationItemInternal.otherProduct ?? FIELD_EMPTY
        : DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PRODUCTS(
            sanitizationItemInternal.product
          )
      : FIELD_EMPTY;

  const wasteFrequencyContainer =
    document.healthAdditions?.sanitization?.items?.find(
      (item) => item.type === DocumentHealthSanitizationType.CONTAINER
    )?.frequency !== undefined
      ? DOCUMENT_FREQUENCY(
          document.healthAdditions.sanitization.items.find(
            (item) => item.type === DocumentHealthSanitizationType.CONTAINER
          )!.frequency!
        )
      : FIELD_EMPTY;

  const wasteFrequencyInternal =
    document.healthAdditions?.sanitization?.items?.find(
      (item) => item.type === DocumentHealthSanitizationType.INTERNAL_STORAGE
    )?.frequency !== undefined
      ? DOCUMENT_FREQUENCY(
          document.healthAdditions.sanitization.items.find(
            (item) =>
              item.type === DocumentHealthSanitizationType.INTERNAL_STORAGE
          )!.frequency!
        )
      : FIELD_EMPTY;

  function getCompanyWastes(
    wastes: IDocumentHealthWaste[]
  ): IDocumentCompanyLicense[] {
    const companys: IDocumentCompanyLicense[] = [];

    wastes.forEach((waste) => {
      waste.companiesDestination?.forEach((company) => {
        const repeatDestination = companys.some(
          (e) => company.identifier === e.identifier
        );

        if (company.identifier && !repeatDestination) {
          companys.push(company);
        }
      });

      waste.companiesTransport?.forEach((company) => {
        const repeatTransport = companys.some(
          (e) => company.identifier === e.identifier
        );

        if (company.identifier && !repeatTransport) {
          companys.push(company);
        }
      });
    });

    return companys;
  }

  getCompanyWastes(document.healthWastes ?? []).forEach((company) => {
    const row: TableCell[] = [
      `${company.name} / ${cnpjMask(company.identifier)}`,
      `${company.license} - ${dateFormat(company.licenseExpirationDate)}`,
    ];

    companies.push(row);
  });

  if (!companies.length) {
    companies.push([]);
  }

  document.approved?.timeline?.forEach((e) => {
    const row = [
      e.action,
      `${dateFormat(e.inicialDate)} - ${dateFormat(e.expirationDate)}`,
    ];

    timeline.push(row);
  });

  if (!timeline.length) {
    timeline.push([]);
  }

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

  const template: TDocumentDefinitions = {
    pageSize: "A4",
    pageOrientation: "portrait",
    pageMargins: [50, 80, 50, 80],
    defaultStyle: { font: "Arial", fontSize: 11, lineHeight: 1.5 },
    header: [
      {
        image: "headerImg",
        width: 650,
        alignment: "center",
        cover: {
          width: 650,
          height: 12,
          valign: "center",
          align: "left",
        },
        margin: [0, 40, 0, 0],
      },
    ],
    footer: function (currentPage: number) {
      return {
        stack: [
          "",
          {
            text: [
              { text: currentPage >= 3 ? currentPage - 2 : "", bold: true },
            ],
            width: "auto",
            margin: [0, 0, 50, 0],
            fontSize: 10,
            alignment: "right",
          },
          {
            alignment: "center",
            image: "footerImg",
            width: 600,
            margin: [0, 0, 0, 100],
          },
        ],
      };
    },
    content: [
      {
        lineHeight: 1,
        stack: [
          {
            stack: [
              {
                image: "logo",
                width: 220,
                alignment: "center",
                marginBottom: 15,
              },
              {
                layout: "noBorders",
                margin: [-50, 10, -50, 0],
                table: {
                  widths: ["*"],
                  body: [
                    [
                      {
                        margin: [10, 2],
                        text: "RELATÓRIO TÉCNICO",
                        style: [
                          "bg-gray",
                          "bold",
                          "font-2xl",
                          "center",
                          "my-1",
                        ],
                      },
                    ],
                  ],
                },
              },
              {
                text: [
                  "PLANO DE GERENCIAMENTO ",
                  "\nDE RESÍDUOS SÓLIDOS DO SERVIÇO DE SAÚDE",
                  "\n PGRSS (INDIVIDUAL)",
                ],
                style: ["bold", "center"],
                fontSize: 20,
                margin: [10, 150],
              },
              {
                layout: "noBorders",
                margin: [-50, 0],
                table: {
                  widths: ["*"],
                  body: [
                    [
                      {
                        margin: [0, 2],
                        text: document.company?.name,
                        style: ["bg-gray", "bold", "font-lg", "center", "my-1"],
                      },
                    ],
                  ],
                },
              },
              {
                text: dateFormat(getDateSec()) ?? FIELD_EMPTY,
                fontSize: 12,
                margin: [0, 100, 0, 0],
                style: ["center", "bold"],
              },
            ],
          },
        ],
      },
      {
        style: ["text-justify"],
        pageBreak: "before",
        stack: [
          { text: "1    APRESENTAÇÃO", style: ["bold"] },
          {
            text: "A geração de resíduos sólidos, líquidos e gasosos tem sido sem dúvida alguma, um dos maiores desafios da sociedade moderna. ",
            marginTop: 25,
          },
          {
            text: "Segundo os pesquisadores da área, equacionar este problema é de alta complexidade, podendo ser caracterizado em vários níveis como:",
            marginTop: 15,
          },
          {
            text: [
              { text: "Psicológico:", style: ["bold"] },
              " na questão do resíduo sólido, a palavra lixo dá a ideia de algo sem valor, mas sabe-se que um material pode deixar de ter valor para um indivíduo, porém ter valor para outro;",
            ],
            marginTop: 15,
          },
          {
            text: [
              { text: "Econômico:", style: ["bold"] },
              " a geração de resíduos implica em gastos desnecessários de matéria-prima e energia;",
            ],
            marginTop: 2,
          },
          {
            text: [
              { text: "Ecológico:", style: ["bold"] },
              " encontram-se nos resíduos as mais diversas moléculas sintéticas produzidas pelo homem que afetam, geralmente, a saúde pública e o meio ambiente em geral;",
            ],
            marginTop: 2,
          },
          {
            text: [
              { text: "Sócio-político:", style: ["bold"] },
              " depende da sociedade e das autoridades juntarem forças para solucionar o problema dos resíduos.",
            ],
            marginTop: 2,
          },
          {
            text: "A atual exigência dos órgãos ambientais fiscalizadores no sentido de se fazer cumprir a Lei nº 12.305/10, a Resolução CONAMA 313/02 e a RDC N. 222/2018, definitivamente desmistificar a omissão do poder público, sensibiliza todos aqueles que, em suas atividades, lidam com a problemática de destinação final dos resíduos sólidos e buscam de alguma maneira um controle e gerenciamento mais efetivo dos mesmos.",
            marginTop: 15,
          },
          {
            text: [
              "A preocupação da empresa ",
              { text: document.company?.name ?? FIELD_EMPTY, style: ["bold"] },
              " em planejar suas ações na esfera ambiental, mais especificamente com relação ao gerenciamento de seus resíduos sólidos, se concretiza pela contratação da DaVinci Ambiental, para elaborar um Plano capaz de englobar harmonicamente todas as variáveis envolvidas, tais como custo/benefício administrativo financeiro, ambiental, sanitário, social, político e legal.",
            ],
            marginTop: 15,
          },
          {
            text: "Para isso sabemos que, qualquer que seja a forma de gerenciamento dos resíduos sólidos, são considerados três fatores básicos:",
            marginTop: 15,
          },
          {
            ul: [
              "ser uma solução pautada em princípios ecológicos que contemple a minimização da geração de resíduos e a maximização da reciclagem e reutilização como forma de diminuir a pressão sobre o meio ambiente;",
              "estar coerente com os objetivos sanitários;",
              "incentivar a participação pois, sem a participação de todos os envolvidos e das autoridades, muito pouco pode ser resolvido.",
            ],
            marginLeft: 20,
          },
          {
            text: "Os benefícios advindos são:",
            marginTop: 15,
          },
          {
            type: "lower-alpha",
            separator: ")",
            ol: [
              "economia de energia;",
              "economia de recursos naturais;",
              "minimização dos riscos para a saúde pública;",
              "aumento da vida útil dos aterros sanitários, entre outros.",
            ],
          },
          { text: "1.1 ESCOPO DO TRABALHO", style: ["bold"], marginTop: 25 },
          {
            text: [
              "O escopo do presente trabalho é a elaboração do Plano de Gerenciamento de Resíduos Sólidos do Serviço de Saúde da empresa ",
              { text: document.company?.name ?? FIELD_EMPTY, style: ["bold"] },
              ", onde foram identificadas as oportunidades de redução, reutilização e reciclagem de resíduos, assim como definida a melhor forma de disposição final para o resíduo remanescente.",
            ],
            marginTop: 15,
          },
          { text: "1.2 OBJETIVOS", style: ["bold"], marginTop: 25 },
          {
            text: "O gerenciamento, parte integrante do presente relatório, tem como objetivos:",
            marginTop: 15,
          },
          {
            ul: [
              "Conhecer a geração dos resíduos sólidos;",
              "Definir as fontes, quantidades e tipos dos resíduos gerados e fazer um diagnóstico das condições atuais de gerenciamento dos resíduos da Empresa;",
              "Definir as melhores práticas para a gestão, fundamentado em subsídios suficientemente concretos onde se possa oferecer uma contribuição técnica inovadora voltada nitidamente para as necessidades da prática e do desenvolvimento sustentável da empresa.",
            ],
            marginLeft: 15,
          },
          {
            text: "Diretrizes básicas são observadas, enfocando as seguintes questões:",
            marginTop: 15,
          },
          {
            ul: [
              "Segregar na origem, minimizando a geração de resíduos;",
              "Priorizar a reutilização ou reciclagem dos resíduos passíveis de serem reaproveitados;",
              "Minimizar o consumo de recursos naturais;",
              "Minimizar liberações para o meio ambiente resultante das atividades; e,",
              "Providenciar a disposição adequada dos resíduos remanescentes.",
            ],
            marginLeft: 15,
          },
          {
            text: "1.3 METODOLOGIA DE TRABALHO",
            style: ["bold"],
            marginTop: 25,
          },
          {
            text: "A metodologia utilizada para elaboração de um plano de gerenciamento de resíduos divide-se em duas fases:",
            marginTop: 15,
          },
          {
            text: [
              {
                text: "Fase I - Diagnóstico da situação atual:",
                style: ["bold"],
              },
              " análise das fontes, tipos e quantidades de resíduos produzidos, bem como a gestão atual.",
            ],
            marginTop: 15,
          },
          {
            text: [
              {
                text: "Fase II - Plano de gerenciamento de resíduos e Apoio à implementação do PGRSS:",
                style: ["bold"],
              },
              " esquematiza os passos necessários para gerenciar com eficiência os resíduos sólidos produzidos, e fornece treinamento para aplicação do PGRSS.",
            ],
            marginTop: 15,
          },
          {
            text: "FASE I – DIAGNÓSTICO DA SITUAÇÃO ATUAL",
            marginTop: 15,
          },
          {
            marginLeft: 15,
            ul: [
              "COLETA DE INFORMAÇÕES DISPONÍVEIS",
              "IDENTIFICAÇÃO DOS RESÍDUOS E FONTES GERADORAS",
              "ANÁLISE DOS DADOS",
              "IDENTIFICAÇÃO DAS OPORTUNIDADES",
              "CORREÇÕES E SUGESTÕES DE MELHORIAS",
            ],
          },
          {
            text: "FASE II – PLANEJAMENTO DO GERENCIAMENTO DE RESÍDUOS",
            marginTop: 15,
          },
          {
            marginLeft: 15,
            ul: [
              {
                stack: [
                  {
                    text: "PASSO 1: OPORTUNIDADES DE GERENCIAMENTO DE RESÍDUOS",
                    style: ["bold"],
                  },
                  {
                    text: "Após a identificação dos resíduos gerados, devem ser consideradas as suas opções de gerenciamento. Este passo mostra uma visão geral de redução, reuso, reciclagem, compostagem, geração de energia a partir dos resíduos e alternativas de disposição final, de acordo com as opções existentes.",
                  },
                ],
              },
              {
                stack: [
                  {
                    text: "PASSO 2: AVALIAÇÃO TÉCNICA",
                    style: ["bold"],
                  },
                  {
                    text: "A avaliação técnica deve determinar se uma opção de gerenciamento de resíduos proposta irá funcionar. São levados em consideração os resíduos gerados e as melhores formas de destinação.",
                  },
                ],
              },
              {
                stack: [
                  {
                    text: "PASSO 3: DOCUMENTAÇÃO",
                    style: ["bold"],
                  },
                  {
                    text: "A documentação do plano de gerenciamento compreende este relatório, as licenças ambientais das empresas terceiras e os Manifestos de Transporte de Resíduos (MTRs) e/ou Certificados de Destinação Final (CDFs), bem como outros documentos complementares.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        pageBreak: "before",
        lineHeight: 1.3,
        stack: [
          { text: "2    DADOS DO EMPREENDIMENTO", style: ["bold"] },
          {
            marginTop: 25,
            table: {
              widths: ["*", "*"],
              body: [
                [
                  {
                    text: [
                      { text: "RAZÃO SOCIAL: ", style: ["bold"] },
                      document.company?.name ?? FIELD_EMPTY,
                    ],
                    style: ["bg-gray-dark"],
                    border: borderOptions.bottomOnly,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: "1. DADOS DO EMPREENDIMENTO",
                    style: ["bold"],
                    border: borderOptions.noBorder,
                  },
                  { text: "", border: borderOptions.noBorder },
                ],
                [
                  {
                    text: [
                      { text: "Endereço: ", style: ["bold"] },
                      setUpAddress(document.company?.address),
                    ],
                    border: borderOptions.bottomOnly,
                    marginTop: -5,
                    colSpan: 2,
                  },
                  { text: "", border: borderOptions.noBorder },
                ],
                [
                  {
                    text: [
                      { text: "Telefone: ", style: ["bold"] },
                      document.company?.landline !== undefined
                        ? phoneMask(document.company?.landline)
                        : FIELD_EMPTY,
                    ],
                    border: borderOptions.bottomOnly,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "E-mail: ", style: ["bold"] },
                      document.company?.email ?? FIELD_EMPTY,
                    ],
                    border: borderOptions.bottomOnly,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: "2. REGISTROS LEGAIS:",
                    border: borderOptions.bottomOnly,
                    style: ["bold"],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "CNPJ: ", style: ["bold"] },
                      document.company?.identifier !== undefined
                        ? cnpjMask(document.company.identifier)
                        : FIELD_EMPTY,
                    ],
                    border: borderOptions.bottomOnly,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "Horário de Funcionamento: ", style: ["bold"] },
                      daysOfWeekAndHours(),
                    ],
                    border: borderOptions.bottomOnly,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: "3. RESPONSÁVEIS",
                    border: borderOptions.bottomOnly,
                    style: ["bold"],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: "3.1 RESPONSÁVEL LEGAL:",
                    border: borderOptions.bottomOnly,
                    style: ["bold"],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "Nome: ", style: ["bold"] },
                      document.responsibles?.legal?.name ?? FIELD_EMPTY,
                    ],
                    border: borderOptions.bottomOnly,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "CPF: ", style: ["bold"] },
                      document.responsibles?.legal?.taxpayerNumber
                        ? cpfMask(document.responsibles?.legal?.taxpayerNumber)
                        : FIELD_EMPTY,
                    ],
                    border: borderOptions.bottomOnly,
                  },
                  {
                    text: [
                      { text: "Email: ", style: ["bold"] },
                      document.responsibles?.legal?.email ?? FIELD_EMPTY,
                    ],
                    border: borderOptions.bottomOnly,
                  },
                ],
                [
                  {
                    text: "3.2 RESPONSÁVEL TÉCNICO",
                    border: borderOptions.bottomOnly,
                    style: ["bold"],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: "3.2.1 ELABORAÇÃO DO PGRS",
                    border: borderOptions.bottomOnly,
                    style: ["bold"],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "Nome: ", style: ["bold"] },
                      techinical.name,
                    ],
                    border: borderOptions.bottomOnly,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "Cargo: ", style: ["bold"] },
                      techinical.position,
                    ],
                    border: borderOptions.bottomOnly,
                  },
                  {
                    text: [
                      { text: "Email: ", style: ["bold"] },
                      techinical.email,
                    ],
                    border: borderOptions.bottomOnly,
                  },
                ],
                [
                  {
                    text: [
                      { text: "Telefone: ", style: ["bold"] },
                      techinical.phone
                        ? phoneMask(techinical.phone)
                        : FIELD_EMPTY,
                    ],
                    border: borderOptions.bottomOnly,
                  },
                  {
                    text: [
                      { text: "Conselho de Classe: ", style: ["bold"] },
                      techinical?.professionalClass
                        ? `${techinical?.professionalClass?.institution}  ${techinical?.professionalClass?.identity}`
                        : FIELD_EMPTY,
                    ],
                    border: borderOptions.bottomOnly,
                  },
                ],
                [
                  {
                    text: "3.2.2 IMPLEMENTAÇÃO DO PGRS",
                    border: borderOptions.bottomOnly,
                    style: ["bold"],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "Nome: ", style: ["bold"] },
                      document.responsibles?.implementation?.name ??
                        FIELD_EMPTY,
                    ],
                    border: borderOptions.bottomOnly,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "Cargo: ", style: ["bold"] },
                      document.responsibles?.implementation?.position ??
                        FIELD_EMPTY,
                    ],
                    border: borderOptions.bottomOnly,
                  },
                  {
                    text: [
                      { text: "Email: ", style: ["bold"] },
                      document.responsibles?.implementation?.email ??
                        FIELD_EMPTY,
                    ],
                    border: borderOptions.bottomOnly,
                  },
                ],
                [
                  {
                    text: [
                      { text: "CPF: ", style: ["bold"] },
                      document.responsibles?.implementation?.taxpayerNumber
                        ? cpfMask(
                            document.responsibles?.implementation
                              ?.taxpayerNumber
                          )
                        : FIELD_EMPTY,
                    ],
                    border: borderOptions.bottomOnly,
                  },
                  {
                    text: [
                      { text: "Conselho de Classe: ", style: ["bold"] },
                      document.responsibles?.implementation?.professionalClass
                        ? `${document.responsibles?.implementation?.professionalClass?.institution}  ${document.responsibles?.implementation?.professionalClass?.identity}`
                        : FIELD_EMPTY,
                    ],
                    border: borderOptions.bottomOnly,
                  },
                ],
                [
                  {
                    text: "DADOS ESPECÍFICOS DA ÁREA",
                    style: ["bg-gray-dark", "bold"],
                    border: borderOptions.bottomOnly,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: "4. ATIVIDADES:",
                    style: ["bold"],
                    border: borderOptions.noBorder,
                  },
                  {
                    text: "",
                    border: borderOptions.noBorder,
                  },
                ],
                [
                  {
                    text: [
                      { text: "Atividade Principal: ", style: ["bold"] },
                      document.company?.cnaeId
                        ? getCnaeId(cnaes, document?.company?.cnaeId)
                        : FIELD_EMPTY,
                    ],
                    border: borderOptions.noBorder,
                    colSpan: 2,
                    marginTop: -5,
                  },
                  { text: "", border: borderOptions.noBorder },
                ],
                [
                  {
                    text: [
                      { text: "Atividades Secundárias: ", style: ["bold"] },
                      document.company?.cnaeIds
                        ? getCnaeIdList(cnaes, document?.company?.cnaeIds)
                        : FIELD_EMPTY,
                    ],
                    border: borderOptions.bottomOnly,
                    colSpan: 2,
                    marginTop: -5,
                  },
                  { text: "", border: borderOptions.noBorder },
                ],
                [
                  {
                    text: "5. Nº de funcionários",
                    style: ["bold"],
                    border: borderOptions.noBorder,
                  },
                  {
                    text: "",
                    border: borderOptions.noBorder,
                  },
                ],
                [
                  {
                    text: [
                      { text: "Total: ", style: ["bold"] },
                      {
                        text: document.company?.totalEmployeesCount
                          ? `${document.company?.totalEmployeesCount.toLocaleString(
                              LOCALE
                            )} pessoas`
                          : FIELD_EMPTY,
                      },
                    ],
                    border: borderOptions.bottomOnly,
                    colSpan: 2,
                  },
                  {
                    text: "",
                    border: borderOptions.noBorder,
                  },
                ],
                [
                  {
                    text: [
                      { text: "6. Área construída (m²): ", style: ["bold"] },
                      document.company?.builtArea ?? FIELD_EMPTY,
                    ],
                    border: borderOptions.bottomOnly,
                    colSpan: 2,
                  },
                  {
                    text: "",
                    border: borderOptions.noBorder,
                  },
                ],
                [
                  {
                    text: [
                      {
                        text: "7. Número de Atendimentos/Dia: ",
                        style: ["bold"],
                      },
                      document.company?.healthAppointmentsByDay?.toLocaleString(
                        LOCALE
                      ) ?? FIELD_EMPTY,
                    ],
                    border: borderOptions.bottomOnly,
                    colSpan: 2,
                  },
                  {
                    text: "",
                    border: borderOptions.noBorder,
                  },
                ],
              ],
            },
          },
        ],
      },
      {
        pageBreak: "before",
        style: ["text-justify"],
        stack: [
          { text: "3    EQUIPE TÉCNICA", style: ["bold"] },
          {
            marginTop: 25,
            text: [
              { text: "Pedro Américo Norcio Duarte -", style: ["bold"] },
              " Tecnólogo em Química Ambiental, pela Universidade Tecnológica Federal do Paraná – UTFPR, pós-graduado em Administração com ênfase em Estratégia e Sustentabilidade Empresarial e Mestre em Meio Ambiente Urbano e Industrial pela UFPR e Universidade de Stuttgart, na Alemanha. Possui uma iniciação científica em Tratamento de Efluentes Industriais com Lodos Ativados e experiência em projetos de Educação Ambiental e Tratamento e Destinação de Resíduos Industriais. Atualmente desenvolve trabalhos na área de Assessoria Técnica e Tecnológica na Área de Gestão e Tecnologia Ambiental.",
            ],
          },
        ],
      },
      {
        style: ["text-justify"],
        marginTop: 50,
        lineHeight: 1.3,
        stack: [
          { text: "4 CARACTERIZAÇAO DO EMPREENDIMENTO", style: ["bold"] },
          {
            text: document.company?.activityDescription ?? FIELD_EMPTY,
            margin: [0, 15, 0, 0],
          },
        ],
      },
      {
        pageBreak: "before",
        pageOrientation: "landscape",
        stack: [
          {
            text: "5 MANEJO DOS RESÍDUOS SÓLIDOS",
            style: ["bold"],
          },
          {
            text: "O acondicionamento de cada tipo de resíduo é realizado de acordo com as determinações e limites estabelecidos na resolução.",
            marginTop: 20,
          },
          {
            marginTop: 15,
            text: [
              { text: "GRUPO A – ", bold: true },
              "Devem ser acondicionados em sacos branco leitosos, com identificação e simbologia de Resíduo Infectante. Os sacos devem ser substituídos ao atingirem o limite de 2/3 (dois terços) de sua capacidade ou então a cada 48 (quarenta e oito) horas, independentemente do volume, visando o conforto ambiental e a segurança dos usuários e profissionais.",
            ],
          },
          {
            marginTop: 15,
            text: [
              { text: "GRUPO B – ", bold: true },
              "Devem ser acondicionados em bombonas ou recipientes plásticos contendo a identificação e simbologia de Resíduo Perigoso (químico). ",
            ],
          },
          {
            marginTop: 15,
            text: [
              { text: "GRUPO C – ", bold: true },
              "Fontes radioativas devem seguir as determinações da Comissão Nacional de Energia Nuclear (CNEM).",
            ],
          },
          {
            marginTop: 15,
            text: [
              { text: "GRUPO D – ", bold: true },
              "Os resíduos recicláveis não contaminados devem ser acondicionados em sacos plásticos coloridos (azul – papel; amarelo – metal; vermelho – plástico; verde – vidro) e em recipientes com nome e simbologia de Resíduo Reciclável.  Os resíduos orgânicos e não recicláveis devem ser acondicionados em sacos plásticos de cor marrom ou cinza, e em recipientes identificados com nome e simbologia de Resíduo Não-Reciclável.",
            ],
          },
          {
            marginTop: 15,
            text: [
              { text: "GRUPO E – ", bold: true },
              "Devem ser acondicionados em recipientes identificados com nome e simbologia, rígidos, providos com tampa, resistentes à punctura, ruptura e vazamento. Os recipientes devem ser substituídos de acordo com a demanda ou quando o nível de preenchimento atingir 3/4 da capacidade ou de acordo com as instruções do fabricante, sendo proibidos seu esvaziamento manual e seu reaproveitamento.",
            ],
          },
        ],
      },
      {
        pageBreak: "before",
        pageOrientation: "landscape",
        stack: [
          {
            text: "Os resíduos gerados pela empresa são transportados e destinados conforme apresentados a seguir.",
          },
          {
            text: "GRUPO A",
            style: ["bold"],
            marginTop: 20,
          },
          {
            stack: [
              {
                table: {
                  widths: [120, 200, "*"],
                  body: [
                    [
                      {
                        text: "GRUPO DE RESÍDUOS",
                        style: "headerTable",
                        alignment: "center",
                      },
                      {
                        text: "A – POTENCIALMENTE INFECTANTES",
                        style: "headerTable",
                        alignment: "center",
                      },
                      {
                        stack: [
                          {
                            columns: [
                              {
                                text: "GERA ESTE RESÍDUO: ",
                                style: "bodyTable",
                                bold: true,
                                width: 130,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !Object.keys(groupA ?? {}).length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              Object.keys(groupA ?? {}).length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                text: [
                                  "Se ",
                                  { text: "SIM", style: ["bold"] },
                                  ", complete o quadro abaixo:",
                                ],
                                style: "bodyTable",
                                width: "*",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                    [
                      {
                        text: "Resíduos gerados: ",
                        style: "boldBodyTable",
                      },
                      {
                        text: `- ${groupA?.names?.join(", ") ?? FIELD_EMPTY}`,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Pontos de geração de RSS: ",
                        style: "boldBodyTable",
                      },
                      {
                        text:
                          groupA?.originPoints !== undefined
                            ? `- ${groupA?.originPoints
                                .map((origin) =>
                                  DOCUMENT_HEALTH_WASTE_ORIGIN_POINT(origin)
                                )
                                .join(", ")}`
                            : FIELD_EMPTY,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Forma de acondicionamento: ",
                        style: "boldBodyTable",
                      },
                      {
                        text:
                          groupA?.packing !== undefined
                            ? `- ${DOCUMENT_HEALTH_WASTE_PACKING(
                                groupA?.packing
                              )}`
                            : FIELD_EMPTY,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Quantificação dos resíduos: ",
                        style: "boldBodyTable",
                      },
                      {
                        text:
                          groupA?.quantity !== undefined
                            ? `- ${groupA?.quantity} ${DOCUMENT_WASTE_UNIT(
                                groupA?.unit
                              )}/${DOCUMENT_WASTE_FREQUENCY(
                                groupA.frequency!
                              )} `
                            : FIELD_EMPTY,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Coleta externa: ",
                        style: "boldBodyTable",
                      },
                      {
                        text: [
                          {
                            text: "Frequência de coleta externa:\n",
                            bold: true,
                          },
                          `- ${
                            groupA?.collectionFrequency !== undefined
                              ? DOCUMENT_FREQUENCY(groupA?.collectionFrequency)
                              : ""
                          }`,
                        ],
                        style: "bodyTable",
                      },
                      {
                        text: [
                          {
                            text: "Razão Social da empresa executora do transporte:\n",
                            bold: true,
                          },
                          `- ${
                            groupA?.companyTransport ===
                              DocumentWasteCompanyLicense.CITY_HALL ||
                            groupA?.companyTransport ===
                              DocumentWasteCompanyLicense.OWN_BUSINESS
                              ? DOCUMENT_WASTE_COMPANY_LICENSE(
                                  groupA?.companyTransport
                                )
                              : groupA?.companiesTransport
                                  ?.map((companys) => companys.name)
                                  .join(", ") ?? " "
                          }`,
                        ],
                        style: "bodyTable",
                      },
                    ],
                    [
                      {
                        text: "Tratamento externo: ",
                        style: "boldBodyTable",
                      },
                      {
                        text: [
                          {
                            text: "Tecnologia utilizada:",
                            bold: true,
                          },
                          `\n ${
                            groupA?.treatment !== undefined
                              ? `- ${DOCUMENT_WASTE_TREATMENT(
                                  groupA?.treatment
                                )}`
                              : FIELD_EMPTY
                          }`,
                        ],
                        style: "bodyTable",
                      },
                      {
                        // empresa b
                        text: [
                          {
                            text: "Razão Social da empresa executora do tratamento:",
                            bold: true,
                          },
                          `\n- ${
                            groupA?.companyDestination ===
                              DocumentWasteCompanyLicense.CITY_HALL ||
                            groupA?.companyDestination ===
                              DocumentWasteCompanyLicense.OWN_BUSINESS
                              ? DOCUMENT_WASTE_COMPANY_LICENSE(
                                  groupA?.companyDestination
                                )
                              : groupA?.companiesDestination
                                  ?.map((companys) => companys.name)
                                  .join(", ") ?? " "
                          }`,
                        ],
                        style: "bodyTable",
                      },
                    ],
                    [
                      {
                        // empresa b
                        text: "Disposição final: ",
                        style: "boldBodyTable",
                      },
                      {
                        text: [
                          {
                            text: "Razão Social da empresa receptora final dos resíduos:",
                            bold: true,
                          },
                          `\n- ${
                            groupA?.companyDestination ===
                              DocumentWasteCompanyLicense.CITY_HALL ||
                            groupA?.companyDestination ===
                              DocumentWasteCompanyLicense.OWN_BUSINESS
                              ? DOCUMENT_WASTE_COMPANY_LICENSE(
                                  groupA?.companyDestination
                                )
                              : groupA?.companiesDestination
                                  ?.map((companys) => companys.name)
                                  .join(", ") ?? " "
                          }`,
                        ],

                        style: "bodyTable",
                        colSpan: 2,
                      },
                      "",
                    ],

                    [
                      {
                        text: "RESÍDUOS INFECTANTES DE RÁPIDA PUTREFAÇÃO",
                        style: "headerTable",
                        colSpan: 2,
                        pageBreak: "before",
                      },
                      "",
                      {
                        pageBreak: "before",
                        stack: [
                          {
                            columns: [
                              {
                                text: "GERA ESTE RESÍDUO: ",
                                style: "bodyTable",
                                bold: true,
                                width: 130,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !Object.keys(
                                                groupA?.putrescible ?? {}
                                              ).length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              Object.keys(
                                                groupA?.putrescible ?? {}
                                              ).length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                text: [
                                  "Se ",
                                  {
                                    text: "SIM",
                                    style: ["bold"],
                                  },
                                  ", complete o quadro abaixo:",
                                ],
                                style: "bodyTable",
                                width: "*",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                    [
                      {
                        colSpan: 2,
                        stack: [
                          {
                            columns: [
                              {
                                text: "Possui sistema de refrigeração:",
                                style: "boldBodyTable",
                                width: 160,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              Object.keys(
                                                groupA?.putrescible
                                                  ?.coolingSystem ?? {}
                                              ).length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !Object.keys(
                                                groupA?.putrescible
                                                  ?.coolingSystem ?? {}
                                              ).length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                            ],
                          },
                        ],
                      },
                      "",
                      {
                        text: [
                          {
                            text: [
                              "Se ",
                              { text: "SIM", style: ["bold"] },
                              ", esclareça qual o sistema utilizado: ",
                            ],
                          },
                          ` - ${
                            groupA?.putrescible?.coolingSystem.systemUsed !==
                            undefined
                              ? DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_COOLING_SYSTEM(
                                  groupA?.putrescible?.coolingSystem.systemUsed
                                )
                              : ""
                          }`,
                        ],
                        style: "bodyTable",
                      },
                    ],
                    [
                      {
                        text: [
                          {
                            text: "Descrever os resíduos de rápida putrefação gerados no estabelecimento:\n",
                            bold: true,
                          },
                          `- ${
                            groupA?.putrescible?.descriptions !== undefined
                              ? groupA?.putrescible?.descriptions
                                  .map((description) =>
                                    DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION(
                                      description
                                    )
                                  )
                                  .join(", ")
                              : ""
                          }`,
                        ],
                        style: "bodyTable",
                        colSpan: 3,
                      },
                      "",
                      "",
                    ],
                    [
                      {
                        text: [
                          {
                            text: "Descrever os procedimentos de acondicionamento (características do saco plástico ou recipiente, coleta interna, armazenamento, coleta externa (freqüência e responsável), tecnologia de tratamento e disposição final:\n",
                            bold: true,
                          },
                          `-${
                            document.approved?.putresciblePackingProcedure ?? ""
                          }`,
                        ],
                        style: "bodyTable",
                        colSpan: 3,
                      },
                      "",
                      "",
                    ],
                    [
                      {
                        colSpan: 3,
                        style: "bodyTable",
                        fillColor: "#D9D9D9",
                        border: [true, false, true, true],
                        lineHeight: 1,
                        ul: [
                          "Os resíduos de fácil putrefação devem ser encaminhados para coleta externa no período máximo de 24 horas, se este tempo for ultrapassado estes deverão ser mantidos em equipamento refrigerado.",
                        ],
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
            pageBreak: "before",
            stack: [
              {
                table: {
                  widths: [320, "*"],
                  headerRows: 1,
                  body: [
                    [
                      {
                        text: "RESÍDUO DE EXPLANTES",
                        style: "headerTable",
                      },
                      {
                        stack: [
                          {
                            columns: [
                              {
                                text: "GERA ESTE RESÍDUO:",
                                style: "bodyTable",
                                bold: true,
                                width: 130,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !Object.keys(
                                                groupA?.explant ?? {}
                                              ).length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              Object.keys(groupA?.explant ?? {})
                                                .length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                text: [
                                  "Se ",
                                  { text: "SIM", style: ["bold"] },
                                  ", complete o quadro abaixo:",
                                ],
                                style: "bodyTable",
                                width: "*",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                    [
                      {
                        stack: [
                          {
                            text: "É realizado tratamento interno dos resíduos de explantes?",
                            style: "boldBodyTable",
                          },
                          {
                            columns: [
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text:
                                              groupA?.explant
                                                ?.internalTreatment === true
                                                ? "X"
                                                : "",
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: !groupA?.explant
                                              ?.internalTreatment
                                              ? "X"
                                              : "",
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        text: [
                          "Se ",
                          { text: "SIM ", bold: true },
                          "apresente o Procedimento Operacional Padrão - POP adotado para limpeza, higienização, tratamento interno e destinação final do resíduo, anexado ao PGRSS.\nSe ",
                          { text: "NÃO ", bold: true },
                          "complete o último quadro abaixo",
                        ],
                        style: "bodyTable",
                      },
                    ],
                    [
                      {
                        stack: [
                          {
                            text: "Os explantes são entregues ao paciente quando solicitado?",
                            style: "boldBodyTable",
                            width: 180,
                          },
                          {
                            columns: [
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              groupA?.explant
                                                ?.deliveredToPatient.exists
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !groupA?.explant
                                                ?.deliveredToPatient.exists
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                    bold: true,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        text: `- ${
                          groupA?.explant?.deliveredToPatient.description ?? ""
                        }`,
                        style: "bodyTable",
                      },
                    ],
                    [
                      {
                        text: [
                          {
                            text: "Descrever o procedimento adotado no gerenciamento desse resíduo (acondicionamento, armazenamento, coleta externa - frequência e responsável; tecnologia de tratamento externo e destinação final:\n",
                            bold: true,
                          },
                          `- ${groupA?.explant?.procedures ?? ""}`,
                        ],
                        style: "bodyTable",
                        colSpan: 2,
                      },
                      "",
                    ],
                    [
                      {
                        colSpan: 2,
                        style: "bodyTable",
                        fillColor: "#D9D9D9",
                        border: [true, false, true, true],
                        ul: [
                          "Verifique a Seção XIII da Resolução RDC n.º 15/2012, referente aos procedimentos estabelecidos para o gerenciamento de resíduos de explantes. ",
                        ],
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
            stack: [
              {
                text: "GRUPO B",
                style: ["bold"],
              },
              {
                table: {
                  widths: [120, 200, "*"],
                  headerRows: 1,
                  body: [
                    [
                      {
                        text: "GRUPO DE RESÍDUOS",
                        style: "headerTable",
                        alignment: "center",
                      },
                      {
                        text: "B - QUÍMICOS",
                        style: "headerTable",
                        alignment: "center",
                      },
                      {
                        stack: [
                          {
                            columns: [
                              {
                                text: "GERA ESTE RESÍDUO: ",
                                style: "bodyTable",
                                bold: true,
                                width: 130,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !Object.keys(groupB ?? {}).length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              Object.keys(groupB ?? {}).length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                text: [
                                  "Se ",
                                  { text: "SIM", style: ["bold"] },
                                  ", complete o quadro abaixo:",
                                ],
                                style: "bodyTable",
                                width: "*",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                    [
                      {
                        text: "Resíduos gerados: ",
                        style: "boldBodyTable",
                      },
                      {
                        text: `- ${groupB?.names?.join(", ") ?? FIELD_EMPTY}`,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Pontos de geração de RSS: ",
                        style: "boldBodyTable",
                      },
                      {
                        text:
                          groupB?.originPoints !== undefined
                            ? `- ${groupB?.originPoints
                                .map((origin) =>
                                  DOCUMENT_HEALTH_WASTE_ORIGIN_POINT(origin)
                                )
                                .join(", ")}`
                            : FIELD_EMPTY,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Forma de acondicionamento: ",
                        style: "boldBodyTable",
                      },
                      {
                        text:
                          groupB?.packing !== undefined
                            ? `- ${DOCUMENT_HEALTH_WASTE_PACKING(
                                groupB?.packing
                              )}`
                            : FIELD_EMPTY,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Quantificação dos resíduos: ",
                        style: "boldBodyTable",
                      },
                      {
                        text:
                          groupB?.quantity !== undefined
                            ? `- ${groupB?.quantity} ${DOCUMENT_WASTE_UNIT(
                                groupB?.unit
                              )}/${DOCUMENT_WASTE_FREQUENCY(
                                groupB.frequency!
                              )} `
                            : FIELD_EMPTY,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Coleta externa: ",
                        style: "boldBodyTable",
                      },
                      {
                        text: [
                          {
                            text: "Frequência de coleta externa:\n",
                            bold: true,
                          },
                          groupB?.collectionFrequency !== undefined
                            ? `- ${DOCUMENT_FREQUENCY(
                                groupB?.collectionFrequency
                              )}`
                            : FIELD_EMPTY,
                        ],
                        style: "bodyTable",
                      },
                      {
                        text: [
                          {
                            text: "Razão Social da empresa executora do transporte:\n",
                            bold: true,
                          },
                          `- ${
                            groupB?.companyTransport ===
                              DocumentWasteCompanyLicense.CITY_HALL ||
                            groupB?.companyTransport ===
                              DocumentWasteCompanyLicense.OWN_BUSINESS
                              ? DOCUMENT_WASTE_COMPANY_LICENSE(
                                  groupB?.companyTransport
                                )
                              : groupB?.companiesTransport
                                  ?.map((companys) => companys.name)
                                  .join(", ") ?? " "
                          }`,
                        ],
                        style: "bodyTable",
                      },
                    ],
                    [
                      {
                        text: "Tratamento externo: ",
                        style: "boldBodyTable",
                      },
                      {
                        text: [
                          {
                            text: "Tecnologia utilizada:\n",
                            bold: true,
                          },
                          `${
                            groupB?.treatment !== undefined
                              ? `- ${DOCUMENT_WASTE_TREATMENT(
                                  groupB?.treatment
                                )}`
                              : FIELD_EMPTY
                          }`,
                        ],
                        style: "bodyTable",
                      },
                      {
                        text: [
                          {
                            text: "Razão Social da empresa executora do tratamento:\n",
                            bold: true,
                          },
                          `- ${
                            groupB?.companyDestination ===
                              DocumentWasteCompanyLicense.CITY_HALL ||
                            groupB?.companyDestination ===
                              DocumentWasteCompanyLicense.OWN_BUSINESS
                              ? DOCUMENT_WASTE_COMPANY_LICENSE(
                                  groupB?.companyTransport
                                )
                              : groupB?.companiesTransport
                                  ?.map((companys) => companys.name)
                                  .join(", ") ?? " "
                          }`,
                        ],
                        style: "bodyTable",
                      },
                    ],
                    [
                      {
                        text: "Disposição final: ",
                        style: "boldBodyTable",
                      },
                      {
                        text: [
                          {
                            text: "Razão Social da empresa receptora final dos resíduos:\n",
                            bold: true,
                          },
                          `- ${
                            groupB?.companyDestination ===
                              DocumentWasteCompanyLicense.CITY_HALL ||
                            groupB?.companyDestination ===
                              DocumentWasteCompanyLicense.OWN_BUSINESS
                              ? DOCUMENT_WASTE_COMPANY_LICENSE(
                                  groupB?.companyDestination
                                )
                              : groupB?.companiesDestination
                                  ?.map((companys) => companys.name)
                                  .join(", ") ?? " "
                          }`,
                        ],
                        style: "bodyTable",
                        colSpan: 2,
                      },
                      "",
                    ],
                    [
                      {
                        colSpan: 3,
                        style: "bodyTable",
                        fillColor: "#D9D9D9",
                        border: [true, false, true, true],
                        lineHeight: 1,
                        ul: [
                          "O armazenamento de resíduos químicos deve atender à NBR n.º 12.235 da ABNT. ",
                          "Verificar as orientações constantes nas fichas de segurança dos produtos químicos – FISPQ. Caso possuam características de periculosidade, os frascos vazios não podem ser classificados como recicláveis e as embalagens devem receber tratamento e/ou disposição final igual ao resíduo que os contaminou (Resolução RDC n.º 222/2018 da ANVISA, Resolução RDC n.º 56/2008 da ANVISA). Se a FISPQ indicar deverá seguir as determinações do órgão ambiental competente, esta SMMA, baseada no princípio de precaução, determina que deve ser segregado e encaminhado para tratamento e/ou disposição final ambientalmente adequada como Resíduo Perigoso – Classe I",
                          "Vedado o descarte do resíduo Químico Perigoso – Classe I no solo, na rede de esgotamento sanitário ou de águas pluviais, ou como resíduo comum não-reciclável e reciclável.",
                        ],
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
            pageBreak: "before",
            stack: [
              {
                text: "GRUPO C",
                style: ["bold"],
              },
              {
                table: {
                  widths: [120, 200, "*"],
                  headerRows: 1,
                  body: [
                    [
                      {
                        text: "GRUPO DE RESÍDUOS",
                        style: "headerTable",
                        alignment: "center",
                      },
                      {
                        text: "C - RADIOATIVOS",
                        style: "headerTable",
                        alignment: "center",
                      },
                      {
                        stack: [
                          {
                            columns: [
                              {
                                text: "GERA ESTE RESÍDUO:",
                                style: "bodyTable",
                                bold: true,
                                width: 130,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !Object.keys(groupC ?? {}).length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              Object.keys(groupC ?? {}).length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                    [
                      {
                        colSpan: 3,
                        style: "bodyTable",
                        fillColor: "#D9D9D9",
                        border: [true, false, true, true],
                        ul: [
                          "Fontes radioativas devem seguir as determinações da CNEN.",
                        ],
                      },
                      "",
                      "",
                    ],
                  ],
                },
              },
              {
                text: "GRUPO D",
                style: ["bold"],
                marginTop: 30,
              },
              {
                margin: [0, 0, 0, 10],
                table: {
                  widths: [120, 200, "*"],
                  headerRows: 1,
                  body: [
                    [
                      {
                        text: "GRUPO DE RESÍDUOS",
                        style: "headerTable",
                        alignment: "center",
                      },
                      {
                        text: "D – COMUNS NÃO RECICLÁVEIS",
                        style: "headerTable",
                        alignment: "center",
                      },
                      {
                        stack: [
                          {
                            columns: [
                              {
                                text: "GERA ESTE RESÍDUO:",
                                style: "bodyTable",
                                bold: true,
                                width: 130,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !Object.keys(groupDNR ?? {})
                                                .length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              Object.keys(groupDNR ?? {}).length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                text: [
                                  "Se ",
                                  { text: "SIM", style: ["bold"] },
                                  ", complete os quadros abaixo:",
                                ],
                                style: "bodyTable",
                                width: "*",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                    [
                      {
                        text: "Resíduos gerados: ",
                        style: "boldBodyTable",
                      },
                      {
                        text: `-${groupDNR?.names?.join(", ") ?? FIELD_EMPTY}`,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Pontos de geração de RSS: ",
                        style: "boldBodyTable",
                      },
                      {
                        text:
                          groupDNR?.originPoints !== undefined
                            ? `- ${groupDNR?.originPoints
                                .map((origin) =>
                                  DOCUMENT_HEALTH_WASTE_ORIGIN_POINT(origin)
                                )
                                .join(", ")}`
                            : FIELD_EMPTY,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Forma de acondicionamento: ",
                        style: "boldBodyTable",
                      },
                      {
                        text:
                          groupDNR?.packing !== undefined
                            ? `- ${DOCUMENT_HEALTH_WASTE_PACKING(
                                groupDNR?.packing
                              )}`
                            : FIELD_EMPTY,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Quantificação dos resíduos: ",
                        style: "boldBodyTable",
                      },
                      {
                        text:
                          groupDNR?.quantity !== undefined
                            ? `- ${groupDNR?.quantity} ${DOCUMENT_WASTE_UNIT(
                                groupDNR?.unit
                              )}/${DOCUMENT_WASTE_FREQUENCY(
                                groupDNR.frequency!
                              )} `
                            : FIELD_EMPTY,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Coleta externa: ",
                        style: "boldBodyTable",
                      },
                      {
                        text: [
                          {
                            text: "Frequência de coleta externa:\n",
                            bold: true,
                          },
                          groupDNR?.collectionFrequency !== undefined
                            ? `- ${DOCUMENT_FREQUENCY(
                                groupDNR?.collectionFrequency
                              )}`
                            : FIELD_EMPTY,
                        ],
                        style: "bodyTable",
                      },
                      {
                        stack: [
                          {
                            columns: [
                              {
                                margin: [0, 1, 0, 0],
                                alignment: "left",
                                table: {
                                  heights: [5],
                                  widths: [2.5],
                                  body: [
                                    [
                                      {
                                        text: `${
                                          groupDNR?.companyTransport ===
                                          DocumentWasteCompanyLicense.CITY_HALL
                                            ? "X"
                                            : ""
                                        }`,
                                        relativePosition: {
                                          x: -2.5,
                                          y: -3.5,
                                        },
                                        fontSize: 11,
                                        bold: true,
                                      },
                                    ],
                                  ],
                                },
                                width: 15,
                              },
                              {
                                text: "Coleta Pública",
                                style: "boldBodyTable",
                              },
                            ],
                            width: 40,
                          },
                          {
                            columns: [
                              {
                                margin: [0, 1, 0, 0],
                                table: {
                                  heights: [5],
                                  widths: [2.5],
                                  body: [
                                    [
                                      {
                                        text: `${
                                          groupDNR?.companyTransport ===
                                          DocumentWasteCompanyLicense.OWN_BUSINESS
                                            ? "X"
                                            : ""
                                        }`,
                                        relativePosition: {
                                          x: -2.5,
                                          y: -3.5,
                                        },
                                        fontSize: 11,
                                        bold: true,
                                      },
                                    ],
                                  ],
                                },
                                width: 15,
                              },
                              {
                                text: "Coleta Própria",
                                style: "boldBodyTable",
                              },
                            ],
                            width: 40,
                          },
                          {
                            columns: [
                              {
                                margin: [0, 1, 0, 0],
                                table: {
                                  heights: [5],
                                  widths: [2.5],
                                  body: [
                                    [
                                      {
                                        text: `${
                                          groupDNR?.companyTransport ===
                                          DocumentWasteCompanyLicense.OUTSOURCED
                                            ? "X"
                                            : ""
                                        }`,
                                        relativePosition: {
                                          x: -2.5,
                                          y: -3.5,
                                        },
                                        fontSize: 11,
                                        bold: true,
                                      },
                                    ],
                                  ],
                                },
                                width: 15,
                              },
                              {
                                text: "Empresa contratada",
                                style: "boldBodyTable",
                              },
                            ],
                            width: 40,
                          },
                          {
                            text: [
                              {
                                text: "Nome da empresa contratada:\n",
                                bold: true,
                              },
                              `${
                                groupDNR?.companyTransport ===
                                DocumentWasteCompanyLicense.OUTSOURCED
                                  ? groupDNR?.companiesTransport
                                      ?.map((companys) => companys.name)
                                      .join(", ")
                                  : " "
                              }`,
                            ],
                            style: "bodyTable",
                          },
                        ],
                      },
                    ],
                    [
                      {
                        text: "Disposição final:",
                        style: "boldBodyTable",
                      },
                      {
                        text: [
                          {
                            text: "Razão Social da empresa receptora final dos resíduos:\n",
                            bold: true,
                          },

                          `- ${
                            groupDNR?.companyDestination ===
                              DocumentWasteCompanyLicense.CITY_HALL ||
                            groupDNR?.companyDestination ===
                              DocumentWasteCompanyLicense.OWN_BUSINESS
                              ? DOCUMENT_WASTE_COMPANY_LICENSE(
                                  groupDNR?.companyDestination
                                )
                              : groupDNR?.companiesDestination
                                  ?.map((companys) => companys.name)
                                  .join(", ") ?? " "
                          }`,
                        ],
                        style: "bodyTable",
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
            stack: [
              {
                pageBreak: "before",
                table: {
                  widths: [120, 200, "*"],
                  headerRows: 1,
                  body: [
                    [
                      {
                        text: "GRUPO DE RESÍDUOS",
                        style: "headerTable",
                        alignment: "center",
                      },
                      {
                        text: "D – COMUNS RECICLÁVEIS",
                        style: "headerTable",
                        alignment: "center",
                      },
                      {
                        stack: [
                          {
                            columns: [
                              {
                                text: "GERA ESTE RESÍDUO:",
                                style: "boldBodyTable",
                                width: 130,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !Object.keys(groupDR ?? {}).length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              Object.keys(groupDR ?? {}).length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                text: [
                                  "Se assinalar ",
                                  { text: "SIM", style: ["bold"] },
                                  ", complete os quadros abaixo:",
                                ],
                                style: "bodyTable",
                                width: "*",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                    [
                      {
                        text: "Resíduos gerados: ",
                        style: "boldBodyTable",
                      },
                      {
                        text: `- ${groupDR?.names?.join(", ") ?? FIELD_EMPTY}`,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Pontos de geração de RSS: ",
                        style: "boldBodyTable",
                      },
                      {
                        text:
                          groupDR?.originPoints !== undefined
                            ? `- ${groupDR?.originPoints
                                .map((origin) =>
                                  DOCUMENT_HEALTH_WASTE_ORIGIN_POINT(origin)
                                )
                                .join(", ")}`
                            : FIELD_EMPTY,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Forma de acondicionamento: ",
                        style: "boldBodyTable",
                      },
                      {
                        text:
                          groupDR?.packing !== undefined
                            ? `- ${DOCUMENT_HEALTH_WASTE_PACKING(
                                groupDR?.packing
                              )}`
                            : FIELD_EMPTY,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Quantificação dos resíduos: ",
                        style: "boldBodyTable",
                      },
                      {
                        text:
                          groupDR?.quantity !== undefined
                            ? `- ${groupDR?.quantity} ${DOCUMENT_WASTE_UNIT(
                                groupDR?.unit
                              )}/${DOCUMENT_WASTE_FREQUENCY(
                                groupDR.frequency!
                              )} `
                            : FIELD_EMPTY,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Coleta externa: ",
                        style: "boldBodyTable",
                      },
                      {
                        text: [
                          {
                            text: "Frequência de coleta externa:\n",
                            bold: true,
                          },
                          groupDR?.collectionFrequency !== undefined
                            ? `- ${DOCUMENT_FREQUENCY(
                                groupDR?.collectionFrequency
                              )}`
                            : FIELD_EMPTY,
                        ],
                        style: "bodyTable",
                      },
                      {
                        stack: [
                          {
                            columns: [
                              {
                                margin: [0, 1, 0, 0],
                                alignment: "left",
                                table: {
                                  heights: [5],
                                  widths: [2.5],
                                  body: [
                                    [
                                      {
                                        text: `${
                                          groupDR?.companyTransport ===
                                          DocumentWasteCompanyLicense.CITY_HALL
                                            ? "X"
                                            : ""
                                        }`,
                                        relativePosition: {
                                          x: -2.5,
                                          y: -3.5,
                                        },
                                        fontSize: 11,
                                        bold: true,
                                      },
                                    ],
                                  ],
                                },
                                width: 15,
                              },
                              {
                                text: "Coleta Pública",
                                style: "boldBodyTable",
                              },
                            ],
                            width: 40,
                          },
                          {
                            columns: [
                              {
                                margin: [0, 1, 0, 0],
                                alignment: "left",
                                table: {
                                  heights: [5],
                                  widths: [2.5],
                                  body: [
                                    [
                                      {
                                        text: `${
                                          groupDR?.companyTransport ===
                                          DocumentWasteCompanyLicense.OWN_BUSINESS
                                            ? "X"
                                            : ""
                                        }`,
                                        relativePosition: {
                                          x: -2.5,
                                          y: -3.5,
                                        },
                                        fontSize: 11,
                                        bold: true,
                                      },
                                    ],
                                  ],
                                },
                                width: 15,
                              },
                              {
                                text: "Coleta Própria",
                                style: "boldBodyTable",
                              },
                            ],
                            width: 40,
                          },
                          {
                            columns: [
                              {
                                margin: [0, 1, 0, 0],
                                table: {
                                  heights: [5],
                                  widths: [2.5],
                                  body: [
                                    [
                                      {
                                        text: `${
                                          groupDR?.companyTransport ===
                                          DocumentWasteCompanyLicense.OUTSOURCED
                                            ? "X"
                                            : ""
                                        }`,
                                        relativePosition: {
                                          x: -2.5,
                                          y: -3.5,
                                        },
                                        fontSize: 11,
                                        bold: true,
                                      },
                                    ],
                                  ],
                                },
                                width: 15,
                              },
                              {
                                text: "Empresa contratada",
                                style: "boldBodyTable",
                              },
                            ],
                            width: 40,
                          },
                          {
                            text: [
                              {
                                text: "Nome da empresa contratada: ",
                                bold: true,
                              },
                              `${
                                groupDR?.companyTransport ===
                                DocumentWasteCompanyLicense.OUTSOURCED
                                  ? groupDR?.companiesTransport
                                      ?.map((companys) => companys.name)
                                      .join(", ")
                                  : " "
                              }`,
                            ],
                            style: "bodyTable",
                          },
                        ],
                      },
                    ],
                    [
                      {
                        text: "Disposição final: ",
                        style: "boldBodyTable",
                      },
                      {
                        text: [
                          {
                            text: "Razão Social da empresa receptora final dos resíduos:\n",
                            bold: true,
                          },
                          `- ${
                            groupDR?.companyDestination ===
                              DocumentWasteCompanyLicense.CITY_HALL ||
                            groupDR?.companyDestination ===
                              DocumentWasteCompanyLicense.OWN_BUSINESS
                              ? DOCUMENT_WASTE_COMPANY_LICENSE(
                                  groupDR?.companyDestination
                                )
                              : groupDR?.companiesDestination
                                  ?.map((companys) => companys.name)
                                  .join(", ") ?? " "
                          }`,
                        ],
                        style: "bodyTable",
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
            stack: [
              {
                pageBreak: "before",
                table: {
                  widths: [120, 200, "*"],
                  headerRows: 1,
                  body: [
                    [
                      {
                        text: "GRUPO DE RESÍDUOS",
                        style: "headerTable",
                        alignment: "center",
                        lineHeight: 1,
                      },
                      {
                        lineHeight: 1,
                        text: "E – PERFUROCORTANTES\nRisco Adicional Infectante",
                        style: "headerTable",
                        alignment: "center",
                      },
                      {
                        lineHeight: 1,
                        stack: [
                          {
                            columns: [
                              {
                                text: "GERA ESTE RESÍDUO:",
                                style: "boldBodyTable",
                                width: 130,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !Object.keys(groupE ?? {}).length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              Object.keys(groupE ?? {}).length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                text: [
                                  "Se ",
                                  {
                                    text: "SIM",
                                    style: ["bold"],
                                  },
                                  ", complete o quadro abaixo:",
                                ],
                                style: "bodyTable",
                                width: "*",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                    [
                      {
                        text: "Resíduos gerados: ",
                        style: "boldBodyTable",
                      },
                      {
                        text: `- ${groupE?.names?.join(", ") ?? FIELD_EMPTY}`,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Pontos de geração de RSS: ",
                        style: "boldBodyTable",
                      },
                      {
                        text:
                          groupE?.originPoints !== undefined
                            ? `- ${groupE?.originPoints
                                .map((origin) =>
                                  DOCUMENT_HEALTH_WASTE_ORIGIN_POINT(origin)
                                )
                                .join(", ")}`
                            : FIELD_EMPTY,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Forma de acondicionamento: ",
                        style: "boldBodyTable",
                      },
                      {
                        text: `- ${
                          groupE?.packing !== undefined
                            ? DOCUMENT_HEALTH_WASTE_PACKING(groupE?.packing)
                            : ""
                        }`,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Quantificação dos resíduos: ",
                        style: "boldBodyTable",
                      },
                      {
                        text:
                          groupE?.quantity !== undefined
                            ? `- ${groupE?.quantity} ${DOCUMENT_WASTE_UNIT(
                                groupE?.unit
                              )}/${DOCUMENT_WASTE_FREQUENCY(
                                groupE.frequency!
                              )} `
                            : FIELD_EMPTY,
                        colSpan: 2,
                        style: "bodyTable",
                      },
                      "",
                    ],
                    [
                      {
                        text: "Coleta externa: ",
                        style: "boldBodyTable",
                      },
                      {
                        text: [
                          {
                            text: "Frequência de coleta externa:\n",
                            bold: true,
                          },
                          `- ${
                            groupE?.collectionFrequency !== undefined
                              ? DOCUMENT_FREQUENCY(groupE?.collectionFrequency)
                              : ""
                          }`,
                        ],
                        style: "bodyTable",
                      },
                      {
                        text: [
                          {
                            text: "Razão Social da empresa executora do transporte:\n",
                            bold: true,
                          },
                          `- ${
                            groupE?.companyTransport ===
                              DocumentWasteCompanyLicense.CITY_HALL ||
                            groupE?.companyTransport ===
                              DocumentWasteCompanyLicense.OWN_BUSINESS
                              ? DOCUMENT_WASTE_COMPANY_LICENSE(
                                  groupE?.companyTransport
                                )
                              : groupE?.companiesTransport
                                  ?.map((companys) => companys.name)
                                  .join(", ") ?? " "
                          }`,
                        ],
                        style: "bodyTable",
                      },
                    ],
                    [
                      {
                        text: "Tratamento externo: ",
                        style: "boldBodyTable",
                      },
                      {
                        text: [
                          {
                            text: "Tecnologia utilizada:\n",
                            bold: true,
                          },
                          `${
                            groupE?.treatment !== undefined
                              ? `- ${DOCUMENT_WASTE_TREATMENT(
                                  groupE?.treatment
                                )}`
                              : FIELD_EMPTY
                          }`,
                        ],
                        style: "bodyTable",
                      },
                      {
                        text: [
                          {
                            text: "Razão Social da empresa executora do tratamento:\n",
                            bold: true,
                          },
                          `- ${
                            groupE?.companiesDestination
                              ?.map((companys) => companys.name)
                              .join(", ") ?? " "
                          }`,
                        ],
                        style: "bodyTable",
                      },
                    ],
                    [
                      {
                        text: "Disposição final: ",
                        style: "boldBodyTable",
                      },
                      {
                        text: [
                          {
                            text: "Razão Social da empresa receptora final dos resíduos:\n",
                            bold: true,
                          },

                          `-${
                            groupE?.companyDestination ===
                              DocumentWasteCompanyLicense.CITY_HALL ||
                            groupE?.companyDestination ===
                              DocumentWasteCompanyLicense.OWN_BUSINESS
                              ? DOCUMENT_WASTE_COMPANY_LICENSE(
                                  groupE?.companyDestination
                                )
                              : groupE?.companiesDestination
                                  ?.map((companys) => companys.name)
                                  .join(", ") ?? " "
                          }`,
                        ],
                        style: "bodyTable",
                        colSpan: 2,
                      },
                      "",
                    ],
                    [
                      {
                        text: "GRUPO DE RESÍDUOS",
                        style: "headerTable",
                        alignment: "center",
                        lineHeight: 1,
                      },
                      {
                        text: "E – PERFUROCORTANTES Risco\nAdicional Químico ou Quimioterápico",
                        style: "headerTable",
                        alignment: "center",
                        lineHeight: 1,
                      },
                      {
                        lineHeight: 1,
                        stack: [
                          {
                            columns: [
                              {
                                text: "GERA ESTE RESÍDUO:",
                                style: "bodyTable",
                                bold: true,
                                width: 130,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !Object.keys(
                                                groupE?.chemicalDangerProcedures ??
                                                  {}
                                              ).length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              Object.keys(
                                                groupE?.chemicalDangerProcedures ??
                                                  {}
                                              ).length
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                text: [
                                  "Se ",
                                  { text: "SIM", style: ["bold"] },
                                  ", complete os quadros abaixo:",
                                ],
                                style: "bodyTable",
                                width: "*",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                    [
                      {
                        text: [
                          {
                            text: "Descrever o procedimento adotado no gerenciamento desse resíduo (acondicionamento, armazenamento, coleta externa, tecnologia de tratamento externo e destinação final:\n",
                            bold: true,
                          },
                          `- ${groupE?.chemicalDangerProcedures ?? ""}`,
                        ],
                        colSpan: 3,
                        style: "bodyTable",
                      },
                      "",
                      "",
                    ],
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        style: ["text-justify"],
        pageBreak: "before",
        pageOrientation: "portrait",
        stack: [
          {
            text: "5.1 COLETA INTERNA",
            style: ["bold"],
          },
          {
            text: "De acordo com Resoluções RDC – ANVISA nº 222/2018, CONAMA nº 358/2005 e normas pertinentes da ABNT e do município sede do estabelecimento, deve-se:",
            marginTop: 20,
          },
          {
            marginTop: 15,
            text: [
              " ",
              "          1)   Durante o manuseio dos resíduos o funcionário deverá utilizar os seguintes equipamentos de proteção individual: óculos de proteção, bota de segurança, luvas de PVC ou borracha, impermeáveis, resistentes, de cor clara, antiderrapantes e de cano longo; avental: de PVC, impermeável e de médio comprimento. Após a coleta interna, o funcionário deve lavar as mãos ainda enluvadas, retirando as luvas e colocando-as em local apropriado. O funcionário deve lavar as mãos antes de calçar as luvas e depois de retirá-las.",
            ],
          },
          {
            text: [
              " ",
              "         2)   Em caso de ruptura das luvas, o funcionário deve descartá-las imediatamente, não as reutilizando.",
            ],
          },
          {
            text: [
              " ",
              "          3)   Estes equipamentos de proteção individual devem ser lavados e desinfetados diariamente. Sempre que houver contaminação com material infectante, devem ser substituídos imediatamente, lavados e esterilizados.",
            ],
          },
          {
            text: "As pessoas envolvidas com o manuseio de resíduos devem ser submetidas a exame admissional, periódico, de retorno ao trabalho, mudança de função e demissional. ",
            marginTop: 15,
          },
          {
            text: "Dimensionamento de coletores",
            marginTop: 15,
            style: ["bold"],
          },
          {
            text: "Os coletores foram dimensionados de acordo com as quantidades geradas em cada fonte, peso específico e frequência de remoção, permitindo determinar os tipos mais apropriados de coletores, quantidades e dimensões.",
            marginTop: 15,
          },
          {
            text: "Logística de remoção e coleta",
            marginTop: 15,
            style: ["bold"],
          },
          {
            text: "Descrição de rotinas e utilização de EPIs:",
            marginTop: 15,
          },
          {
            text: "Funcionários encarregados no manejo dos resíduos de serviço de saúde deverão utilizar equipamentos de proteção individual, conforme NR-32, sendo luvas de material resistente, óculos de proteção, máscara de proteção, uniforme de tecido resistente e avental impermeável por cima e botas de borracha.",
            marginTop: 15,
          },
          {
            text: "Os funcionários deverão transportar os resíduos dos Grupos A e E, B, D separadamente, considerar a compatibilidade química dos resíduos e não transportar juntas substâncias que possam resultar em reação química violenta.",
            marginTop: 15,
          },
          {
            text: "As coletas dos resíduos do Grupo A e E e dos resíduos do Grupo B devem ser realizadas em um turno único, evitando uma possível contaminação com os resíduos de outros grupos.",
            marginTop: 15,
          },
          {
            text: "Não arrastar no solo os recipientes, e os sacos plásticos; aproximar o carro coletor o máximo possível do lugar de onde se deve recolher os recipientes. Não transferir os resíduos acondicionados de um recipiente para outro; no recolhimento dos sacos, os funcionários devem levantá-los e mantê-los distantes do corpo, a fim de evitar cortes e possíveis acidentes com materiais perfuro cortantes, indevidamente acondicionados.",
            marginTop: 15,
          },
          {
            text: "5.2 ARMAZENAMENTO – ABRIGO EXTERNO",
            style: ["bold"],
            marginTop: 15,
          },
          {
            text: "Os resíduos deverão seguir os seguintes procedimentos ao serem transportados dentro do estabelecimento, de acordo com as Resoluções RDC – ANVISA nº 222/2018, CONAMA nº 358/2004 e normas pertinentes da ABNT e do município sede do estabelecimento.",
            marginTop: 15,
          },
          {
            stack: [
              {
                text: [
                  "1)    ",
                  "O abrigo de resíduos é constituído de um local fechado, exclusivo para guarda temporária de resíduos de serviços de saúde, devidamente acondicionados em recipientes.",
                ],
                marginTop: 15,
              },
              {
                text: [
                  "2)    ",
                  "As dimensões do abrigo são suficientes para armazenar a produção de resíduos de até três dias, sem empilhamento dos recipientes acima de 1,20 m.",
                ],
                marginTop: 15,
              },
              {
                text: [
                  "3)    ",
                  "O piso, paredes, porta e teto são de material liso, impermeável, lavável e de cor branca.",
                ],
                marginTop: 15,
              },
              {
                text: [
                  "4)    ",
                  "A porta deve ostentar o símbolo de substância infectante.",
                ],
                marginTop: 15,
              },
              {
                text: [
                  "5)    ",
                  "O abrigo de resíduo deve ser higienizado após a coleta externa ou sempre que ocorrer derramamento.",
                ],
                marginTop: 15,
              },
            ],
            marginLeft: 15,
          },
          {
            text: "O abrigo externo deve ser dividido e devidamente identificado em abrigo para “RESÍDUO RECICLÁVEL”, “RESÍDUO INFECTANTE”, “RESÍDUO QUÍMICO” E “RESÍDUO NÃO RECICLÁVEL”. ",
            marginTop: 15,
          },
          {
            text: "As instalações internas o abrigo de “RESÍDUO INFECTANTE” deve ser de pisos e paredes laváveis, na cor clara; devidamente lacrados para impedir o acesso de pessoas estranhas e possuem instalações de água para a higienização do abrigo externo das lixeiras e containers de transporte.",
            marginTop: 15,
          },
        ],
      },
      {
        style: ["text-justify"],
        pageBreak: "before",
        stack: [
          {
            text: "5.7 DESTINAÇÃO FINAL",
            style: ["bold"],
            marginTop: 25,
          },
          {
            text: "A tabela abaixo descreve quem são as empresas responsáveis pela coleta, tratamento e destinação final dos RSS conforme apresentados no item 3 deste PGRSS.",
            marginTop: 15,
            fontSize: 12,
          },
          {
            layout: {
              hLineColor: function () {
                return "#C2D69B";
              },
              hLineWidth: function () {
                return 1.5;
              },
            },
            style: ["center"],
            marginTop: 15,
            table: {
              widths: ["*", "*"],
              body: [
                [
                  {
                    text: "Razão Social/CNPJ",
                    style: ["bold"],
                    border: borderOptions.bottomOnly,
                  },
                  {
                    text: "N° da Licença Ambiental / Órgão licenciador / Validade",
                    style: ["bold"],
                    margin: [20, 0],
                    border: borderOptions.bottomOnly,
                  },
                ],
              ],
            },
          },
          {
            layout: {
              fillColor: function (rowIndex) {
                return rowIndex % 2 === 0 ? "#EAF1DD" : null;
              },
              hLineColor: function () {
                return "#C2D69B";
              },
              vLineColor: function () {
                return "#C2D69B";
              },
              hLineWidth: function () {
                return 0.1;
              },
              vLineWidth: function () {
                return 0.1;
              },
            },
            style: ["center"],
            table: {
              widths: ["*", "*"],
              body: [...companies],
            },
          },
        ],
      },
      {
        pageBreak: "before",
        pageOrientation: "landscape",
        lineHeight: 1.3,
        stack: [
          {
            text: "6   ROTINA DE LIMPEZA E HIGIENIZAÇÃO DOS RECIPIENTES DE ACONDICIONAMENTO DOS RESÍDUOS E ABRIGO EXTERNO",
            style: ["bold", "center"],
          },
          {
            text: "As cestas de resíduo com tampa situadas em cada setor deverão ser higienizadas semanalmente com sabão e água e desinfetadas com hipoclorito de sódio a 1%. O carro utilizado no transporte dos resíduos deverá também ser higienizado diariamente com sabão e água e desinfetados com hipoclorito de sódio a 1%. O abrigo externo destinado à coleta deverá ser higienizado com água corrente e sabão e desinfecção com Hipoclorito de sódio a 1 %.",
            marginTop: 25,
          },
          {
            margin: [0, 30, 0, 10],
            table: {
              widths: [150, "*"],
              headerRows: 1,
              body: [
                [
                  {
                    text: "ROTINA DE LIMPEZA E HIGIENIZAÇÃO DOS RECIPIENTES DE ACONDICIONAMENTO DOS RESÍDUOS",
                    style: "headerTable",
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: "Lixeiras, carrinhos de coleta,  containers",
                    style: "headerTable",
                    rowSpan: 4,
                    margin: [0, 8, 0, 0],
                  },
                  {
                    text: [
                      {
                        text: "Frequência de Limpeza: ",
                        bold: true,
                      },
                      wasteFrequencyContainer,
                    ],
                    style: "bodyTable",
                  },
                ],
                [
                  "",
                  {
                    text: [
                      {
                        text: "Produtos Utilizados: ",
                        bold: true,
                      },
                      resultSanitizationItemContainer,
                    ],
                    style: "bodyTable",
                  },
                ],
                [
                  "",
                  {
                    text: [
                      {
                        text: "EPI’s Utilizados: ",
                        bold: true,
                      },
                      document.healthAdditions?.sanitization?.items?.find(
                        (item) =>
                          item.type === DocumentHealthSanitizationType.CONTAINER
                      )?.protectionGear !== undefined
                        ? DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PROTECTION_GEAR(
                            document.healthAdditions?.sanitization?.items?.find(
                              (item) =>
                                item.type ===
                                DocumentHealthSanitizationType.CONTAINER
                            )?.protectionGear!
                          )
                        : FIELD_EMPTY,
                    ],
                    style: "bodyTable",
                  },
                ],
                [
                  "",
                  {
                    text: [
                      {
                        text: "Procedimento de Limpeza: ",
                        bold: true,
                      },
                      document.healthAdditions?.sanitization?.items?.find(
                        (item) =>
                          item.type === DocumentHealthSanitizationType.CONTAINER
                      )?.procedure !== undefined
                        ? DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PROCEDURES(
                            document.healthAdditions?.sanitization?.items?.find(
                              (item) =>
                                item.type ===
                                DocumentHealthSanitizationType.CONTAINER
                            )!.procedure!
                          )
                        : FIELD_EMPTY,
                    ],
                    style: "bodyTable",
                  },
                ],
                [
                  {
                    text: "Abrigo de armazenamento interno (temporário) e/ou externo de resíduos",
                    style: "headerTable",
                    rowSpan: 4,
                    margin: [0, 8, 0, 0],
                  },
                  {
                    text: [
                      {
                        text: "Frequência de Limpeza: ",
                        bold: true,
                      },
                      wasteFrequencyInternal,
                    ],
                    style: "bodyTable",
                  },
                ],
                [
                  "",
                  {
                    text: [
                      {
                        text: "Produtos Utilizados: ",
                        bold: true,
                      },
                      resultSanitizationItemInternal,
                    ],
                    style: "bodyTable",
                  },
                ],
                [
                  "",
                  {
                    text: [
                      {
                        text: "EPI’s Utilizados: ",
                        bold: true,
                      },
                      document.healthAdditions?.sanitization?.items?.find(
                        (item) =>
                          item.type ===
                          DocumentHealthSanitizationType.INTERNAL_STORAGE
                      )?.protectionGear !== undefined
                        ? DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PROTECTION_GEAR(
                            document.healthAdditions?.sanitization?.items?.find(
                              (item) =>
                                item.type ===
                                DocumentHealthSanitizationType.INTERNAL_STORAGE
                            )?.protectionGear!
                          )
                        : FIELD_EMPTY,
                    ],
                    style: "bodyTable",
                  },
                ],
                [
                  "",
                  {
                    text: [
                      {
                        text: "Procedimento de Limpeza: ",
                        bold: true,
                      },
                      document.healthAdditions?.sanitization?.items?.find(
                        (item) =>
                          item.type ===
                          DocumentHealthSanitizationType.INTERNAL_STORAGE
                      )?.procedure !== undefined
                        ? DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PROCEDURES(
                            document.healthAdditions?.sanitization?.items?.find(
                              (item) =>
                                item.type ===
                                DocumentHealthSanitizationType.INTERNAL_STORAGE
                            )!.procedure!
                          )
                        : FIELD_EMPTY,
                    ],
                    style: "bodyTable",
                  },
                ],
                [
                  {
                    colSpan: 2,
                    stack: [
                      {
                        text: "O efluente da lavagem dos recipientes e do abrigo é direcionado para a rede coletora de esgoto?",
                        style: "boldBodyTable",
                      },
                      {
                        columns: [
                          {
                            columns: [
                              {
                                margin: [0, 1, 0, 0],
                                alignment: "left",
                                table: {
                                  heights: [5],
                                  widths: [2.5],
                                  body: [
                                    [
                                      {
                                        text: `${
                                          document.healthAdditions?.sanitization
                                            .effluent.public
                                            ? "X"
                                            : ""
                                        }`,
                                        relativePosition: {
                                          x: -2.5,
                                          y: -3.5,
                                        },
                                        fontSize: 11,
                                        bold: true,
                                      },
                                    ],
                                  ],
                                },
                                width: 15,
                              },
                              {
                                text: "SIM",
                                style: "bodyTable",
                              },
                            ],
                            width: 40,
                          },
                          {
                            columns: [
                              {
                                margin: [0, 1, 0, 0],
                                table: {
                                  heights: [5],
                                  widths: [2.5],
                                  body: [
                                    [
                                      {
                                        text: `${
                                          !document.healthAdditions
                                            ?.sanitization.effluent.public
                                            ? "X"
                                            : ""
                                        }`,
                                        relativePosition: {
                                          x: -2.5,
                                          y: -3.5,
                                        },
                                        fontSize: 11,
                                        bold: true,
                                      },
                                    ],
                                  ],
                                },
                                width: 15,
                              },
                              {
                                text: "NÃO",
                                style: "bodyTable",
                              },
                            ],
                            width: 50,
                          },
                          {
                            text: [
                              "Se ",
                              {
                                text: "NÃO",
                                bold: true,
                              },
                              ", indicar o local encaminhado: ",
                              `${
                                document.healthAdditions?.sanitization.effluent
                                  .public
                                  ? " "
                                  : document.healthAdditions?.sanitization
                                      .effluent.destination
                              }`,
                            ],
                            style: "bodyTable",
                            width: "*",
                          },
                        ],
                      },
                    ],
                  },
                ],
              ],
            },
          },
          {
            pageBreak: "before",
            stack: [
              {
                table: {
                  widths: [400, "*"],
                  headerRows: 1,
                  body: [
                    [
                      {
                        text: "CARACTERÍSTICAS DO ABRIGO EXTERNO / LOCAL DE ARMAZENAMENTO",
                        style: "headerTable",
                        colSpan: 2,
                      },
                      "",
                    ],
                    [
                      {
                        colSpan: 2,
                        stack: [
                          {
                            columns: [
                              {
                                text: "Existe abrigo para armazenamento dos resíduos?",
                                style: "boldBodyTable",
                                width: 270,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              document.healthAdditions?.storage
                                                .exists
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !document.healthAdditions?.storage
                                                .exists
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                            ],
                          },
                        ],
                      },
                      "",
                    ],
                    [
                      {
                        colSpan: 2,
                        stack: [
                          {
                            columns: [
                              {
                                text: "Quais tipos de resíduos são armazenados?",
                                style: "boldBodyTable",
                                width: 230,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              document.healthAdditions?.storage.wasteClasses?.includes(
                                                DocumentHealthWasteClass.GROUP_A
                                              )
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "Infectantes/perfurocortantes",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 160,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              document.healthAdditions?.storage.wasteClasses?.includes(
                                                DocumentHealthWasteClass.GROUP_B
                                              )
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "Químicos",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 70,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              document.healthAdditions?.storage.wasteClasses?.includes(
                                                DocumentHealthWasteClass.GROUP_C
                                              )
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "Radioativos",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 80,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              document.healthAdditions?.storage.wasteClasses?.includes(
                                                DocumentHealthWasteClass.GROUP_D_NR
                                              )
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "D-não-reciclável",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 100,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              document.healthAdditions?.storage.wasteClasses?.includes(
                                                DocumentHealthWasteClass.GROUP_D_R
                                              )
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "D-reciclável",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 75,
                              },
                            ],
                          },
                        ],
                      },
                      "",
                    ],
                    [
                      {
                        colSpan: 2,
                        stack: [
                          {
                            columns: [
                              {
                                text: "O abrigo possui identificação dos tipos de resíduos armazenados?",
                                style: "boldBodyTable",
                                width: 360,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              document.healthAdditions?.storage
                                                .wasteTypesIdentification
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !document.healthAdditions?.storage
                                                .wasteTypesIdentification
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                            ],
                          },
                        ],
                      },
                      "",
                    ],
                    [
                      {
                        colSpan: 2,
                        stack: [
                          {
                            columns: [
                              {
                                text: "O abrigo possui compartimentos específicos para cada resíduo armazenado?",
                                style: "boldBodyTable",
                                width: 415,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              document.healthAdditions?.storage
                                                .wasteByType
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !document.healthAdditions?.storage
                                                .wasteByType
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                            ],
                          },
                        ],
                      },
                      "",
                    ],
                    [
                      {
                        stack: [
                          {
                            text: "Os pisos e paredes são revestidos de material liso, lavável e impermeável?",
                            style: "boldBodyTable",
                            margin: [0, 0, 0, 0],
                          },
                          {
                            columns: [
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              document.healthAdditions?.storage?.questions?.find(
                                                (question) =>
                                                  question.type ===
                                                  DocumentHealthAdditionsQuestionType.PROTECTED_FLOOR_MATERIALS
                                              )
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !document.healthAdditions?.storage?.questions?.find(
                                                (question) =>
                                                  question.type ===
                                                  DocumentHealthAdditionsQuestionType.PROTECTED_FLOOR_MATERIALS
                                              )
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "Não",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        text: [
                          {
                            text: "Cite o material utilizado: ",
                            bold: true,
                          },
                          parsedHealthAdditions?.storage.protectedFloorMaterials
                            ?.description
                            ? DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_MATERIALS_USED(
                                parsedHealthAdditions?.storage
                                  .protectedFloorMaterials?.description
                              )
                            : FIELD_EMPTY,
                        ],
                        style: "bodyTable",
                      },
                    ],
                    [
                      {
                        stack: [
                          {
                            columns: [
                              {
                                text: "Possui cobertura?",
                                style: "boldBodyTable",
                                width: 100,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              document.healthAdditions?.storage?.questions?.find(
                                                (question) =>
                                                  question.type ===
                                                  DocumentHealthAdditionsQuestionType.COVERAGE
                                              )?.exists
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !document.healthAdditions?.storage?.questions?.find(
                                                (question) =>
                                                  question.type ===
                                                  DocumentHealthAdditionsQuestionType.COVERAGE
                                              )?.exists
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        text: [
                          {
                            text: "Cite o material utilizado: ",
                            bold: true,
                          },
                          parsedHealthAdditions?.storage.coverage?.description
                            ? DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_MATERIALS_USED(
                                parsedHealthAdditions?.storage.coverage
                                  .description
                              )
                            : FIELD_EMPTY,
                        ],
                        style: "bodyTable",
                      },
                    ],
                    [
                      {
                        stack: [
                          {
                            columns: [
                              {
                                text: "Possui ralo?",
                                style: "boldBodyTable",
                                width: 100,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              document.healthAdditions?.storage?.questions?.find(
                                                (question) =>
                                                  question.type ===
                                                  DocumentHealthAdditionsQuestionType.FLOOR_DRAIN
                                              )?.exists
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !document.healthAdditions?.storage?.questions?.find(
                                                (question) =>
                                                  question.type ===
                                                  DocumentHealthAdditionsQuestionType.FLOOR_DRAIN
                                              )?.exists
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        stack: [
                          {
                            columns: [
                              {
                                text: "É ligado a rede de esgoto?",
                                style: "boldBodyTable",
                                width: 150,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              document.healthAdditions?.storage?.questions?.find(
                                                (question) =>
                                                  question.type ===
                                                  DocumentHealthAdditionsQuestionType.FLOOR_DRAIN
                                              )?.public
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !document.healthAdditions?.storage?.questions?.find(
                                                (question) =>
                                                  question.type ===
                                                  DocumentHealthAdditionsQuestionType.FLOOR_DRAIN
                                              )?.public
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                    [
                      {
                        stack: [
                          {
                            columns: [
                              {
                                text: "Tem ventilação? ",
                                style: "boldBodyTable",
                                width: 100,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              document.healthAdditions?.storage?.questions?.find(
                                                (question) =>
                                                  question.type ===
                                                  DocumentHealthAdditionsQuestionType.VENTILATION
                                              )?.exists
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !document.healthAdditions?.storage?.questions?.find(
                                                (question) =>
                                                  question.type ===
                                                  DocumentHealthAdditionsQuestionType.VENTILATION
                                              )?.exists
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        text: [
                          {
                            text: "De que forma? ",
                            bold: true,
                          },
                          parsedHealthAdditions?.storage.ventilation
                            ?.description
                            ? DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_VENTILATION(
                                parsedHealthAdditions?.storage.ventilation
                                  .description
                              )
                            : FIELD_EMPTY,
                        ],
                        style: "bodyTable",
                      },
                    ],
                    [
                      {
                        stack: [
                          {
                            columns: [
                              {
                                text: "Tem iluminação? ",
                                style: "boldBodyTable",
                                width: 100,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              document.healthAdditions?.storage?.questions?.find(
                                                (question) =>
                                                  question.type ===
                                                  DocumentHealthAdditionsQuestionType.ILLUMINATION
                                              )?.exists
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !document.healthAdditions?.storage?.questions?.find(
                                                (question) =>
                                                  question.type ===
                                                  DocumentHealthAdditionsQuestionType.ILLUMINATION
                                              )?.exists
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        text: [
                          {
                            text: "De que forma? ",
                            bold: true,
                          },
                          parsedHealthAdditions?.storage.illumination
                            ?.description
                            ? DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_VENTILATION(
                                parsedHealthAdditions?.storage.illumination
                                  .description
                              )
                            : FIELD_EMPTY,
                        ],
                        style: "bodyTable",
                      },
                    ],
                    [
                      {
                        stack: [
                          {
                            columns: [
                              {
                                text: "Possui porta com sistema de fechamento? ",
                                style: "boldBodyTable",
                                width: 230,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              document.healthAdditions?.storage?.questions?.find(
                                                (question) =>
                                                  question.type ===
                                                  DocumentHealthAdditionsQuestionType.DOOR_LOCK_SYSTEM
                                              )?.exists
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !document.healthAdditions?.storage?.questions?.find(
                                                (question) =>
                                                  question.type ===
                                                  DocumentHealthAdditionsQuestionType.DOOR_LOCK_SYSTEM
                                              )?.exists
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        text: [
                          {
                            text: "De que forma? ",
                            bold: true,
                          },
                          parsedHealthAdditions?.storage.doorLockSystem
                            ?.description
                            ? DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_DOOR_LOCK_SYSTEM(
                                parsedHealthAdditions?.storage.doorLockSystem
                                  .description
                              )
                            : FIELD_EMPTY,
                        ],
                        style: "bodyTable",
                      },
                    ],
                    [
                      {
                        stack: [
                          {
                            text: "O abrigo é de uso compartilhado com Sala de Utilidades? ",
                            style: "boldBodyTable",
                          },
                          {
                            columns: [
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    alignment: "left",
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              document.healthAdditions?.storage
                                                .shared
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "SIM",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                              {
                                columns: [
                                  {
                                    margin: [0, 1, 0, 0],
                                    table: {
                                      heights: [5],
                                      widths: [2.5],
                                      body: [
                                        [
                                          {
                                            text: `${
                                              !document.healthAdditions?.storage
                                                .shared
                                                ? "X"
                                                : ""
                                            }`,
                                            relativePosition: {
                                              x: -2.5,
                                              y: -3.5,
                                            },
                                            fontSize: 11,
                                            bold: true,
                                          },
                                        ],
                                      ],
                                    },
                                    width: 15,
                                  },
                                  {
                                    text: "NÃO",
                                    style: "bodyTable",
                                  },
                                ],
                                width: 40,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        text: [
                          {
                            text: "Qual é espaço destinado ao abrigo de RSS: ",
                            bold: true,
                          },
                          `${
                            document.healthAdditions?.storage.area?.toLocaleString(
                              LOCALE
                            ) ?? FIELD_EMPTY
                          } m²`,
                        ],
                        style: "bodyTable",
                      },
                    ],
                    [
                      {
                        style: "bodyTable",
                        fillColor: "#D9D9D9",
                        colSpan: 2,
                        ul: [
                          "Deverá apresentar fotos panorâmicas do abrigo ou local de armazenamento dos resíduos, vistas do ambiente interno e externo. ",
                          "O abrigo de resíduos A, B, C e E deve ser de uso exclusivo para armazenamento de RSS, sendo vetado o compartilhamento para guarda de materiais, produtos, equipamentos ou para uso com outras funções. Orientamos que o abrigo de RSS deve atender à Resolução n.º 222/2018 da ANVISA.",
                        ],
                      },
                      "",
                    ],
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        pageBreak: "before",
        pageOrientation: "portrait",
        stack: [
          {
            text: "7   TREINAMENTO E CAPACITAÇÃO NO MANEJO DE RSS",
            style: ["bold"],
          },
          {
            text: "Um dos fatores mais importantes para o sucesso do Plano de Gerenciamento de Resíduos Sólidos do Serviço de Saúde - PGRSS é o treinamento contínuo, pois somente através da equipe consciente e comprometida, consegue-se atingir os objetivos pretendidos. Para tanto, os treinamentos devem abordar temas relacionados à sensibilização quanto às atitudes ambientalmente corretas, as formas de tratamento e disposição final dos resíduos e os procedimentos a serem adotados pela empresa. Todos os colaboradores devem ser envolvidos, inclusive os terceirizados, para que haja uma efetiva implementação e manutenção do PGRSS.",
            marginTop: 20,
          },
          {
            text: [
              "Todos os colaboradores da empresa ",
              {
                text: document.company?.name ?? FIELD_EMPTY,
                style: ["bold"],
              },
              " receberam treinamento online sobre a correta gestão dos resíduos do Serviço de Saúde, contemplando:",
            ],
            marginTop: 15,
          },
          {
            ul: [
              "O que são resíduos sólidos;",
              "Formas de acondicionamento dos RSS;",
              "Coleta Seletiva;",
              "Tratamentos e disposição final de RSS;",
              "Educação ambiental: 3Rs e sustentabilidade;",
              "Responsabilidade ambiental.",
            ],
            marginLeft: 15,
          },
          {
            marginTop: 15,
            text: "Cabe salientar que o processo de sensibilização não deve ser estático, sofrendo atualizações sempre que necessário e estabelecendo a continuidade dele, para que resultem nos efeitos pretendidos.",
          },
          {
            marginTop: 15,
            text: "Ressalta-se que o treinamento específico, quanto aos procedimentos, deve ser repassado a todos os colaboradores, inclusive aos terceirizados e prestadores de serviços, através do grupo de multiplicadores, conforme periodicidade a ser definida.",
          },
          {
            marginTop: 15,
            text: "Para a obtenção dos propósitos desejados em qualquer que seja o projeto, é imprescindível um bom plano de marketing interno, o que vem a contribuir com o processo de sensibilização e treinamento proporcionados. ",
          },
        ],
      },
      {
        pageBreak: "before",
        stack: [
          {
            text: "8 CRONOGRAMAS",
            style: ["bold"],
          },
          {
            text: "8.1 CRONOGRAMA DE TREINAMENTO",
            style: ["bold"],
            marginTop: 25,
            fontSize: 12,
          },
          {
            text: "O programa de treinamento dos funcionários deve ser realizado no mínimo 1 vez por ano, a fim de manter os procedimentos atualizados, principalmente aos novos funcionários. ",
            marginTop: 25,
          },
          {
            text: "Conteúdo programático mínimo:",
            marginTop: 15,
          },
          {
            text: "1. Informações Básicas e Legislação Pertinente",
            style: ["bold"],
          },
          {
            separator: ["1.", ""],
            ol: [
              "Histórico do Programa de Gerenciamento dos Resíduos dos Serviços de Saúde (PGRSS);",
              "Descrição das ações relativas ao manejo dos resíduos sólidos;",
              "Características e riscos dos RSS;",
              "RDC 222/2018 – ANVISA. – Gerenciamento interno dos RSS",
              "Resolução CONAMA nº 358/2005. – Gerenciamento externo dos RSS.",
            ],
          },
          {
            text: "2. Classificação dos Resíduos ",
            style: ["bold"],
            marginTop: 15,
          },
          {
            separator: ["2.", ""],
            ol: [
              "GRUPO A: Resíduos biológicos;",
              "GRUPO B: Resíduos químicos;",
              "GRUPO C: Rejeitos radioativos;",
              "GRUPO D: Resíduos comuns; e",
              "GRUPO E: Materiais perfurocortantes.",
            ],
          },
          {
            text: "3. Processos de descarte de resíduos ",
            style: ["bold"],
            marginTop: 15,
          },
          {
            separator: ["3.", ""],
            ol: [
              "Identificação do Gerador e do Responsável Técnico;",
              "Descrição dos Ambientes Geradores;",
              "Identificação dos tipos de resíduos e Quantidades geradas;",
              "Manejo;",
              "Segregação;",
              "Acondicionamento;",
              "Identificação;",
              "Transporte interno;",
              "Armazenamento temporário;",
              "Tratamento;",
              "Armazenamento externo;",
              "Coleta e transporte externo; e",
              "Disposição final.",
            ],
          },
          {
            text: "8.2 CRONOGRAMA DE REVISÃO E ATUALIZAÇÃO DO PGRSS ",
            style: ["bold"],
            marginTop: 25,
          },
          {
            text: "O PGRSS deverá ser revisado a cada ano ou antecipadamente, caso ocorram alterações significativas na geração de resíduos, bem como alterações nos processos.",
            marginTop: 15,
          },
          {
            layout: {
              hLineColor: function () {
                return "#C2D69B";
              },
              hLineWidth: function () {
                return 1.5;
              },
            },
            style: ["center"],
            margin: [20, 15, 20, 0],
            table: {
              widths: ["*", "*"],
              body: [
                [
                  {
                    text: "FASE",
                    style: ["bold"],
                    border: borderOptions.bottomOnly,
                  },
                  {
                    text: "PERÍODO",
                    style: ["bold"],
                    margin: [20, 0],
                    border: borderOptions.bottomOnly,
                  },
                ],
              ],
            },
          },
          {
            margin: [20, 0],
            layout: {
              fillColor: function (rowIndex) {
                return rowIndex % 2 === 0 ? "#EAF1DD" : null;
              },
              hLineColor: function () {
                return "#C2D69B";
              },
              vLineColor: function () {
                return "#C2D69B";
              },
              hLineWidth: function () {
                return 0.1;
              },
              vLineWidth: function () {
                return 0.1;
              },
            },
            style: ["center"],
            table: {
              widths: ["*", "*"],
              body: [...timeline],
            },
          },
        ],
      },
      {
        pageBreak: "before",
        alignment: "center",
        stack: [
          {
            text: "________________________________________",
            style: ["bold"],
            marginTop: 100,
          },
          { text: "MSC. PEDRO AMERICO DUARTE", fontSize: 11, style: ["bold"] },
          { text: "DAVINCI CONSULTORIA", style: ["bold"], fontSize: 11 },
          { text: "MEIO AMBIENTE", style: ["bold"], fontSize: 11 },
          { text: "Av. Vicente Machado, 467 cj 102", marginTop: 15 },
          { text: "Centro" },
          { text: "Curitiba - PR, 80420-010" },
          { text: "Fone: (41) 3011-4500" },
        ],
      },
      {
        alignment: "center",
        stack: [
          {
            text: "________________________________________",
            style: ["bold"],
            marginTop: 100,
          },
          {
            text:
              document.responsibles?.legal?.name?.toUpperCase() ?? FIELD_EMPTY,
            style: ["bold"],
            fontSize: 11,
          },
          {
            text: document.company?.name?.toUpperCase() ?? FIELD_EMPTY,
            style: ["bold"],
            marginTop: 5,
            fontSize: 11,
          },
        ],
      },
      {
        alignment: "center",
        stack: [
          {
            text: "________________________________________",
            style: ["bold"],
            marginTop: 100,
          },
          {
            text:
              document.responsibles?.techinical?.name?.toUpperCase() ??
              FIELD_EMPTY,
            style: ["bold"],
            fontSize: 10.5,
          },
          {
            text: document.company?.name?.toUpperCase() ?? FIELD_EMPTY,
            style: ["bold"],
            marginTop: 5,
            fontSize: 10.5,
          },
        ],
      },
    ],
    images: {
      logo,
      headerImg,
      footerImg,
      checkImg,
    },
    styles: {
      "text-red": {
        color: "red",
      },
      "bg-gray": {
        fillColor: "#EAEAEA",
      },
      "bg-gray-dark": {
        fillColor: "#C0C0C0",
      },
      bold: {
        bold: true,
      },
      "not-bold": {
        bold: false,
      },
      "font-2xl": {
        fontSize: 24,
      },
      "font-lg": {
        fontSize: 18,
      },
      "font-md": {
        fontSize: 14,
      },
      "font-base": {
        fontSize: 11,
      },
      center: {
        alignment: "center",
      },
      "my-1": {
        marginTop: 2,
        marginBottom: 2,
      },
      "text-justify": {
        alignment: "justify",
      },
      headerTable: {
        fontSize: 10,
        fillColor: "#D9D9D9",
        bold: true,
      },
      boldBodyTable: {
        bold: true,
      },
    },
  };

  return template;
}
