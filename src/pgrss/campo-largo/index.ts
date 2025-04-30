import { TableLayout, TDocumentDefinitions } from "pdfmake/interfaces";
import {
  DOCUMENT_FREQUENCY,
  DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PROCEDURES,
  DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PRODUCTS,
  DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PROTECTION_GEAR,
  DOCUMENT_HEALTH_WASTE_PACKING,
  DOCUMENT_WASTE_COMPANY_LICENSE,
  DOCUMENT_WASTE_FREQUENCY,
  DOCUMENT_WASTE_TREATMENT,
  DOCUMENT_WASTE_UNIT,
  LOCALE,
} from "../../resource";
import { getFullDateFormat } from "../../service/util";
import {
  DocumentHealthSanitizationType,
  DocumentHealthWasteClass,
  DocumentWasteCompanyLicense,
  DocumentWasteFrequency,
  DocumentWasteUnit,
} from "../../types/document/enum";
import {
  IDocumentHealthWaste,
  IDocumentHealthWasteBase,
} from "../../types/document/interface";
import { IRenderReq } from "../../types/template/interface";
import { getWorkSchedule } from "../../types/template/utils";
import {
  cnpjMask,
  phoneMask,
  rgMask,
  setUpAddress,
  zipMask,
} from "../../utils";

const FIELD_EMPTY = "-";

const header = "http://localhost:5173/campo-largo.png";

const PARAGRAPH_START_WHITESPACE = "       ";
const USED_VEHICLE_DEFAULT = "Caminhão";

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

const groupKeyMap = Object.freeze({
  [DocumentHealthWasteClass.GROUP_A]: "groupA",
  [DocumentHealthWasteClass.GROUP_B]: "groupB",
  [DocumentHealthWasteClass.GROUP_C]: "groupC",
  [DocumentHealthWasteClass.GROUP_D_R]: "groupDR",
  [DocumentHealthWasteClass.GROUP_D_NR]: "groupDNr",
  [DocumentHealthWasteClass.GROUP_E]: "groupE",
});

type GroupKeyMapValue = (typeof groupKeyMap)[keyof typeof groupKeyMap];

