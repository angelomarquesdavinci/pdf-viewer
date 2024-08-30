import {
  TDocumentDefinitions,
  TableCell,
  TableLayout,
} from "pdfmake/interfaces";
import {
  DOCUMENT_FREQUENCY,
  DOCUMENT_WASTE_COMPANY_LICENSE,
  DOCUMENT_WASTE_FREQUENCY,
  DOCUMENT_WASTE_ORIGIN_POINT,
  DOCUMENT_WASTE_PACKING,
  DOCUMENT_WASTE_STORAGE,
  DOCUMENT_WASTE_TREATMENT,
  DOCUMENT_WASTE_UNIT,
  DOCUMENT_WASTE_WEEKDAYS,
  LOCALE,
} from "../../resource";
import {
  cnpjMask,
  cpfMask,
  dateFormat,
  getClassificationId,
  getCnaeId,
  getCnaeIdList,
  getDateSec,
  phoneMask,
  setUpAddress,
} from "../../utils";
import { IRenderReq } from "../../types/template/interface";
import {
  IDocumentCompanyLicense,
  IDocumentWaste,
} from "../../types/document/interface";
import {
  DocumentWasteClass,
  DocumentWasteCompanyLicense,
} from "../../types/document/enum";

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

const thinBorderLayout: TableLayout = {
  hLineWidth: function () {
    return 0.1;
  },
  vLineWidth: function () {
    return 0.1;
  },
};

