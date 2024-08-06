import {
  DocumentWasteOriginPoint,
  DocumentApprovedPreventionActions,
  DocumentFrequency,
  DocumentHistoryType,
  DocumentRefectoryPrepare,
  DocumentWasteAttributes,
  DocumentWasteClass,
  DocumentWasteCompanyLicense,
  DocumentWasteDangers,
  DocumentWasteDestination,
  DocumentWasteExternalPackaging,
  DocumentWasteFrequency,
  DocumentWasteImprovementActions,
  DocumentWastePacking,
  DocumentWasteStorage,
  DocumentWasteTreatment,
  DocumentWasteTreatmentSystems,
  DocumentWasteUnit,
  DocumentWasteUsedHardwares,
  DocumentWasteWeekDays,
  IDocumentWasteContainmentAccident,
  IDocumentWasteInternalTransportation,
} from "./types/document/interface";

export const LOCALE = "pt-BR";
export const DRAFT_TEXT = "PGRS iniciado";
export const DRAFT_DESCRIPTION = "Documento em rascunho";

export const COMPLETED_TEXT = "PGRS aprovado";
export const COMPLETED_DESCRIPTION =
  "Documento disponível para download e impressão";

export const REVIEW_TEXT = "PGRS em análise";
export const REVIEW_DESCRIPTION =
  "Documento em análise pelo responsável técnico";

export const SENT_TEXT = "PGRS enviado";
export const SENT_DESCRIPTION = "Documento enviado para o responsável técnico";

export const REJECTED_TEXT = "Ação necessária";
export const REJECTED_DESCRIPTION = "Documento com pendências de ajuste";

export const DOCUMENT_FREQUENCY_0 = "Diária";
export const DOCUMENT_FREQUENCY_1 = "Semanal";
export const DOCUMENT_FREQUENCY_2 = "Mensal";
export const DOCUMENT_FREQUENCY_3 = "Anual";
export const DOCUMENT_FREQUENCY_4 = "Esporádica";
export const DOCUMENT_FREQUENCY = (value: DocumentFrequency) => {
  switch (value) {
    case DocumentFrequency.DAILY:
      return DOCUMENT_FREQUENCY_0;
    case DocumentFrequency.WEEKLY:
      return DOCUMENT_FREQUENCY_1;
    case DocumentFrequency.MONTHLY:
      return DOCUMENT_FREQUENCY_2;
    case DocumentFrequency.YEARLY:
      return DOCUMENT_FREQUENCY_3;
    case DocumentFrequency.SPORADIC:
      return DOCUMENT_FREQUENCY_4;
    default:
      return `[DOCUMENT_FREQUENCY_${value}]`;
  }
};

export const DOCUMENT_WASTE_UNIT_0 = "Kg";
export const DOCUMENT_WASTE_UNIT_1 = "Ton";
export const DOCUMENT_WASTE_UNIT_2 = "Un";
export const DOCUMENT_WASTE_UNIT_3 = "L";
export const DOCUMENT_WASTE_UNIT_4 = "M³";
export const DOCUMENT_WASTE_UNIT = (value: DocumentWasteUnit) => {
  switch (value) {
    case DocumentWasteUnit.KG:
      return DOCUMENT_WASTE_UNIT_0;
    case DocumentWasteUnit.TON:
      return DOCUMENT_WASTE_UNIT_1;
    case DocumentWasteUnit.UN:
      return DOCUMENT_WASTE_UNIT_2;
    case DocumentWasteUnit.L:
      return DOCUMENT_WASTE_UNIT_3;
    case DocumentWasteUnit.M3:
      return DOCUMENT_WASTE_UNIT_4;
    default:
      return `[DOCUMENT_WASTE_UNIT_${value}]`;
  }
};

export const DOCUMENT_WASTE_FREQUENCY_0 = "Dia";
export const DOCUMENT_WASTE_FREQUENCY_1 = "Semana";
export const DOCUMENT_WASTE_FREQUENCY_2 = "Mês";
export const DOCUMENT_WASTE_FREQUENCY_3 = "Ano";
export const DOCUMENT_WASTE_FREQUENCY = (value: DocumentWasteFrequency) => {
  switch (value) {
    case DocumentWasteFrequency.DAY:
      return DOCUMENT_WASTE_FREQUENCY_0;
    case DocumentWasteFrequency.WEEK:
      return DOCUMENT_WASTE_FREQUENCY_1;
    case DocumentWasteFrequency.MONTH:
      return DOCUMENT_WASTE_FREQUENCY_2;
    case DocumentWasteFrequency.YEAR:
      return DOCUMENT_WASTE_FREQUENCY_3;
    default:
      return `[DOCUMENT_WASTE_FREQUENCY_${value}]`;
  }
};

export const DOCUMENT_WASTE_STORAGE_0 =
  "Tambor em piso impermeável, área coberta";
export const DOCUMENT_WASTE_STORAGE_1 =
  "Tambor em piso impermeável, área descoberta";