export function render({ document, techinical }: IRenderReq) {
  const { company, healthWastes } = document;

  const { groupA, groupB, groupDR, groupDNr, groupE } =
    healthWastes?.reduce((acc, cur) => {
      const key = groupKeyMap[cur.group as DocumentHealthWasteClass];

      acc[key] = cur as IDocumentHealthWasteBase;

      return acc;
    }, {} as Record<GroupKeyMapValue, IDocumentHealthWasteBase>) ?? {};

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

    return `${quantity.toLocaleString(LOCALE)} ${DOCUMENT_WASTE_UNIT(
      unit
    )}/${DOCUMENT_WASTE_FREQUENCY(frequency)}`;
  }

  const sanitizationRoutine = document.healthAdditions?.sanitization.items.find(
    (item) => item.type === DocumentHealthSanitizationType.CONTAINER
  );

  const template: TDocumentDefinitions = {
    pageSize: "A4",
    pageOrientation: "portrait",
    pageMargins: [70, 150, 50, 60],
    defaultStyle: { font: "Arial", fontSize: 12 },
    header: function () {
      return {
        stack: [
          {
            image: "header",
            width: 80,
            alignment: "center",
            margin: [0, 40, 0, 0],
          },
          {
            style: ["text-center", "font-bold"],
            marginTop: 4,
            fontSize: 8,
            stack: [
              { text: "PREFEITURA MUNICIPAL DE CAMPO LARGO", fontSize: 10 },
              "SECRETARIA MUNICIPAL DE MEIO AMBIENTE",
              "SETOR DE MONITORAMENTO E FISCALIZAÇÃO",
            ],
          },
        ],
      };
    },
    footer: function (currentPage, pageCount) {
      return {
        margin: [70, 0, 70, 0],
        alignment: "center",
        table: {
          widths: [450],
          body: [
            [
              {
                text: "Av. Padre Natal Pigato, 989 CEP 83601-630 Campo largo – Paraná Tel. (41) 3291-5000 Fax (41) 3291-5195",
                fillColor: "#E0E0E0",
                fontSize: 7,
                border: [false, true, false, false],
              },
            ],
            [
              {
                text: "www.campolargo.pr.gov.br",
                fillColor: "#E0E0E0",
                fontSize: 7,
                border: borderOptions.noBorder,
              },
            ],
          ],
        },
      };
    },
    content: [
      {
        style: ["text-justify"],
        lineHeight: 1.5,
        stack: [
          {
            style: ["font-bold", "text-center"],
            text: [
              "MANUAL DE ORIENTAÇÃO PARA ELABORAÇÃO DO PLANO DE \n",
              "GERENCIAMENTO DE RESÍDUOS DE SAÚDE (PGRSS) ",
            ],
          },
          { text: "1 JUSTIFICATIVA", style: ["font-bold"], marginTop: 25 },
          {
            text: [
              " ",
              PARAGRAPH_START_WHITESPACE,
              "Resíduos gerados oriundos de atividades de atendimento a saúde humana ou  de serviços de atendimento a saúde de animais são classificados como resíduos de  serviço de saúde, pois podem apresentar agentes biológicos (como fungos,  bactérias, parasitas, vírus e outros agentes infecciosos). ",
            ],
            marginTop: 15,
          },
          {
            text: [
              " ",
              PARAGRAPH_START_WHITESPACE,
              "Devido a sua periculosidade e riscos à saúde pública, estes resíduos devem  passar por tratamento específico não devendo ser destinados a aterro sanitário  comum. ",
            ],
          },
          {
            text: [
              " ",
              PARAGRAPH_START_WHITESPACE,
              "Os resíduos gerados no atendimento à saúde são classificados de acordo  com a RDC 222 de 28 de março de 2018 da Anvisa em 5 grupos, a saber:",
            ],
          },
          {
            marginLeft: 15,
            type: "square",
            ul: [
              "Grupo A: resíduos com possível presença de agentes biológicos que, por  suas características de maior virulência ou concentração, podem apresentar  risco de infecção;",
              "Grupo B: resíduos contendo substâncias químicas que podem apresentar  risco à saúde pública ou ao meio ambiente, dependendo de suas  características de inflamabilidade, corrosividade, reatividade e toxicidade;",
              "Grupo C: quaisquer materiais resultantes de atividades humanas que  contenham radionuclídeos em quantidades superiores aos limites de isenção  especificados nas normas do CNEN e para os quais a reutilização é imprópria  ou não prevista;",
              "Grupo D: Resíduos que não apresentam risco biológico, químico ou  radiológico à saúde ou ao meio ambiente, podendo ser equiparados aos  resíduos domiciliares;",
              "Grupo E: materiais perfurocortantes ou escarificantes como: lâminas de  barbear, agulhas, lâminas de bisturi, lancetas, tubos capilares, lâminas,  lamínulas e demais utensílios de vidro quebrados.",
            ],
          },
          {
            pageBreak: "before",
            text: [
              " ",
              PARAGRAPH_START_WHITESPACE,
              "Para garantir segregação, armazenamento e destinação final adequadas  deve-se elaborar o Plano de Gerenciamento de Resíduos de Serviço de Saúde  (PGRSS) o qual determinará as diretrizes a serem seguidas para o correto  gerenciamento dos resíduos gerados. ",
            ],
          },
          {
            text: "2 OBJETIVO",
            style: ["font-bold"],
            marginTop: 25,
          },
          {
            text: [
              " ",
              PARAGRAPH_START_WHITESPACE,
              "O seguinte Manual tem por objetivo estabelecer um roteiro padrão para a  elaboração do PGRSS de clínicas, consultórios odontológicos, laboratórios,  hospitais, clínicas veterinárias e demais empreendimentos e atividades relacionados  ao atendimento a saúde humana ou animal. ",
            ],
            marginTop: 15,
          },
          {
            text: [
              " ",
              PARAGRAPH_START_WHITESPACE,
              "O PGRSS deverá conter informações detalhadas sobre o manejo de resíduos  sólidos contemplando os aspectos referentes à geração, segregação,  acondicionamento, armazenamento, coleta, transporte, tratamento e disposição final. ",
            ],
          },
          {
            text: "3 EQUIPE TÉCNICA",
            style: ["font-bold"],
            marginTop: 25,
          },
          {
            text: [
              " ",
              PARAGRAPH_START_WHITESPACE,
              "O PGRSS deverá ser elaborado por profissional com formação na área  ambiental ou profissional com formação na área de saúde devidamente registrado  no conselho de classe. Juntamente ao PGRSS deverá ser apresentado a ART do  responsável técnico (ou documento similar). ",
            ],
            marginTop: 15,
          },
          {
            text: "4 INFORMAÇÕES GERAIS",
            style: ["font-bold"],
            marginTop: 25,
          },
          {
            text: "4.1 Da obrigatoriedade da apresentação do PGRSS ",
            marginTop: 15,
            style: ["font-bold"],
          },
          {
            text: [
              " ",
              PARAGRAPH_START_WHITESPACE,
              "Todos os estabelecimentos prestadores de serviços de saúde, deverão  apresentar o Plano de Gerenciamento de Resíduos Sólidos de Serviços de Saúde  (PGRSS)  à Secretaria Municipal de Meio Ambiente, para fins de análise e aprovação, em  atendimento à legislação vigente. ",
            ],
          },
          {
            text: [
              " ",
              PARAGRAPH_START_WHITESPACE,
              "Os estabelecimentos prestadores de serviços de saúde considerados como  pequenos geradores de resíduos, deverão preencher e encaminhar o Plano Simplificado de Gerenciamento de Resíduos de Serviços de Saúde (ANEXO I), à  Secretaria Municipal do Meio Ambiente. A apresentação do formulário devidamente  preenchido atenderá a exigência de apresentação do Plano de Gerenciamento de  Resíduos Sólidos de Serviços de Saúde",
            ],
          },
          {
            text: "4.1.1 Geradores de resíduos de serviços de saúde que devem elaborar e  apresentar o Plano de Gerenciamento Completo:  ",
            marginTop: 15,
          },
          {
            type: "lower-alpha",
            separator: ["", ")"],
            marginLeft: 15,
            ol: [
              "Centros de ensino e pesquisa;",
              "Centros e postos de saúde;",
              "Centros radiológicos e quimioterápicos;",
              "Clínicas de Diálise;",
              "Clínicas de recuperação;",
              "Clínicas médicas e odontológicas;",
              "Clínicas veterinárias e centros de controle de zoonoses;",
              "Distribuidores de produtos farmacêuticos;",
              "Estabelecimentos de saúde que prestam assistência domiciliar e/ou unidades  móveis;",
              "Hospitais e maternidades;",
              "Institutos de Longa Permanência de Idosos;",
              "Laboratórios clínicos, patológicos e de radiografia;",
              "Medicina nuclear;",
              "Necrotérios, crematórios, funerárias e serviços onde se realizam atividades de  embalsamento (tanatopraxia e somatoconservação);",
              "Serviços de Esterilização de produtos médicos;",
              "Serviços de medicina legal;",
              "Outros estabelecimentos similares.",
            ],
          },
          {
            text: [
              "4.1.2 Estabelecimentos geradores que poderão apresentar o Plano ",
              { text: "Simplificado", style: ["font-bold"] },
              " de Gerenciamento de Resíduos de Serviços de Saúde: ",
            ],
            marginTop: 15,
          },
          {
            type: "lower-alpha",
            separator: ["", ")"],
            marginLeft: 15,
            ol: [
              "Clínicas de Estética;",
              "Consultórios médicos;",
              "Consultórios odontológicos;",
              "Estabelecimentos comerciais e industriais que possuam serviços  ambulatoriais;",
              "Farmácias e drogarias, inclusive as de manipulação;",
              "Pet-Shops;",
              "Salões de Beleza;",
              "Serviços de acupuntura, tatuagem e colocação de piercing;",
              "Outros estabelecimentos similares.",
            ],
          },
          {
            text: "4.2 Informações gerais do empreendimento",
            style: ["font-bold"],
            marginTop: 15,
          },
          {
            text: [
              " ",
              PARAGRAPH_START_WHITESPACE,
              "Este item deve conter detalhes do empreendimento e do empreendedor  ",
              "conforme segue. ",
            ],
          },
          {
            text: "4.2.1 Dados do empreendedor",
          },
          {
            text: [
              " ",
              PARAGRAPH_START_WHITESPACE,
              "Indicando nome, número do registro geral legal, endereço completo, telefone e fax, representante (s) legal (ais), pessoas de contato (nome, CPF, endereço, telefone, fax e e-mail).",
            ],
          },
          {
            text: "4.2.2 Identificação do Empreendimento",
          },
          {
            text: [
              " ",
              PARAGRAPH_START_WHITESPACE,
              "Razão social, nome fantasia, CNPJ, endereço completo, telefone, fax, e-mail, especialidades, número de leitos, entre outros.",
            ],
          },
          {
            text: "4.2.3 Responsáveis",
          },
          {
            text: [
              " ",
              PARAGRAPH_START_WHITESPACE,
              "Responsável Técnico pelo estabelecimento e identificação dos responsáveis pela implantação e controle do PGRSS no empreendimento.",
            ],
          },
          {
            text: "4.3 Tipologia do Empreendimento",
            style: ["font-bold"],
            marginTop: 15,
          },
          {
            text: [
              " ",
              PARAGRAPH_START_WHITESPACE,
              "Para melhoria da análise do PGRSS faz-se necessária a descrição das atividades desenvolvidas, croqui do estabelecimento, número de funcionários, horário de funcionamento e número de pacientes atendidos.",
            ],
          },
          {
            text: "4.4 Diagnóstico da Situação Atual (Gerenciamento dos Resíduos)",
            style: ["font-bold"],
            marginTop: 15,
          },
          {
            type: "square",
            marginLeft: 15,
            ul: [
              "Deverão ser indicados os materiais utilizados em cada procedimento e a quantidade e tipologia dos resíduos gerados conforme Resolução Anvisa nº 222/2018;",
              "Descrição dos procedimentos adotados quanto à segregação, coleta, acondicionamento, armazenamento, transporte e destinação final dos resíduos gerados, bem como os equipamentos e recipientes utilizados em seu manejo;",
              "Especificar os responsáveis pelo transporte e destinação final apresentando os certificados de destinação de todos os resíduos gerados bem como a licença ambiental dos responsáveis;",
              "Especificar qual o destino final dos resíduos gerados;",
              "Descrever o plano de Auto-Monitoramento;",
              "Deverão ser apresentada cópia do contrato de prestação de serviços firmado com a empresa responsável pela coleta dos resíduos;",
              "Deverão ser apresentadas as licenças sanitária e ambiental do empreendimento;",
              "Especificar e descrever (projeto) o destino dos efluentes líquidos gerados. Em caso de ligação à rede coletora de esgotos da SANEPAR, apresentar Anuência da mesma, que comprove a correta ligação à rede;",
              "Treinar e capacitar os funcionários sobre o PGRSS (A cópia das fichas de treinamentos deve estar em Anexo a este PGRSS);",
              "Definir e descrever os Equipamentos de Proteção Individual adotados;",
              "Deverá ser informado imediatamente aos órgãos de meio ambiente e de saúde competentes, sobre quaisquer modificações em seu tratamento normal dos resíduos gerados pelo estabelecimento, bem como sua disposição final.",
            ],
          },
          {
            text: "4.5 Atendimento à Legislação",
            style: ["font-bold"],
            marginTop: 15,
          },
          {
            text: [
              " ",
              PARAGRAPH_START_WHITESPACE,
              "Conforme Notificação Recomendatória Circular do Ministério Público do Trabalho, datada de 10 de junho de 2013, caberá às empresas a implantação de Programa Permanente de Separação Seletiva do Resíduos Sólidos Recicláveis e a ",
              {
                text: "formalização de um termo de convênio/parceria com as organizações de catadores de materiais recicláveis de Campo Largo",
                style: ["text-underline"],
              },
              {
                text: ", conforme art. 7º da Lei Federal 12.305/2010, que prevê a integração dos catadores nas ações que envolvam a responsabilidade compartilhada pelo ciclo de vida dos produtos.",
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
            text: "PLANO SIMPLIFICADO DE GERENCIAMENTO DE RESÍDUOS DE SERVIÇOS DE SAÚDE",
            style: ["font-bold"],
          },
          { text: "1. IDENTIFICAÇÃO DO GERADOR", marginTop: 15 },
          {
            marginTop: 15,
            layout: "noBorders",
            table: {
              widths: ["*", 250],
              body: [
                [
                  {
                    text: [
                      { text: "Razão Social: ", style: ["font-bold"] },
                      company?.name ?? FIELD_EMPTY,
                    ],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "Nome Fantasia: ", style: ["font-bold"] },
                      company?.businessName ?? FIELD_EMPTY,
                    ],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "C.N.P.J: ", style: ["font-bold"] },
                      cnpjMask(company?.identifier) ?? FIELD_EMPTY,
                    ],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "Endereço: ", style: ["font-bold"] },
                      setUpAddress(company?.address) ?? FIELD_EMPTY,
                    ],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "Bairro: ", style: ["font-bold"] },
                      company?.address?.neighborhood ?? FIELD_EMPTY,
                    ],
                  },
                  {
                    text: [
                      { text: "Fone/Fax: ", style: ["font-bold"] },
                      company?.landline
                        ? phoneMask(company?.landline)
                        : FIELD_EMPTY,
                    ],
                  },
                ],
                [
                  {
                    text: [
                      { text: "Email: ", style: ["font-bold"] },
                      company?.email ?? FIELD_EMPTY,
                    ],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      { text: "Área Construída (m²): ", style: ["font-bold"] },
                      company?.builtArea?.toLocaleString(LOCALE) ?? FIELD_EMPTY,
                    ],
                    colSpan: 2,
                  },
                  "",
                ],
              ],
            },
          },
          {
            marginTop: 10,
            layout: "noBorders",
            table: {
              widths: ["*", 190],
              body: [
                [
                  {
                    text: "Especialidades Médicas:  ",
                    style: ["font-bold"],
                    marginTop: 10,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: company?.activityDescription ?? FIELD_EMPTY,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      {
                        text: "Horário de funcionamento: ",
                        style: ["font-bold"],
                      },
                      getWorkSchedule({ company }),
                    ],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      {
                        text: "Número de pacientes atendidos por dia: ",
                        style: ["font-bold"],
                      },
                      company?.healthAppointmentsByDay?.toLocaleString(
                        LOCALE
                      ) ?? FIELD_EMPTY,
                    ],
                  },
                  {
                    text: [
                      {
                        text: "Número de funcionários: ",
                        style: ["font-bold"],
                      },
                      company?.totalEmployeesCount?.toLocaleString(LOCALE) ??
                        FIELD_EMPTY,
                    ],
                  },
                ],
              ],
            },
          },
          {
            marginTop: 10,
            layout: "noBorders",
            table: {
              widths: ["*", 200],
              body: [
                [
                  {
                    text: "Responsável Técnico pelo Plano de Gerenciamento de Resíduos:  ",
                    style: ["font-bold"],
                    marginTop: 10,
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      {
                        text: "Nome: ",
                        style: ["font-bold"],
                      },
                      techinical?.name ?? FIELD_EMPTY,
                    ],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      {
                        text: "Profissão: ",
                        style: ["font-bold"],
                      },
                      techinical.position ?? FIELD_EMPTY,
                    ],
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
                      `${
                        techinical.professionalClass?.institution ?? FIELD_EMPTY
                      } ${
                        techinical.professionalClass?.identity ?? FIELD_EMPTY
                      }`,
                    ],
                  },
                  {
                    text: [
                      {
                        text: "R.G.: ",
                        style: ["font-bold"],
                      },
                      techinical.identityNumber
                        ? rgMask(techinical.identityNumber)
                        : FIELD_EMPTY,
                    ],
                  },
                ],
                [
                  {
                    text: [
                      {
                        text: "Endereço residencial: ",
                        style: ["font-bold"],
                      },
                      `${techinical.company?.address.street}, ${techinical.company?.address.number}` +
                        (techinical.company?.address.complement
                          ? ` - ${techinical.company?.address.complement}`
                          : ""),
                    ],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      {
                        text: "Bairro: ",
                        style: ["font-bold"],
                      },
                      techinical.company?.address?.neighborhood ?? FIELD_EMPTY,
                    ],
                  },
                  {
                    text: [
                      {
                        text: "CEP: ",
                        style: ["font-bold"],
                      },
                      techinical.company?.address
                        ? zipMask(techinical.company.address.zip)
                        : FIELD_EMPTY,
                    ],
                  },
                ],
                [
                  {
                    text: [
                      {
                        text: "Cidade: ",
                        style: ["font-bold"],
                      },
                      techinical.company?.address.city ?? FIELD_EMPTY,
                    ],
                  },
                  {
                    text: [
                      {
                        text: "Estado: ",
                        style: ["font-bold"],
                      },
                      techinical.company?.address.state ?? FIELD_EMPTY,
                    ],
                  },
                ],
                [
                  {
                    text: [
                      {
                        text: "Fone/Fax: ",
                        style: ["font-bold"],
                      },
                      techinical.phone
                        ? phoneMask(techinical.phone)
                        : FIELD_EMPTY,
                    ],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: [
                      {
                        text: "Email: ",
                        style: ["font-bold"],
                      },
                      techinical.company?.email ?? FIELD_EMPTY,
                    ],
                    colSpan: 2,
                  },
                  "",
                ],
              ],
            },
          },
          {
            text: "2. IDENTIFICAÇÃO DOS RESÍDUOS GERADOS ",
            marginTop: 25,
          },
          {
            text: "GRUPO A: Resíduos Infectantes  ",
            style: ["font-bold"],
            marginTop: 15,
          },
          {
            text: "Resíduos que apresentam risco potencial à saúde pública e ao meio ambiente  devido à presença de agentes biológicos  ",
          },
          {
            text: "GRUPO B: Resíduos Químicos  ",
            style: ["font-bold"],
            marginTop: 15,
          },
          {
            text: "Resíduos que apresentam risco potencial à saúde pública e ao meio ambiente devido às suas características químicas.  ",
          },
          {
            text: "GRUPO D: Resíduos Comuns  ",
            style: ["font-bold"],
            marginTop: 15,
          },
          {
            text: "Resíduos que não apresentem risco biológico, químico ou radiológico à saúde ou ao meio ambiente, podendo ser equiparados aos resíduos domiciliares. ",
          },
          {
            text: "GRUPO E: Materiais Perfurocortantes ou Escarificantes.",
            style: ["font-bold"],
            marginTop: 15,
          },
          {
            marginTop: 25,
            table: {
              widths: [100, "*"],
              body: [
                [
                  "",
                  {
                    text: "RESÍDUOS GERADOS",
                    style: ["font-bold", "text-center"],
                  },
                ],
                [
                  { text: "GRUPO A", alignment: "start" },
                  {
                    text: groupA?.names?.join(", ") ?? FIELD_EMPTY,
                  },
                ],
                [
                  { text: "GRUPO B", alignment: "start" },
                  {
                    text: groupB?.names?.join(", ") ?? FIELD_EMPTY,
                  },
                ],
                [
                  { text: "GRUPO D (comum)", alignment: "start" },
                  {
                    text: groupDNr?.names?.join(", ") ?? FIELD_EMPTY,
                  },
                ],
                [
                  { text: "GRUPO D (recicláveis)", alignment: "start" },
                  {
                    text: groupDR?.names?.join(", ") ?? FIELD_EMPTY,
                  },
                ],
                [
                  { text: "GRUPO E", alignment: "start" },
                  {
                    text: groupE?.names?.join(", ") ?? FIELD_EMPTY,
                  },
                ],
              ],
            },
          },
          { text: "3. QUANTIFICAÇÃO DOS RESÍDUOS", marginTop: 25 },
          {
            text: "Indique a quantidade gerada de cada tipo de resíduos, em litros ou em kg por semana:",
          },
          {
            layout: "noBorders",
            table: {
              widths: [200, "*"],
              body: [
                [
                  "Grupo A, Resíduos Infectantes: ",
                  getGroupQuantity(
                    groupA?.quantity,
                    groupA?.unit,
                    groupA?.frequency
                  ),
                ],
                [
                  "Grupo B, Resíduos Químicos: ",
                  getGroupQuantity(
                    groupB?.quantity,
                    groupB?.unit,
                    groupB?.frequency
                  ),
                ],
                [
                  "Grupo D, Resíduos Comuns: ",
                  getGroupQuantity(
                    groupDNr?.quantity,
                    groupDNr?.unit,
                    groupDNr?.frequency
                  ),
                ],
                [
                  "Grupo D, Resíduos Recicláveis: ",
                  getGroupQuantity(
                    groupDR?.quantity,
                    groupDR?.unit,
                    groupDR?.frequency
                  ),
                ],
                [
                  "Grupo E, Resíduos Perfurantes: ",
                  getGroupQuantity(
                    groupE?.quantity,
                    groupE?.unit,
                    groupE?.frequency
                  ),
                ],
              ],
            },
          },
          {
            text: "4. ACONDICIONAMENTO DOS RESÍDUOS",
            marginTop: 25,
          },
          {
            marginTop: 15,
            table: {
              dontBreakRows: true,
              widths: [100, "*"],
              body: [
                [
                  { text: "GRUPO A", alignment: "start", style: ["font-bold"] },
                  {
                    text:
                      groupA?.packing !== undefined
                        ? DOCUMENT_HEALTH_WASTE_PACKING(groupA?.packing)
                        : FIELD_EMPTY,
                  },
                ],
                [
                  { text: "GRUPO B", alignment: "start", style: ["font-bold"] },
                  {
                    text:
                      groupB?.packing !== undefined
                        ? DOCUMENT_HEALTH_WASTE_PACKING(groupB?.packing)
                        : FIELD_EMPTY,
                  },
                ],
                [
                  {
                    text: "GRUPO D (comum)",
                    alignment: "start",
                    style: ["font-bold"],
                  },
                  {
                    text:
                      groupDNr?.packing !== undefined
                        ? DOCUMENT_HEALTH_WASTE_PACKING(groupDNr?.packing)
                        : FIELD_EMPTY,
                  },
                ],
                [
                  {
                    text: "GRUPO D (recicláveis)",
                    alignment: "start",
                    style: ["font-bold"],
                  },
                  {
                    text:
                      groupDR?.packing !== undefined
                        ? DOCUMENT_HEALTH_WASTE_PACKING(groupDR?.packing)
                        : FIELD_EMPTY,
                  },
                ],
                [
                  { text: "GRUPO E", alignment: "start", style: ["font-bold"] },
                  {
                    text:
                      groupE?.packing !== undefined
                        ? DOCUMENT_HEALTH_WASTE_PACKING(groupE?.packing)
                        : FIELD_EMPTY,
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
          "5. COLETA INTERNA DOS RESÍDUOS",
          {
            text: "a) O transporte dos recipientes deve ser realizado sem esforço excessivo ou risco de acidente para o funcionário.",
            marginTop: 10,
          },
          {
            text: "b) Os procedimentos devem ser realizados de forma a não permitir o rompimento dos recipientes. No caso de acidente ou derramamento, deve-se imediatamente realizar a limpeza e desinfecção simultânea do local.",
            marginTop: 5,
          },
          {
            text: "6. ARMAZENAMENTO DOS RESÍDUOS",
            marginTop: 25,
          },
          {
            marginTop: 15,
            table: {
              widths: [100, "*"],
              body: [
                [
                  { text: "GRUPO A", alignment: "start", style: ["font-bold"] },
                  {
                    text: "",
                  },
                ],
                [
                  { text: "GRUPO B", alignment: "start", style: ["font-bold"] },
                  {
                    text: "",
                  },
                ],
                [
                  {
                    text: "GRUPO D (comum)",
                    alignment: "start",
                    style: ["font-bold"],
                  },
                  {
                    text: "",
                  },
                ],
                [
                  {
                    text: "GRUPO D (recicláveis)",
                    alignment: "start",
                    style: ["font-bold"],
                  },
                  {
                    text: "",
                  },
                ],
                [
                  { text: "GRUPO E", alignment: "start", style: ["font-bold"] },
                  {
                    text: "",
                  },
                ],
              ],
            },
          },
          {
            text: "7.COLETA EXTERNA DOS RESÍDUOS",
            marginTop: 25,
          },
          {
            text: "Indique a entidade, devidamente licenciada pelo órgão ambiental, que realiza a coleta e transporte externo de cada tipo de resíduo, até a sua destinação final.",
            marginTop: 15,
          },
          {
            marginTop: 15,
            text: "GRUPO A: Resíduos Infectantes",
            style: ["font-bold"],
          },
          {
            text: "Responsável pelo transporte:",
            style: ["font-bold"],
          },
          { text: getCompaniesTransport(groupA) },
          {
            text: "Veículo utilizado:",
            style: ["font-bold"],
            marginTop: 5,
          },
          { text: groupA ? USED_VEHICLE_DEFAULT : FIELD_EMPTY },
          {
            text: "Frequência de coleta:",
            style: ["font-bold"],
            marginTop: 5,
          },
          {
            text:
              groupA?.collectionFrequency !== undefined
                ? DOCUMENT_FREQUENCY(groupA?.collectionFrequency)
                : FIELD_EMPTY,
          },
          {
            text: "Tratamento:",
            style: ["font-bold"],
            marginTop: 5,
          },
          {
            text:
              groupA?.treatment !== undefined
                ? DOCUMENT_WASTE_TREATMENT(groupA?.treatment)
                : FIELD_EMPTY,
          },
          {
            text: "Destino Final:",
            style: ["font-bold"],
            marginTop: 5,
          },
          { text: getCompaniesDestination(groupA) },
          {
            marginTop: 15,
            text: "GRUPO B: Resíduos Químicos",
            style: ["font-bold"],
          },
          {
            text: "Responsável pelo transporte:",
            style: ["font-bold"],
          },
          { text: getCompaniesTransport(groupB) },
          {
            text: "Veículo utilizado:",
            style: ["font-bold"],
            marginTop: 5,
          },
          { text: groupB ? USED_VEHICLE_DEFAULT : FIELD_EMPTY },
          {
            text: "Frequência de coleta:",
            style: ["font-bold"],
            marginTop: 5,
          },
          {
            text:
              groupB?.collectionFrequency !== undefined
                ? DOCUMENT_FREQUENCY(groupB?.collectionFrequency)
                : FIELD_EMPTY,
          },
          {
            text: "Tratamento:",
            style: ["font-bold"],
            marginTop: 5,
          },
          {
            text:
              groupB?.treatment !== undefined
                ? DOCUMENT_WASTE_TREATMENT(groupB.treatment)
                : FIELD_EMPTY,
          },
          {
            text: "Destino Final:",
            style: ["font-bold"],
            marginTop: 5,
          },
          { text: getCompaniesDestination(groupB) },
          {
            marginTop: 15,
            text: "GRUPO D: Resíduos Comuns Não Recicláveis",
            style: ["font-bold"],
          },
          {
            text: "Responsável pelo transporte:",
            style: ["font-bold"],
          },
          { text: getCompaniesTransport(groupDNr) },
          {
            text: "Veículo utilizado:",
            style: ["font-bold"],
            marginTop: 5,
          },
          { text: groupDNr ? USED_VEHICLE_DEFAULT : FIELD_EMPTY },
          {
            text: "Frequência de coleta:",
            style: ["font-bold"],
            marginTop: 5,
          },
          {
            text:
              groupDNr?.collectionFrequency !== undefined
                ? DOCUMENT_FREQUENCY(groupDNr?.collectionFrequency)
                : FIELD_EMPTY,
          },
          {
            text: "Destino Final:",
            style: ["font-bold"],
            marginTop: 5,
          },
          { text: getCompaniesDestination(groupDNr) },
          {
            marginTop: 15,
            text: "GRUPO D: Resíduos Recicláveis",
            style: ["font-bold"],
          },
          {
            text: "Responsável pelo transporte:",
            style: ["font-bold"],
          },
          { text: getCompaniesTransport(groupDR) },
          {
            text: "Veículo utilizado:",
            style: ["font-bold"],
            marginTop: 5,
          },
          { text: groupDR ? USED_VEHICLE_DEFAULT : FIELD_EMPTY },
          {
            text: "Frequência de coleta:",
            style: ["font-bold"],
            marginTop: 5,
          },
          {
            text:
              groupDR?.collectionFrequency !== undefined
                ? DOCUMENT_FREQUENCY(groupDR?.collectionFrequency)
                : FIELD_EMPTY,
          },
          {
            text: "Destino Final:",
            style: ["font-bold"],
            marginTop: 5,
          },
          { text: getCompaniesDestination(groupDR) },
          {
            marginTop: 15,
            text: "GRUPO E: Resíduos Perfurantes ou escarificantes",
            style: ["font-bold"],
          },
          {
            text: "Responsável pelo transporte:",
            style: ["font-bold"],
          },
          { text: getCompaniesTransport(groupE) },
          {
            text: "Veículo utilizado:",
            style: ["font-bold"],
            marginTop: 5,
          },
          { text: groupE ? USED_VEHICLE_DEFAULT : FIELD_EMPTY },
          {
            text: "Frequência de coleta:",
            style: ["font-bold"],
            marginTop: 5,
          },
          {
            text:
              groupE?.collectionFrequency !== undefined
                ? USED_VEHICLE_DEFAULT
                : FIELD_EMPTY,
          },
          {
            text: "Tratamento:",
            style: ["font-bold"],
            marginTop: 5,
          },
          {
            text:
              groupE?.treatment !== undefined
                ? DOCUMENT_WASTE_TREATMENT(groupE.treatment)
                : FIELD_EMPTY,
          },
          {
            text: "Destino Final:",
            style: ["font-bold"],
            marginTop: 5,
          },
          { text: getCompaniesDestination(groupE) },
        ],
      },
      {
        pageBreak: "before",
        style: ["text-justify"],
        stack: [
          { text: "8. SAÚDE E SEGURANÇA OCUPACIONAL" },
          {
            text: "a) Descrição das rotinas e utilização de EPI’s:",
            style: ["font-bold"],
            marginTop: 15,
          },
          {
            text: "_______________________________________________________",
          },
          {
            text: "b) Descrição das rotinas de Higienização e Limpeza:",
            style: ["font-bold"],
            marginTop: 15,
          },
          {
            marginLeft: 15,
            type: "square",
            ul: [
              `Frequência de Limpeza: ${
                sanitizationRoutine?.frequency !== undefined
                  ? DOCUMENT_FREQUENCY(sanitizationRoutine.frequency)
                  : FIELD_EMPTY
              }`,
              `Produtos Utilizados: ${
                sanitizationRoutine?.product !== undefined
                  ? DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PRODUCTS(
                      sanitizationRoutine.product
                    )
                  : FIELD_EMPTY
              }`,
              `EPI’s Utilizados: ${
                sanitizationRoutine?.protectionGear !== undefined
                  ? DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PROTECTION_GEAR(
                      sanitizationRoutine.protectionGear
                    )
                  : FIELD_EMPTY
              }`,
              `Procedimento de Limpeza: ${
                sanitizationRoutine?.procedure !== undefined
                  ? DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PROCEDURES(
                      sanitizationRoutine.procedure
                    )
                  : FIELD_EMPTY
              }`,
            ],
          },
        ],
      },
      {
        pageBreak: "before",
        style: ["text-justify"],
        stack: [
          { text: "9. CONSIDERAÇÕES FINAIS" },
          {
            text: "Este estabelecimento se compromete a seguir as disposições e implantar as medidas contidas neste plano.",
            marginTop: 15,
          },
          {
            marginTop: 15,
            marginLeft: 15,
            type: "square",
            ul: [
              "As cópias de contratos com empresas terceiras e suas devidas Licenças Ambientais devem estar em Anexo a este PGRSS;",
              "As cópias das fichas de treinamentos devem estar em Anexo a este PGRSS;",
            ],
          },
          {
            text: `Campo Largo, ${getFullDateFormat(new Date())}.`,
            marginTop: 25,
          },
          {
            marginTop: 75,
            marginLeft: 200,
            marginRight: 50,
            style: ["text-center"],
            stack: [
              {
                text: "________________________________",
              },
              {
                text: "Assinatura do Responsável pelo Estabelecimento Gerador",
                marginTop: 10,
              },
              {
                text: "________________________________",
                marginTop: 40,
              },
              {
                text: "Assinatura do Responsável Técnico pelo Plano de Gerenciamento",
                marginTop: 10,
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