export function render({
  classifications,
  document,
  techinical,
  cnaes,
}: IRenderReq) {
  const wastesClassI: TableCell[][] = [];
  const wastesClassIIa: TableCell[][] = [];
  const wastesClassIIb: TableCell[][] = [];
  const companys: TableCell[][] = [];
  const timeline: TableCell[][] = [];

  function getCompanyWastes(
    wastes: IDocumentWaste[]
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

  getCompanyWastes(document.wastes ?? []).forEach((company) => {
    const row: TableCell[] = [
      `${company.name} / ${cnpjMask(company.identifier)}`,
      `${company.license} - ${dateFormat(company.licenseExpirationDate)}`,
    ];

    companys.push(row);
  });

  function getCompaniesTransport(waste: IDocumentWaste): string {
    if (waste.companyTransport === undefined) return FIELD_EMPTY;
    if (waste.companyTransport === DocumentWasteCompanyLicense.OUTSOURCED) {
      return (
        waste.companiesTransport?.map((company) => company.name).join(", ") ??
        ""
      );
    }

    return DOCUMENT_WASTE_COMPANY_LICENSE(waste.companyTransport);
  }

  function getCompaniesDestination(waste: IDocumentWaste): string {
    if (waste.companyDestination === undefined) return FIELD_EMPTY;
    if (waste.companyDestination === DocumentWasteCompanyLicense.OUTSOURCED) {
      return (
        waste.companiesDestination?.map((company) => company.name).join(", ") ??
        ""
      );
    }

    return DOCUMENT_WASTE_COMPANY_LICENSE(waste.companyDestination!);
  }

  document.wastes?.forEach(async (waste: IDocumentWaste) => {
    const row = [
      waste.originPoint!.map((origin) => DOCUMENT_WASTE_ORIGIN_POINT(origin)),
      getClassificationId(classifications, waste.classificationId!),
      `${waste.quantity} ${DOCUMENT_WASTE_UNIT(
        waste.unit!
      )}/${DOCUMENT_WASTE_FREQUENCY(waste.frequency!)}`,
      DOCUMENT_WASTE_PACKING(waste.packing!),
      DOCUMENT_WASTE_STORAGE(waste.storage!),
      waste.treatment !== undefined
        ? DOCUMENT_WASTE_TREATMENT(waste.treatment)
        : FIELD_EMPTY,
      waste.collectionFrequency
        ? DOCUMENT_FREQUENCY(waste.collectionFrequency!)
        : FIELD_EMPTY,
      getCompaniesTransport(waste),
      getCompaniesDestination(waste),
    ];

    if (waste.class === DocumentWasteClass.CLASS1) {
      wastesClassI.push(row);
    }

    if (waste.class === DocumentWasteClass.CLASS2A) {
      wastesClassIIa.push(row);
    }

    if (waste.class === DocumentWasteClass.CLASS2B) {
      wastesClassIIb.push(row);
    }
  });

  function daysOfWeek() {
    const res = [];

    res.push([
      document.company?.weekDays
        .sort()
        .map((day) => DOCUMENT_WASTE_WEEKDAYS(day))
        .join(", "),
    ]);

    document.company?.othersWorkSchedule?.forEach((e) => {
      const days = e.weekDays
        .map((day) => DOCUMENT_WASTE_WEEKDAYS(day))
        .join(", ");

      res.push([days]);
    });

    return res.join("/ \n");
  }

  function hoursOfWeek() {
    const res = [];

    res.push([
      `${document.company?.hoursDayStart ?? "-"}h - ${
        document.company?.hoursDayEnd ?? "-"
      }h`,
    ]);

    document.company?.othersWorkSchedule?.forEach((e) => {
      const hours = `${e.hoursDayStart}h - ${e.hoursDayEnd}h`;

      res.push([hours]);
    });

    return res.join("/ \n");
  }

  function countEmployees(): number {
    const admin = document.company?.administrativeEmployeesCount ?? 0;
    const prod = document.company?.productionEmployeesCount ?? 0;

    return admin + prod;
  }

  document.approved?.timeline?.forEach((e) => {
    const row = [
      e.action,
      `${dateFormat(e.inicialDate)} - ${dateFormat(e.expirationDate)}`,
    ];

    timeline.push(row);
  });

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
        pageOrientation: "portrait",
        style: ["text-justify"],
        stack: [
          {
            text: "5    FASE II – PLANEJAMENTO DO GERENCIAMENTO DE RESÍDUOS",
            style: ["bold"],
          },
          {
            text: "5.1 LOGÍSTICA DO GERENCIAMENTO PROPOSTO",
            marginTop: 30,
            style: ["bold"],
          },
          {
            text: "Visando a efetividade do processo de implementação, propõe-se pela adoção de ilhas de coleta, consistindo de um conjunto de coletores apropriados para cada setor (local de geração), estrategicamente localizado.",
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
        ],
      },
      {
        style: ["text-justify"],
        pageBreak: "before",
        stack: [
          {
            text: "5.2 COLETA INTERNA",
            style: ["bold"],
          },
          {
            text: "As pessoas envolvidas com o manuseio de resíduos devem ser submetidas a exame admissional, periódico, de retorno ao trabalho, mudança de função e demissional. Os exames e avaliações que devem ser submetidas são: Anamnese ocupacional, Exame físico, exame mental. Os funcionários também devem ser vacinados contra tétano, hepatite e outras considerações importantes pela Vigilância Sanitária.",
            marginTop: 30,
          },
          {
            text: "Logística de remoção e coleta",
            marginTop: 15,
            style: ["bold"],
          },
          {
            text: "Deverão utilizar equipamentos de proteção individual, como luvas de material resistente, óculos de proteção, gorro, máscara de proteção, uniforme de tecido resistente e avental impermeável por cima e botas de borracha.",
            marginTop: 15,
          },
          {
            text: "Não arrastar no solo os recipientes, e os sacos plásticos; aproximar o carro coletor o máximo possível do lugar de onde se deve recolher os recipientes. Não transferir os resíduos acondicionados de um recipiente para outro; no recolhimento dos sacos, os funcionários devem levantá-los e mantê-los distantes do corpo, a fim de evitar cortes e possíveis acidentes com materiais perfuro cortantes, indevidamente acondicionados.",
            marginTop: 15,
          },
        ],
      },
      {
        style: ["text-justify"],
        pageBreak: "before",
        stack: [
          {
            text: "5.3 EDUCAÇÃO AMBIENTAL",
            style: ["bold"],
          },
          {
            text: "REDUZIR",
            marginTop: 25,
            style: ["bold"],
          },
          {
            text: "A partir do ideal de produzir com qualidade e de se manter um equilíbrio entre as receitas e despesas, destacamos a necessidade de ser controlada a geração de resíduos na empresa. Esta realidade, além de gerar preocupações com a possibilidade de pagamentos de multas ambientais, é um item que possibilita o equilíbrio ideal entre o custo para se produzir e o lucro gerado.",
            marginTop: 15,
          },
          {
            text: "Dicas de Redução de resíduos:",
            marginTop: 25,
            style: ["bold"],
          },
          {
            marginTop: 15,
            columns: [
              { image: "checkImg", width: 8, marginTop: 2 },
              {
                text: "Melhorar o controle da qualidade pela compra de equipamentos e/ou matérias-primas mais eficientes;",
                marginLeft: 10,
              },
            ],
          },
          {
            columns: [
              { image: "checkImg", width: 8, marginTop: 2 },
              {
                text: "Melhorar o treinamento de funcionários e implementação de sistemas de monitoramento da qualidade;",
                marginLeft: 10,
              },
            ],
          },
          {
            columns: [
              { image: "checkImg", width: 8, marginTop: 2 },
              {
                text: "Procurar alternativas menos tóxicas para produtos químicos, colas, desengraxantes, etc.;",
                marginLeft: 10,
              },
            ],
          },
          {
            columns: [
              { image: "checkImg", width: 8, marginTop: 2 },
              {
                text: "Orientar fornecedores, solicitando que a embalagem desnecessária seja eliminada;",
                marginLeft: 10,
              },
            ],
          },
          {
            columns: [
              { image: "checkImg", width: 8, marginTop: 2 },
              {
                text: "Adotar hábito requerendo impressão de todos (ou a maior parte) os documentos em ambos os lados da folha, pois esta atitude reduz o consumo de papel;",
                marginLeft: 10,
              },
            ],
          },
          {
            columns: [
              { image: "checkImg", width: 8, marginTop: 2 },
              {
                text: "Colocar quadro de notícias em local central em cada departamento ou área de circulação comum, bem como aumentar o uso de correio eletrônico;",
                marginLeft: 10,
              },
            ],
          },
          {
            columns: [
              { image: "checkImg", width: 8, marginTop: 2 },
              {
                text: "Reduzir a toxicidade das soluções de limpeza;",
                marginLeft: 10,
              },
            ],
          },
          {
            columns: [
              { image: "checkImg", width: 8, marginTop: 2 },
              {
                text: "Comprar material de limpeza em recipientes retornáveis;",
                marginLeft: 10,
              },
            ],
          },
          {
            columns: [
              { image: "checkImg", width: 8, marginTop: 2 },
              {
                text: "Substituir uso de trapos de malha/estopas por toalhas industriais laváveis, evitando a geração de resíduo perigoso (trapos contaminados) quando gerados;",
                marginLeft: 10,
              },
            ],
          },
          {
            columns: [
              { image: "checkImg", width: 8, marginTop: 2 },
              {
                text: "Adquirir óleo e demais produtos perigosos em embalagens maiores e/ou a granel, evitando excesso de embalagens contaminadas.",
                marginLeft: 10,
              },
            ],
          },
        ],
      },
      {
        style: ["text-justify"],
        pageBreak: "before",
        stack: [
          {
            text: "REUTILIZAR",
            style: ["bold"],
          },
          {
            text: "Após serem consideradas e implementadas todas as opções de redução de resíduos, levando-se em conta a sua praticidade e viabilidade econômica, os resíduos restantes devem ser gerenciados, verificando a condição de retorno do resíduo ao processo de produção, seja substituindo a matéria-prima do processo ou processando o resíduo como subproduto.",
            marginTop: 15,
          },
          {
            text: "Dicas de Reutilização de resíduos:",
            marginTop: 25,
            style: ["bold"],
          },
          {
            marginTop: 15,
            columns: [
              { image: "checkImg", width: 8, marginTop: 2 },
              {
                text: "Promover sistema de filtragem/decantação de produtos de limpeza (querosene, óleo diesel, etc.), permitindo prolongar utilização do mesmo;",
                marginLeft: 10,
              },
            ],
          },
          {
            columns: [
              { image: "checkImg", width: 8, marginTop: 2 },
              {
                text: "Usar reutilizáveis de preferência, evitando os descartáveis (por exemplo: baterias recarregáveis)",
                marginLeft: 10,
              },
            ],
          },
          {
            columns: [
              { image: "checkImg", width: 8, marginTop: 2 },
              {
                text: "Criar blocos para rascunho com papel usado de um lado.",
                marginLeft: 10,
              },
            ],
          },
          {
            columns: [
              { image: "checkImg", width: 8, marginTop: 2 },
              {
                text: "Devolver ao fabricante os cartuchos de impressora já usados, no momento da compra de um novo.",
                marginLeft: 10,
              },
            ],
          },
          {
            columns: [
              { image: "checkImg", width: 8, marginTop: 2 },
              {
                text: "Observar sempre que aplicável a devolução de pilhas e baterias aos fabricantes.",
                marginLeft: 10,
              },
            ],
          },
          {
            columns: [
              { image: "checkImg", width: 8, marginTop: 2 },
              {
                text: "Solicitar aos fornecedores que enviem os pedidos em embalagem retornável (por ex., bombonas e tambores de produtos químicos, graxa, óleo retornáveis, reutilizáveis e reabastecíveis).",
                marginLeft: 10,
              },
            ],
          },
          {
            text: "RECICLAR",
            marginTop: 25,
            style: ["bold"],
          },
          {
            marginTop: 15,
            text: "Em terceiro lugar vem a Reciclagem. A reciclagem é a transformação de um resíduo em um produto novo. Esta transformação geralmente acaba gerando também resíduos! Por isso ela vem em 3º lugar na escala dos 3R´s.",
          },
          {
            marginTop: 15,
            text: "A Reciclagem trata o lixo como matéria-prima a ser transformada para fazer novos produtos. O componente ambiental é, sem dúvida, o aspecto de maior peso no balanço custo/benefício da reciclagem. O benefício ambiental será alcançado através da exploração, em menor escala, dos recursos como matéria-prima de um novo processo de industrialização. Essa medida é favorável ao equilíbrio ambiental, uma vez que água, energia e matéria-prima serão economizados, assim como o espaço será poupado nos locais de destino final dos resíduos.",
          },
          {
            marginTop: 15,
            text: "Ressalta-se que a identificação e o planejamento das ações que venham a ser desencadeadas no processo de redução de resíduos deve ser uma meta contínua da empresa, onde a “Comissão de Gestão de Resíduos” ocupa papel importante, motivando os demais colaboradores do setor a apresentarem ideias e projetos que visem a redução. ",
          },
          {
            marginTop: 25,
            text: "5.4 AÇÕES PREVENTIVAS, CORRETIVAS E DE CONTROLE NO MANEJO DE RESÍDUOS",
            style: ["bold"],
          },
          {
            marginTop: 25,
            text: "6.4.1 Avaliação e Monitoramento do PGRS",
            style: ["bold"],
          },
          {
            marginTop: 15,
            text: "Processo de Gestão",
            decoration: "underline",
          },
          {
            marginTop: 15,
            text: "Para a avaliação, o monitoramento e o gerenciamento dos resíduos recomendam-se o controle via SINIR. Esta sistemática, permite uma avaliação quali-quantitativa dos resíduos sólidos gerados, de forma contínua, demonstrando as formas de destinação final adotadas",
          },
          {
            marginTop: 15,
            text: "Destinação Final",
            decoration: "underline",
          },
          {
            marginTop: 15,
            text: "O gerenciamento adequado dos resíduos sólidos vai além do controle interno: é necessário garantir que os fornecedores estejam trabalhando de forma sincronizada com a legislação e com os interesses ambientais da empresa.",
          },
          {
            marginTop: 15,
            text: "Desta forma, é importante que seja realizada uma avaliação inicial para a contratação e/ou renovação de contrato do receptor de resíduos e auditorias periódicas nos mesmos. Os procedimentos sugeridos formam a base para a administração, manutenção e a divulgação do PGRS. Entretanto, é interessante lembrar que a empresa pode adotar outras medidas internas, e com os seus parceiros, adequadas ao propósito de evoluir na melhoria do aproveitamento da matéria-prima e disposição final no meio ambiente.",
          },
          {
            marginTop: 15,
            text: "Ressaltamos que uma postura proativa dos dirigentes da empresa é fundamental para manter e ampliar os resultados positivos das ações implantadas.",
          },
          {
            marginTop: 25,
            text: "6.5 TREINAMENTO E SENSIBILIZAÇÃO",
            style: ["bold"],
          },
          {
            marginTop: 15,
            text: "Um dos fatores mais importantes para o sucesso do Plano de Gerenciamento de Resíduos Sólidos - PGRS é o treinamento contínuo, pois somente através da equipe consciente e comprometida, consegue-se atingir os objetivos pretendidos. Para tanto, os treinamentos devem abordar temas relacionados à sensibilização quanto às atitudes ambientalmente corretas, as formas de tratamento e disposição final dos resíduos e os procedimentos a serem adotados pela empresa. Todos os colaboradores devem ser envolvidos, inclusive os terceirizados, para que haja uma efetiva implementação e manutenção do PGRS.",
          },
          {
            marginTop: 15,
            text: [
              "Todos os colaboradores da empresa ",
              {
                text: document.company?.name ?? FIELD_EMPTY,
                style: ["bold"],
              },
              " receberam treinamento online sobre a correta gestão dos resíduos do Serviço de Saúde, contemplando:",
            ],
          },
          {
            marginLeft: 15,
            ul: [
              "O que são resíduos sólidos;",
              "Formas de acondicionamento dos Resíduos;",
              "Coleta Seletiva;",
              "Tratamentos e disposição final de Resíduos;",
              "Educação ambiental: 3Rs e sustentabilidade;",
              "Responsabilidade ambiental.",
            ],
          },
          {
            marginTop: 15,
            text: "Cabe salientar que o processo de sensibilização não deve ser estático, sofrendo atualizações sempre que necessário e estabelecendo a continuidade do mesmo, para que resultem nos efeitos pretendidos.",
          },
          {
            marginTop: 15,
            text: "Ressalta-se que o treinamento específico, quanto aos procedimentos, deve ser repassado a todos os colaboradores, inclusive aos terceirizados e prestadores de serviços, através do grupo de multiplicadores, conforme periodicidade a ser definida.",
          },
          {
            marginTop: 15,
            text: "Para a obtenção dos propósitos desejados em qualquer que seja o projeto, é imprescindível um bom plano de marketing interno, o que vem a contribuir com o processo de sensibilização e treinamento proporcionados.",
          },
        ],
      },
      {
        style: ["text-justify"],
        pageBreak: "before",
        stack: [
          {
            text: "5.6 PROGNÓSTICO DOS IMPACTOS SÓCIO-ECONÔMICOS E AMBIENTAIS DO PLANO PROPOSTO",
            style: ["bold"],
          },
          {
            text: "Avaliação do ponto de vista social:",
            style: ["bold"],
            marginTop: 25,
          },
          {
            text: "Aliado a redução de custos financeiros, cabe salientar os ganhos que advém da coleta seletiva, quando da existência de um efetivo plano de gerenciamento de resíduos. Agregando valor aos resíduos, o qual resulta no fomento para o segmento dos sucateiros e para a indústria de reciclagem, permite a geração de novos empregos, beneficiando principalmente a classe de menor renda.",
            marginTop: 15,
          },
          {
            text: "A doação de resíduos por sua vez também se mostra bastante interessante do ponto de vista social, pois vem a beneficiar diversas famílias, onde o sustento advém exclusivamente dos materiais recicláveis. Atualmente existem Cooperativas e Associações de Catadores, as quais podem ser parceiras da empresa.",
            marginTop: 15,
          },
          {
            text: "Avaliação do ponto de vista econômico:",
            marginTop: 15,
            style: ["bold"],
          },
          {
            text: "Considerando a prática da doação de parte dos resíduos recicláveis, a receita auferida a título de venda de resíduos é muito incipiente.",
            marginTop: 15,
          },
          {
            text: "Por outro lado, fica evidente a necessidade de reduzir a geração de resíduos perigosos, em especial os trapos de malha contaminados com óleo, os quais terão custos de transporte e destinação final ambientalmente adequados. Caso os trapos de malha venham a ser substituídos por toalhas industriais laváveis, este custo deixa de existir, todavia, apresenta-se um novo custo referente ao serviço da lavanderia, o que normalmente resulta em um equilíbrio financeiro entre a situação atual e a situação proposta. Porém o mais importante é o reflexo positivo do ponto de vista ambiental",
            marginTop: 15,
          },
          {
            text: "Avaliação do ponto de vista ambiental:",
            style: ["bold"],
            marginTop: 15,
          },
          {
            text: "Considerando a utilização de Aterros, é de relevada importância que medidas sejam implantadas, permitindo prolongar sua vida útil, minimizando as quantidades de resíduos a serem dispostas no mesmo. Desta forma é imprescindível a disposição no mesmo somente daqueles resíduos que não apresentam outras opções de tratamento e/ou disposição finais mais apropriados.",
            marginTop: 15,
          },
          {
            text: "Procura-se através do respectivo plano, maximizar o processo de reciclagem, buscando sempre agregar maior valor aos resíduos, tendo como meta principal a redução nas quantidades geradas ou até mesmo a substituição por produtos menos nocivos, também como uma forma de redução dos resíduos perigosos.",
            marginTop: 15,
          },
          {
            text: "O PGRS proposto orienta no sentido de buscar as melhores formas de destinação ou tecnologias existentes, do ponto de vista ambiental, técnico e socioeconômico.",
            marginTop: 15,
          },
          {
            text: "Propõe-se o incremento no processo de reciclagem, que dentre todos os benefícios proporcionados, o maior deles ainda é a preservação dos tão escassos recursos naturais, que vem sendo explorados de maneira insustentável.",
            marginTop: 15,
          },
          {
            text: "5.7 DESTINAÇAO FINAL",
            style: ["bold"],
            marginTop: 25,
          },
          {
            text: "A tabela abaixo descreve quem são as empresas responsáveis pela coleta, tratamento e destinação final dos Resíduos conforme apresentados no item 4.2 deste PGRS.",
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
          // {
          //   layout: {
          //     fillColor: function (rowIndex) {
          //       return rowIndex % 2 === 0 ? "#EAF1DD" : null;
          //     },
          //     hLineColor: function () {
          //       return "#C2D69B";
          //     },
          //     vLineColor: function () {
          //       return "#C2D69B";
          //     },
          //     hLineWidth: function () {
          //       return 0.1;
          //     },
          //     vLineWidth: function () {
          //       return 0.1;
          //     },
          //   },
          //   style: ["center"],
          //   table: {
          //     widths: ["*", "*"],
          //     body: [...companys],
          //   },
          // },
        ],
      },
      {
        pageBreak: "before",
        stack: [
          {
            text: "5.8 CRONOGRAMA DE REVISÃO E ATUALIZAÇÃO DO PGRS",
            style: ["bold"],
          },
          {
            text: "O PGRS deverá ser revisado a cada ano ou antecipadamente, caso ocorram alterações significativas na geração de resíduos, bem como alterações nos processos.",
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
          // {
          //   margin: [20, 0],
          //   layout: {
          //     fillColor: function (rowIndex) {
          //       return rowIndex % 2 === 0 ? "#EAF1DD" : null;
          //     },
          //     hLineColor: function () {
          //       return "#C2D69B";
          //     },
          //     vLineColor: function () {
          //       return "#C2D69B";
          //     },
          //     hLineWidth: function () {
          //       return 0.1;
          //     },
          //     vLineWidth: function () {
          //       return 0.1;
          //     },
          //   },
          //   style: ["center"],
          //   table: {
          //     widths: ["*", "*"],
          //     body: [...timeline],
          //   },
          // },
        ],
      },
      {
        style: ["text-justify"],
        pageBreak: "before",
        stack: [
          { text: "ANEXO I - SIGLAS E DEFINIÇÕES", style: ["bold", "center"] },
          {
            text: [
              { text: "Resíduos sólidos:", style: ["bold"] },
              " resíduos nos estados sólidos e semissólidos, que resultam de atividades da comunidade de origem industrial, doméstica, hospitalar, comercial, agrícola, de serviços de varrição. Ficam incluídos nesta definição os lodos provenientes de sistemas de tratamento de água, aqueles gerados em equipamentos e instalações de controle de poluição, bem como determinados líquidos cujas particularidades tornem inviável seu lançamento na rede pública de esgotos ou corpos d água, ou exijam para isso soluções técnica e economicamente inviáveis, em face da melhor tecnologia disponível (NBR 10004).",
            ],
            marginTop: 25,
          },
          {
            text: [
              {
                text: "PGRS - Plano de Gerenciamento de Resíduos Sólidos:",
                style: ["bold"],
              },
              " documento integrante do processo de licenciamento ambiental, que aponta e descreve as ações relativas ao manejo de resíduos sólidos, contemplando os aspectos referentes à geração, segregação, acondicionamento, coleta, armazenamento, transporte, tratamento e disposição final, bem como a proteção à saúde pública.",
            ],
            marginTop: 25,
          },
          {
            text: [
              {
                text: "Reciclagem:",
                style: ["bold"],
              },
              " processo de reaproveitamento de um mesmo material com o intuito de fabricar o mesmo produto, ou similar, mas com economia de matéria-prima.",
            ],
            marginTop: 25,
          },
          {
            text: [
              {
                text: "Compostagem:",
                style: ["bold"],
              },
              " Operação de tratamento de resíduo sólido controlada de decomposição biológica da matéria orgânica presente no lixo, utilizando-se microorganismos existentes nos resíduos, em condições adequadas de aeração, umidade e temperatura. Esta operação gera um produto biologicamente estável chamado de composto orgânico.",
            ],
            marginTop: 25,
          },
          {
            text: [
              {
                text: "Resíduos classe I - Perigosos:",
                style: ["bold"],
              },
              " São classificados como resíduos classe I ou perigosos, os resíduos ou mistura de resíduos que, em função de suas características de inflamabilidade, corrosividade, reatividade, toxicidade e patogenicidade, podem apresentar risco à saúde pública, provocando ou contribuindo para um aumento de mortalidade ou incidência de doenças e/ou apresentar efeitos adversos ao meio ambiente, quando manuseados ou dispostos de forma inadequada. Os resíduos industriais e alguns domésticos, como restos de tintas, solventes, aerosóis, produtos de limpeza, lâmpadas fluorescentes, medicamentos vencidos, pilhas e outros, contêm significativa quantidade de substâncias químicas nocivas ao meio ambiente.",
            ],
            marginTop: 25,
          },
          {
            text: [
              {
                text: "Resíduos Classe II A – Não inertes:",
                style: ["bold"],
              },
              " São classificados como II A ou resíduos não inertes, os resíduos sólidos ou mistura de resíduos sólidos que não se enquadram na Classe I - perigosos ou na Classe III ou II B- inertes. Estes resíduos podem ter propriedades tais como: combustibilidade, biodegradabilidade ou solubilidade em água. Como exemplos destes materiais, pode-se citar: certos lodos de ETE, orgânicos, papéis e etc.",
            ],
            marginTop: 25,
          },
          {
            text: [
              {
                text: "Resíduos Classe II B – Inertes:",
                style: ["bold"],
              },
              ' São classificados II B ou resíduos inertes, os resíduos sólidos ou mistura de resíduos sólidos que, submetidos ao teste de solubilização (Norma NBR 10006 - "Solubilização de resíduos - Procedimento") não tenham nenhum de seus constituintes solubilizados em concentrações superiores aos padrões definidos na Listagem 8 - " Padrões para o Teste de Solubilização". Como exemplos destes materiais, pode-se citar: rochas, tijolos, vidros e certos plásticos e borrachas que não são facilmente decompostos.',
            ],
            marginTop: 25,
          },
          "Os resíduos inertes não podem ser solúveis nem inflamáveis, nem ter qualquer outro tipo de reação física ou química e não podem ser biodegradáveis, nem afetar negativamente outras substâncias com as quais entrem em contato, de forma suscetível de aumentar a poluição do ambiente ou prejudicar a saúde humana.",
          {
            text: [
              {
                text: "Coleta seletiva:",
                style: ["bold"],
              },
              " Coleta seletiva de lixo é um processo que consiste na separação e recolhimento dos resíduos descartados por empresas e pessoas. Desta forma, os materiais que podem ser reciclados são separados do lixo orgânico (restos de carne, frutas, verduras e outros alimentos). Este último tipo de lixo é descartado em aterros sanitários ou usado para a fabricação de adubos orgânicos.",
            ],
            marginTop: 25,
          },
          {
            text: "No sistema de coleta seletiva, os materiais recicláveis são separados em: papéis, plásticos, metais e vidros. Existem indústrias que reutilizam estes materiais para a fabricação de matéria-prima ou até mesmo de outros produtos.",
            marginTop: 25,
          },
          {
            text: "Pilhas e baterias também são separadas, pois quando descartadas no meio ambiente provocam  contaminação do solo. Embora não possam ser reutilizados, estes materiais ganham um destino apropriado para não gerarem a poluição do meio ambiente.",
            marginTop: 25,
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
            marginTop: 200,
          },
          { text: "MSC. PEDRO AMERICO DUARTE", fontSize: 16 },
          { text: "DAVINCI CONSULTORIA", style: ["bold"], fontSize: 10.5 },
          { text: "MEIO AMBIENTE", style: ["bold"], fontSize: 10.5 },
          { text: "Av. Vicente Machado, 467 cj 102", marginTop: 15 },
          { text: "Centro" },
          { text: "Curitiba - PR, 80420-010" },
          { text: "Fone: (41) 3011-4500" },
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
    },
  };

  return template;
}
