import { IUser } from "../user/interface";
import { IWasteClassification } from "../waste-classification/interface";

export enum DataStatus {
  NONE = 0,
  DRAFT = 1,
  ENABLED = 2,
  DISABLED = 3,
  ARCHIVED = 4,
  BLOCKED = 5,
  OBSOLETE = 6,
  ERROR = 99,
}

export interface IDataQueryReq {
  index?: string;
  fields?: string[];
  limit?: number;
  offset?: string;
  asc?: boolean;
  from?: number;
  to?: number;
  pk?: string | number;
}

export interface IDataModel {
  id: string;
  status: DataStatus;
  createdAt: number;
  updatedAt?: number;
  ver?: number;
  refId?: string;
}

export interface IUserCrudModel extends IDataModel {
  createdBy: string;
  userId: string;
  updatedBy?: string;
  holdingId?: string;
}

// document/enum.ts
export enum DocumentStatus {
  DRAFT = 0, // RASCUNHO
  SENT = 1, // ENVIADO
  REVIEW = 2, // ANÁLISE
  SIGN = 3, // ASSINAR
  COMPLETED = 4, // CONCLUÍDO
  REJECTED = 99, // CORRIGIR (Reprovado)
}

export enum DocumentWasteFrequency {
  DAY = 0,
  WEEK = 1,
  MONTH = 2,
  YEAR = 3,
  HALF_YEARLY = 6, // Semestral
}

export enum DocumentFrequency {
  DAILY = 0,
  WEEKLY = 1,
  MONTHLY = 2,
  YEARLY = 3,
  SPORADIC = 4,
  HALF_YEARLY = 5, // Semestral
  NONE = 99, // Campo vazio
}

export enum DocumentWasteUnit {
  KG = 0,
  TON = 1,
  UN = 2,
  L = 3,
  M3 = 4,
}

export enum DocumentWasteStorage {
  COVERED_DRUM_ON_IMPERMEABLE_FLOOR = 0,
  UNCOVERED_DRUM_ON_IMPERMEABLE_FLOOR = 1,
  COVERED_DRUM_ON_GROUND = 2,
  UNCOVERED_DRUM_ON_GROUND = 3,
  COVERED_BULK_ON_IMPERMEABLE_FLOOR = 4,
  UNCOVERED_BULK_ON_IMPERMEABLE_FLOOR = 5,
  COVERED_BULK_ON_GROUND = 6,
  UNCOVERED_BULK_ON_GROUND = 7,
  COVERED_CONTAINER_WITH_COVER = 8,
  UNCOVERED_CONTAINER_WITHOUT_COVER = 9,
  TANK_WITH_CONTAINMENT_BASIN = 10,
  TANK_WITHOUT_CONTAINMENT_BASIN = 11,
  COVERED_CAN_ON_IMPERMEABLE_FLOOR = 12,
  UNCOVERED_CAN_ON_IMPERMEABLE_FLOOR = 13,
  COVERED_CAN_ON_GROUND = 14,
  UNCOVERED_CAN_ON_GROUND = 15,
  LINED_LAGOON = 16,
  UNLINED_LAGOON = 17,
  COVERED_CONTAINER = 18,
  UNCOVERED_CONTAINER = 19,
  COVERED_TRASH = 20,
  UNCOVERED_TRASH = 21,
  COVERED_TRASH_WATERPROOF_FLOOR = 22, // Lixeira em piso impermeável, área coberta
  UNCOVERED_TRASH_WATERPROOF_FLOOR = 23, // Lixeira em piso impermeável, área descoberta
  COVERED_CONTAINER_WATERPROOF_FLOOR = 24, // Contêiner em piso impermeável, área coberta
  UNCOVERED_CONTAINER_WATERPROOF_FLOOR = 25, // Contêiner em piso impermeável, área descoberta
}

export enum DocumentWastePacking {
  NO_GARBAGE_BAG = 0,
  BLUE_RECYCLABLE_GARBAGE_BAG = 1,
  YELLOW_RECYCLABLE_GARBAGE_BAG = 2,
  GREEN_RECYCLABLE_GARBAGE_BAG = 3,
  RED_RECYCLABLE_GARBAGE_BAG = 4,
  BROWN_RECYCLABLE_GARBAGE_BAG = 5,
  ORANGE_HAZARDOUS_GARBAGE_BAG = 6,
  BLACK_NON_RECYCLABLE_GARBAGE_BAG = 7,
  OIL_BOX = 8, // Caixa de Gordura
  CSAO = 9, // Caixa Separadora Água/Óleo
  BARREL = 10, // Tambor
  LARGE_CONTAINER = 11, // Bombona
  CARDBOARD_BOX = 12, // Caixa de papelão
  HARD_CONTAINER = 13, // Recipiente rígido
}