export const DOCUMENT_WASTE_STORAGE_2 = "Tambor em solo, área coberta";
export const DOCUMENT_WASTE_STORAGE_3 = "Tambor em solo, área descoberta";
export const DOCUMENT_WASTE_STORAGE_4 =
  "A granel em piso impermeável, área coberta";
export const DOCUMENT_WASTE_STORAGE_5 =
  "A granel em piso impermeável, área descoberta";
export const DOCUMENT_WASTE_STORAGE_6 = "A granel em solo, área coberta";
export const DOCUMENT_WASTE_STORAGE_7 = "A granel em solo, área descoberta";
export const DOCUMENT_WASTE_STORAGE_8 = "Caçamba com cobertura";
export const DOCUMENT_WASTE_STORAGE_9 = "Caçamba sem cobertura";
export const DOCUMENT_WASTE_STORAGE_10 = "Tanque com bacia de contenção";
export const DOCUMENT_WASTE_STORAGE_11 = "Tanque sem bacia de contenção";
export const DOCUMENT_WASTE_STORAGE_12 =
  "Bombona em piso impermeável, área coberta";
export const DOCUMENT_WASTE_STORAGE_13 =
  "Bombona em piso impermeável, área descoberta";
export const DOCUMENT_WASTE_STORAGE_14 = "Bombona em solo, área coberta";
export const DOCUMENT_WASTE_STORAGE_15 = "Bombona em solo, área descoberta";
export const DOCUMENT_WASTE_STORAGE_16 = "Lagoa com impermeabilização";
export const DOCUMENT_WASTE_STORAGE_17 = "Lagoa sem impermeabilização";
export const DOCUMENT_WASTE_STORAGE = (value: DocumentWasteStorage) => {
  switch (value) {
    case DocumentWasteStorage.COVERED_DRUM_ON_IMPERMEABLE_FLOOR:
      return DOCUMENT_WASTE_STORAGE_0;
    case DocumentWasteStorage.UNCOVERED_DRUM_ON_IMPERMEABLE_FLOOR:
      return DOCUMENT_WASTE_STORAGE_1;
    case DocumentWasteStorage.COVERED_DRUM_ON_GROUND:
      return DOCUMENT_WASTE_STORAGE_2;
    case DocumentWasteStorage.UNCOVERED_DRUM_ON_GROUND:
      return DOCUMENT_WASTE_STORAGE_3;
    case DocumentWasteStorage.COVERED_BULK_ON_IMPERMEABLE_FLOOR:
      return DOCUMENT_WASTE_STORAGE_4;
    case DocumentWasteStorage.UNCOVERED_BULK_ON_IMPERMEABLE_FLOOR:
      return DOCUMENT_WASTE_STORAGE_5;
    case DocumentWasteStorage.COVERED_BULK_ON_GROUND:
      return DOCUMENT_WASTE_STORAGE_6;
    case DocumentWasteStorage.UNCOVERED_BULK_ON_GROUND:
      return DOCUMENT_WASTE_STORAGE_7;
    case DocumentWasteStorage.COVERED_CONTAINER_WITH_COVER:
      return DOCUMENT_WASTE_STORAGE_8;
    case DocumentWasteStorage.UNCOVERED_CONTAINER_WITHOUT_COVER:
      return DOCUMENT_WASTE_STORAGE_9;
    case DocumentWasteStorage.TANK_WITH_CONTAINMENT_BASIN:
      return DOCUMENT_WASTE_STORAGE_10;
    case DocumentWasteStorage.TANK_WITHOUT_CONTAINMENT_BASIN:
      return DOCUMENT_WASTE_STORAGE_11;
    case DocumentWasteStorage.COVERED_CAN_ON_IMPERMEABLE_FLOOR:
      return DOCUMENT_WASTE_STORAGE_12;
    case DocumentWasteStorage.UNCOVERED_CAN_ON_IMPERMEABLE_FLOOR:
      return DOCUMENT_WASTE_STORAGE_13;
    case DocumentWasteStorage.COVERED_CAN_ON_GROUND:
      return DOCUMENT_WASTE_STORAGE_14;
    case DocumentWasteStorage.UNCOVERED_CAN_ON_GROUND:
      return DOCUMENT_WASTE_STORAGE_15;
    case DocumentWasteStorage.LINED_LAGOON:
      return DOCUMENT_WASTE_STORAGE_16;
    case DocumentWasteStorage.UNLINED_LAGOON:
      return DOCUMENT_WASTE_STORAGE_17;
    default:
      return `[DOCUMENT_WASTE_STORAGE_${value}]`;
  }
};

export const DOCUMENT_WASTE_PACKING_0 = "Sem saco de lixo";
export const DOCUMENT_WASTE_PACKING_1 =
  "Saco de lixo azul com reciclável simbologia";
export const DOCUMENT_WASTE_PACKING_2 =
  "Saco de lixo amarelo com reciclável simbologia";
export const DOCUMENT_WASTE_PACKING_3 =
  "Saco de lixo verde com reciclável simbologia";
export const DOCUMENT_WASTE_PACKING_4 =
  "Saco de lixo vermelho com reciclável simbologia";
export const DOCUMENT_WASTE_PACKING_5 =
  "Saco de lixo marrom com reciclável simbologia";
