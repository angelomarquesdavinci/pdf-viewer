import { DocumentTemplateType } from "../documentTemplate/interface";
import {
  DocumentWasteOriginPoint,
  DocumentFrequency,
  DocumentHistoryType,
  DocumentRefectoryPrepare,
  DocumentWasteAttributes,
  DocumentWasteClass,
  DocumentWasteCompanyLicense,
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
  DocumentWasteDangers,
  IDocumentWasteInternalTransportation,
  DocumentApprovedPreventionActions,
  DocumentWasteAction,
  DocumentHealthWasteClass,
  DocumentHealthAdditionsSanitizationProducts,
  DocumentHealthAdditionsSanitizationProtectionGear,
  DocumentHealthAdditionsSanitizationProcedure,
  DocumentHealthAdditionsSanitizationMaterialsUsed,
  DocumentHealthAdditionsSanitizationVentilation,
  DocumentHealthAdditionsSanitizationDoorLockSystem,
  DocumentHealthWasteOriginPoint,
  DocumentHealthWastePacking,
  DocumentHealthWastePutrescibleCoolingSystem,
  DocumentHealthWastePutrescibleDescription,
  DocumentCompanyServiceMode,
  DocumentHealthInternalCollectionTransport,
  DocumentHealthAdditionsSecurityVaccines,
} from "./enum";
import { IDocumentWaste } from "./interface";

export const LOCALE = "pt-BR";
export const DRAFT_TEXT = "{type} iniciado";
export const DRAFT_DESCRIPTION = "Documento em rascunho";

export const COMPLETED_TEXT = "{type} aprovado";
export const COMPLETED_DESCRIPTION =
  "Documento disponível para download e impressão";

export const REVIEW_TEXT = "{type} em análise";
export const REVIEW_DESCRIPTION =
  "Documento em análise pelo responsável técnico";

export const SENT_TEXT = "{type} enviado";
export const SENT_DESCRIPTION = "Documento enviado para o responsável técnico";

export const REJECTED_TEXT = "Ação necessária";
export const REJECTED_DESCRIPTION = "Documento com pendências de ajuste";

export const VERSION_TEXT = "Atualização do documento";
export const VERSION_DESCRIPTION =
  "Documento atualizado para a versão: {version}";

export const TECHINICAL_ADJUSTMENT_WASTE_TEXT =
  "Correções em resíduos do técnico responsável";
export const TECHINICAL_ADJUSTMENT_WASTE_DESCRIPTION = (
  action: DocumentWasteAction,
  waste: IDocumentWaste,
) =>
  `${action} resíduo ${waste.classificationId} na ${DOCUMENT_WASTE_CLASS(
    waste.class,
  )}`;

export const TECHINICAL_ADJUSTMENT_HEALT_WASTE_DESCRIPTION = (
  action: DocumentWasteAction,
  group: string,
) => `${action} resíduos no grupo ${group}`;

export const TECHINICAL_ADJUSTMENT_WASTE_EFFLUENT_TEXT =
  "Correções em resíduos efluente do técnico responsável";
export const TECHINICAL_ADJUSTMENT_WASTE_EFFLUENT_DESCRIPTION = (
  action: DocumentWasteAction,
) => `${action} resíduo efluente`;

export const DOCUMENT_WASTE_HEALT_GROUP_A = "A - POTENCIALMENTE INFECTANTES";
export const DOCUMENT_WASTE_HEALT_GROUP_B = "B - QUÍMICOS";
export const DOCUMENT_WASTE_HEALT_GROUP_D_NR = "D - COMUNS NÃO RECICLÁVEIS";
export const DOCUMENT_WASTE_HEALT_GROUP_D_R = "D - COMUNS RECICLÁVEIS";
export const DOCUMENT_WASTE_HEALT_GROUP_E = "E - PERFUROCORTANTES";
export const DOCUMENT_WASTE_HEALT = (value: DocumentHealthWasteClass) => {
  switch (value) {
    case DocumentHealthWasteClass.GROUP_A:
      return DOCUMENT_WASTE_HEALT_GROUP_A;
    case DocumentHealthWasteClass.GROUP_B:
      return DOCUMENT_WASTE_HEALT_GROUP_B;
    case DocumentHealthWasteClass.GROUP_D_NR:
      return DOCUMENT_WASTE_HEALT_GROUP_D_NR;
    case DocumentHealthWasteClass.GROUP_D_R:
      return DOCUMENT_WASTE_HEALT_GROUP_D_R;
    case DocumentHealthWasteClass.GROUP_E:
      return DOCUMENT_WASTE_HEALT_GROUP_E;
    default:
      return `[DOCUMENT_WASTE_HEALT_${value}]`;
  }
};