export enum DocumentWasteTreatment {
  LANDFILL = 0,
  AUTOCLAVE = 1,
  BLENDING_FOR_COPROCESSING = 2,
  COMPOSTING = 3,
  COPROCESSING = 4,
  LAMP_DECONTAMINATION = 5,
  EDUCATIONAL_PURPOSES = 6,
  GASIFICATION = 7,
  INCINERATION = 8,
  MICROWAVE = 9,
  RECYCLING = 10,
  ENERGY_RECOVERY = 11,
  RE_REFINING = 12,
  EFFLUENT_TREATMENT = 13,
  THERMAL_TREATMENT = 14,
  AGRICULTURAL_USE = 15,
  STOCK = 16,
  OTHER = 99,
}

export enum DocumentWasteOriginPoint {
  PRODUCTION = 0,
  MAINTENANCE = 1,
  ADMINISTRATIVE = 2,
  BATHROOMS = 3,
  KITCHEN_CAFETERIA = 4,
  OTHER_TEXTOPTION = 5,
  STOCK = 6,
  RESTAURANT = 7,
  PRODUCTION_IT = 8,
  ALL_SECTORS = 9,
  LABORATORY = 10, // Laboratório
  OIL_BOX = 11, // Caixa de Gordura
  CSAO = 12, // Caixa Separadora Água/Óleo
  OFFICE = 13, // Escritório / Consultório
}

export enum DocumentWasteClass {
  CLASS1 = 0,
  CLASS2A = 1,
  CLASS2B = 2,
}

export enum DocumentWasteAction {
  ADD = "Adicionado",
  UPDATE = "Atualizado",
  REMOVE = "Removido",
}

export enum DocumentRefectoryPrepare {
  LOCAL = 0,
  OUTSOURCED = 1,
  NONE = 3,
}