export const DOCUMENT_WASTE_PACKING_6 =
  "Saco de lixo laranja com simbologia de resíduo perigoso";
export const DOCUMENT_WASTE_PACKING_7 =
  "Saco de lixo preto com não reciclável simbologia";
export const DOCUMENT_WASTE_PACKING = (value: DocumentWastePacking) => {
  switch (value) {
    case DocumentWastePacking.NO_GARBAGE_BAG:
      return DOCUMENT_WASTE_PACKING_0;
    case DocumentWastePacking.BLUE_RECYCLABLE_GARBAGE_BAG:
      return DOCUMENT_WASTE_PACKING_1;
    case DocumentWastePacking.YELLOW_RECYCLABLE_GARBAGE_BAG:
      return DOCUMENT_WASTE_PACKING_2;
    case DocumentWastePacking.GREEN_RECYCLABLE_GARBAGE_BAG:
      return DOCUMENT_WASTE_PACKING_3;
    case DocumentWastePacking.RED_RECYCLABLE_GARBAGE_BAG:
      return DOCUMENT_WASTE_PACKING_4;
    case DocumentWastePacking.BROWN_RECYCLABLE_GARBAGE_BAG:
      return DOCUMENT_WASTE_PACKING_5;
    case DocumentWastePacking.ORANGE_HAZARDOUS_GARBAGE_BAG:
      return DOCUMENT_WASTE_PACKING_6;
    case DocumentWastePacking.BLACK_NON_RECYCLABLE_GARBAGE_BAG:
      return DOCUMENT_WASTE_PACKING_7;
    default:
      return `[DOCUMENT_WASTE_PACKING_${value}]`;
  }
};

export const DOCUMENT_WASTE_TREATMENT_0 = "Aterro";
export const DOCUMENT_WASTE_TREATMENT_1 = "Autoclave";
export const DOCUMENT_WASTE_TREATMENT_2 = "Blendagem para Coprocessamento";
export const DOCUMENT_WASTE_TREATMENT_3 = "Compostagem";
export const DOCUMENT_WASTE_TREATMENT_4 = "Coprocessamento";
export const DOCUMENT_WASTE_TREATMENT_5 = "Descontaminação de Lâmpadas";
export const DOCUMENT_WASTE_TREATMENT_6 = "Fins Didáticos";
export const DOCUMENT_WASTE_TREATMENT_7 = "Gaseificação";
export const DOCUMENT_WASTE_TREATMENT_8 = "Incineração";
export const DOCUMENT_WASTE_TREATMENT_9 = "Microondas";
export const DOCUMENT_WASTE_TREATMENT_10 = "Reciclagem";
export const DOCUMENT_WASTE_TREATMENT_11 = "Recuperação energética";
export const DOCUMENT_WASTE_TREATMENT_12 = "Rerrefino";
export const DOCUMENT_WASTE_TREATMENT_13 = "Tratamento de Efluentes";
export const DOCUMENT_WASTE_TREATMENT_14 = "Tratamento Térmico";
export const DOCUMENT_WASTE_TREATMENT_15 = "Uso Agrícola";
export const DOCUMENT_WASTE_TREATMENT_16 = "Estoque Próprio";
export const DOCUMENT_WASTE_TREATMENT = (value: DocumentWasteTreatment) => {
  switch (value) {
    case DocumentWasteTreatment.LANDFILL:
      return DOCUMENT_WASTE_TREATMENT_0;
    case DocumentWasteTreatment.AUTOCLAVE:
      return DOCUMENT_WASTE_TREATMENT_1;
    case DocumentWasteTreatment.BLENDING_FOR_COPROCESSING:
      return DOCUMENT_WASTE_TREATMENT_2;
    case DocumentWasteTreatment.COMPOSTING:
      return DOCUMENT_WASTE_TREATMENT_3;
    case DocumentWasteTreatment.COPROCESSING:
      return DOCUMENT_WASTE_TREATMENT_4;
    case DocumentWasteTreatment.LAMP_DECONTAMINATION:
      return DOCUMENT_WASTE_TREATMENT_5;
    case DocumentWasteTreatment.EDUCATIONAL_PURPOSES:
      return DOCUMENT_WASTE_TREATMENT_6;
    case DocumentWasteTreatment.GASIFICATION:
      return DOCUMENT_WASTE_TREATMENT_7;
    case DocumentWasteTreatment.INCINERATION:
      return DOCUMENT_WASTE_TREATMENT_8;
    case DocumentWasteTreatment.MICROWAVE:
      return DOCUMENT_WASTE_TREATMENT_9;
    case DocumentWasteTreatment.RECYCLING:
      return DOCUMENT_WASTE_TREATMENT_10;
    case DocumentWasteTreatment.ENERGY_RECOVERY:
      return DOCUMENT_WASTE_TREATMENT_11;
    case DocumentWasteTreatment.RE_REFINING:
      return DOCUMENT_WASTE_TREATMENT_12;
    case DocumentWasteTreatment.EFFLUENT_TREATMENT:
      return DOCUMENT_WASTE_TREATMENT_13;
    case DocumentWasteTreatment.THERMAL_TREATMENT:
      return DOCUMENT_WASTE_TREATMENT_14;
    case DocumentWasteTreatment.AGRICULTURAL_USE:
      return DOCUMENT_WASTE_TREATMENT_15;
    case DocumentWasteTreatment.STOCK:
      return DOCUMENT_WASTE_TREATMENT_16;
    default:
      return `[DOCUMENT_WASTE_TREATMENT_${value}]`;
  }
};

