export interface ILocation {
  neighborhood?: string;
  cep: string;
  city?: string;
  street: string;
  state: string;
  coordinates?: IGMapsCoordinates;
}

export interface IGMaps {
  results: IGMapsRes[];
  status:
    | "OK"
    | "ZERO_RESULTS"
    | "OVER_DAILY_LIMIT"
    | "OVER_QUERY_LIMIT"
    | "REQUEST_DENIED"
    | "INVALID_REQUEST"
    | "UNKNOWN_ERROR";
}

export interface IGMapsRes {
  address_components: IGMapsAddressComponent[];
  formatted_address: string;
  geometry: IGMapsGeometry;
  types: string[];
}

export interface IGMapsAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface IGMapsGeometry {
  location: IGMapsCoordinates;
  location_type: string;
}

export interface IGMapsCoordinates {
  lat: number;
  lng: number;
}

export interface IViaCepZipRes {
  bairro: string;
  cep: string;
  complemento: string;
  ddd: string;
  gia: string;
  ibge: string;
  localidade: string;
  logradouro: string;
  siafi: string;
  uf: string;
  erro?: boolean;
}