export const DOCUMENT_FREQUENCY_0 = "Diária";
export const DOCUMENT_FREQUENCY_1 = "Semanal";
export const DOCUMENT_FREQUENCY_2 = "Mensal";
export const DOCUMENT_FREQUENCY_3 = "Anual";
export const DOCUMENT_FREQUENCY_4 = "Esporádica";
export const DOCUMENT_FREQUENCY_6 = "Semestral";
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
    case DocumentFrequency.HALF_YEARLY:
      return DOCUMENT_FREQUENCY_6;
    default:
      return `[DOCUMENT_FREQUENCY_${value}]`;
  }
};

export const DOCUMENT_WASTE_UNIT_0 = "Kg";
export const DOCUMENT_WASTE_UNIT_1 = "Ton";
export const DOCUMENT_WASTE_UNIT_2 = "Un";
export const DOCUMENT_WASTE_UNIT_3 = "L";
export const DOCUMENT_WASTE_UNIT_4 = "m³";
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
export const DOCUMENT_WASTE_FREQUENCY_6 = "Semestre";
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
    case DocumentWasteFrequency.HALF_YEARLY:
      return DOCUMENT_WASTE_FREQUENCY_6;
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
export const DOCUMENT_WASTE_STORAGE_18 = "Container em solo, área coberta";
export const DOCUMENT_WASTE_STORAGE_19 = "Container em solo, área descoberta";
export const DOCUMENT_WASTE_STORAGE_20 = "Lixeira em solo, área coberta";
export const DOCUMENT_WASTE_STORAGE_21 = "Lixeira em solo, área descoberta";
export const DOCUMENT_WASTE_STORAGE_22 =
  "Lixeira em piso impermeável, área coberta";
export const DOCUMENT_WASTE_STORAGE_23 =
  "Lixeira em piso impermeável, área descoberta";
export const DOCUMENT_WASTE_STORAGE_24 =
  "Container em piso impermeável, área coberta";
export const DOCUMENT_WASTE_STORAGE_25 =
  "Container em piso impermeável, área descoberta";
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
    case DocumentWasteStorage.COVERED_CONTAINER:
      return DOCUMENT_WASTE_STORAGE_18;
    case DocumentWasteStorage.UNCOVERED_CONTAINER:
      return DOCUMENT_WASTE_STORAGE_19;
    case DocumentWasteStorage.COVERED_TRASH:
      return DOCUMENT_WASTE_STORAGE_20;
    case DocumentWasteStorage.UNCOVERED_TRASH:
      return DOCUMENT_WASTE_STORAGE_21;
    case DocumentWasteStorage.COVERED_TRASH_WATERPROOF_FLOOR:
      return DOCUMENT_WASTE_STORAGE_22;
    case DocumentWasteStorage.UNCOVERED_TRASH_WATERPROOF_FLOOR:
      return DOCUMENT_WASTE_STORAGE_23;
    case DocumentWasteStorage.COVERED_CONTAINER_WATERPROOF_FLOOR:
      return DOCUMENT_WASTE_STORAGE_24;
    case DocumentWasteStorage.UNCOVERED_CONTAINER_WATERPROOF_FLOOR:
      return DOCUMENT_WASTE_STORAGE_25;
    default:
      return `[DOCUMENT_WASTE_STORAGE_${value}]`;
  }
};

export const DOCUMENT_WASTE_PACKING_0 = "Sem saco de lixo";
export const DOCUMENT_WASTE_PACKING_1 =
  "Saco de lixo azul com simbologia de reciclável ";
export const DOCUMENT_WASTE_PACKING_2 =
  "Saco de lixo amarelo com simbologia de reciclável";
export const DOCUMENT_WASTE_PACKING_3 =
  "Saco de lixo verde com simbologia de reciclável";
export const DOCUMENT_WASTE_PACKING_4 =
  "Saco de lixo vermelho com simbologia de reciclável";
export const DOCUMENT_WASTE_PACKING_5 =
  "Saco de lixo marrom com simbologia de reciclável";
export const DOCUMENT_WASTE_PACKING_6 =
  "Saco de lixo laranja com simbologia de resíduo perigoso";
export const DOCUMENT_WASTE_PACKING_7 =
  "Saco de lixo preto com simbologia de não reciclável";
