import { IUserCrudModel } from "../crud/user/interface";
import { DataStatus, IDataQueryReq } from "../data/interface";
import {
  DocumentApprovedPreventionActions,
  DocumentCompanyPeoplesInvolved,
  DocumentFrequency,
  DocumentHistoryType,
  DocumentRefectoryPrepare,
  DocumentStatus,
  DocumentWasteAttributes,
  DocumentWasteClass,
  DocumentWasteCompanyLicense,
  DocumentWasteDangers,
  DocumentWasteDestination,
  DocumentWasteExternalPackaging,
  DocumentWasteFrequency,
  DocumentWasteImprovementActions,
  DocumentWasteOriginPoint,
  DocumentWastePacking,
  DocumentWasteStorage,
  DocumentWasteTreatment,
  DocumentWasteTreatmentSystems,
  DocumentWasteUnit,
  DocumentWasteUsedHardwares,
  DocumentHealthWasteClass,
  DocumentWasteWeekDays,
  IDocumentContainmentMeasures,
  IDocumentWasteContainmentAccident,
  IDocumentWasteInternalTransportation,
  DocumentHealthSanitizationType,
  DocumentHealthAdditionsQuestionType,
  DocumentHealthAdditionsSanitizationProducts,
  DocumentHealthAdditionsSanitizationProtectionGear,
  DocumentHealthAdditionsSanitizationProcedure,
  DocumentHealthAdditionsSanitizationMaterialsUsed,
  DocumentHealthAdditionsSanitizationVentilation,
  DocumentHealthAdditionsSanitizationDoorLockSystem,
  DocumentHealthWasteOriginPoint,
  DocumentHealthWastePutrescibleCoolingSystem,
  DocumentHealthWastePutrescibleDescription,
  DocumentCompanyServiceMode,
  DocumentHealthWastePacking,
  DocumentHealthInternalCollectionTransport,
  DocumentHealthAdditionsSecurityVaccines,
} from "./enum";

export interface IDocument extends IUserCrudModel {
  company: IDocumentCompany;
  documentStatus: DocumentStatus;
  responsibles?: IDocumentResponsibles;
  wastes?: IDocumentWaste[];
  wastesEffluent?: IDocumentWasteEffluent[];
  attachments?: IDocumentAttachments;
  templateRef: string;
  pdfUrl?: string;
  histories?: IDocumentHistory[];
  techinicalId?: string;
  techinicalName?: string;
  rejected?: IDocumentRejected;
  approved?: IDocumentApproved;
  healthAdditions?: IDocumentHealthAdditions; // Complementações saude
  healthWastes?: IDocumentHealthWaste[];
  healthWastesGroupC?: IDocumentHealthWasteGroupC;
}

export interface IDocumentCompany {
  identifier: string; //cnpj
  name: string; // Razão social
  address: IAddress;
  landline: string; // tel fixo
  phone: string;
  cnaeId: string;
  email: string;

  businessName?: string; // Nome fantasia
  fiscalIdentifier?: string; // indicacao fiscal
  propertyRegistration?: string; //inscricao imobiliaria
  licenseNumber?: string; // numero do alvara
  builtArea?: number; // area construída
  administrativeEmployeesCount?: number; // numero de funcionarios administrativos
  productionEmployeesCount?: number; // numero de funcionarios producao
  totalEmployeesCount?: number; // numero total de funcionarios
  weekDays: DocumentWasteWeekDays[];
  hoursDayStart: string;
  hoursDayEnd: string;
  othersWorkSchedule?: IDocumentCompanyOthersWorkSchedule[];
  refectory?: IDocumentRefectory;
  renovation?: boolean;
  totalArea?: number; // area total
  stateRegistration?: string; // inscrição estadual
  activityDescription?: string; // CARACTERIZAÇÃO E JUSTIFICATIVA DO EMPREENDIMENTO / ATIVIDADE - DESCRICAO DAS ATIVIDADES PRESTADAS
  cnaeIds?: string[];
  license?: string; // Licença ambiental
  licenseExpirationDate?: number; // Validade da licença
  peopleInvolved?: IDocumentCompanyPeopleInvolved; // pessoas envolvidas na geração de resíduos (POPULAÇÃO FLUTUANTE)
  improvementApproach?: boolean; // Perspectiva de reforma ou ampliação
  descriptionImprovementApproach?: string; // Descrição do plano/projeto, no caso de perspectiva de ampliação e/ou diversificação do estabelecimento
  healthAppointmentsByDay?: number; // N.º de atendimentos/dia (PGRSS)
  foundingDate?: number; // //  de fundação / início de funcionamento
  healthTotalBeds?: number; // Número de leitos total e por especialidades médicas
  healthOperationalCapability?: number; // Descrição de capacidade operacional do estabelecimento (n º de leitos/unidade ou serviço)
  serviceModes?: DocumentCompanyServiceMode[]; // Modalidades de Atendimento
}

