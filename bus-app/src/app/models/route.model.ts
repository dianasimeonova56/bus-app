export interface Route {
  startStop: {
    stopId: string;
    sector: number;
  };
  endStop: {
    stopId: string;
    sector: number;
  };
  distance: Number;
  duration: String;
  days: String[];
  stops: {
    stopId: string;
    arrivalTime: string;
    departureTime: string;
    order: number;
    sector: number;
  }[];
  transportOperator: string;
  startHour: String;
  arrivalHour: String;
}