export enum DocumentWasteWeekDays {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export enum DocumentWasteCompanyLicense {
  CITY_HALL = 0,
  OWN_BUSINESS = 1,
  OUTSOURCED = 2,
  NONE = 99, // Campo vazio
}

export enum DocumentHistoryType {
  PROCESS = 0,
  WAIT = 1,
  FINISH = 2,
  ERROR = 3,
}

export enum Steps {
  COMPANY = "company",
  RESPONSIBLE = "responsibles",
  WASTES = "wastes",
  ATTACHMENTS = "attachments",
}

export enum IDocumentContainmentMeasures {
  NO_CONTAINMENT = 0, // Sem contenção
  CONTAINMENT_TANK = 1, // Bacia de Contenção
  EMERGENCY_KIT = 2, // Kit de emergencia ambiental
  CONTAINER_IBC = 3, // Container IBC
  CONTAINMENT_PALLET = 4, // Palete de contenção
}

export enum IDocumentWasteInternalTransportation {
  WASTE_CART = 0, // Carrinho com rodas
  TRASH = 1, // Lixeira com rodas
  CONTAINER = 2, // Container com rodas
  TRASH_BAG = 3, // Saco de lixo - manual
}

export enum IDocumentWasteContainmentAccident {
  ISOLATION_AFFECTED_AREA = 0, // - Isolamento da área afetada
  IMMEDIATE_NOTIFICATION = 1, // - Notificação imediata das autoridades competentes
  USE_EQUIPMENT = 2, // - Utilização de Equipamentos de Proteção Individual (EPIs)
  ABSORBENT_MATERIALS_OR_FIXED_BARRIERS = 3, // - Utilização de materiais absorventes ou barreiras fixas
}

export enum DocumentWasteAttributes { // Caracterização do efluente bruto
  ChlorineEffluent = 0, // Efluente do clorador de água,
  CarWashEffluent = 1, // Efluente de lavagem de veículos automotores
  IndustrialEffluent = 2, // Efluente do processo industrial
  WasteWater = 3, // Esgoto Sanitário
}

export enum DocumentWasteTreatmentSystems {
  CONTAINMENT_BASIN = 0, // Bacia de contenção,
  CSAO = 1, // Caixa separadora de água e óleo
  INDEPENDENT_ETE = 2, // Estação de tratamento do esgoto própria,
  OUTSOURCED_ETE = 3, // Estação de tratamento do esgoto terceirado
  SEPTIC_TANK = 4, // Fossa séptica
  PUBLIC = 5, // Rede pública
  SSAO = 6, // Sistema separador de água e óleo
}

export enum DocumentWasteUsedHardwares {
  CONTAINMENT_BASIN = 0, // Bacia de contenção,
  CSAO = 1, // Caixa separadora de água e óleo
  DECANTER_FILTER = 2, // Filtro decantador
  FILTER_SEPTIC_TANK = 3, // Fossa, filtro e sumidouro
  PUBLIC = 4, // Rede pública
}

export enum DocumentWasteDestination {
  INDEPENDENT_ETE = 0, // Estação de tratamento do esgoto própria,
  OUTSOURCED_ETE = 1, // Estação de tratamento do esgoto terceirado
  SOIL_INFILTRATION = 2, // Infiltração em solo
  PUBLIC = 3, // Rede pública
}

export enum DocumentWasteImprovementActions {
  KEEP_OIL_RECIPIENTS = 0, // Manter os recipientes do óleo de cozinha usado em pallets de contenção
  KEEP_TRASH_PROTECTED = 1, // Manter todas as lixeiras em local coberto e piso impermeável (que não seja grama, areia, terra, etc.)
  KEEP_TRASH_HYGIENE_ROUTINE = 2, // Manter uma rotina de higienização das lixeiras
  ORGANIZE_TRASH_LOCALIZATION = 3, // Organizar as lixeiras para serem dispostas somente nos locais em que aqueles resíduos são gerados.
  PATTERN_TRASH_IDENTIFICATION = 4, // Padronizar a identificação de todas as lixeiras,
  VERIFY_TRASH_BAG_CORRECT_COLORS = 5, // Verificar se todos os sacos de lixo estão nas cores correspondentes
}

export enum DocumentCompanyPeoplesInvolved {
  EMPLOYEES = 0, // funcionários
  CUSTOMERS = 1, // clientes
  STUDENTS = 2, // estudantes
  OTHERS = 3, // outras pessoas
}

export enum DocumentWasteExternalPackaging {
  WASTE_SHELTER = 0, // Abrigo de resíduos
  BUCKET = 1, // Caçamba (s)
  WASTE_PLANT = 2, // Central de resíduos
  CONTAINER = 3, // Contâiner (es)
  EXTERNAL_BINS = 4, // Lixeiras externas
}

export enum DocumentWasteDangers {
  ACCIDENT = 0, // Acidente ambiental
  SOIL_CONTAMINATION = 1, // Contaminação do solo
  WATER_CONTAMINATION = 2, // Contaminação da água
}

export enum DocumentApprovedPreventionActions {
  LEAK_CONTAINMENT = 0, // Contenção do vazamento ou derramamento - materiais absorventes ou barreiras fixas
  SAFE_REMOVAL = 1, // Remoção segura dos resíduos contaminados
  AREA_DECONTAMINATION = 2, // Limpeza e descontaminação da área afetada (destinação correta)
  EMPLOYEES_TRAINING = 3, // Treinamento e capacitação contínua dos trabalhadores
  ACCIDENT_INVESTIGATION = 4, // Investigação de acidentes e Registro de ocorrências
}

export enum DocumentHealthWasteClass {
  GROUP_A = 0, // GRUPO A - Infectantes
  GROUP_B = 1, // GRUPO B - Químicos ou Quimioterápicos
  GROUP_C = 2, // GRUPO C - Radioativos
  GROUP_D_NR = 3, // GRUPO D - Não Reciclável
  GROUP_D_R = 4, // GRUPO D - Reciclável
  GROUP_E = 5, // GRUPO E - PERFUROCORTANTES
}

// document/interface.ts

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
  healthWastes?: IDocumentHealthWaste[];
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
  healthProceduresDescription?: string; // Descrição dos tipos de procedimentos, exames e serviços realizados no local (PGRSS)
  healthAppointmentsByDay?: number; // N.º de atendimentos/dia (PGRSS)
  foundingDate?: number; // data de fundação
}

export interface IAddress {
  zip: string;
  street: string;
  city: string;
  state: string;
  number: number;
  neighborhood: string;
  complement?: string;
}

export interface ICnae {
  id: string;
  desc: string;
}

export interface IDocumentResponsible {
  name?: string;
  position?: string; // cargo
  taxpayerNumber?: string; // CPF
  identityNumber?: string; // RG
  email?: string;
  landline?: string; // tel fixo
  phone?: string;
  address?: IAddress;
  professionalClass?: IDocumentProfessionalClass;
}

export interface IDocumentResponsibles {
  legal?: IDocumentResponsible; // responsavel legal
  techinical?: IDocumentResponsible; // responsavel técnico
  implementation?: IDocumentResponsible;
  elaboration?: IDocumentResponsible;
}