export interface IAddress {
  zip: string;
  street: string;
  city: string;
  state: string;
  number?: number;
  neighborhood: string;
  complement?: string;
}

export interface ICnae {
  id: string;
  desc: string;
}

export interface IDocumentResponsible {
  name: string;
  position?: string; // cargo
  taxpayerNumber: string; // CPF
  identityNumber: string; // RG
  email: string;
  landline?: string; // tel fixo
  phone: string;
  address: IAddress;
  professionalClass?: IDocumentProfessionalClass;
  profession?: string; // profissão
}

export interface IDocumentResponsibles {
  legal?: Partial<IDocumentResponsible>; // responsavel legal
  techinical?: Partial<IDocumentResponsible>; // responsavel técnico
  implementation?: Partial<IDocumentResponsible>;
  elaboration?: Partial<IDocumentResponsible>;
}

export interface IDocumentProfessionalClass {
  identity: string; // N.° de registro no órgão de classe profissional
  institution: string; // Órgão de Registro de Classe Profissional
  state?: string; // UF do órgão de classe profissional
}

export interface IDocumentWaste {
  id?: string;
  classificationId?: string; // classification ENTIDADE
  class: DocumentWasteClass;
  quantity: number;
  unit: DocumentWasteUnit; // unidade de medida
  frequency: DocumentWasteFrequency;
  originPoint: DocumentWasteOriginPoint[]; // Ponto de Geracao
  storage: DocumentWasteStorage; // Armazenamento
  packing: DocumentWastePacking; // Acondicionamento interno
  externalPackaging?: DocumentWasteExternalPackaging; // Acondicionamento externo
  treatment: DocumentWasteTreatment; // Tratamento | destinacao
  collectionFrequency: DocumentFrequency;
  companyDestination: DocumentWasteCompanyLicense; // enum
  companiesDestination?: IDocumentCompanyLicense[]; // listagem das empresas
  companyTransport: DocumentWasteCompanyLicense; // enum
  companiesTransport?: IDocumentCompanyLicense[]; // listagem transporte
  internalTransportation?: IDocumentWasteInternalTransportation; // Forma de transporte interno
  containmentAccident?: IDocumentWasteContainmentAccident[]; // Medidas de contenção em caso de acidente
  improvementActions?: DocumentWasteImprovementActions;
  containmentMeasures?: IDocumentContainmentMeasures;
  dangers?: DocumentWasteDangers[]; // riscos ambientais
}

export interface IDocumentWasteEffluent {
  id?: string;
  originPoint: DocumentWasteOriginPoint;
  wasteAttributes: DocumentWasteAttributes; // Caracterização dos Efluentes
  treatmentSystems: DocumentWasteTreatmentSystems;
  usedHardware: DocumentWasteUsedHardwares;
  publicWasteWater?: boolean;
  treatmentSystemsDimensions: string;
  destination: DocumentWasteDestination;
  treatmentSystemsEfficient?: boolean;
  physicochemical?: boolean;
}

export interface IDocumentRefectory {
  prepare: DocumentRefectoryPrepare;
  amount: number;
}

export interface IDocumentCompanyLicense {
  name: string;
  identifier: string;
  license: string;
  licenseExpirationDate: number;
  address?: IAddress;
  techinical?: Partial<IDocumentResponsible>;
}
export interface IDocumentHistory {
  date: number;
  text: string;
  description: string;
  type: DocumentHistoryType;
}
export interface IDocumentQueryByStatusReq extends IDataQueryReq {
  status: DataStatus;
}

export interface IDocumentRejected {
  company?: string;
  responsibles?: string;
  wastes?: string;
  attachments?: string;
  healthWastes?: string;
  healthAdditions?: string;
}

export interface IDocumentQueryByDocuemntStatusReq extends IDataQueryReq {
  userId: string;
  documentStatus: DocumentStatus;
}

export interface IDocumentQueryByStatusAndDocuemntStatusReq
  extends IDataQueryReq {}