export const DOCUMENT_WASTE_PACKING_8 = "Caixa de Gordura";
export const DOCUMENT_WASTE_PACKING_9 = "Caixa Separadora Água/Óleo";
export const DOCUMENT_WASTE_PACKING_10 = "Tambor";
export const DOCUMENT_WASTE_PACKING_11 = "Bombona";
export const DOCUMENT_WASTE_PACKING_12 = "Caixa de papelão";
export const DOCUMENT_WASTE_PACKING_13 = "Recipiente rígido";
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
    case DocumentWastePacking.OIL_BOX:
      return DOCUMENT_WASTE_PACKING_8;
    case DocumentWastePacking.CSAO:
      return DOCUMENT_WASTE_PACKING_9;
    case DocumentWastePacking.BARREL:
      return DOCUMENT_WASTE_PACKING_10;
    case DocumentWastePacking.LARGE_CONTAINER:
      return DOCUMENT_WASTE_PACKING_11;
    case DocumentWastePacking.CARDBOARD_BOX:
      return DOCUMENT_WASTE_PACKING_12;
    case DocumentWastePacking.HARD_CONTAINER:
      return DOCUMENT_WASTE_PACKING_13;
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
export const DOCUMENT_WASTE_TREATMENT_16 = "Em estoque na empresa";
export const DOCUMENT_WASTE_TREATMENT_17 = "Não especificado";
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
    case DocumentWasteTreatment.UNSPECIFIED:
      return DOCUMENT_WASTE_TREATMENT_17;
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
export const DOCUMENT_WASTE_ORIGIN_POINT_10 = "Laboratório";
export const DOCUMENT_WASTE_ORIGIN_POINT_11 = "Caixa de Gordura";
export const DOCUMENT_WASTE_ORIGIN_POINT_12 = "Caixa Separadora Água/Óleo";
export const DOCUMENT_WASTE_ORIGIN_POINT_13 = "Escritório/Consultório";
export const DOCUMENT_WASTE_ORIGIN_POINT = (
  value: DocumentWasteOriginPoint,
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
    case DocumentWasteOriginPoint.LABORATORY:
      return DOCUMENT_WASTE_ORIGIN_POINT_10;
    case DocumentWasteOriginPoint.OIL_BOX:
      return DOCUMENT_WASTE_ORIGIN_POINT_11;
    case DocumentWasteOriginPoint.CSAO:
      return DOCUMENT_WASTE_ORIGIN_POINT_12;
    case DocumentWasteOriginPoint.OFFICE:
      return DOCUMENT_WASTE_ORIGIN_POINT_13;
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
export const DOCUMENT_REFECTORY_PREPARE_2 = "-";
export const DOCUMENT_REFECTORY_PREPARE = (value: DocumentRefectoryPrepare) => {
  switch (value) {
    case DocumentRefectoryPrepare.LOCAL:
      return DOCUMENT_REFECTORY_PREPARE_0;
    case DocumentRefectoryPrepare.OUTSOURCED:
      return DOCUMENT_REFECTORY_PREPARE_1;
    case DocumentRefectoryPrepare.NONE:
      return DOCUMENT_REFECTORY_PREPARE_2;

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
export const DOCUMENT_WASTE_COMPANY_LICENSE_2 = "Coleta Terceirizada";
export const DOCUMENT_WASTE_COMPANY_LICENSE = (
  value: DocumentWasteCompanyLicense,
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
  value: IDocumentWasteContainmentAccident,
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
  value: DocumentWasteTreatmentSystems,
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
      return `[DOCUMENT_WASTE_TREATMENT_SYSTEMS_${value}]`;
  }
};

export const DOCUMENT_WASTE_USED_HARDWARE_0 = "Bacia de contenção";
export const DOCUMENT_WASTE_USED_HARDWARE_1 = "Caixa separadora de água e óleo";
export const DOCUMENT_WASTE_USED_HARDWARE_2 = "Filtro decantador";
export const DOCUMENT_WASTE_USED_HARDWARE_3 = "Fossa, filtro e sumidouro";
export const DOCUMENT_WASTE_USED_HARDWARE_4 = "Rede pública";
export const DOCUMENT_WASTE_USED_HARDWARE = (
  value: DocumentWasteUsedHardwares,
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
  value: DocumentWasteImprovementActions,
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
      return `[DOCUMENT_WASTE_IMPROVEMENT_ACTIONS_${value}]`;
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
  value: DocumentWasteExternalPackaging,
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
  value: IDocumentWasteInternalTransportation,
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
  value: DocumentApprovedPreventionActions,
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

export const DOCUMENT_TEMPLATE_TYPE_0 = "PGRS";
export const DOCUMENT_TEMPLATE_TYPE_1 = "PGRSS";
export const DOCUMENT_TEMPLATE_TYPE = (value: DocumentTemplateType) => {
  switch (value) {
    case DocumentTemplateType.PGRS:
      return DOCUMENT_TEMPLATE_TYPE_0;
    case DocumentTemplateType.PGRSS:
      return DOCUMENT_TEMPLATE_TYPE_1;
    default:
      return `DOCUMENT_TEMPLATE_TYPE_${value}`;
  }
};

export const SIGNATURE_METADATA_TITLE = "Elaboração do {type}";

export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PRODUCTS_0 =
  "Produtos Saneantes (sabão, detergente, água sanitária)";
export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PRODUCTS_1 = "Outros";
export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PRODUCTS = (
  value: DocumentHealthAdditionsSanitizationProducts,
) => {
  switch (value) {
    case DocumentHealthAdditionsSanitizationProducts.STANDARD:
      return DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PRODUCTS_0;
    case DocumentHealthAdditionsSanitizationProducts.OTHER:
      return DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PRODUCTS_1;
    default:
      return `[DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PRODUCTS_${value}]`;
  }
};

export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PROTECTION_GEAR_0 =
  "Bota de segurança, luva de borracha, óculos e máscara de proteção, avental (NR-32)";
export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PROTECTION_GEAR = (
  value: DocumentHealthAdditionsSanitizationProtectionGear,
) => {
  switch (value) {
    case DocumentHealthAdditionsSanitizationProtectionGear.STANDARD:
      return DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PROTECTION_GEAR_0;
    default:
      return `[DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PROTECTION_GEAR_${value}]`;
  }
};

export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PROCEDURES_0 =
  "Lavagem e Enxágue (Deixando o desinfetante agir por 10 minutos)";
export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PROCEDURES = (
  value: DocumentHealthAdditionsSanitizationProcedure,
) => {
  switch (value) {
    case DocumentHealthAdditionsSanitizationProcedure.STANDARD:
      return DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PROCEDURES_0;
    default:
      return `[DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_PROCEDURES_${value}]`;
  }
};

export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_MATERIALS_USED_MASONRY =
  "Alvenaria";
export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_MATERIALS_USED_DRYWALL =
  "Drywall";
export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_MATERIALS_USED_WATERPROOF_MATERIAL =
  "Material impermeável";
export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_MATERIALS_USED_TILE =
  "Telha";
export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_MATERIALS_USED_TENT =
  "Tenda";
export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_MATERIALS_USED = (
  value: DocumentHealthAdditionsSanitizationMaterialsUsed,
) => {
  switch (value) {
    case DocumentHealthAdditionsSanitizationMaterialsUsed.MASONRY:
      return DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_MATERIALS_USED_MASONRY;
    case DocumentHealthAdditionsSanitizationMaterialsUsed.DRYWALL:
      return DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_MATERIALS_USED_DRYWALL;
    case DocumentHealthAdditionsSanitizationMaterialsUsed.WATERPROOF_MATERIAL:
      return DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_MATERIALS_USED_WATERPROOF_MATERIAL;
    case DocumentHealthAdditionsSanitizationMaterialsUsed.TILE:
      return DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_MATERIALS_USED_TILE;
    case DocumentHealthAdditionsSanitizationMaterialsUsed.TENT:
      return DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_MATERIALS_USED_TENT;
    default:
      return `[DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_MATERIALS_USED_${value}]`;
  }
};

export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_VENTILATION_NATURAL =
  "Ventilação Natural";
export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_VENTILATION_ARTIFICIAL =
  "Ventilação Artificial";
export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_VENTILATION = (
  value: DocumentHealthAdditionsSanitizationVentilation,
) => {
  switch (value) {
    case DocumentHealthAdditionsSanitizationVentilation.NATURAL:
      return DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_VENTILATION_NATURAL;
    case DocumentHealthAdditionsSanitizationVentilation.ARTIFICIAL:
      return DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_VENTILATION_ARTIFICIAL;
    default:
      return `[DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_VENTILATION_${value}]`;
  }
};

export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_DOOR_LOCK_SYSTEM_LOCK =
  "Tranca";
export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_DOOR_LOCK_SYSTEM_PADLOCK =
  "Cadeado";
export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_DOOR_LOCK_SYSTEM_CHAIN =
  "Corrente";
export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_DOOR_LOCK_SYSTEM_KEY_LOCK =
  "Fechadura com chave";
export const DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_DOOR_LOCK_SYSTEM = (
  value: DocumentHealthAdditionsSanitizationDoorLockSystem,
) => {
  switch (value) {
    case DocumentHealthAdditionsSanitizationDoorLockSystem.LOCK:
      return DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_DOOR_LOCK_SYSTEM_LOCK;
    case DocumentHealthAdditionsSanitizationDoorLockSystem.PADLOCK:
      return DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_DOOR_LOCK_SYSTEM_PADLOCK;
    case DocumentHealthAdditionsSanitizationDoorLockSystem.CHAIN:
      return DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_DOOR_LOCK_SYSTEM_CHAIN;
    case DocumentHealthAdditionsSanitizationDoorLockSystem.KEY_LOCK:
      return DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_DOOR_LOCK_SYSTEM_KEY_LOCK;
    default:
      return `[DOCUMENT_HEALTH_ADDITIONS_SANITIZATION_DOOR_LOCK_SYSTEM_${value}]`;
  }
};

export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_0 = "Consultórios";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_1 = "Centro cirúrgico";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_2 = "Raio-X";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_3 = "Enfermaria";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_4 = "Farmácia";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_5 = "Sala de Procedimentos";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_6 = "Sala de Hemodiálise";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_7 = "Sala de coleta";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_8 =
  "Sala de vacinação/aplicação";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_9 = "Sala de esterilização";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_10 = "Sala de necropsia";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_11 = "DML";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_12 = "Expurgo";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_13 = "Administrativo";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_14 = "Banheiros";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_15 = "Copa / Cozinha";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_16 = "Refeitório";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_17 = "Estoque/almoxarifado";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_18 =
  "Estoque na empresa (aguardando destinação)";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_19 = "Sala de aula / escola";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_20 = "Internamento";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_21 = "Salão de Beleza";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_22 = "Sala de Radiografia";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_23 = "Sala de Atendimento";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_24 = "Sala de Café";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_25 = "Manutenção";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_26 = "Laboratório óptico";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_27 =
  "Laboratório físico químico";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_28 =
  "Laboratório de microbiologia";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_29 =
  "Laboratório de enfermagem";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_30 = "Pátio";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_31 = "Ginásio";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_32 = "Sala/salão de Eventos";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_33 = "Banho e tosa";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_34 =
  "Sala de TI - Tecnologia da Informação";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_35 =
  "Todas os setores da empresa";
export const DOCUMENT_HEALTH_WASTE_ORIGIN_POINT = (
  value: DocumentHealthWasteOriginPoint,
) => {
  switch (value) {
    case DocumentHealthWasteOriginPoint.CONSULTATION_ROOMS:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_0;
    case DocumentHealthWasteOriginPoint.SURGICAL_CENTER:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_1;
    case DocumentHealthWasteOriginPoint.X_RAY_ROOM:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_2;
    case DocumentHealthWasteOriginPoint.WARD:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_3;
    case DocumentHealthWasteOriginPoint.PHARMACY:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_4;
    case DocumentHealthWasteOriginPoint.PROCEDURE_ROOM:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_5;
    case DocumentHealthWasteOriginPoint.DIALYSIS_ROOM:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_6;
    case DocumentHealthWasteOriginPoint.COLLECTION_ROOM:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_7;
    case DocumentHealthWasteOriginPoint.VACCINATION_ROOM:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_8;
    case DocumentHealthWasteOriginPoint.STERILIZATION_ROOM:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_9;
    case DocumentHealthWasteOriginPoint.AUTOPSY_ROOM:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_10;
    case DocumentHealthWasteOriginPoint.DML:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_11;
    case DocumentHealthWasteOriginPoint.SLUICE_ROOM:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_12;
    case DocumentHealthWasteOriginPoint.ADMINISTRATIVE:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_13;
    case DocumentHealthWasteOriginPoint.BATHROOMS:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_14;
    case DocumentHealthWasteOriginPoint.KITCHENETTE:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_15;
    case DocumentHealthWasteOriginPoint.CAFETERIA:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_16;
    case DocumentHealthWasteOriginPoint.STOCKROOM:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_17;
    case DocumentHealthWasteOriginPoint.ON_SITE_STOCK:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_18;
    case DocumentHealthWasteOriginPoint.SCHOOL:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_19;
    case DocumentHealthWasteOriginPoint.INPATIENT:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_20;
    case DocumentHealthWasteOriginPoint.BEAUTY_SHOP:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_21;
    case DocumentHealthWasteOriginPoint.RADIOGRAPH_ROOM:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_22;
    case DocumentHealthWasteOriginPoint.ATTENDANCE_ROOM:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_23;
    case DocumentHealthWasteOriginPoint.COFFEE_SHOP:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_24;
    case DocumentHealthWasteOriginPoint.MAINTENANCE:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_25;
    case DocumentHealthWasteOriginPoint.OPTICAL_LAB:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_26;
    case DocumentHealthWasteOriginPoint.PHYSICOCHEMICAL_LAB:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_27;
    case DocumentHealthWasteOriginPoint.MICROBIOLOGY_LAB:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_28;
    case DocumentHealthWasteOriginPoint.NURSING_LAB:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_29;
    case DocumentHealthWasteOriginPoint.COURTYARD:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_30;
    case DocumentHealthWasteOriginPoint.GYMNASIUM:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_31;
    case DocumentHealthWasteOriginPoint.EVENTS_ROOM:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_32;
    case DocumentHealthWasteOriginPoint.BATH_AND_SHEARING:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_33;
    case DocumentHealthWasteOriginPoint.IT_ROOM:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_34;
    case DocumentHealthWasteOriginPoint.ALL_SECTORS:
      return DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_35;
    default:
      return `[DOCUMENT_HEALTH_WASTE_ORIGIN_POINT_${value}]`;
  }
};

export const DOCUMENT_HEALTH_WASTE_PACKING_0 =
  "Lixeira com pedal e tampa. Saco de lixo branco leitoso identificado com nome e simbologia de resíduo infectante";
export const DOCUMENT_HEALTH_WASTE_PACKING_1 =
  "Recipiente rígido com tampa identificado com nome e simbologia de resíduo perigoso (químico)";
export const DOCUMENT_HEALTH_WASTE_PACKING_2 =
  "Lixeira com saco de lixo de cor laranja identificada com nome e simbologia de resíduo perigoso (químico)";
export const DOCUMENT_HEALTH_WASTE_PACKING_3 =
  "Recipiente rígido de papelão identificado com nome e simbologia de resíduo perfurocortante";
export const DOCUMENT_HEALTH_WASTE_PACKING_4 =
  "Lixeira com saco de lixo de cor azul (ou transparente) identificada com nome e simbologia de resíduo reciclável";
export const DOCUMENT_HEALTH_WASTE_PACKING_5 =
  "Lixeira com saco de lixo de cor preta (ou transparente) identificada com nome e simbologia de resíduo não reciclável";
export const DOCUMENT_HEALTH_WASTE_PACKING = (
  value: DocumentHealthWastePacking,
) => {
  switch (value) {
    case DocumentHealthWastePacking.PEDAL_BIN_INFECTIOUS_WASTE:
      return DOCUMENT_HEALTH_WASTE_PACKING_0;
    case DocumentHealthWastePacking.RIGID_CONTAINER_HAZARDOUS_WASTE:
      return DOCUMENT_HEALTH_WASTE_PACKING_1;
    case DocumentHealthWastePacking.ORANGE_BIN_HAZARDOUS_WASTE:
      return DOCUMENT_HEALTH_WASTE_PACKING_2;
    case DocumentHealthWastePacking.RIGID_BOX_SHARPS_WASTE:
      return DOCUMENT_HEALTH_WASTE_PACKING_3;
    case DocumentHealthWastePacking.BLUE_BIN_RECYCLABLE_WASTE:
      return DOCUMENT_HEALTH_WASTE_PACKING_4;
    case DocumentHealthWastePacking.BLACK_BIN_NON_RECYCLABLE_WASTE:
      return DOCUMENT_HEALTH_WASTE_PACKING_5;
    default:
      return `[DOCUMENT_HEALTH_WASTE_PACKING_${value}]`;
  }
};

export const DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_COOLING_SYSTEM_0 =
  "Refrigerador ou frigobar";
export const DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_COOLING_SYSTEM_1 = "Câmara fria";
export const DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_COOLING_SYSTEM_2 = "Freezer";
export const DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_COOLING_SYSTEM_3 =
  "Recipiente com Gelo";
export const DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_COOLING_SYSTEM = (
  value: DocumentHealthWastePutrescibleCoolingSystem,
) => {
  switch (value) {
    case DocumentHealthWastePutrescibleCoolingSystem.REFRIGERATOR:
      return DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_COOLING_SYSTEM_0;
    case DocumentHealthWastePutrescibleCoolingSystem.COLD_ROOM:
      return DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_COOLING_SYSTEM_1;
    case DocumentHealthWastePutrescibleCoolingSystem.FREEZER:
      return DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_COOLING_SYSTEM_2;
    case DocumentHealthWastePutrescibleCoolingSystem.ICE_CONTAINER:
      return DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_COOLING_SYSTEM_3;
    default:
      return `[DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_COOLING_SYSTEM_${value}]`;
  }
};

export const DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_0 =
  "Gordura de lipoaspiração";
export const DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_1 =
  "Tecidos orgânicos";
export const DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_2 =
  "Bolsas de sangue";
export const DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_3 =
  "Cadáveres de animais";
export const DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_4 =
  "Sangue e derivados - oriundos de procedimentos e/ou cirurgia";
export const DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_5 =
  "Materiais de curativos";
export const DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_6 =
  "Excreções e secreções";
export const DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_7 =
  "Culturas e/ou meios de cultura";
export const DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_8 =
  "Membros e peças anatômicas";
export const DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_9 = "Órgãos";
export const DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION = (
  value: DocumentHealthWastePutrescibleDescription,
) => {
  switch (value) {
    case DocumentHealthWastePutrescibleDescription.LIPOSUCTION_FAT:
      return DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_0;
    case DocumentHealthWastePutrescibleDescription.ORGANIC_TISSUES:
      return DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_1;
    case DocumentHealthWastePutrescibleDescription.BLOOD_BAGS:
      return DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_2;
    case DocumentHealthWastePutrescibleDescription.ANIMAL_CADAVERS:
      return DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_3;
    case DocumentHealthWastePutrescibleDescription.BLOOD_AND_DERIVATIVES:
      return DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_4;
    case DocumentHealthWastePutrescibleDescription.DRESSING_MATERIALS:
      return DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_5;
    case DocumentHealthWastePutrescibleDescription.EXCRETIONS_AND_SECRETIONS:
      return DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_6;
    case DocumentHealthWastePutrescibleDescription.CULTURES_AND_MEDIA:
      return DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_7;
    case DocumentHealthWastePutrescibleDescription.LIMBS_AND_ANATOMICAL_PIECES:
      return DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_8;
    case DocumentHealthWastePutrescibleDescription.ORGANS:
      return DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_9;
    default:
      return `[DOCUMENT_HEALTH_WASTE_PUTRESCIBLE_DESCRIPTION_${value}]`;
  }
};

export const DOCUMENT_WASTE_UNIT_LONG_0 = "Kg";
export const DOCUMENT_WASTE_UNIT_LONG_1 = "Tonelada(s)";
export const DOCUMENT_WASTE_UNIT_LONG_2 = "Unidade(s)";
export const DOCUMENT_WASTE_UNIT_LONG_3 = "Litro(s)";
export const DOCUMENT_WASTE_UNIT_LONG_4 = "m³";
export const DOCUMENT_WASTE_UNIT_LONG = (value: DocumentWasteUnit) => {
  switch (value) {
    case DocumentWasteUnit.KG:
      return DOCUMENT_WASTE_UNIT_LONG_0;
    case DocumentWasteUnit.TON:
      return DOCUMENT_WASTE_UNIT_LONG_1;
    case DocumentWasteUnit.UN:
      return DOCUMENT_WASTE_UNIT_LONG_2;
    case DocumentWasteUnit.L:
      return DOCUMENT_WASTE_UNIT_LONG_3;
    case DocumentWasteUnit.M3:
      return DOCUMENT_WASTE_UNIT_LONG_4;
    default:
      return `[DOCUMENT_WASTE_UNIT_${value}]`;
  }
};

// DocumentCompanyServiceModes
export const DOCUMENT_COMPANY_SERVICE_MODES_1 = "Clínico";
export const DOCUMENT_COMPANY_SERVICE_MODES_2 = "Ambulatorial";
export const DOCUMENT_COMPANY_SERVICE_MODES_3 = "De Enfermagem";
export const DOCUMENT_COMPANY_SERVICE_MODES_4 = "Domiciliares";
export const DOCUMENT_COMPANY_SERVICE_MODES_5 = "Odontológico";
export const DOCUMENT_COMPANY_SERVICE_MODES_6 = "Médico - Pediatra";
export const DOCUMENT_COMPANY_SERVICE_MODES_7 = "Médico - Ginecológico";
export const DOCUMENT_COMPANY_SERVICE_MODES_8 = "Entrega de Medicamentos";
export const DOCUMENT_COMPANY_SERVICE_MODES_9 = "Educação em Comunidade";
export const DOCUMENT_COMPANY_SERVICE_MODES_10 = "Acupuntura";
export const DOCUMENT_COMPANY_SERVICE_MODES_11 = "Clínica Fisioterápica";
export const DOCUMENT_COMPANY_SERVICE_MODES_12 = "Clínica Veterinária";
export const DOCUMENT_COMPANY_SERVICE_MODES_13 =
  "Farmácias e Farmácias de Manipulação";
export const DOCUMENT_COMPANY_SERVICE_MODES_14 =
  "Laboratório Clínico e Patológico";
export const DOCUMENT_COMPANY_SERVICE_MODES_15 =
  "Necrotérios; Funerárias e Laboratórios que realizam atividades de embalsamento tanatopraxia e somatoconservação";
export const DOCUMENT_COMPANY_SERVICE_MODES_16 =
  "Tatuagem, colocação de piercing e congêneres";
export const DOCUMENT_COMPANY_SERVICE_MODES_99 = "Outros (especificar)";
export const DOCUMENT_COMPANY_SERVICE_MODES = (
  value: DocumentCompanyServiceMode,
) => {
  switch (value) {
    case DocumentCompanyServiceMode.CLINICAL:
      return DOCUMENT_COMPANY_SERVICE_MODES_1;
    case DocumentCompanyServiceMode.OUTPATIENT:
      return DOCUMENT_COMPANY_SERVICE_MODES_2;
    case DocumentCompanyServiceMode.NURSING:
      return DOCUMENT_COMPANY_SERVICE_MODES_3;
    case DocumentCompanyServiceMode.HOUSEHOLD:
      return DOCUMENT_COMPANY_SERVICE_MODES_4;
    case DocumentCompanyServiceMode.DENTAL:
      return DOCUMENT_COMPANY_SERVICE_MODES_5;
    case DocumentCompanyServiceMode.DOCTOR_PEDIATRICIAN:
      return DOCUMENT_COMPANY_SERVICE_MODES_6;
    case DocumentCompanyServiceMode.DOCTOR_GYNECOLOGIST:
      return DOCUMENT_COMPANY_SERVICE_MODES_7;
    case DocumentCompanyServiceMode.MEDICINE_DELIVERY:
      return DOCUMENT_COMPANY_SERVICE_MODES_8;
    case DocumentCompanyServiceMode.COMMUNITY_EDUCATION:
      return DOCUMENT_COMPANY_SERVICE_MODES_9;
    case DocumentCompanyServiceMode.ACUPUNCTURE:
      return DOCUMENT_COMPANY_SERVICE_MODES_10;
    case DocumentCompanyServiceMode.PHYSIOTHERAPY:
      return DOCUMENT_COMPANY_SERVICE_MODES_11;
    case DocumentCompanyServiceMode.VETERINARY:
      return DOCUMENT_COMPANY_SERVICE_MODES_12;
    case DocumentCompanyServiceMode.PHARMACY:
      return DOCUMENT_COMPANY_SERVICE_MODES_13;
    case DocumentCompanyServiceMode.LABORATORY:
      return DOCUMENT_COMPANY_SERVICE_MODES_14;
    case DocumentCompanyServiceMode.MORGUE:
      return DOCUMENT_COMPANY_SERVICE_MODES_15;
    case DocumentCompanyServiceMode.TATTOO:
      return DOCUMENT_COMPANY_SERVICE_MODES_16;
    case DocumentCompanyServiceMode.OTHER:
      return DOCUMENT_COMPANY_SERVICE_MODES_99;
    default:
      return `[DOCUMENT_COMPANY_SERVICE_MODES_${value}]`;
  }
};

export const DOCUMENT_HEALTH_WASTE_GROUP_A_LABEL = "Grupo A";
export const DOCUMENT_HEALTH_WASTE_GROUP_B_LABEL = "Grupo B";
export const DOCUMENT_HEALTH_WASTE_GROUP_C_LABEL = "Grupo C";
export const DOCUMENT_HEALTH_WASTE_GROUP_D_NR_LABEL =
  "Grupo D - Não Reciclável";
export const DOCUMENT_HEALTH_WASTE_GROUP_D_R_LABEL = "Grupo D - Reciclável";
export const DOCUMENT_HEALTH_WASTE_GROUP_E_LABEL = "Grupo E";
export const DOCUMENT_HEALTH_WASTE_LABEL = (
  value: DocumentHealthWasteClass,
) => {
  switch (value) {
    case DocumentHealthWasteClass.GROUP_A:
      return DOCUMENT_HEALTH_WASTE_GROUP_A_LABEL;
    case DocumentHealthWasteClass.GROUP_B:
      return DOCUMENT_HEALTH_WASTE_GROUP_B_LABEL;
    case DocumentHealthWasteClass.GROUP_C:
      return DOCUMENT_HEALTH_WASTE_GROUP_C_LABEL;
    case DocumentHealthWasteClass.GROUP_D_NR:
      return DOCUMENT_HEALTH_WASTE_GROUP_D_NR_LABEL;
    case DocumentHealthWasteClass.GROUP_D_R:
      return DOCUMENT_HEALTH_WASTE_GROUP_D_R_LABEL;
    case DocumentHealthWasteClass.GROUP_E:
      return DOCUMENT_HEALTH_WASTE_GROUP_E_LABEL;
    default:
      return "";
  }
};

export const DOCUMENT_HEALTH_INTERNAL_COLLECTION_TRANSPORT_1 =
  "Container ou Carrinho com rodas";
export const DOCUMENT_HEALTH_INTERNAL_COLLECTION_TRANSPORT_2 = "Remoção manual";
export const DOCUMENT_HEALTH_TRANSPORT_COLLECTOR = (
  value: DocumentHealthInternalCollectionTransport,
) => {
  switch (value) {
    case DocumentHealthInternalCollectionTransport.CART:
      return DOCUMENT_HEALTH_INTERNAL_COLLECTION_TRANSPORT_1;
    case DocumentHealthInternalCollectionTransport.MANUAL:
      return DOCUMENT_HEALTH_INTERNAL_COLLECTION_TRANSPORT_2;
    default:
      return `[DOCUMENT_HEALTH_TRANSPORT_COLLECTOR_${value}]`;
  }
};

export const DOCUMENT_HEALTH_ADDITIONS_SECURITY_VACCINES_0 = "HEPATITE B";
export const DOCUMENT_HEALTH_ADDITIONS_SECURITY_VACCINES_1 = "TÉTANO";
export const DOCUMENT_HEALTH_ADDITIONS_SECURITY_VACCINES_2 = "RUBÉOLA";
export const DOCUMENT_HEALTH_ADDITIONS_SECURITY_VACCINES = (
  value: DocumentHealthAdditionsSecurityVaccines,
) => {
  switch (value) {
    case DocumentHealthAdditionsSecurityVaccines.HEPATITIS_B:
      return DOCUMENT_HEALTH_ADDITIONS_SECURITY_VACCINES_0;
    case DocumentHealthAdditionsSecurityVaccines.TETANUS:
      return DOCUMENT_HEALTH_ADDITIONS_SECURITY_VACCINES_1;
    case DocumentHealthAdditionsSecurityVaccines.RUBELLA:
      return DOCUMENT_HEALTH_ADDITIONS_SECURITY_VACCINES_2;
    default:
      return `[DOCUMENT_HEALTH_ADDITIONS_SECURITY_VACCINES_${value}]`;
  }
};