export const DOCUMENT_WASTE_ORIGIN_POINT_0 = "Produção";
export const DOCUMENT_WASTE_ORIGIN_POINT_1 = "Manutenção";
export const DOCUMENT_WASTE_ORIGIN_POINT_2 = "Administrativo";
export const DOCUMENT_WASTE_ORIGIN_POINT_3 = "Banheiros";
export const DOCUMENT_WASTE_ORIGIN_POINT_4 = "Copa/Refeitório";
export const DOCUMENT_WASTE_ORIGIN_POINT_5 = "Outro";
export const DOCUMENT_WASTE_ORIGIN_POINT_6 = "Estoque";
export const DOCUMENT_WASTE_ORIGIN_POINT_7 = "Restaurante";
export const DOCUMENT_WASTE_ORIGIN_POINT_8 = "Manutenção - Informática";
export const DOCUMENT_WASTE_ORIGIN_POINT_9 = "Todos os setores da empresa";
export const DOCUMENT_WASTE_ORIGIN_POINT = (
  value: DocumentWasteOriginPoint
) => {
  switch (value) {
    case DocumentWasteOriginPoint.PRODUCTION:
      return DOCUMENT_WASTE_ORIGIN_POINT_0;
    case DocumentWasteOriginPoint.MAINTENANCE:
      return DOCUMENT_WASTE_ORIGIN_POINT_1;
    case DocumentWasteOriginPoint.ADMINISTRATIVE:
      return DOCUMENT_WASTE_ORIGIN_POINT_2;
    case DocumentWasteOriginPoint.BATHROOMS:
      return DOCUMENT_WASTE_ORIGIN_POINT_3;
    case DocumentWasteOriginPoint.KITCHEN_CAFETERIA:
      return DOCUMENT_WASTE_ORIGIN_POINT_4;
    case DocumentWasteOriginPoint.OTHER_TEXTOPTION:
      return DOCUMENT_WASTE_ORIGIN_POINT_5;
    case DocumentWasteOriginPoint.STOCK:
      return DOCUMENT_WASTE_ORIGIN_POINT_6;
    case DocumentWasteOriginPoint.RESTAURANT:
      return DOCUMENT_WASTE_ORIGIN_POINT_7;
    case DocumentWasteOriginPoint.PRODUCTION_IT:
      return DOCUMENT_WASTE_ORIGIN_POINT_8;
    case DocumentWasteOriginPoint.ALL_SECTORS:
      return DOCUMENT_WASTE_ORIGIN_POINT_9;
    default:
      return `[DOCUMENT_WASTE_ORIGIN_POINT_${value}]`;
  }
};

export const DOCUMENT_WASTE_CLASS_0 = "Classe I";
export const DOCUMENT_WASTE_CLASS_1 = "Classe II-A";
export const DOCUMENT_WASTE_CLASS_2 = "Classe II-B";
export const DOCUMENT_WASTE_CLASS = (value: DocumentWasteClass) => {
  switch (value) {
    case DocumentWasteClass.CLASS1:
      return DOCUMENT_WASTE_CLASS_0;
    case DocumentWasteClass.CLASS2A:
      return DOCUMENT_WASTE_CLASS_1;
    case DocumentWasteClass.CLASS2B:
      return DOCUMENT_WASTE_CLASS_2;
    default:
      return `[DOCUMENT_WASTE_CLASS_${value}]`;
  }
};

export const DOCUMENT_REFECTORY_PREPARE_0 = "No local";
export const DOCUMENT_REFECTORY_PREPARE_1 = "Terceirizado";
export const DOCUMENT_REFECTORY_PREPARE = (value: DocumentRefectoryPrepare) => {
  switch (value) {
    case DocumentRefectoryPrepare.LOCAL:
      return DOCUMENT_REFECTORY_PREPARE_0;
    case DocumentRefectoryPrepare.OUTSOURCED:
      return DOCUMENT_REFECTORY_PREPARE_1;
    default:
      return `[DOCUMENT_REFECTORY_PREPARE_${value}]`;
  }
};

export const DOCUMENT_HISTORY_TYPE_0 = "process";
export const DOCUMENT_HISTORY_TYPE_1 = "wait";
export const DOCUMENT_HISTORY_TYPE_2 = "finish";
export const DOCUMENT_HISTORY_TYPE_3 = "error";
export const DOCUMENT_HISTORY_TYPE = (value: DocumentHistoryType) => {
  switch (value) {
    case DocumentHistoryType.PROCESS:
      return DOCUMENT_HISTORY_TYPE_0;
    case DocumentHistoryType.WAIT:
      return DOCUMENT_HISTORY_TYPE_1;
    case DocumentHistoryType.FINISH:
      return DOCUMENT_HISTORY_TYPE_2;
    case DocumentHistoryType.ERROR:
      return DOCUMENT_HISTORY_TYPE_3;
    default:
      return `[DOCUMENT_HISTORY_TYPE_${value}]`;
  }
};