export interface IDocumentQueryByTechinicalIdReq extends IDataQueryReq {
  techinicalId: string;
}

export interface IDocumentApproved {
  artLink: string;
  artNumber?: string;
  timeline?: IDocumentApprovedTimeline[];
  observation?: string;
  training?: boolean;
  frequency?: DocumentFrequency;
  trainedEmployees?: number; // nº de funcionarios
  responsible?: string; // Responsável pela capacitação
  responsiblePosition?: string;
  classCouncil?: string; // Conselho de Classe
  content?: string; // Conteúdos abordados
  managementActions?: string; // AÇÕES DE GERENCIAMENTO DE RESÍDUOS SÓLIDOS
  goalsAndJustifications?: string; // OBJETIVO E JUSTIFICATIVA DO PLANO DE GERENCIAMENTO DE RESÍDUOS SÓLIDOS
  legislation?: string; // LEGISLAÇÃO UTILIZADA
  employeeAwareness?: string; // CAPACITAÇÃO E SENSIBILIZAÇÃO DOS COLABORADORES ACERCA DAS AÇÕES REFERENTES AO PGRS
  goals?: IDocumentApprovedGoals; // METAS E PROCEDIMENTOS VISANDO A NÃO GERAÇÃO, A REDUÇÃO, A REUTILIZAÇÃO E A RECICLAGEM DOS RESÍDUOS
  wastagePointsDescription?: string; // Descrever pontos de desperdício, perdas, não segregação, formas não adequadas de acondicionamentos, armazenamento, transporte, tratamento e destinação final dos resíduos ou outras informações que apontem discordância com a legislação vigente.
  recyclingProcedure?: string; // PROCEDIMENTOS VISANDO: REDUZIR A GERAÇÃO, A REUTILIZAÇÃO, A RECICLAGEM E A PERICULOSIDADE DE RESÍDUOS
  effluentOtherInfo?: string; // Outras informações de Efluentes
  preventionActions?: DocumentApprovedPreventionActions[]; // AÇÕES PREVENTIVAS E CORRETIVAS A SEREM EXECUTADAS EM SITUAÇÕES DE GERENCIAMENTO INCORRETO OU ACIDENTES
  putresciblePackingProcedure?: string; // DESCREVER OS PROCEDIMENTOS DE ACONDICIONAMENTO (CARACTERÍSTICAS DO SACO PLÁSTICO OU RECIPIENTE, COLETA INTERNA, ARMAZENAMENTO, COLETA EXTERNA (FREQUÊNCIA E RESPONSÁVEL), TECNOLOGIA DE TRATAMENTO E DISPOSIÇÃO FINAL
}

export interface IDocumentApprovedTimeline {
  action: string;
  inicialDate: number;
  expirationDate: number;
}

export interface IDocumentApprovedGoals {
  decreaseNonRecyclable?: number; // * Reduzir a produção de resíduos não recicláveis em XX% no próximo ano.
  increaseRecyclableRate?: number; // * Aumentar a taxa de resíduos que são destinados para reciclagem em XX% até o próximo ano.
  decreaseFoodWaste?: number; // * Reduzir o desperdício de alimentos em XX% até o próximo ano.
  reuse?: number; // * Reutilizar XX% dos materiais passíveis de reutilização dentro de um ano.
  implementComposting?: number; // * Introduzir a prática de compostagem de resíduos orgânicos até o próximo ano. XX%
  implementEnvironmentalEducation?: number; // * Introduzir o tema de educação ambiental em treinamentos da empresa. (XX treinamentos por ano)
  implementWaterReuse?: number; // * Implementar um programa de reuso de água que reduza o consumo de água potável em XX% em um período de um ano.
  decreaseEletronics?: number; // * Reduzir a quantidade de resíduos eletrônicos enviados para aterros sanitários em XX% em um período de um ano.
  decreaseGases?: number; // * Reduzir as emissões de gases de efeito estufa associadas às atividades da empresa em XX% em um ano.
}

export interface IDocumentAttachment {
  urls?: string[];
  justification?: string;
}

export interface IDocumentAttachments {
  contracts?: IDocumentAttachment;
  licenses?: IDocumentAttachment;
  photos?: IDocumentAttachment;
  collect?: IDocumentAttachment;
  training?: IDocumentAttachment;
  flowchart?: IDocumentAttachment;
  physicochemical?: IDocumentAttachment;
  floorplan?: IDocumentAttachment;
  calculus?: IDocumentAttachment;
  map?: IDocumentAttachment;
  procedures?: IDocumentAttachment;
}

