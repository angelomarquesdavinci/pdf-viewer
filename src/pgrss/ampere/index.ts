import { TableLayout, TDocumentDefinitions } from "pdfmake/interfaces";
import { DocumentHealthWasteClass } from "../../types/document/enum";
import { IRenderReq } from "../../types/template/interface";

export function render({}: IRenderReq) {
  const template: TDocumentDefinitions = {
    pageSize: "A4",
    pageOrientation: "portrait",
    pageMargins: [50, 60, 50, 60],
    defaultStyle: { font: "Arial", fontSize: 12 },
    content: [
      {
        text: "ANEXO I (Res. Conjunta 02/2005 SEMA/SESA)",
        style: ["text-center", "font-bold"],
      },
      {
        text: "PLANO SIMPLIFICADO DE GERENCIAMENTO DE RESÍDUOS DE SERVIÇOS DA SAÚDE PARA MÍNIMOS GERADORES Até 30 Litros/semana",
        style: ["text-center", "font-bold", "text-lg"],
        margin: [28, 8, 28, 0],
      },
      {
        text: "não aplicável para estabelecimentos que geram resíduos quimioterápicos e radioativos",
        style: ["text-center", "font-bold", "font-italics", "text-sm"],
        marginTop: 4,
      },
      {
        text: "1. IDENTIFICAÇÃO DO GERADOR",
        style: ["font-bold"],
        marginTop: 24,
      },
      {
        text: "Razão Social: ___________________________________________________",
        marginTop: 8,
      },
      {
        text: "Nome Fantasia: __________________________________________________",
        marginTop: 8,
      },
      {
        text: "C.N.P.J: _______________________________________________________",
        marginTop: 8,
      },
      {
        text: "Endereço: _______________________________________________________",
        marginTop: 8,
      },
      {
        marginTop: 8,
        columns: [
          "Bairro: _________________________________________",
          { text: "CEP: ________________", width: 180 },
        ],
      },
      {
        text: "Cidade: _______________________________________________________",
        marginTop: 8,
      },
      {
        text: "Fone / Fax: _______________________________________________________",
        marginTop: 8,
      },
      {
        text: "Email: _______________________________________________________",
        marginTop: 8,
      },
      {
        marginTop: 8,
        columns: [
          "Área Construída (m²): _________________",
          "Área Total do Terreno (m²): _____________",
        ],
      },
      {
        text: "2. INFORMAÇÕES GERAIS",
        style: ["font-bold"],
        marginTop: 24,
      },
      {
        text: "Responsável Legal: _______________________________",
        marginTop: 8,
      },
      {
        text: "CPF: _______________________________",
        marginTop: 8,
      },
      {
        text: "Responsável Técnico: _______________________________",
        marginTop: 16,
      },
      {
        text: "Registro no Conselho: _______________________________",
        marginTop: 8,
      },
      {
        text: "Especialidades (identificar as unidades ambulatoriais, clínicas, de complemento diagnóstico e terapêutica que geram resíduos): ________________________________________________________",
        marginTop: 16,
      },
      {
        text: "Data de início de funcionamento: __________________________________________",
        marginTop: 8,
      },
      {
        text: "Horário de funcionamento: ___________________________________________________",
        marginTop: 8,
      },
      {
        marginTop: 8,
        columns: [
          { text: "Número de pacientes atendidos por dia: ____" },
          { text: "Número de funcionários: _________", width: 200 },
        ],
      },
      {
        text: "(incluir os terceirizados)",
        style: ["text-xs"],
        margin: [340, 2, 0, 0],
      },
      {
        marginTop: 8,
        columns: [
          {
            text: "Número de Leitos: _________",
            width: 200,
          },
          {
            text: "(___) Observação",
            width: 120,
          },
          {
            text: "(___) Internação",
          },
        ],
      },
      {
        marginTop: 8,
        columns: [
          {
            text: "Serviço de Limpeza: ",
            width: 120,
          },
          {
            text: "(___) Próprio",
            width: 80,
          },
          {
            text: "(___) Terceirizado",
          },
        ],
      },
      {
        text: "Responsável Técnico pelo Plano de Gerenciamento de Resíduos:",
        marginTop: 16,
      },
      {
        text: "(pode ser o responsável técnico pelo estabelecimento se de nível superior e aprovado pelo órgão prof. respectivo)",
        marginTop: 2,
        style: ["text-xs"],
      },
      {
        text: "Nome: _____________________________________________________",
        marginTop: 8,
      },
      {
        text: "R.G.: ________________________________________________",
        marginTop: 8,
      },
      {
        columns: [
          {
            text: "Profissão: __________________________",
          },
          {
            text: "Registro no Conselho: _______________",
          },
        ],
        marginTop: 8,
      },
      {
        text: "Conferir com documento que comprove a designação do profissional ART (ou CRT)",
        style: ["text-xs"],
        marginTop: 2,
      },
      {
        text: "Endereço residencial: __________________________________________",
        marginTop: 8,
      },
      {
        columns: [
          {
            text: "Bairro: ________________________",
          },
          {
            text: "CEP: _________________",
            width: 180,
          },
        ],
        marginTop: 8,
      },
      {
        columns: [
          {
            text: "Cidade: _________________",
          },
          {
            text: "Estado: _________________",
            width: 180,
          },
        ],
        marginTop: 8,
      },
      {
        text: "Fone / Fax: ______________________________________",
        marginTop: 8,
      },
      {
        text: "Email: ______________________________________",
        marginTop: 8,
      },
      {
        text: "Responsável Pela Execução do PGRSS: ______________________________________",
        marginTop: 16,
      },
      {
        columns: [
          { text: "Função: ______________________________" },
          { text: "Formação: ____________________________" },
        ],
        marginTop: 8,
      },
      {
        text: "3. IDENTIFICAÇÃO DOS RESÍDUOS GERADOS",
        style: ["font-bold"],
        marginTop: 24,
      },
      {
        text: "GRUPO A: Resíduos Infectantes",
        marginTop: 8,
      },
      {
        text: "Resíduos que apresentam risco potencial à saúde pública e ao meio ambiente devido à presença de agentes biológicos.",
        marginTop: 8,
      },
      {
        text: "GRUPO B: Resíduos Químicos",
        marginTop: 8,
      },
      {
        text: "Resíduos que apresentam risco potencial à saúde pública e ao meio ambiente devido às suas características químicas.",
        marginTop: 8,
      },
      {
        text: "GRUPO D: Resíduos Comuns",
        marginTop: 8,
      },
      {
        text: "Resíduos que não apresentem risco biológico, químico ou radiológico à saúde ou ao meio ambiente, podendo ser equiparados aos resíduos domiciliares.",
        marginTop: 8,
      },
      {
        text: "GRUPO E: Materiais perfurocortantes ou escarificantes.",
        marginTop: 8,
      },
      {
        text: "4. QUANTIFICAÇÃO DOS RESÍDUOS",
        style: ["font-bold"],
        marginTop: 24,
      },
      {
        text: "Grupo A, Resíduos Infectantes: __________________",
        marginTop: 8,
      },
      {
        text: "Grupo B, Resíduos Químicos: __________________",
        marginTop: 8,
      },
      {
        text: "Grupo D, Resíduos Comuns – não recicláveis: __________________",
        marginTop: 8,
      },
      {
        text: "Grupo D, Resíduos Comuns – recicláveis: __________________",
        marginTop: 8,
      },
      {
        text: "Grupo E, Resíduos Perfurantes: __________________",
        marginTop: 8,
      },
      {
        style: ["text-justify"],
        stack: [
          {
            text: "5. ACONDICIONAMENTO DOS RESÍDUOS – Obrigações Legais",
            style: ["font-bold"],
            marginTop: 24,
          },
          {
            text: "Os resíduos deste estabelecimento serão acondicionados e armazenados da seguinte forma, de acordo com as Resoluções RDC – ANVISA nº 306/2004, CONAMA nº 358/2005 e normas pertinentesda ABNT e do município sede do estabelecimento:",
            marginTop: 8,
          },
          {
            text: "GRUPO A: Resíduos Infectantes",
            marginTop: 16,
          },
          {
            text: "São acondicionados em sacos plásticos, impermeáveis e resistentes, de cor branca leitosa, com simbologia de resíduo infectante. (observar a necessidade de utilização de sacos vermelhos – RDC 306/04 – ANVISA)",
            marginTop: 8,
          },
          {
            text: "São armazenados em recipientes estanques, metálicos ou de plástico, com tampa, de fácil higienização e manuseio.",
            marginTop: 8,
          },
          {
            text: "GRUPO B: Resíduos Químicos",
            marginTop: 16,
          },
          {
            text: "São acondicionados em duplo saco plástico de cor branca leitosa, com identificação do resíduo e dos riscos; ou acondicionados em recipiente rígido e estanque, compatível com as características físico-químicas do resíduo ou produto a ser descartado, identificando de forma visível com o nome do conteúdo e suas principais características.",
            marginTop: 8,
          },
          {
            text: "GRUPO D: Resíduos Comuns",
            marginTop: 16,
          },
          {
            text: "São acondicionados em sacos pretos resistentes de modo a evitar derramamento durante o manuseio. Os resíduos comuns recicláveis (papel, papelão, plástico e vidro) podem ser separados e destinados à reciclagem.",
            marginTop: 8,
          },
          {
            text: "GRUPO E: Resíduos Perfurantes ou escarificantes",
            marginTop: 16,
          },
          {
            text: "Os resíduos perfurantes e cortantes do Grupo A são acondicionados e armazenados em recipientes rígidos, resistentes à punctura, rompimento e vazamento, com tampa, devidamente identificados com a simbologia de resíduo infectante e perfurocortante.",
            marginTop: 8,
          },
          {
            text: "6. COLETA INTERNA DOS RESÍDUOS – Obrigações Legais",
            style: ["font-bold"],
            marginTop: 24,
          },
          {
            text: "Os resíduos deverão seguir os seguintes procedimentos ao serem transportados dentro do estabelecimento, de acordo com as Resoluções RDC – ANVISA nº 306/2004, CONAMA nº 358/2005 e normas pertinentes da ABNT e do município sede do estabelecimento.",
          },
          {
            text: "1) O transporte dos recipientes deve ser realizado sem esforço excessivo ou risco de acidente para o funcionário.",
            marginTop: 8,
          },
          {
            text: "2) Os procedimentos devem ser realizados de forma a não permitir o rompimento dos recipientes. No caso de acidente ou derramamento, deve-se imediatamente realizar a limpeza e desinfecção simultânea do local, e notificar a chefia da unidade.",
            marginTop: 8,
          },
          {
            text: "7. ABRIGO DOS RESÍDUOS – Obrigações Legais",
            style: ["font-bold"],
            marginTop: 24,
          },
          {
            text: "(pode ser apenas um conteiner/armário/bombona devido o porte do estabelecimento)",
            marginTop: 8,
          },
          {
            text: "Os resíduos deverão seguir os seguintes procedimentos ao serem transportados dentro do estabelecimento, de acordo com as Resoluções RDC – ANVISA nº 306/2004, CONAMA nº 358/2005 e normas pertinentes da ABNT e do município sede do estabelecimento.",
            marginTop: 8,
          },
          {
            text: "1) O abrigo de resíduos deve ser constituído de um local fechado, ser exclusivo para guarda temporária de resíduos de serviços de saúde, devidamente acondicionados em recipientes (Conteiner/armário/bombona).",
            marginTop: 8,
          },
          {
            text: "2) As dimensões do abrigo devem ser suficientes para armazenar a produção de resíduos de até três dias, sem empilhamento dos recipientes acima de 1,20 m.",
            marginTop: 8,
          },
          {
            text: "3) O piso, paredes, porta e teto devem ser de material liso, impermeável, lavável e de cor branca.",
            marginTop: 8,
          },
          {
            text: "4) A porta deve ostentar o símbolo de substância infectante.",
            marginTop: 8,
          },
          {
            text: "5) O abrigo de resíduo deve ser higienizado após a coleta externa ou sempre que ocorrer derramamento.",
            marginTop: 8,
          },
          {
            text: "8. TRATAMENTO E DESTINO FINAL DOS RESÍDUOS – Obrigações Legais",
            style: ["font-bold"],
            marginTop: 24,
          },
          {
            text: "Os resíduos deverão ser tratados e destinados da seguinte forma, de acordo com Resoluções RDC – ANVISA nº 306/2004, CONAMA nº 358/2005 e normas pertinentes da ABNT e do município sede do estabelecimento.",
            marginTop: 8,
          },
        ],
      },
      {
        text: "9. COLETA EXTERNA DOS RESIDUOS/TRATAMENTO E DISPOSIÇÃO FINAL",
        style: ["font-bold"],
        marginTop: 24,
      },
      {
        text: "Indique a entidade, devidamente licenciada pelo órgão ambiental, que realiza a coleta e transporte externo de cada tipo de resíduo, até a sua destinação final.",
        marginTop: 8,
      },
      {
        text: "GRUPO A: Resíduos Infectantes",
        marginTop: 16,
      },
      {
        text: "Responsável pelo transporte: __________________________________________________",
        marginTop: 8,
      },
      {
        text: "Veículo utilizado: ____________________________________________________________",
        marginTop: 8,
      },
      {
        text: "Freqüência de coleta: ________________________________________________________",
        marginTop: 8,
      },
      {
        text: "Tratamento: ________________________________________________________________",
        marginTop: 8,
      },
      {
        text: "Destino Final: ______________________________________________________________",
        marginTop: 8,
      },
      {
        text: "GRUPO B: Resíduos Químicos",
        style: ["font-bold"],
        marginTop: 24,
      },
      {
        text: "Responsável pelo transporte: __________________________________________________",
        marginTop: 8,
      },
      {
        text: "Veículo utilizado: ____________________________________________________________",
        marginTop: 8,
      },
      {
        text: "Freqüência de coleta: ________________________________________________________",
        marginTop: 8,
      },
      {
        text: "Tratamento: ________________________________________________________________",
        marginTop: 8,
      },
      {
        text: "Destino Final: ______________________________________________________________",
        marginTop: 8,
      },
      {
        text: "GRUPO D: Resíduos Comuns Não Recicláveis",
        style: ["font-bold"],
        marginTop: 8,
      },
      {
        text: "Responsável pelo transporte: __________________________________________________",
        marginTop: 8,
      },
      {
        text: "Veículo utilizado: ____________________________________________________________",
        marginTop: 8,
      },
      {
        text: "Freqüência de coleta: ________________________________________________________",
        marginTop: 8,
      },
      {
        text: "Destino Final: ______________________________________________________________",
        marginTop: 8,
      },
      {
        text: "GRUPO D: Resíduos Recicláveis",
        marginTop: 16,
      },
      {
        text: "Responsável pelo transporte: __________________________________________________",
        marginTop: 8,
      },
      {
        text: "Veículo utilizado: ____________________________________________________________",
        marginTop: 8,
      },
      {
        text: "Freqüência de coleta: ________________________________________________________ ",
        marginTop: 8,
      },
      {
        text: "Destino Final: _________________________________________________________",
        marginTop: 8,
      },
      {
        text: "GRUPO E: Resíduos Perfurantes ou escarificantes",
        marginTop: 16,
      },
      {
        text: "Responsável pelo transporte: __________________________________________________",
        marginTop: 8,
      },
      {
        text: "Veículo utilizado: ____________________________________________________________",
        marginTop: 8,
      },
      {
        text: "Freqüência de coleta: ________________________________________________________",
        marginTop: 8,
      },
      {
        text: "Tratamento: ________________________________________________________________",
        marginTop: 8,
      },
      {
        text: "Destino Final: ______________________________________________________________",
        marginTop: 8,
      },
      {
        style: ["text-justify"],
        stack: [
          {
            pageBreak: "before",
            text: "10. SAÚDE E SEGURANÇA OCUPACIONAL – Obrigações legais e recomendações",
            style: ["font-bold"],
            marginTop: 24,
          },
          {
            text: "As seguintes medidas serão implantadas neste estabelecimento, de acordo com Resoluções RDC – ANVISA nº 306/2004, CONAMA nº 358/2005 e normas pertinentes da ABNT e do município sede do estabelecimento:",
            marginTop: 8,
          },
          {
            text: "1) Durante o manuseio dos resíduos o funcionário deverá utilizar os seguintes equipamentos de proteção individual: luvas: de PVC ou borracha, impermeáveis, resistentes, de cor clara, antiderrapantes e de cano longo; e avental: de PVC, impermeável e de médio comprimento.",
            marginTop: 8,
          },
          {
            text: "2) Após a coleta interna, o funcionário deve lavar as mãos ainda enluvadas, retirando as luvas e colocando-as em local apropriado. O funcionário deve lavar as mãos antes de calçar as luvas e depois de retirá-las.",
            marginTop: 8,
          },
          {
            text: "3) Em caso de ruptura das luvas, o funcionário deve descartá-las imediatamente, não as reutilizando.",
            marginTop: 8,
          },
          {
            text: "4) Estes equipamentos de proteção individual devem ser lavados e desinfetados diariamente. Sempre que houver contaminação com material infectante, devem ser substituídos imediatamente, lavados e desinfetados no estabelecimento.",
            marginTop: 8,
          },
          {
            text: "As pessoas envolvidas com o manuseio de resíduos devem ser submetidas a exame admissional, periódico, de retorno ao trabalho, mudança de função e demissional. Os exames e avaliações que devem ser submetidas são: Anamnese ocupacional, Exame físico, Exame mental. Os funcionários também devem ser vacinados contra tétano, hepatite e outras considerações importantes pela Vigilância Sanitária.",
            marginTop: 8,
          },
          {
            text: "Para a prevenção de acidentes e exposição do trabalhador e agentes biológicos devem ser adotadas as seguintes medidas:",
            marginTop: 8,
          },
          {
            text: "1) Realizar anti-sepsia das mãos sempre que houver contato da pele com sangue e secreções",
            marginTop: 16,
          },
          {
            text: "2) Usar luvas sempre e, após retirá-las realizar lavagem das mãos",
            marginTop: 8,
          },
          {
            text: "3) Não fumar e não alimentar-se durante o manuseio com resíduos.",
            marginTop: 8,
          },
          {
            text: "4) Retirar as luvas e lavar as mãos sempre que exercer outra atividade não relacionada aos resíduos (ir ao sanitário, atender o telefone, beber água, etc.)",
            marginTop: 8,
          },
          {
            text: "5) Manter o ambiente sempre limpo.",
            marginTop: 8,
          },
          {
            text: "Em caso de acidente com perfurantes e cortantes, as seguintes medidas serão tomadas:",
            marginTop: 8,
          },
          {
            text: "1) Lavar bem o local com solução de detergente neutro.",
            marginTop: 8,
          },
          {
            text: "2) Aplicar solução anti-séptica (álcool iodado, álcool glicerinado a 70%) de 30 segundos a 2 minutos.",
            marginTop: 8,
          },
          {
            text: "3) Notificar imediatamente a chefia da unidade, e encaminhar para o pronto atendimento se necessário.",
            marginTop: 8,
          },
        ],
      },
      {
        text: "11. CONSIDERAÇÕES FINAIS",
        style: ["font-bold"],
        marginTop: 24,
      },
      {
        text: "Este estabelecimento se compromete a seguir as disposições e implantar as medidas contidas neste plano.",
        marginTop: 8,
      },
      {
        columns: [
          {
            text: `Local: ___________`,
          },
          {
            text: `Data: _____de __________de ______.`,
          },
        ],
        marginTop: 8,
      },
      {
        text: "_____________________________________________",
        marginTop: 90,
      },
      {
        text: "Assinatura do Responsável pelo Estabelecimento Gerador",
        margin: [18, 4, 0, 0],
        style: ["text-sm"],
      },
      {
        text: "_____________________________________________",
        marginTop: 90,
      },
      {
        text: "Assinatura do Responsável Técnico pelo Plano de Gerenciamento",
        margin: [4, 4, 0, 0],
        style: ["text-sm"],
      },
      {
        style: ["text-justify"],
        stack: [
          {
            text: "12. BIBLIOGRAFIA",
            style: ["font-bold"],
            marginTop: 24,
          },
          {
            text: "Para fins de atendimento de apresentação do Plano de Gerenciamento de Resíduos Sólidos Sépticos, deverão ser observadas as seguintes Legislações e Normas Técnicas: ",
          },
          {
            text: "LEI FEDERAL Nº 9605/98 – Dispõe sobre crimes ambientais.",
            marginTop: 8,
          },
          {
            text: "RESOLUÇÃO CONAMA Nº 01/86 – Estabelece definições, responsabilidade, critérios básicos, e diretrizes da avaliação do impacto ambiental , determina que aterros sanitários, processamento e destino final de resíduos tóxicos ou perigosos são passiveis de avaliação.",
            marginTop: 8,
          },
          {
            text: "RESOLUÇÃO CONAMA Nº 05/88 – Especifica licenciamento de obras de unidade de transferências, tratamento e disposição final de resíduos sólidos de origem domésticas, públicas, industriais e de origem hospitalar.",
            marginTop: 8,
          },
          {
            text: "RESOLUÇÃO CONAMA Nº 05/93 – dispões sobre destinação dos resíduos sólidos de serviço de saúde, portos, aeroportos, terminais rodoviários e ferroviários. Onde define a responsabilidade do gerador quanto o gerenciamento dos resíduos desde a geração até a disposição final.",
            marginTop: 8,
          },
          {
            text: "RESOLUÇÃO CONAMA Nº 358/2005 – Dispõe sobre o tratamento a destinação final dos resíduos dos serviços de saúde.",
            marginTop: 8,
          },
          {
            text: "RESOLUÇÃO ANVISA RDC 306/04 – Dispõe sobre o regulamento técnico para o gerenciamento de resíduos dos serviços de saúde.",
            marginTop: 8,
          },
          {
            text: "NBR 10.004/87 – Classifica os resíduos sólidos quanto aos seus riscos potenciais ao meio ambiente e à sua saúde.",
            marginTop: 8,
          },
          {
            text: "NBR 7.500/87 – Símbolos de risco e manuseio para o transporte e armazenamento de resíduos sólidos.",
            marginTop: 8,
          },
          {
            text: "NBR 12.235/92 – Armazenamento de resíduos sólidos perigosos definidos na NBR 10004 – procedimentos",
            marginTop: 8,
          },
          {
            text: "NBR 12807/93 – Resíduos de serviços de saúde – terminologia.",
            marginTop: 8,
          },
          {
            text: "NBR 12809/93 – Manuseio de resíduos de serviços de saúde – procedimentos.",
            marginTop: 8,
          },
          {
            text: "NBR 12810/93 – Coleta de resíduos de serviços de saúde – procedimentos.",
            marginTop: 8,
          },
          {
            text: "NBR 12980/93 – Coleta, varrição e acondicionamento de resíduos sólidos urbanos terminologia.",
            marginTop: 8,
          },
          {
            text: "NBR 11.175/90 – Fixa as condições exigíveis de desempenho do equipamento para incineração de resíduos sólidos perigosos.",
            marginTop: 8,
          },
          {
            text: "NBR 13.853/97 – Coletores para resíduos de seviços de saúde perfurantes ou cortantes – requisitos e métodos de ensaio.",
            marginTop: 8,
          },
          {
            text: "CNEN – NE 6.05/98 gerência dos rejeitos radioativos",
            style: ["font-bold"],
            marginTop: 8,
          },
        ],
      },
    ],
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
      "text-lg": {
        fontSize: 14,
      },
      "text-sm": {
        fontSize: 10,
      },
      "text-xs": {
        fontSize: 8,
      },
    },
  };

  return template;
}