export const DOCUMENT_WASTE_WEEKDAYS_0 = "Domingo";
export const DOCUMENT_WASTE_WEEKDAYS_1 = "Segunda";
export const DOCUMENT_WASTE_WEEKDAYS_2 = "Terça";
export const DOCUMENT_WASTE_WEEKDAYS_3 = "Quarta";
export const DOCUMENT_WASTE_WEEKDAYS_4 = "Quinta";
export const DOCUMENT_WASTE_WEEKDAYS_5 = "Sexta";
export const DOCUMENT_WASTE_WEEKDAYS_6 = "Sábado";
export const DOCUMENT_WASTE_WEEKDAYS = (value: DocumentWasteWeekDays) => {
  switch (value) {
    case DocumentWasteWeekDays.SUNDAY:
      return DOCUMENT_WASTE_WEEKDAYS_0;
    case DocumentWasteWeekDays.MONDAY:
      return DOCUMENT_WASTE_WEEKDAYS_1;
    case DocumentWasteWeekDays.TUESDAY:
      return DOCUMENT_WASTE_WEEKDAYS_2;
    case DocumentWasteWeekDays.WEDNESDAY:
      return DOCUMENT_WASTE_WEEKDAYS_3;
    case DocumentWasteWeekDays.THURSDAY:
      return DOCUMENT_WASTE_WEEKDAYS_4;
    case DocumentWasteWeekDays.FRIDAY:
      return DOCUMENT_WASTE_WEEKDAYS_5;
    case DocumentWasteWeekDays.SATURDAY:
      return DOCUMENT_WASTE_WEEKDAYS_6;
    default:
      return `[DOCUMENT_WASTE_WEEKDAYS_${value}]`;
  }
};

export const DOCUMENT_WASTE_COMPANY_LICENSE_0 = "Coleta Municipal";
export const DOCUMENT_WASTE_COMPANY_LICENSE_1 = "Transporte próprio";
export const DOCUMENT_WASTE_COMPANY_LICENSE_2 = "Coleta Tercerizada";
export const DOCUMENT_WASTE_COMPANY_LICENSE = (
  value: DocumentWasteCompanyLicense
) => {
  switch (value) {
    case DocumentWasteCompanyLicense.CITY_HALL:
      return DOCUMENT_WASTE_COMPANY_LICENSE_0;
    case DocumentWasteCompanyLicense.OWN_BUSINESS:
      return DOCUMENT_WASTE_COMPANY_LICENSE_1;
    case DocumentWasteCompanyLicense.OUTSOURCED:
      return DOCUMENT_WASTE_COMPANY_LICENSE_2;
    default:
      return `[DOCUMENT_WASTE_COMPANY_LICENSE${value}]`;
  }
};

export const DOCUMENT_WASTE_CONTAINMENT_ACCIDENT_0 =
  "Isolamento da área afetada";
export const DOCUMENT_WASTE_CONTAINMENT_ACCIDENT_1 =
  "Notificação imediata das autoridades competentes";
export const DOCUMENT_WASTE_CONTAINMENT_ACCIDENT_2 =
  "Utilização de Equipamentos de Proteção Individual (EPIs)";
export const DOCUMENT_WASTE_CONTAINMENT_ACCIDENT_3 =
  "Utilização de materiais absorventes e/ou barreiras fixas";
export const DOCUMENT_WASTE_CONTAINMENT_ACCIDENT = (
  value: IDocumentWasteContainmentAccident
) => {
  switch (value) {
    case IDocumentWasteContainmentAccident.ISOLATION_AFFECTED_AREA:
      return DOCUMENT_WASTE_CONTAINMENT_ACCIDENT_0;
    case IDocumentWasteContainmentAccident.IMMEDIATE_NOTIFICATION:
      return DOCUMENT_WASTE_CONTAINMENT_ACCIDENT_1;
    case IDocumentWasteContainmentAccident.USE_EQUIPMENT:
      return DOCUMENT_WASTE_CONTAINMENT_ACCIDENT_2;
    case IDocumentWasteContainmentAccident.ABSORBENT_MATERIALS_OR_FIXED_BARRIERS:
      return DOCUMENT_WASTE_CONTAINMENT_ACCIDENT_3;
    default:
      return `[DOCUMENT_WASTE_CONTAINMENT_ACCIDENT_${value}]`;
  }
};

export const DOCUMENT_WASTE_ATTRIBUTES_0 = "Efluente do clorador de água";
export const DOCUMENT_WASTE_ATTRIBUTES_1 =
  "Efluente de lavagem de veículos automotores";