export interface IDocumentCompanyPeopleInvolved {
  total: number;
  types: DocumentCompanyPeoplesInvolved[];
}

export interface IDocumentCompanyOthersWorkSchedule {
  weekDays: DocumentWasteWeekDays[];
  hoursDayStart: string;
  hoursDayEnd: string;
}

export type IGetAttachmentsRes = { artLink?: string } & {
  [key in keyof IDocumentAttachments]?: string[];
};

export interface IDocumentHealthAdditions {
  sanitization: IDocumentHealthSanitization; // Limpeza e Higienização
  storage: IDocumentHealthAdditionsStorage; // CARACTERÍSTICAS DO ABRIGO EXTERNO / LOCAL DE ARMAZENAMENTO
  homeCare: string; // Descrição dos procedimentos adotados nas etapas de acondicionamento, coleta e transporte de resíduos gerados na casa dos pacientes. [Saúde e SO]
  security?: IDocumentHealthAdditionsSecurity; // Saúde e Segurança Ocupacional (SSO)
  internalCollection?: IDocumentHealthAdditionsInternalCollection; // Coleta Interna
}

export interface IDocumentHealthSanitization {
  items: IDocumentHealthSanitizationItem[];
  effluent: IDocumentHealthSanitizationEffluent; // O efluente da lavagem dos recipientes e do abrigo é direcionado para a rede coletora de esgoto?
}

export interface IDocumentHealthSanitizationItem {
  frequency?: DocumentFrequency; // Frequência de Limpeza
  product?: DocumentHealthAdditionsSanitizationProducts; // Produtos Utilizados
  otherProduct?: string; // Outro produtos utilizados
  protectionGear?: DocumentHealthAdditionsSanitizationProtectionGear; // EPIs Utilizados
  procedure?: DocumentHealthAdditionsSanitizationProcedure; // Procedimento de Limpeza
  type: DocumentHealthSanitizationType;
}

export interface IDocumentHealthAdditionsStorage {
  exists?: boolean; // Existe abrigo para armazenamento dos resíduos?
  wasteClasses?: DocumentHealthWasteClass[]; // Quais tipos de resíduos são armazenados?
  wasteTypesIdentification?: boolean; // O abrigo possui identificação dos tipos de resíduos armazenados?
  wasteByType?: boolean; // O abrigo possui compartimentos específicos para cada resíduo armazenado?
  questions?: IDocumentHealthAdditionsQuestion[];
  shared?: boolean; // O abrigo é de uso compartilhado com Sala de Utilidades?
  area?: number; // Qual é espaço destinado ao abrigo de RSS? (m2)
  wasteGroups?: IDocumentHealthStorageWasteGroups[]; // CARACTERÍSTICAS DO ABRIGO EXTERNO (ORGANIZADOS POR GRUPO) [Abrigo]
  external?: boolean; // O Abrigo é externo?
}

export type IDocumentHealthAdditionsQuestionDescription =
  | DocumentHealthAdditionsSanitizationMaterialsUsed
  | DocumentHealthAdditionsSanitizationVentilation
  | DocumentHealthAdditionsSanitizationDoorLockSystem;

export interface IDocumentHealthAdditionsQuestion {
  type: DocumentHealthAdditionsQuestionType;
  exists: boolean; // Possui **?
  description?: IDocumentHealthAdditionsQuestionDescription; // De que forma?
  public?: boolean; // O ralo é direcionado para a rede de esgoto?
}

export type IDocumentHealthWaste =
  | IDocumentHealthWasteBase
  | IDocumentHealthWasteClassA
  | IDocumentHealthWasteClassE;

