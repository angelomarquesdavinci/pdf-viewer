import { TDocumentDefinitions } from "pdfmake/interfaces";

const borderOptions = {
  noBottom: [true, true, true, false],
  noTop: [true, false, true, true],
  horizontalOnly: [true, false, true, false],
  leftBottomOnly: [true, false, false, true],
};

export const fbTemplate: TDocumentDefinitions = {
  pageSize: "A4",
  pageOrientation: "landscape",
  pageMargins: [30, 20],
  content: [
    {
      stack: [
        {
          columns: [
            { image: "logo", width: 50, absolutePosition: { x: 220, y: 10 } },
            {
              margin: [-60, 0, 0, 0],
              stack: [
                { text: "MUNICÍPIO DE FRANCISCO BELTRÃO", style: "header" },
                { text: "Estado do Paraná", style: "header" },
                {
                  text: "SECRETARIA MUNICIPAL DE MEIO AMBIENTE",
                  style: "header",
                  bold: true,
                },
                {
                  text: "Modelo de Referência - Plano de Gerenciamento de Resíduos Sólidos– PGRS",
                  style: "header",
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
      table: {
        widths: ["*"],
        body: [
          [
            {
              text: "ATENÇÃO:",
              border: borderOptions.noBottom,
              lineHeight: 0.5,
              bold: true,
            },
          ],
          [
            {
              text: "Este formulário é um modelo para que os dados relativos ao empreendimento sejam preenchidos de forma correta.",
              border: borderOptions.horizontalOnly,
            },
          ],
          [
            {
              text: "Assim sendo, o PGRS deve contemplar NO MÍNIMO os dados solicitados neste instrumento, porém pode ser complementado com outras informações consideradas relevantes no campo “7) OBSERVAÇÕES GERAIS”.",
              border: borderOptions.horizontalOnly,
            },
          ],
          [
            {
              text: "A partir do mês de maio de 2020, somente serão aceitos para análise os PGRS apresentados conforme formulário próprio desta SMMA.",
              border: borderOptions.horizontalOnly,
            },
          ],
          [
            {
              text: "OBSERVAÇÕES IMPORTANTES QUANTO AO PGRS:",
              border: borderOptions.horizontalOnly,
              bold: true,
            },
          ],
          [
            {
              text: "1) O PGRS deverá ser apresentado em duas vias encadernadas, em formato paisagem, com fonte Times New Roman ou Arial, tamanho mínimo de fonte “10”. Não será aceito documento manuscrito;",
              border: borderOptions.horizontalOnly,
            },
          ],
          [
            {
              text: "2) O documento deve ser paginado, com as assinaturas dos responsáveis pelo empreendimento e pelo PGRS, com data de elaboração;",
              border: borderOptions.horizontalOnly,
            },
          ],
          [
            {
              text: "3) Quando solicitadas complementações, estas deverão ser apresentadas diretamente na Secretaria Municipal de Meio Ambiente, em um prazo máximo de 30 dias.",
              border: borderOptions.horizontalOnly,
            },
          ],
          [
            {
              text: "4) Caso o empreendimento apresente Sistema de Tratamento de Efluentes, deve ser preenchido o item “2) MANEJO DOS RESÍDUOS GERADOS, CONFORME LEGISLAÇÃO VIGENTE, NOS DIFERENTES SETORES DO EMPREENDIMENTO – D) EFLUENTES”, inserindo informações quanto a geração destes resíduos, seu tratamento e destinação",
              border: borderOptions.noTop,
            },
          ],
        ],
      },
    },
    {
      margin: [0, 20, 0, 0],
      table: {
        widths: ["*"],
        body: [
          [
            {
              text: "DOCUMENTOS A SEREM APRESENTADOS ANEXOS AOS PGRS:",
              border: borderOptions.noBottom,
              lineHeight: 0.5,
              bold: true,
            },
          ],
          [
            {
              text: "1) Contrato(s) com a(s) empresa(s) terceirizada(s) devidamente licenciadas com validade vigente, constando as devidas assinaturas;",
              border: borderOptions.horizontalOnly,
            },
          ],
          [
            {
              text: "2) Comprovante(s) recente(s) de coleta e destinação final, emitido(s) pela(s) empresa(s) terceirizada(s) no caso de empresas existentes;",
              border: borderOptions.horizontalOnly,
            },
          ],
          [
            {
              text: "3) Licença(s) de Operação ou Autorização(ões) Ambiental(ais) da(s) empresa(s) terceirizada(s), dentro do prazo de validade;",
              border: borderOptions.horizontalOnly,
            },
          ],
          [
            {
              text: "4) Anotação de Responsabilidade Técnica do profissional responsável pela elaboração do PGRS;",
              border: borderOptions.horizontalOnly,
            },
          ],
          [
            {
              text: "5) Registro fotográfico apontando o local de acondicionamento e armazenamento dos resíduos",
              border: borderOptions.horizontalOnly,
            },
          ],
          [
            {
              text: "6) Em caso de geração de efluentes e/ou material particulado atmosférico, apresentar projeto e/ou fotos do sistema de tratamento implantados no empreendimento;",
              border: borderOptions.horizontalOnly,
            },
          ],
          [
            {
              text: "7) Em caso de geração de efluentes apresentar Memorial de Cálculo e Análises físico-químicas conforme Resolução CONAMA 357/2005 e 430/2011 e comprovantes de destinação do lodo gerado;",
              border: borderOptions.noTop,
            },
          ],
        ],
      },
    },
    {
      margin: [0, 20, 0, 0],
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
              text: "2) Deve ser apresentado em duas vias encadernadas, em formato paisagem, com fonte Times New Roman ou Arial, tamanho mínimo de fonte “10”. Não será aceito documento manuscrito;",
              border: borderOptions.horizontalOnly,
            },
          ],
          [
            {
              text: "3) Para casos de empreendimentos com lançamento de efluentes líquidos tratados, deve-se apontar além do corpo hídrico ou galeria de lançamento final, as análises físico-químicas conforme Resolução CONAMA 357/2005 e 430/2011 e comprovantes de destinação do lodo gerado.",
              border: borderOptions.noTop,
            },
          ],
        ],
      },
    },
    {
      pageBreak: "before",
      table: {
        widths: ["*", 80, 100],
        body: [
          [
            { border: borderOptions.noBottom, text: "" },
            {
              text: "CAMPO A SER PREENCHIDO PELA SMMA",
              style: "subTitle",
              colSpan: 2,
            },
            "",
          ],
          [
            {
              text: "1)   IDENTIFICAÇÃO",
              border: borderOptions.horizontalOnly,
              lineHeight: 0.5,
            },
            { text: "Nº DE PROTOCOLO", style: "subTitle" },
            { text: "DATA DE APROVAÇÃO", style: "subTitle" },
          ],
          [
            {
              text: "1.1) DADOS DO EMPREENDIMENTO:",
              margin: [19, 0, 0, 0],
              border: borderOptions.horizontalOnly,
            },
            { text: "", rowSpan: 2 },
            { text: "", rowSpan: 2 },
          ],
          [{ text: "", border: borderOptions.leftBottomOnly }, "", ""],
        ],
      },
    },
    {
      table: {
        widths: [100, "*", 100, "*"],
        body: [
          [
            {
              text: "Razão social:",
              border: borderOptions.noTop,
              margin: [0, 8],
            },
            { text: "", border: borderOptions.noTop },
            {
              text: "CNPJ/CPF:",
              border: borderOptions.noTop,
              margin: [0, 8],
            },
            { text: "", border: borderOptions.noTop },
          ],
          [
            {
              text: "Nome fantasia:",
              border: borderOptions.noTop,
              margin: [0, 8],
            },
            "",
            { text: "Inscrição Estadual:", margin: [0, 8] },
            "",
          ],
        ],
      },
    },
    {
      table: {
        widths: [150, "*"],
        body: [
          [
            {
              text: "Ramo de atividade e descrição sucinta dos serviços prestados",
              border: borderOptions.noTop,
              margin: [0, 4],
            },
            { text: "", border: borderOptions.noTop },
          ],
          [
            {
              text: "Atividades inseridas no CNPJ porém não executadas:",
              border: borderOptions.noTop,
              margin: [0, 4],
            },
            { text: "", border: borderOptions.noTop },
          ],
        ],
      },
    },
    {
      table: {
        widths: [100, "*"],
        body: [
          [
            {
              text: "Endereço completo:",
              border: borderOptions.noTop,
              margin: [0, 8],
            },
            { text: "", border: borderOptions.noTop },
          ],
        ],
      },
    },
  ],
  images: {
    logo: "https://cdn.sistemadavinci.com/image/42d214c3-a368-4c1c-b09c-3aa67dfd29f8.jpg",
  },
  styles: {
    header: {
      alignment: "center",
    },
    subTitle: {
      fontSize: 8,
    },
  },
  defaultStyle: {
    fontSize: 10,
  },
};