export const DOCUMENT_WASTE_ATTRIBUTES_2 = "Efluente do processo industrial";
export const DOCUMENT_WASTE_ATTRIBUTES_3 = "Esgoto Sanitário";
export const DOCUMENT_WASTE_ATTRIBUTES = (value: DocumentWasteAttributes) => {
  switch (value) {
    case DocumentWasteAttributes.ChlorineEffluent:
      return DOCUMENT_WASTE_ATTRIBUTES_0;
    case DocumentWasteAttributes.CarWashEffluent:
      return DOCUMENT_WASTE_ATTRIBUTES_1;
    case DocumentWasteAttributes.IndustrialEffluent:
      return DOCUMENT_WASTE_ATTRIBUTES_2;
    case DocumentWasteAttributes.WasteWater:
      return DOCUMENT_WASTE_ATTRIBUTES_3;
    default:
      return `[DOCUMENT_WASTE_ATTRIBUTES${value}]`;
  }
};

export const DOCUMENT_WASTE_TREATMENT_SYSTEMS_0 = "Bacia de contenção";
export const DOCUMENT_WASTE_TREATMENT_SYSTEMS_1 =
  "Caixa separadora de água e óleo";
export const DOCUMENT_WASTE_TREATMENT_SYSTEMS_2 =
  "Estação de tratamento do esgoto própria";
export const DOCUMENT_WASTE_TREATMENT_SYSTEMS_3 =
  "Estação de tratamento do esgoto terceirado";
export const DOCUMENT_WASTE_TREATMENT_SYSTEMS_4 = "Fossa séptica";
export const DOCUMENT_WASTE_TREATMENT_SYSTEMS_5 = "Rede pública";
export const DOCUMENT_WASTE_TREATMENT_SYSTEMS_6 =
  "Sistema separador de água e óleo";
export const DOCUMENT_WASTE_TREATMENT_SYSTEMS = (
  value: DocumentWasteTreatmentSystems
) => {
  switch (value) {
    case DocumentWasteTreatmentSystems.CONTAINMENT_BASIN:
      return DOCUMENT_WASTE_TREATMENT_SYSTEMS_0;
    case DocumentWasteTreatmentSystems.CSAO:
      return DOCUMENT_WASTE_TREATMENT_SYSTEMS_1;
    case DocumentWasteTreatmentSystems.INDEPENDENT_ETE:
      return DOCUMENT_WASTE_TREATMENT_SYSTEMS_2;
    case DocumentWasteTreatmentSystems.OUTSOURCED_ETE:
      return DOCUMENT_WASTE_TREATMENT_SYSTEMS_3;
    case DocumentWasteTreatmentSystems.SEPTIC_TANK:
      return DOCUMENT_WASTE_TREATMENT_SYSTEMS_4;
    case DocumentWasteTreatmentSystems.PUBLIC:
      return DOCUMENT_WASTE_TREATMENT_SYSTEMS_5;
    case DocumentWasteTreatmentSystems.SSAO:
      return DOCUMENT_WASTE_TREATMENT_SYSTEMS_6;
    default:
      return `[DOCUMENT_WASTE_TREATMENT_SYSTEMS${value}]`;
  }
};

export const DOCUMENT_WASTE_USED_HARDWARE_0 = "Bacia de contenção";
export const DOCUMENT_WASTE_USED_HARDWARE_1 = "Caixa separadora de água e óleo";
export const DOCUMENT_WASTE_USED_HARDWARE_2 = "Filtro decantador";
export const DOCUMENT_WASTE_USED_HARDWARE_3 = "Fossa, filtro e sumidouro";
export const DOCUMENT_WASTE_USED_HARDWARE_4 = "Rede pública";
export const DOCUMENT_WASTE_USED_HARDWARE = (
  value: DocumentWasteUsedHardwares
) => {
  switch (value) {
    case DocumentWasteUsedHardwares.CONTAINMENT_BASIN:
      return DOCUMENT_WASTE_USED_HARDWARE_0;
    case DocumentWasteUsedHardwares.CSAO:
      return DOCUMENT_WASTE_USED_HARDWARE_1;
    case DocumentWasteUsedHardwares.DECANTER_FILTER:
      return DOCUMENT_WASTE_USED_HARDWARE_2;
    case DocumentWasteUsedHardwares.FILTER_SEPTIC_TANK:
      return DOCUMENT_WASTE_USED_HARDWARE_3;
    case DocumentWasteUsedHardwares.PUBLIC:
      return DOCUMENT_WASTE_USED_HARDWARE_4;
    default:
      return `[DOCUMENT_WASTE_USED_HARDWARE${value}]`;
  }
};

export const DOCUMENT_WASTE_DESTINATION_0 =
  "Estação de tratamento do esgoto própria";
export const DOCUMENT_WASTE_DESTINATION_1 =
  "Estação de tratamento do esgoto terceirado";
export const DOCUMENT_WASTE_DESTINATION_2 = "Infiltração em solo";
export const DOCUMENT_WASTE_DESTINATION_3 = "Rede pública";
export const DOCUMENT_WASTE_DESTINATION = (value: DocumentWasteDestination) => {
  switch (value) {
    case DocumentWasteDestination.INDEPENDENT_ETE:
      return DOCUMENT_WASTE_DESTINATION_0;
    case DocumentWasteDestination.OUTSOURCED_ETE:
      return DOCUMENT_WASTE_DESTINATION_1;
    case DocumentWasteDestination.SOIL_INFILTRATION:
      return DOCUMENT_WASTE_DESTINATION_2;
    case DocumentWasteDestination.PUBLIC:
      return DOCUMENT_WASTE_DESTINATION_3;
    default:
      return `[DOCUMENT_WASTE_DESTINATION${value}]`;
  }
};