export interface IDocumentHealthWasteBase {
  id: string;
  names?: string[]; //  Id (Descrição) do Resíduo seguindo a tabela de classificação de resíduos do ibama (Resíduos Gerados)
  classificationIds?: string[]; // Id (Descrição) do Resíduo seguindo a tabela de classificação de resíduos do ibama (Resíduos Gerados)
  originPoints: DocumentHealthWasteOriginPoint[]; // Pontos de geração de RSS:
  packing: DocumentHealthWastePacking; // Acondicionamento interno - forma de acondicionamento
  quantity: number; // Quantidade de resíduos gerados
  unit: DocumentWasteUnit; // unidade de medida para quantidade de resíduos gerados
  frequency: DocumentWasteFrequency; // Frequência da quantidade de resíduos gerados
  collectionFrequency: DocumentFrequency; // COLETA EXTERNA (FREQUÊNCIA)
  treatment?: DocumentWasteTreatment; // Tratamento externo:
  group: Omit<DocumentHealthWasteClass, "GROUP_A" | "GROUP_E" | "GROUP_C">;
  companyDestination: DocumentWasteCompanyLicense;
  companiesDestination?: IDocumentCompanyLicense[]; // Disposição final / Destinação final
  companyTransport: DocumentWasteCompanyLicense;
  companiesTransport?: IDocumentCompanyLicense[];
  previousTreatment?: DocumentWasteTreatment; // Tratamento Prévio - Opções (AUTOCLAVE, MICROWAVE) *APENAS EM GRUPO A*
  trashCans?: IDocumentWasteTrashCan[]; // Número de Recipientes
}

export interface IDocumentHealthWasteClassA
  extends Omit<IDocumentHealthWasteBase, "group"> {
  putrescible?: IDocumentHealthWastePutrescible; // [GRUPO A] RESÍDUOS INFECTANTES DE RÁPIDA PUTREFAÇÃO  (ex. carcaças, peças anatômicas, tecidos e órgãos provenientes de cirurgia).
  explant?: IDocumentHealthWasteExplant; // [GRUPO A] RESÍDUO DE EXPLANTES (ex. próteses mamárias, cateteres, marcapassos, peças metálicas removidas dos pacientes)
  group: DocumentHealthWasteClass.GROUP_A;
}

export interface IDocumentHealthWasteClassE
  extends Omit<IDocumentHealthWasteBase, "group"> {
  chemicalDangerProcedures?: string; // [GRUPO E] PERFUROCORTANTES Risco Adicional Químico ou Quimioterápico -> Descrever o procedimento adotado no gerenciamento desse resíduo (acondicionamento, armazenamento, coleta externa, tecnologia de tratamento externo e destinação final:
  group: DocumentHealthWasteClass.GROUP_E;
}

export interface IDocumentHealthWasteGroupC {
  exists: boolean;
}

export interface IDocumentHealthWasteExplant {
  internalTreatment: boolean; // É realizado tratamento interno dos resíduos de explantes?
  deliveredToPatient: IDocumentCheckField; // Os explantes são entregues ao paciente quando solicitado?
  procedures: string; // Descrever o procedimento adotado no gerenciamento desse resíduo (acondicionamento, armazenamento, coleta externa - freqüência e responsável; tecnologia de tratamento externo e destinação final:
}

export interface IDocumentHealthWastePutrescible {
  coolingSystem: IDocumentHealthWastePutrescibleCoolingSystem; // Sistema de refrigeração
  descriptions: DocumentHealthWastePutrescibleDescription[]; // Descrever os resíduos de rápida putrefação gerados no estabelecimento:
}

export interface IDocumentHealthWastePutrescibleCoolingSystem {
  exists: boolean; // existe
  systemUsed: DocumentHealthWastePutrescibleCoolingSystem; // SE SIM, ESCLAREÇA QUAL O SISTEMA UTILIZADO (REFRIGERADOR, CÂMARA FRIA, FREEZER)
}

export interface IDocumentCheckField {
  exists: boolean; // Possui **?
  description: string; // De que forma?
}

export interface IDocumentHealthSanitizationEffluent {
  public?: boolean; // O efluente da lavagem dos recipientes e do abrigo é direcionado para a rede coletora de esgoto?
  destination?: string; // Se NÃO, indicar o local encaminhado para a rede coletora de esgoto.
}

export interface IDocumentHealthFloorDrain {
  exists: boolean; // Possui ralo?
  public: boolean; // O ralo é direcionado para a rede de esgoto?
}

export interface IDocumentHealthAdditionsParsed {
  sanitization: IDocumentHealthSanitizationParsed; // Limpeza e Higienização
  storage: IDocumentHealthAdditionsStorageParsed; // CARACTERÍSTICAS DO ABRIGO EXTERNO / LOCAL DE ARMAZENAMENTO
  homeCare: string; // Descrição dos procedimentos adotados nas etapas de acondicionamento, coleta e transporte de resíduos gerados na casa dos pacientes.
}

export interface IDocumentHealthSanitizationParsed {
  container: IDocumentHealthSanitizationItem;
  internalStorage: IDocumentHealthSanitizationItem;
  effluent: IDocumentHealthSanitizationEffluent; // O efluente da lavagem dos recipientes e do abrigo é direcionado para a rede coletora de esgoto?
}

