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
  UNSPECIFIED = 17,
  ANIMAL_FEED = 18,
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
  WAREHOUSE = 14, // Almoxarifado
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
  UNSPECIFIED = 4, // - Não especificado
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

/**
 * - container: Lixeiras, carrinhos de coleta,  containers
 * - internalStorage: Abrigo de armazenamento interno (temporário) e/ou externo de resíduos
 */
export enum DocumentHealthSanitizationType {
  CONTAINER = "container",
  INTERNAL_STORAGE = "internalStorage",
}

export enum DocumentHealthAdditionsQuestionType {
  PROTECTED_FLOOR_MATERIALS = 0, //  Os pisos e paredes são revestidos de material liso, lavável e impermeável? -- Cite o material utilizado:
  COVERAGE = 1, // Possui cobertura? -- Cite o material utilizado:
  VENTILATION = 2, // Tem ventilação? -- De que forma?
  ILLUMINATION = 3, // Tem iluminação? -- De que forma?
  DOOR_LOCK_SYSTEM = 4, // Possui porta com sistema de fechamento? -- De que forma?
  FLOOR_DRAIN = 5, // Possui ralo?
  OUTLET = 6, // Tomada elétrica
  WATER_SUPPLY = 7, // Ponto de água para higienização do abrigo
  SEWAGE_SYSTEM = 8, // Rede de esgoto para coleta de águas residuárias
}

export enum DocumentHealthAdditionsSanitizationProducts {
  STANDARD = 0, // Produtos Saneantes (sabão, detergente, água sanitária)
  OTHER = 99, // Outros
}

export enum DocumentHealthAdditionsSanitizationProtectionGear {
  STANDARD = 0, // Bota de segurança, luva de borracha, óculos e máscara de proteção, avental (NR-32)
}

export enum DocumentHealthAdditionsSanitizationProcedure {
  STANDARD = 0, // Procedimento de Limpeza
}

export enum DocumentHealthAdditionsSanitizationMaterialsUsed {
  MASONRY = "masonry", // Alvenaria
  DRYWALL = "drywall", // Drywall
  WATERPROOF_MATERIAL = "waterproofMaterial", // Material impermeável
  TILE = "tile", // Telha
  TENT = "tent", // Tenda
}

export enum DocumentHealthAdditionsSanitizationVentilation {
  NATURAL = "natural", // Ventilação Natural
  ARTIFICIAL = "artificial", // Ventilação Artificial
}

export enum DocumentHealthAdditionsSanitizationDoorLockSystem {
  LOCK = "lock", // Tranca
  PADLOCK = "padlock", // Cadeado
  CHAIN = "chain", // Corrente
  KEY_LOCK = "keyLock", // Fechadura com chave
}

export enum DocumentHealthWasteOriginPoint {
  CONSULTATION_ROOMS = 0, // Consultórios
  SURGICAL_CENTER = 1, // Centro cirúrgico
  X_RAY_ROOM = 2, // Raio-X
  WARD = 3, // Enfermaria
  PHARMACY = 4, // Farmácia
  PROCEDURE_ROOM = 5, // Sala de Procedimentos
  DIALYSIS_ROOM = 6, // Sala de Hemodiálise
  COLLECTION_ROOM = 7, // Sala de coleta
  VACCINATION_ROOM = 8, // Sala de vacinação/aplicação
  STERILIZATION_ROOM = 9, // Sala de esterilização
  AUTOPSY_ROOM = 10, // Sala de necropsia
  DML = 11, // DML
  SLUICE_ROOM = 12, // Expurgo
  ADMINISTRATIVE = 13, // Administrativo
  BATHROOMS = 14, // Banheiros
  KITCHENETTE = 15, // Copa / Cozinha
  CAFETERIA = 16, // Refeitório / Restaurante
  STOCKROOM = 17, // Estoque/almoxarifado
  ON_SITE_STOCK = 18, // Estoque na empresa (aguardando destinação)
  SCHOOL = 19, // Sala de aula / escola
  INPATIENT = 20, // Internamento
  BEAUTY_SHOP = 21, // Salão de Beleza
  RADIOGRAPH_ROOM = 22, // Sala de Radiografia
  ATTENDANCE_ROOM = 23, // Sala de Atendimento
  COFFEE_SHOP = 24, // Sala de Café
  MAINTENANCE = 25, // Manutenção
  OPTICAL_LAB = 26, // Laboratório óptico
  PHYSICOCHEMICAL_LAB = 27, // Laboratório físico químico
  MICROBIOLOGY_LAB = 28, // Laboratório de microbiologia
  NURSING_LAB = 29, // Laboratório de enfermagem
  COURTYARD = 30, // Pátio
  GYMNASIUM = 31, // Ginásio
  EVENTS_ROOM = 32, // Sala/salão de Eventos
  BATH_AND_SHEARING = 33, // Banho e tosa
  IT_ROOM = 34, // Sala de TI - Tecnologia da Informação
  ALL_SECTORS = 35, // Todas os setores da empresa
  BAKERY = 36, // Confeitaria
  PODIATRY = 37, // Podologia
  RADIOLOGY = 38, // Radiologia
  AMBULATORY = 39, // Ambulatório
  WAREHOUSE = 40, // Almoxarifado
}