export const DOCUMENT_WASTE_IMPROVEMENT_ACTIONS_0 =
  "Manter os recipientes do óleo de cozinha usado em pallets de contenção";
export const DOCUMENT_WASTE_IMPROVEMENT_ACTIONS_1 =
  "Manter todas as lixeiras em local coberto e piso impermeável (que não seja grama, areia, terra, etc.)";
export const DOCUMENT_WASTE_IMPROVEMENT_ACTIONS_2 =
  "Manter uma rotina de higienização das lixeiras";
export const DOCUMENT_WASTE_IMPROVEMENT_ACTIONS_3 =
  "Organizar as lixeiras para serem dispostas somente nos locais em que aqueles resíduos são gerados.";
export const DOCUMENT_WASTE_IMPROVEMENT_ACTIONS_4 =
  "Padronizar a identificação de todas as lixeiras";
export const DOCUMENT_WASTE_IMPROVEMENT_ACTIONS_5 =
  "Verificar se todos os sacos de lixo estão nas cores correspondentes";
export const DOCUMENT_WASTE_IMPROVEMENT_ACTIONS = (
  value: DocumentWasteImprovementActions
) => {
  switch (value) {
    case DocumentWasteImprovementActions.KEEP_OIL_RECIPIENTS:
      return DOCUMENT_WASTE_IMPROVEMENT_ACTIONS_0;
    case DocumentWasteImprovementActions.KEEP_TRASH_PROTECTED:
      return DOCUMENT_WASTE_IMPROVEMENT_ACTIONS_1;
    case DocumentWasteImprovementActions.KEEP_TRASH_HYGIENE_ROUTINE:
      return DOCUMENT_WASTE_IMPROVEMENT_ACTIONS_2;
    case DocumentWasteImprovementActions.ORGANIZE_TRASH_LOCALIZATION:
      return DOCUMENT_WASTE_IMPROVEMENT_ACTIONS_3;
    case DocumentWasteImprovementActions.PATTERN_TRASH_IDENTIFICATION:
      return DOCUMENT_WASTE_IMPROVEMENT_ACTIONS_4;
    case DocumentWasteImprovementActions.VERIFY_TRASH_BAG_CORRECT_COLORS:
      return DOCUMENT_WASTE_IMPROVEMENT_ACTIONS_5;
    default:
      return `[DOCUMENT_WASTE_IMPROVEMENT_ACTIONS${value}]`;
  }
};

export const DOCUMENT_APPROVED_GOAL_DECREASENONRECYCLABLE =
  "Reduzir a produção de resíduos não recicláveis em {number}% no próximo ano.";
export const DOCUMENT_APPROVED_GOAL_INCREASERECYCLABLERATE =
  "Aumentar a taxa de resíduos que são destinados para reciclagem em {number}% até o próximo ano.";
export const DOCUMENT_APPROVED_GOAL_DECREASEFOODWASTE =
  "Reduzir o desperdício de alimentos em {number}% até o próximo ano.";
export const DOCUMENT_APPROVED_GOAL_REUSE =
  "Reutilizar {number}% dos materiais passíveis de reutilização dentro de um ano.";
export const DOCUMENT_APPROVED_GOAL_IMPLEMENTCOMPOSTING =
  "Introduzir a prática de compostagem de resíduos orgânicos até o próximo ano. {number}%";
export const DOCUMENT_APPROVED_GOAL_IMPLEMENTENVIRONMENTALEDUCATION =
  "Introduzir o tema de educação ambiental em treinamentos da empresa. ({number} treinamentos por ano)";
export const DOCUMENT_APPROVED_GOAL_IMPLEMENTWATERREUSE =
  "Implementar um programa de reuso de água que reduza o consumo de água potável em {number}% em um período de um ano.";
export const DOCUMENT_APPROVED_GOAL_DECREASEELETRONICS =
  "Reduzir a quantidade de resíduos eletrônicos enviados para aterros sanitários em {number}% em um período de um ano.";
export const DOCUMENT_APPROVED_GOAL_DECREASEGASES =
  "Reduzir as emissões de gases de efeito estufa associadas às atividades da empresa em {number}% em um ano.";