export interface IDocumentHealthAdditionsStorageParsed {
  exists?: boolean; // Existe abrigo para armazenamento dos resíduos?
  wasteClasses?: DocumentHealthWasteClass[];
  wasteTypesIdentification?: boolean; // O abrigo possui identificação dos tipos de resíduos armazenados?
  wasteByType?: boolean; // O abrigo possui compartimentos específicos para cada resíduo armazenado?
  protectedFloorMaterials?: IDocumentHealthAdditionsQuestionBaseParsed &
    IDocumentHealthAdditionsQuestionDescriptionParsed<DocumentHealthAdditionsSanitizationMaterialsUsed>; // Os pisos e paredes são revestidos de material liso, lavável e impermeável? -- Cite o material utilizado:
  coverage?: IDocumentHealthAdditionsQuestionBaseParsed &
    IDocumentHealthAdditionsQuestionDescriptionParsed<DocumentHealthAdditionsSanitizationMaterialsUsed>; // Possui cobertura? -- Cite o material utilizado: {
  ventilation?: IDocumentHealthAdditionsQuestionBaseParsed &
    IDocumentHealthAdditionsQuestionDescriptionParsed<DocumentHealthAdditionsSanitizationVentilation>; // Tem ventilação? -- De que forma?
  illumination?: IDocumentHealthAdditionsQuestionBaseParsed &
    IDocumentHealthAdditionsQuestionDescriptionParsed<DocumentHealthAdditionsSanitizationVentilation>; // Tem iluminação? -- De que forma?
  doorLockSystem?: IDocumentHealthAdditionsQuestionBaseParsed &
    IDocumentHealthAdditionsQuestionDescriptionParsed<DocumentHealthAdditionsSanitizationDoorLockSystem>; // Possui porta com sistema de fechamento? -- De que forma?
  floorDrain?: IDocumentHealthAdditionsQuestionBaseParsed; // Limpeza e Higienização
  shared?: boolean; // O abrigo é de uso compartilhado com Sala de Utilidades?
  area?: number; // Qual é espaço destinado ao abrigo de RSS? (m2)
}

export interface IDocumentHealthAdditionsQuestionBaseParsed {
  type: DocumentHealthAdditionsQuestionType;
  exists: boolean; // Possui **?
  public?: boolean; // O ralo é direcionado para a rede de esgoto?
}

export interface IDocumentHealthAdditionsQuestionDescriptionParsed<
  T extends IDocumentHealthAdditionsQuestion["description"]
> {
  description?: T; // De que forma?
}

export interface IDocumentWasteTrashCan {
  originPoint: DocumentHealthWasteOriginPoint;
  quantity: number;
}

export interface IDocumentHealthStorageWasteGroups {
  group: DocumentHealthWasteClass;
  area?: number; // Qual é espaço destinado ao abrigo de RSS? (m2)
  drainageDuct?: boolean; // Canaletas para escoamento
  shelves?: number; // Número de prateleiras
  questions?: IDocumentHealthAdditionsQuestion[];
}

export interface IDocumentHealthAdditionsSecurity {
  accidentNotification?: boolean; // Serão feitas as notificações de acidentes aos órgãos competentes?
  outsourcedInsectsControl?: boolean; // POSSUI EMPRESA TERCEIRA PARA CONTROLE DE INSETOS, PRAGAS E ROEDORES?
  medicineDisposal?: string; // Descrever como ocorre o descarte dos medicamentos em desuso, conforme Lei Estadual 17211 de 03 de julho de 2012, Decreto Estadual 9213 de 23 de outubro de 2013 e Decreto Municipal 10995/2016 (SE NÃO GERAR MEDICAMENTOS, ESCREVER QUE NÃO GERA MEDICAMENTOS)
  outsourcedCleaningFrequency?: DocumentFrequency; // Efetuada Desinsetização / Desratização realizada por empresa especializada com Licença Sanitária vigente com periodicidade
  examsDescriptions?: string; // Descrição dos exames realizados pelo estabelecimento:
  vaccines?: DocumentHealthAdditionsSecurityVaccines[];
}

export interface IDocumentHealthAdditionsInternalCollection {
  transport?: DocumentHealthInternalCollectionTransport; // Equipamento utilizado para coleta interna / Os resíduos serão assim transportados até o Abrigo:
}
