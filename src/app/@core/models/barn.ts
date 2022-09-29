/* eslint-disable @typescript-eslint/naming-convention */
export interface Barn {
  user_id?: number;
  productTypeId?: number;
  cultivated_area?: number;
  estimated_production?: number;
  productMassMeasurementId?: number;
  production_mode?: string;
  harvest_date?: Date;
  price?: number;
  cultivated_area_address?: string;
  status?: string;
}