export interface IDocumentProfessionalClass {
  identity: string; // N.° de registro no órgão de classe profissional
  institution: string; // Órgão de Registro de Classe Profissional
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
  techinical?: IDocumentResponsible;
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
  content?: string; //Conteúdos abordados
  managementActions?: string; // AÇÕES DE GERENCIAMENTO DE RESÍDUOS SÓLIDOS
  goalsAndJustifications?: string; // OBJETIVO E JUSTIFICATIVA DO PLANO DE GERENCIAMENTO DE RESÍDUOS SÓLIDOS
  legislation?: string; // LEGISLAÇÃO UTILIZADA
  employeeAwareness?: string; // CAPACITAÇÃO E SENSIBILIZAÇÃO DOS COLABORADORES ACERCA DAS AÇÕES REFERENTES AO PGRS
  goals?: IDocumentApprovedGoals; // METAS E PROCEDIMENTOS VISANDO A NÃO GERAÇÃO, A REDUÇÃO, A REUTILIZAÇÃO E A RECICLAGEM DOS RESÍDUOS
  wastagePointsDescription?: string; // Descrever pontos de desperdício, perdas, não segregação, formas não adequadas de acondicionamentos, armazenamento, transporte, tratamento e destinação final dos resíduos ou outras informações que apontem discordância com a legislação vigente.
  recyclingProcedure?: string; // PROCEDIMENTOS VISANDO: REDUZIR A GERAÇÃO, A REUTILIZAÇÃO, A RECICLAGEM E A PERICULOSIDADE DE RESÍDUOS
  effluentOtherInfo?: string; // Outras informações de Efluentes
  preventionActions?: DocumentApprovedPreventionActions[]; // AÇÕES PREVENTIVAS E CORRETIVAS A SEREM EXECUTADAS EM SITUAÇÕES DE GERENCIAMENTO INCORRETO OU ACIDENTES
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

export type IDocumentHealthWaste =
  | IDocumentHealthWasteBase
  | IDocumentHealthWasteClassA
  | IDocumentHealthWasteClassE
  | IDocumentHealthWasteClassC;

export interface IDocumentHealthWasteBase {
  id: string;
  names?: string[]; // Id (Descrição) do Resíduo seguindo a tabela de classificação de resíduos do ibama (Resíduos Gerados)
  classificationIds?: string[]; // Id (Descrição) do Resíduo seguindo a tabela de classificação de resíduos do ibama (Resíduos Gerados)
  originPoint: DocumentWasteOriginPoint; // Pontos de geração de RSS:
  packing: DocumentWastePacking; // Acondicionamento interno
  quantity: number; // Quantidade de resíduos gerados
  unit: DocumentWasteUnit; // unidade de medida para quantidade de resíduos gerados
  frequency: DocumentWasteFrequency; // Frequência da quantidade de resíduos gerados
  collectionFrequency: DocumentFrequency; // TODO: verificar se são os mesmos
  treatment?: DocumentWasteTreatment; // Tratamento externo:
  group: Omit<DocumentHealthWasteClass, "GROUP_A" | "GROUP_E" | "GROUP_C">;
  companyDestination: DocumentWasteCompanyLicense;
  companiesDestination?: IDocumentCompanyLicense[]; // Disposição final / Destinação final
  companyTransport: DocumentWasteCompanyLicense;
  companiesTransport?: IDocumentCompanyLicense[];
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

export interface IDocumentHealthWasteClassC
  extends Pick<IDocumentHealthWasteBase, "id"> {
  group: DocumentHealthWasteClass.GROUP_C;
}

export interface IDocumentHealthWasteExplant {
  internalTreatment: boolean; // É realizado tratamento interno dos resíduos de explantes?
  deliveredToPatient: IDocumentCheckField; // Os explantes são entregues ao paciente quando solicitado?
  procedures: string; // Descrever o procedimento adotado no gerenciamento desse resíduo (acondicionamento, armazenamento, coleta externa - freqüência e responsável; tecnologia de tratamento externo e destinação final:
}

export interface IDocumentHealthWastePutrescible {
  coolingSystem: IDocumentCheckField; // Sistema de refrigeração
  description: string; // Descrever os resíduos de rápida putrefação gerados no estabelecimento:
  packing: string; // Acondicionamento interno
}

export interface IDocumentCheckField {
  exists: boolean; // Possui **?
  description: string; // De que forma?
}

export interface IGMapsCoordinates {
  lat: number;
  lng: number;
}

export interface ILocation {
  neighborhood?: string;
  cep: string;
  city?: string;
  street: string;
  state: string;
  coordinates?: IGMapsCoordinates;
}

export interface IRenderReq {
  document: Partial<IDocument>;
  classifications: IWasteClassification[];
  cnaes: ICnae[];
  location?: ILocation;
  techinical: Partial<IUser>;
  isApproved: boolean;
}