export enum DocumentHealthWastePacking {
  PEDAL_BIN_INFECTIOUS_WASTE = 0, // Lixeira com pedal e tampa. Saco de lixo branco leitoso identificado com nome e simbologia de resíduo infectante
  RIGID_CONTAINER_HAZARDOUS_WASTE = 1, // Recipiente rígido com tampa identificado com nome e simbologia de resíduo perigoso (químico)
  ORANGE_BIN_HAZARDOUS_WASTE = 2, // Lixeira com saco de lixo de cor laranja identificada com nome e simbologia de resíduo perigoso (químico)
  RIGID_BOX_SHARPS_WASTE = 3, // Recipiente rígido de papelão identificado com nome e simbologia de resíduo perfurocortante
  BLUE_BIN_RECYCLABLE_WASTE = 4, // Lixeira com saco de lixo de cor azul (ou transparente) identificada com nome e simbologia de resíduo reciclável
  BLACK_BIN_NON_RECYCLABLE_WASTE = 5, // Lixeira com saco de lixo de cor preta (ou transparente) identificada com nome e simbologia de resíduo não reciclável
}

export enum DocumentHealthWastePutrescibleCoolingSystem {
  REFRIGERATOR = 0, // Refrigerador ou frigobar
  COLD_ROOM = 1, // Câmara fria
  FREEZER = 2, // Freezer
  ICE_CONTAINER = 3, // Recipiente com Gelo
}

export enum DocumentHealthWastePutrescibleDescription {
  LIPOSUCTION_FAT = 0, // Gordura de lipoaspiração
  ORGANIC_TISSUES = 1, // Tecidos orgânicos
  BLOOD_BAGS = 2, // Bolsas de sangue
  ANIMAL_CADAVERS = 3, // Cadáveres de animais
  BLOOD_AND_DERIVATIVES = 4, // Sangue e derivados - oriundos de procedimentos e/ou cirurgia
  DRESSING_MATERIALS = 5, // Materiais de curativos
  EXCRETIONS_AND_SECRETIONS = 6, // Excreções e secreções
  CULTURES_AND_MEDIA = 7, // Culturas e/ou meios de cultura
  LIMBS_AND_ANATOMICAL_PIECES = 8, // Membros e peças anatômicas
  ORGANS = 9, // Órgãos
}

export enum DocumentCompanyServiceMode {
  CLINICAL = 1, // Clínico
  OUTPATIENT = 2, // Ambulatorial
  NURSING = 3, // De Enfermagem
  HOUSEHOLD = 4, // Domiciliares
  DENTAL = 5, // Odontológico
  DOCTOR_PEDIATRICIAN = 6, // Médico - Pediatra
  DOCTOR_GYNECOLOGIST = 7, // Médico - Ginecológico
  MEDICINE_DELIVERY = 8, // Entrega de Medicamentos
  COMMUNITY_EDUCATION = 9, // Educação em Comunidade
  ACUPUNCTURE = 10, // Acupuntura
  PHYSIOTHERAPY = 11, // Clínica Fisioterápica
  VETERINARY = 12, // Clínica Veterinária
  PHARMACY = 13, // Farmácias e Farmácias de Manipulação
  LABORATORY = 14, // Laboratório Clínico e Patológico
  MORGUE = 15, // Necrotérios; Funerárias e Laboratórios que realizam atividades de embalsamento tanatopraxia e somatoconservação
  TATTOO = 16, // Tatuagem, colocação de piercing e congêneres
  OTHER = 99, // Outros
}

export enum DocumentHealthInternalCollectionTransport {
  CART = 1, // Carrinho com rodas
  MANUAL = 2, // Remoção manual
}

export enum DocumentHealthAdditionsSecurityVaccines {
  HEPATITIS_B = 1, // HEPATITE B
  TETANUS = 2, // TÉTANO
  RUBELLA = 3, // RUBÉOLA
  OTHER = 99, // OUTRAS
}

export enum DocumentHealthWasteIdentification {
  GROUP_A1_1 = 1,
  GROUP_A1_2 = 2,
  GROUP_A1_3 = 3,
  GROUP_A1_4 = 4,
  GROUP_A1_5 = 5,
  GROUP_A1_6 = 6,
  GROUP_A1_7 = 7,
  GROUP_A2_1 = 8,
  GROUP_A3_1 = 9,
  GROUP_A4_1 = 10,
  GROUP_A4_2 = 11,
  GROUP_A4_3 = 12,
  GROUP_A4_4 = 13,
  GROUP_A4_5 = 14,
  GROUP_A4_6 = 15,
  GROUP_A4_7 = 16,
  GROUP_A4_8 = 17,
  GROUP_A5_1 = 18,
  GROUP_B_1 = 19,
  GROUP_B_2 = 20,
  GROUP_B_3 = 21,
  GROUP_B_4 = 22,
  GROUP_B_5 = 23,
  GROUP_D_1 = 24,
  GROUP_D_2 = 25,
  GROUP_D_3 = 26,
  GROUP_D_4 = 27,
  GROUP_D_5 = 28,
  GROUP_D_6 = 29,
  GROUP_E_1 = 30,
  GROUP_E_2 = 31,
  GROUP_E_3 = 32,
  GROUP_E_4 = 33,
  GROUP_E_5 = 34,
}
