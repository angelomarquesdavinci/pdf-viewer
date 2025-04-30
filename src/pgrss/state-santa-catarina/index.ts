import { TDocumentDefinitions } from "pdfmake/interfaces";
import { IRenderReq } from "../../types/template/interface";

const logo = "http://localhost:5173/sc-estado-logo.png";

export function render({}: IRenderReq) {
  const template: TDocumentDefinitions = {
    pageSize: "A4",
    pageOrientation: "portrait",
    pageMargins: [40, 170, 40, 60],
    defaultStyle: { font: "Arial", fontSize: 12 },
    header: {
      margin: [40, 60, 50, 0],
      stack: [
        {
          columns: [
            { image: "logo", width: 50 },
            {
              width: "*",
              stack: [
                "ESTADO DE SANTA CATARINA",
                "SECRETARIA DE ESTADO DA SAÚDE",
                "SUPERINTENDÊNCIA DE VIGILÂNCIA EM SAÚDE",
                "DIRETORIA DE VIGILÂNCIA SANITÁRIA",
              ],
              marginLeft: 20,
              style: ["text-base"],
            },
          ],
        },
        {
          text: "PLANO DE GERENCIAMENTO DE RESÍDUOS DE SERVIÇOS DE SAÚDE - PGRSS \n SIMPLIFICADO (até 120litros/mensais ou o equivalente a 10 kg mês)",
          alignment: "center",
          marginTop: 20,
        },
      ],
    },
    footer: (currentPage, pageCount) => {
      return {
        style: ["text-xs"],
        margin: [40, 0, 40, 0],
        columns: [
          { text: "07/12/2023 23:" },
          {
            text: "Pág." + currentPage + " de " + pageCount,
            alignment: "right",
          },
        ],
      };
    },
    content: [
      {
        stack: [
          {
            text: "1. IDENTIFICAÇÃO DO GERADOR",
            style: ["text-xs", "font-bold"],
            marginTop: 25,
          },
          {
            marginTop: 20,
            table: {
              widths: [180, "*"],
              body: [
                [
                  {
                    text: ["CNPJ/CPF: ", "52.235.459/0001-78"],
                    style: ["text-xs"],
                  },
                  {
                    text: ["Razão Social: ", "CLÍNICA BIAVATTI ITAPEMA LTDA"],
                    style: ["text-xs"],
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    border: [true, false, true, true],
                    text: ["Nome Fantasia: ", "Clinica Biavatti"],
                    style: ["text-xs"],
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ["*", "*", "*"],
              body: [
                [
                  {
                    border: [true, false, true, true],
                    text: ["CNES: ", ""],
                    style: ["text-xs"],
                  },
                  {
                    border: [true, false, true, true],
                    text: ["CNAE: ", "9602-5/02"],
                    style: ["text-xs"],
                  },
                  {
                    border: [true, false, true, true],
                    text: ["Nº de Funcionários: ", "2"],
                    style: ["text-xs"],
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    border: [true, false, true, true],
                    text: [
                      "Endereço: ",
                      "Rua 234 450 Sala 3 Meia Praia Itapema SC 88220-000",
                    ],
                    style: ["text-xs"],
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ["*", 160],
              body: [
                [
                  {
                    border: [true, false, true, true],
                    text: ["Cidade: ", "ITAPEMA"],
                    style: ["text-xs"],
                  },
                  {
                    border: [true, false, true, true],
                    text: ["Fone: ", "47 9928-19979"],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    text: ["Responsável: ", "Débora Carina Biavatti "],
                    style: ["text-xs"],
                  },
                  {
                    text: ["CPF: ", "061.458.859-63"],
                    style: ["text-xs"],
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ["*", 220],
              body: [
                [
                  {
                    border: [true, false, true, true],
                    text: ["Profissão: ", "Farmacêutica"],
                    style: ["text-xs"],
                  },
                  {
                    border: [true, false, true, true],
                    text: ["Entidade de Classe: ", "CRF 25255"],
                    style: ["text-xs"],
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ["*", 220],
              body: [
                [
                  {
                    border: [true, false, true, true],
                    text: ["Ramo: ", "13. SALÕES DE BELEZA E ESTÉTICA"],
                    style: ["text-xs"],
                  },
                  {
                    border: [true, false, true, true],
                    text: [
                      "E-mail: ",
                      "contato.ipanema@clinicabiavatti.com.br",
                    ],
                    style: ["text-xs"],
                  },
                ],
              ],
            },
          },
          {
            text: "2. IDENTIFICAÇÃO E QUANTIFICAÇÃO DOS RESÍDUOS",
            style: ["text-xs", "font-bold"],
            marginTop: 25,
          },
          {
            text: "Grupo A - resíduos com a possível presença de agentes biológicos que, por suas características, podem apresentar risco de infecção, elencados no Anexo I - RDC 222/18;",
            style: ["text-xs", "font-bold"],
            marginTop: 20,
          },
          {
            marginTop: 10,
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    border: [true, true, true, false],
                    text: ["Descrição dos resíduos: "],
                    style: ["text-xs", "font-bold"],
                  },
                ],
                [
                  {
                    border: [true, false, true, true],
                    text: [
                      "Algoda~o, sache de a´lcool 70, luva descarta´vel, Swab, a ma´scara descarta´vel (sa~o descartados todos os materiais que tenham contato com material biolo´gico). Resi´duos de PRP (Plasma Rico em Plaquetas) sa~o armazenados sob refrigerac¸a~o no abrigo tempora´rio (sacos com nome e simbologia de resi´duos infectantes).",
                    ],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    text: [
                      { text: "Quantidade gerada: ", style: ["font-bold"] },
                      "150L/mês",
                    ],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    text: [
                      {
                        text: "Frequência de Coleta (nº de vezes no --mês--): ",
                        style: ["font-bold"],
                      },
                      "5",
                    ],
                    style: ["text-xs"],
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ["*", 200],
              body: [
                [
                  {
                    border: [false, false, false, false],
                    text: ["Transporte de Resíduos"],
                    style: ["text-sm"],
                    margin: [0, 5],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: ["Nome da Empresa: ", ""],
                    style: ["text-xs"],
                  },
                  {
                    text: ["CNPJ: ", ""],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    text: ["Licença Ambiental de Operação: ", ""],
                    style: ["text-xs"],
                  },
                  {
                    text: ["Validade LAO: ", ""],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    border: [false, false, false, false],
                    text: ["Destinação Final"],
                    style: ["text-sm"],
                    margin: [0, 5],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: ["Nome da Empresa: ", ""],
                    style: ["text-xs"],
                  },
                  {
                    text: ["CNPJ: ", ""],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    text: ["Licença Ambiental de Operação: ", ""],
                    style: ["text-xs"],
                  },
                  {
                    text: ["Validade LAO: ", ""],
                    style: ["text-xs"],
                  },
                ],
              ],
            },
          },
          {
            pageBreak: "before",
            text: "Grupo B - Resíduos contendo produtos químicos que podem apresentar risco à saúde pública ou ao meio ambiente, dependendo de suas características de inflamabilidade, corrosividade, reatividade e toxicidade, elencados no Anexo I - RDC 222/18",
            style: ["text-xs", "font-bold"],
            marginTop: 20,
          },
          {
            marginTop: 10,
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    border: [true, true, true, false],
                    text: ["Descrição dos resíduos: "],
                    style: ["text-xs", "font-bold"],
                  },
                ],
                [
                  {
                    border: [true, false, true, true],
                    text: [
                      "Algoda~o, sache de a´lcool 70, luva descarta´vel, Swab, a ma´scara descarta´vel (sa~o descartados todos os materiais que tenham contato com material biolo´gico). Resi´duos de PRP (Plasma Rico em Plaquetas) sa~o armazenados sob refrigerac¸a~o no abrigo tempora´rio (sacos com nome e simbologia de resi´duos infectantes).",
                    ],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    text: [
                      { text: "Quantidade gerada: ", style: ["font-bold"] },
                      "150L/mês",
                    ],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    text: [
                      {
                        text: "Frequência de Coleta (nº de vezes no --mês--): ",
                        style: ["font-bold"],
                      },
                      "5",
                    ],
                    style: ["text-xs"],
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ["*", 200],
              body: [
                [
                  {
                    border: [false, false, false, false],
                    text: ["Transporte de Resíduos"],
                    style: ["text-sm"],
                    margin: [0, 5],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: ["Nome da Empresa: ", ""],
                    style: ["text-xs"],
                  },
                  {
                    text: ["CNPJ: ", ""],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    text: ["Licença Ambiental de Operação: ", ""],
                    style: ["text-xs"],
                  },
                  {
                    text: ["Validade LAO: ", ""],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    border: [false, false, false, false],
                    text: ["Destinação Final"],
                    style: ["text-sm"],
                    margin: [0, 5],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: ["Nome da Empresa: ", ""],
                    style: ["text-xs"],
                  },
                  {
                    text: ["CNPJ: ", ""],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    text: ["Licença Ambiental de Operação: ", ""],
                    style: ["text-xs"],
                  },
                  {
                    text: ["Validade LAO: ", ""],
                    style: ["text-xs"],
                  },
                ],
              ],
            },
          },
          {
            text: "Grupo C - Rejeitos radioativos, elencados no Anexo I - RDC 222/18;",
            style: ["text-xs", "font-bold"],
            marginTop: 40,
          },
          {
            marginTop: 10,
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    border: [true, true, true, false],
                    text: ["Descrição dos resíduos: "],
                    style: ["text-xs", "font-bold"],
                  },
                ],
                [
                  {
                    border: [true, false, true, true],
                    text: ["---"],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    text: [
                      { text: "Quantidade gerada: ", style: ["font-bold"] },
                      "---",
                    ],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    text: [
                      {
                        text: "Frequência de Coleta: ",
                        style: ["font-bold"],
                      },
                      "---",
                    ],
                    style: ["text-xs"],
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ["*", 200],
              body: [
                [
                  {
                    border: [false, false, false, false],
                    text: ["Transporte de Resíduos"],
                    style: ["text-sm"],
                    margin: [0, 5],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: ["Nome da Empresa: ", "---"],
                    style: ["text-xs"],
                  },
                  {
                    text: ["CNPJ: ", ""],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    text: ["Licença Ambiental de Operação: ", "---"],
                    style: ["text-xs"],
                  },
                  {
                    text: ["Validade LAO: ", "---"],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    border: [false, false, false, false],
                    text: ["Destinação Final"],
                    style: ["text-sm"],
                    margin: [0, 5],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: ["Nome da Empresa: ", "---"],
                    style: ["text-xs"],
                  },
                  {
                    text: ["CNPJ: ", "---"],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    text: ["Licença Ambiental de Operação: ", "---"],
                    style: ["text-xs"],
                  },
                  {
                    text: ["Validade LAO: ", "---"],
                    style: ["text-xs"],
                  },
                ],
              ],
            },
          },
          {
            pageBreak: "before",
            stack: [
              {
                text: "Grupo D - Resíduos que não apresentam risco biológico, químico ou radiológico à saúde ou ao meio ambiente, podendo ser equiparados aos resíduos domiciliares, elencados no Anexo I - RDC 222/18;",
                style: ["text-xs", "font-bold"],
                marginTop: 20,
              },
              {
                columns: [
                  {
                    width: 25,
                    marginTop: 10,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: "X",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    width: 40,
                    text: "Gera",
                    style: ["text-xs"],
                    marginTop: 12.5,
                  },
                  {
                    width: 25,
                    marginTop: 10,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: " ",
                          },
                        ],
                      ],
                    },
                  },
                  { text: "Não Gera", style: ["text-xs"], marginTop: 12.5 },
                ],
              },
              {
                text: "6.1. Características: ",
                margin: [0, 10],
                style: ["text-xs"],
              },
              {
                columns: [
                  {
                    width: 25,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: "X",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    text: "Rejeitos Sólidos; Não passíveis de reutilização, recuperação e reciclagem.",
                    style: ["text-xs"],
                    marginTop: 2.5,
                  },
                ],
              },
              {
                marginLeft: 25,
                stack: [
                  {
                    margin: [0, 5],
                    text: "Destinação:",
                    style: ["text-xs"],
                  },
                  {
                    columns: [
                      {
                        width: 25,
                        table: {
                          widths: [8],
                          heights: [8],
                          body: [
                            [
                              {
                                style: ["text-xs"],
                                text: " ",
                              },
                            ],
                          ],
                        },
                      },
                      {
                        text: "Dispostos conforme as normas ambientais vigentes;",
                        style: ["text-xs"],
                        marginTop: 2.5,
                      },
                    ],
                  },
                  {
                    marginTop: 5,
                    columns: [
                      {
                        width: 25,
                        table: {
                          widths: [8],
                          heights: [8],
                          body: [
                            [
                              {
                                style: ["text-xs"],
                                text: " ",
                              },
                            ],
                          ],
                        },
                      },
                      {
                        text: "Outros;",
                        style: ["text-xs"],
                        marginTop: 2.5,
                      },
                    ],
                  },
                  {
                    marginTop: 5,
                    style: ["text-xs"],
                    text: ["Quantidade gerada: ", "15 kg/mês"],
                  },
                ],
              },
              {
                marginTop: 15,
                columns: [
                  {
                    width: 25,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: "X",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    text: "Efluentes Líquidos:",
                    style: ["text-xs"],
                    marginTop: 2.5,
                  },
                ],
              },
              {
                marginLeft: 25,
                stack: [
                  {
                    margin: [0, 5],
                    text: "Destinação:",
                    style: ["text-xs"],
                  },
                  {
                    columns: [
                      {
                        width: 25,
                        table: {
                          widths: [8],
                          heights: [8],
                          body: [
                            [
                              {
                                style: ["text-xs"],
                                text: " ",
                              },
                            ],
                          ],
                        },
                      },
                      {
                        text: "Lançamento em rede coletora de esgoto com tratamento;",
                        style: ["text-xs"],
                        marginTop: 2.5,
                      },
                    ],
                  },
                  {
                    marginTop: 5,
                    columns: [
                      {
                        width: 25,
                        table: {
                          widths: [8],
                          heights: [8],
                          body: [
                            [
                              {
                                style: ["text-xs"],
                                text: " ",
                              },
                            ],
                          ],
                        },
                      },
                      {
                        text: "Lançamento em sistema individual ambientalmente licenciado;",
                        style: ["text-xs"],
                        marginTop: 2.5,
                      },
                    ],
                  },
                  {
                    marginTop: 5,
                    columns: [
                      {
                        width: 25,
                        table: {
                          widths: [8],
                          heights: [8],
                          body: [
                            [
                              {
                                style: ["text-xs"],
                                text: " ",
                              },
                            ],
                          ],
                        },
                      },
                      {
                        text: "Outros;",
                        style: ["text-xs"],
                        marginTop: 2.5,
                      },
                    ],
                  },
                ],
              },
              {
                marginTop: 15,
                columns: [
                  {
                    width: 25,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: "X",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    text: "Resíduos; Passíveis de reutilização, recuperação e reciclagem.",
                    style: ["text-xs"],
                    marginTop: 2.5,
                  },
                ],
              },
              {
                marginLeft: 25,
                stack: [
                  {
                    margin: [0, 5],
                    text: "Destinação:",
                    style: ["text-xs"],
                  },
                  {
                    columns: [
                      {
                        width: 110,
                        stack: [
                          {
                            columns: [
                              {
                                width: 25,
                                table: {
                                  widths: [8],
                                  heights: [8],
                                  body: [
                                    [
                                      {
                                        style: ["text-xs"],
                                        text: " ",
                                      },
                                    ],
                                  ],
                                },
                              },
                              {
                                text: "Reutilização;",
                                style: ["text-xs"],
                                marginTop: 2.5,
                              },
                            ],
                          },
                          {
                            marginTop: 5,
                            columns: [
                              {
                                width: 25,
                                table: {
                                  widths: [8],
                                  heights: [8],
                                  body: [
                                    [
                                      {
                                        style: ["text-xs"],
                                        text: " ",
                                      },
                                    ],
                                  ],
                                },
                              },
                              {
                                text: "Compostagem;",
                                style: ["text-xs"],
                                marginTop: 2.5,
                              },
                            ],
                          },
                          {
                            marginTop: 5,
                            columns: [
                              {
                                width: 25,
                                table: {
                                  widths: [8],
                                  heights: [8],
                                  body: [
                                    [
                                      {
                                        style: ["text-xs"],
                                        text: " ",
                                      },
                                    ],
                                  ],
                                },
                              },
                              {
                                text: "Outros;",
                                style: ["text-xs"],
                                marginTop: 2.5,
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
                                width: 25,
                                table: {
                                  widths: [8],
                                  heights: [8],
                                  body: [
                                    [
                                      {
                                        style: ["text-xs"],
                                        text: " ",
                                      },
                                    ],
                                  ],
                                },
                              },
                              {
                                text: "Recuperação",
                                style: ["text-xs"],
                                marginTop: 2.5,
                              },
                            ],
                          },
                          {
                            marginTop: 5,
                            columns: [
                              {
                                width: 25,
                                table: {
                                  widths: [8],
                                  heights: [8],
                                  body: [
                                    [
                                      {
                                        style: ["text-xs"],
                                        text: " ",
                                      },
                                    ],
                                  ],
                                },
                              },
                              {
                                text: "Reciclagem;",
                                style: ["text-xs"],
                                marginTop: 2.5,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    marginTop: 5,
                    style: ["text-xs"],
                    text: ["Quantidade gerada: ", "15 kg/mês"],
                  },
                ],
              },
            ],
          },
          {
            pageBreak: "before",
            text: "Grupo E - Resíduos perfurocortantes ou escarificantes, tais como: lâminas de barbear, agulhas, escalpes, ampolas de vidro, brocas, limas endônticas, fios ortodônticos cortados, próteses bucais metálicas inutilizadas, pontas diamantadas, lâminas de bisturi, lancetas, tubos capilares, micropipetas, lâminas e lamínulas, espátulas e todos os utensílios de vidro quebrados no laboratório (pipetas, tubos de coleta sanguínea e placas de Petri), elencados no Anexo I - RDC 222/18;",
            style: ["text-xs", "font-bold"],
            marginTop: 20,
          },
          {
            marginTop: 10,
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    border: [true, true, true, false],
                    text: ["Descrição dos resíduos: "],
                    style: ["text-xs", "font-bold"],
                  },
                ],
                [
                  {
                    border: [true, false, true, true],
                    text: [
                      "Algoda~o, sache de a´lcool 70, luva descarta´vel, Swab, a ma´scara descarta´vel (sa~o descartados todos os materiais que tenham contato com material biolo´gico). Resi´duos de PRP (Plasma Rico em Plaquetas) sa~o armazenados sob refrigerac¸a~o no abrigo tempora´rio (sacos com nome e simbologia de resi´duos infectantes).",
                    ],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    text: [
                      { text: "Quantidade gerada: ", style: ["font-bold"] },
                      "150L/mês",
                    ],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    text: [
                      {
                        text: "Frequência de Coleta (nº de vezes no --mês--): ",
                        style: ["font-bold"],
                      },
                      "5",
                    ],
                    style: ["text-xs"],
                  },
                ],
              ],
            },
          },
          {
            table: {
              widths: ["*", 200],
              body: [
                [
                  {
                    border: [false, false, false, false],
                    text: ["Transporte de Resíduos"],
                    style: ["text-sm"],
                    margin: [0, 5],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: ["Nome da Empresa: ", ""],
                    style: ["text-xs"],
                  },
                  {
                    text: ["CNPJ: ", ""],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    text: ["Licença Ambiental de Operação: ", ""],
                    style: ["text-xs"],
                  },
                  {
                    text: ["Validade LAO: ", ""],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    border: [false, false, false, false],
                    text: ["Destinação Final"],
                    style: ["text-sm"],
                    margin: [0, 5],
                    colSpan: 2,
                  },
                  "",
                ],
                [
                  {
                    text: ["Nome da Empresa: ", ""],
                    style: ["text-xs"],
                  },
                  {
                    text: ["CNPJ: ", ""],
                    style: ["text-xs"],
                  },
                ],
                [
                  {
                    text: ["Licença Ambiental de Operação: ", ""],
                    style: ["text-xs"],
                  },
                  {
                    text: ["Validade LAO: ", ""],
                    style: ["text-xs"],
                  },
                ],
              ],
            },
          },
          {
            pageBreak: "before",
            stack: [
              {
                text: "3. ACONDICIONAMENTO E IDENTIFICAÇÃO",
                style: ["text-xs", "font-bold"],
                marginTop: 20,
              },
              {
                marginLeft: 20,
                stack: [
                  {
                    text: "3.1 - GRUPO A: Presença de Agentes Biológicos",
                    style: ["text-xs", "font-bold"],
                    marginTop: 15,
                  },
                  {
                    marginTop: 5,
                    columns: [
                      {
                        width: 25,
                        table: {
                          widths: [8],
                          heights: [8],
                          body: [
                            [
                              {
                                style: ["text-xs"],
                                text: " ",
                              },
                            ],
                          ],
                        },
                      },
                      {
                        text: "Saco Branco Leitoso",
                        style: ["text-xs"],
                        marginTop: 2.5,
                      },
                    ],
                  },
                  {
                    marginTop: 5,
                    columns: [
                      {
                        width: 25,
                        table: {
                          widths: [8],
                          heights: [8],
                          body: [
                            [
                              {
                                style: ["text-xs"],
                                text: " ",
                              },
                            ],
                          ],
                        },
                      },
                      {
                        text: "Saco Vermelho",
                        style: ["text-xs"],
                        marginTop: 2.5,
                      },
                    ],
                  },
                  {
                    text: "Outros:",
                    style: ["text-xs", "font-bold"],
                    marginTop: 5,
                  },
                  {
                    text: "3.2 - GRUPO B: Resíduo Químico",
                    style: ["text-xs", "font-bold"],
                    marginTop: 15,
                  },
                  {
                    margin: [5, 5, 0, 0],
                    text: "3.2.1 - Líquido",
                    style: ["text-xs"],
                  },
                  {
                    margin: [15, 5, 0, 0],
                    columns: [
                      {
                        width: 25,
                        table: {
                          widths: [8],
                          heights: [8],
                          body: [
                            [
                              {
                                style: ["text-xs"],
                                text: " ",
                              },
                            ],
                          ],
                        },
                      },
                      {
                        text: "Recipientes constituídos de material compatível com o líquido armazenado, resistentes, rídigos e estanques, com tampa que garanta a contenção do RSS e identificação conforme o Anexo II do RDC 222/18",
                        style: ["text-xs"],
                        marginTop: -2,
                      },
                    ],
                  },
                  {
                    text: "Outros:",
                    style: ["text-xs", "font-bold"],
                    margin: [15, 5, 0, 0],
                  },
                  {
                    margin: [5, 10, 0, 0],
                    text: "3.2.2 - Sólidos",
                    style: ["text-xs"],
                  },
                  {
                    margin: [15, 5, 0, 0],
                    columns: [
                      {
                        width: 25,
                        table: {
                          widths: [8],
                          heights: [8],
                          body: [
                            [
                              {
                                style: ["text-xs"],
                                text: " ",
                              },
                            ],
                          ],
                        },
                      },
                      {
                        text: "Recipientes constituídos de material rígido, resistente, compatível com as características de produto químico acondicionado e identificado conforme Anexo II do RDC 222/18",
                        style: ["text-xs"],
                        marginTop: -2,
                      },
                    ],
                  },
                  {
                    text: "Outros:",
                    style: ["text-xs", "font-bold"],
                    margin: [15, 5, 0, 0],
                  },
                  {
                    text: "3.3 - GRUPO C: Rejeito Radioativo",
                    style: ["text-xs", "font-bold"],
                    marginTop: 10,
                  },
                  {
                    marginTop: 5,
                    columns: [
                      {
                        width: 25,
                        table: {
                          widths: [8],
                          heights: [8],
                          body: [
                            [
                              {
                                style: ["text-xs"],
                                text: " ",
                              },
                            ],
                          ],
                        },
                      },
                      {
                        text: "Recipiente adequado a característica química, biológica e radiológica do rejeito, com vedação e tem seu conteúdo identificado",
                        style: ["text-xs"],
                        marginTop: -2,
                      },
                    ],
                  },
                  {
                    text: "Outros:",
                    style: ["text-xs", "font-bold"],
                    marginTop: 5,
                  },
                  {
                    text: "3.4 - GRUPO D: Resíduo Comum",
                    style: ["text-xs", "font-bold"],
                    marginTop: 10,
                  },
                  {
                    margin: [5, 5, 0, 0],
                    text: "3.4.1 - Líquidos",
                    style: ["text-xs"],
                  },
                  {
                    margin: [15, 5, 0, 0],
                    columns: [
                      {
                        width: 25,
                        table: {
                          widths: [8],
                          heights: [8],
                          body: [
                            [
                              {
                                style: ["text-xs"],
                                text: " ",
                              },
                            ],
                          ],
                        },
                      },
                      {
                        text: "Lançamento em rede coletora de esgotos com tratamento",
                        style: ["text-xs"],
                        marginTop: 2.5,
                      },
                    ],
                  },
                  {
                    margin: [15, 5, 0, 0],
                    columns: [
                      {
                        width: 25,
                        table: {
                          widths: [8],
                          heights: [8],
                          body: [
                            [
                              {
                                style: ["text-xs"],
                                text: " ",
                              },
                            ],
                          ],
                        },
                      },
                      {
                        text: "Sistema individual ambientalmente licenciado",
                        style: ["text-xs"],
                        marginTop: 2.5,
                      },
                    ],
                  },
                  {
                    text: "Outros:",
                    style: ["text-xs", "font-bold"],
                    margin: [15, 5, 0, 0],
                  },
                  {
                    margin: [5, 10, 0, 0],
                    text: "3.4.2 - Sólidos",
                    style: ["text-xs"],
                  },
                  {
                    margin: [15, 5, 0, 0],
                    columns: [
                      {
                        width: 25,
                        table: {
                          widths: [8],
                          heights: [8],
                          body: [
                            [
                              {
                                style: ["text-xs"],
                                text: " ",
                              },
                            ],
                          ],
                        },
                      },
                      {
                        text: "Sacos constituídos de material resistente a ruptura, vazamento e impermeável",
                        style: ["text-xs"],
                        marginTop: 2.5,
                      },
                    ],
                  },
                  {
                    text: "Outros:",
                    style: ["text-xs", "font-bold"],
                    margin: [15, 5, 0, 0],
                  },
                  {
                    text: "3.5 - GRUPO E: Perfurocortantes",
                    style: ["text-xs", "font-bold"],
                    marginTop: 10,
                  },
                  {
                    marginTop: 5,
                    columns: [
                      {
                        width: 25,
                        table: {
                          widths: [8],
                          heights: [8],
                          body: [
                            [
                              {
                                style: ["text-xs"],
                                text: " ",
                              },
                            ],
                          ],
                        },
                      },
                      {
                        text: "Recipiente identificado, rígido, providos com tampa, resistentes a punctura, ruptura e",
                        style: ["text-xs"],
                        marginTop: 2.5,
                      },
                    ],
                  },
                  {
                    text: "Outros:",
                    style: ["text-xs", "font-bold"],
                    marginTop: 5,
                  },
                ],
              },
            ],
          },
          {
            pageBreak: "before",
            stack: [
              {
                text: "4 - Armazenamento temporário e externo",
                style: ["text-xs", "font-bold"],
                marginTop: 20,
              },
              {
                text: "4.1 Grupos armazenados",
                style: ["text-xs"],
                margin: [5, 5, 0, 0],
              },
              {
                text: "4.1.1 Temporário",
                style: ["text-xs"],
                margin: [10, 5, 0, 0],
              },
              {
                margin: [15, 5, 0, 0],
                columns: [
                  {
                    width: 25,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: " ",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    width: 25,
                    text: "A",
                    style: ["text-xs"],
                    marginTop: 2.5,
                  },
                  {
                    width: 25,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: " ",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    width: 25,
                    text: "B",
                    style: ["text-xs"],
                    marginTop: 2.5,
                  },
                  {
                    width: 25,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: " ",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    width: 25,
                    text: "C",
                    style: ["text-xs"],
                    marginTop: 2.5,
                  },
                  {
                    width: 25,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: " ",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    width: 25,
                    text: "D",
                    style: ["text-xs"],
                    marginTop: 2.5,
                  },
                  {
                    width: 25,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: " ",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    width: 25,
                    text: "E",
                    style: ["text-xs"],
                    marginTop: 2.5,
                  },
                ],
              },
              {
                text: "4.1.2 Externo",
                style: ["text-xs"],
                margin: [10, 5, 0, 0],
              },
              {
                margin: [15, 5, 0, 0],
                columns: [
                  {
                    width: 25,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: " ",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    width: 25,
                    text: "A",
                    style: ["text-xs"],
                    marginTop: 2.5,
                  },
                  {
                    width: 25,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: " ",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    width: 25,
                    text: "B",
                    style: ["text-xs"],
                    marginTop: 2.5,
                  },
                  {
                    width: 25,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: " ",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    width: 25,
                    text: "C",
                    style: ["text-xs"],
                    marginTop: 2.5,
                  },
                  {
                    width: 25,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: " ",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    width: 25,
                    text: "D",
                    style: ["text-xs"],
                    marginTop: 2.5,
                  },
                  {
                    width: 25,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: " ",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    width: 25,
                    text: "E",
                    style: ["text-xs"],
                    marginTop: 2.5,
                  },
                ],
              },
              {
                text: "5 - Segurança Ocupacional",
                style: ["text-xs", "font-bold"],
                marginTop: 40,
              },
              {
                text: "5.1 O estabelecimento possui funcionário?",
                style: ["text-xs"],
                margin: [10, 5, 0, 0],
              },
              {
                margin: [15, 5, 0, 0],
                columns: [
                  {
                    width: 25,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: " ",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    text: "NÃO",
                    style: ["text-xs"],
                    marginTop: 2.5,
                  },
                ],
              },
              {
                margin: [15, 5, 0, 0],
                columns: [
                  {
                    width: 25,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: " ",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    text: "SIM",
                    style: ["text-xs"],
                    marginTop: 2.5,
                  },
                ],
              },
              {
                margin: [30, 5, 0, 0],
                columns: [
                  {
                    width: 25,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: " ",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    text: "São avaliados periodicamente",
                    style: ["text-xs"],
                    marginTop: 2.5,
                  },
                ],
              },
              {
                margin: [30, 5, 0, 0],
                columns: [
                  {
                    width: 25,
                    table: {
                      widths: [8],
                      heights: [8],
                      body: [
                        [
                          {
                            style: ["text-xs"],
                            text: " ",
                          },
                        ],
                      ],
                    },
                  },
                  {
                    text: "Possuem um programa de educação continuada em relação ao gerenciamento de RSS (Mesmo para os que atuam temporariamente)",
                    style: ["text-xs"],
                    marginTop: -2,
                  },
                ],
              },
            ],
          },
          {
            pageBreak: "before",
            stack: [
              {
                text: "6 - Responsáveis",
                style: ["text-xs", "font-bold"],
                marginTop: 25,
              },
              {
                text: "_____________________________________________",
                style: ["text-center"],
                marginTop: 50,
              },
              {
                text: "{name of the technician} - {certificate number}",
                style: ["text-center", "text-sm"],
                marginTop: 5,
              },
              {
                text: "Responsável pela elaboração do PGRSS",
                style: ["text-center", "text-xs"],
                marginTop: 5,
              },
              {
                text: "_____________________________________________",
                style: ["text-center"],
                marginTop: 50,
              },
              {
                text: "{name of the technician} - {certificate number}",
                style: ["text-center", "text-sm"],
                marginTop: 5,
              },
              {
                text: "Responsável pela implantação do PGRSS",
                style: ["text-center", "text-xs"],
                marginTop: 5,
              },
              {
                text: "_____________________________________________",
                style: ["text-center"],
                marginTop: 50,
              },
              {
                text: "{name of the technician} - {certificate number}",
                style: ["text-center", "text-sm"],
                marginTop: 5,
              },
              {
                text: "Responsável pelo monitoramento do PGRSS",
                style: ["text-center", "text-xs"],
                marginTop: 5,
              },
              {
                text: "_____________________________________________",
                style: ["text-center"],
                marginTop: 50,
              },
              {
                text: "{name of the legal responsible} - {certificate number}",
                style: ["text-center", "text-sm"],
                marginTop: 5,
              },
              {
                text: "Responsável pelo estabelecimento gerador",
                style: ["text-center", "text-xs"],
                marginTop: 5,
              },
              {
                text: ["Local e Data: ", "ITAPEMA 07/12/2023"],
                style: ["text-xs"],
                margin: [25, 30, 0, 0],
              },
              {
                text: "Observações",
                style: ["text-xs", "font-bold"],
                margin: [0, 20, 0, 0],
              },
              {
                text: "Trata-se de uma Clínica estética. Os materiais recicláveis e resíduos comuns são destinados a coleta pública devido ao baixo volume.",
                style: ["text-xs"],
                margin: [0, 10, 0, 0],
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
      // "text-underline": {
      //   decoration: "underline",
      // },
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
      // "text-red": {
      //   color: "red",
      // },
      "text-xl": {
        fontSize: 14,
      },
      "text-lg": {
        fontSize: 12,
      },
      "text-base": {
        fontSize: 11,
      },
      "text-sm": {
        fontSize: 10,
      },
      "text-xs": {
        fontSize: 9,
      },
    },
  };

  return template;
}