export const DOCUMENT_WASTE_EXTERNAL_PACKAGING_0 = "Abrigo de resíduos";
export const DOCUMENT_WASTE_EXTERNAL_PACKAGING_1 = "Caçamba (s)";
export const DOCUMENT_WASTE_EXTERNAL_PACKAGING_2 = "Central de resíduos";
export const DOCUMENT_WASTE_EXTERNAL_PACKAGING_3 = "Contâiner (es)";
export const DOCUMENT_WASTE_EXTERNAL_PACKAGING_4 = "Lixeiras externas";
export const DOCUMENT_WASTE_EXTERNAL_PACKAGING = (
  value: DocumentWasteExternalPackaging
) => {
  switch (value) {
    case DocumentWasteExternalPackaging.WASTE_SHELTER:
      return DOCUMENT_WASTE_EXTERNAL_PACKAGING_0;
    case DocumentWasteExternalPackaging.BUCKET:
      return DOCUMENT_WASTE_EXTERNAL_PACKAGING_1;
    case DocumentWasteExternalPackaging.WASTE_PLANT:
      return DOCUMENT_WASTE_EXTERNAL_PACKAGING_2;
    case DocumentWasteExternalPackaging.CONTAINER:
      return DOCUMENT_WASTE_EXTERNAL_PACKAGING_3;
    case DocumentWasteExternalPackaging.EXTERNAL_BINS:
      return DOCUMENT_WASTE_EXTERNAL_PACKAGING_4;
    default:
      return `[DOCUMENT_WASTE_EXTERNAL_PACKAGING_${value}]`;
  }
};

export const DOCUMENT_WASTE_DANGERS_0 = "Acidente ambiental";
export const DOCUMENT_WASTE_DANGERS_1 = "Contaminação do solo";
export const DOCUMENT_WASTE_DANGERS_2 = "Contaminação da água";
export const DOCUMENT_WASTE_DANGERS = (value: DocumentWasteDangers) => {
  switch (value) {
    case DocumentWasteDangers.ACCIDENT:
      return DOCUMENT_WASTE_DANGERS_0;
    case DocumentWasteDangers.SOIL_CONTAMINATION:
      return DOCUMENT_WASTE_DANGERS_1;
    case DocumentWasteDangers.WATER_CONTAMINATION:
      return DOCUMENT_WASTE_DANGERS_2;
    default:
      return `[DOCUMENT_WASTE_DANGERS_${value}]`;
  }
};

export const DOCUMENT_WASTE_INTERNAL_TRANSPORTATION_0 = "Carrinho com rodas";
export const DOCUMENT_WASTE_INTERNAL_TRANSPORTATION_1 = "Lixeira com rodas";
export const DOCUMENT_WASTE_INTERNAL_TRANSPORTATION_2 = "Container com rodas";
export const DOCUMENT_WASTE_INTERNAL_TRANSPORTATION_3 = "Saco de lixo - manual";
export const DOCUMENT_WASTE_INTERNAL_TRANSPORTATION = (
  value: IDocumentWasteInternalTransportation
) => {
  switch (value) {
    case IDocumentWasteInternalTransportation.WASTE_CART:
      return DOCUMENT_WASTE_INTERNAL_TRANSPORTATION_0;
    case IDocumentWasteInternalTransportation.TRASH:
      return DOCUMENT_WASTE_INTERNAL_TRANSPORTATION_1;
    case IDocumentWasteInternalTransportation.CONTAINER:
      return DOCUMENT_WASTE_INTERNAL_TRANSPORTATION_2;
    case IDocumentWasteInternalTransportation.TRASH_BAG:
      return DOCUMENT_WASTE_INTERNAL_TRANSPORTATION_3;
    default:
      return `[DOCUMENT_WASTE_INTERNAL_TRANSPORTATION_${value}]`;
  }
};

export const DOCUMENT_APPROVED_PREVENTION_ACTIONS_0 =
  "Contenção do vazamento ou derramamento - materiais absorventes ou barreiras fixas";
export const DOCUMENT_APPROVED_PREVENTION_ACTIONS_1 =
  "Remoção segura dos resíduos contaminados";
export const DOCUMENT_APPROVED_PREVENTION_ACTIONS_2 =
  "Limpeza e descontaminação da área afetada (destinação correta)";
export const DOCUMENT_APPROVED_PREVENTION_ACTIONS_3 =
  "Treinamento e capacitação contínua dos trabalhadores";
export const DOCUMENT_APPROVED_PREVENTION_ACTIONS_4 =
  "Investigação de acidentes e Registro de ocorrências";
export const DOCUMENT_APPROVED_PREVENTION_ACTIONS = (
  value: DocumentApprovedPreventionActions
) => {
  switch (value) {
    case DocumentApprovedPreventionActions.LEAK_CONTAINMENT:
      return DOCUMENT_APPROVED_PREVENTION_ACTIONS_0;
    case DocumentApprovedPreventionActions.SAFE_REMOVAL:
      return DOCUMENT_APPROVED_PREVENTION_ACTIONS_1;
    case DocumentApprovedPreventionActions.AREA_DECONTAMINATION:
      return DOCUMENT_APPROVED_PREVENTION_ACTIONS_2;
    case DocumentApprovedPreventionActions.EMPLOYEES_TRAINING:
      return DOCUMENT_APPROVED_PREVENTION_ACTIONS_3;
    case DocumentApprovedPreventionActions.ACCIDENT_INVESTIGATION:
      return DOCUMENT_APPROVED_PREVENTION_ACTIONS_4;
    default:
      return `[DOCUMENT_APPROVED_PREVENTION_ACTIONS_${value}]`;
  }
};
