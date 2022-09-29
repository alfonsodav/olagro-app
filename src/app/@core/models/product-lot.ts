/* eslint-disable @typescript-eslint/naming-convention */
import { ProductLotImage } from './product-lot-image';
import { Auction } from './auction';
import { User } from './user';

export interface ProductLot {
  productLotId?: number;
  productLotName?: string;
  productLotSellerId?: number;
  productId?: number;
  productName?: string;
  productImage?: string;
  productTypeId?: number;
  productMassMeasurementId?: number;
  productMassMeasurementName?: string;
  productQualityId?: number;
  productQualityName?: string;
  productQualityDescription?: string;
  productLotQuantity?: number;
  productLotAvailableDate?: any;
  productLotExpirationDate?: any;
  productLotCultivatedArea?: string;
  productLotCultivatedAreaAddress?: string;
  productLotCultivatedAreaPerformance?: string;
  productLotProductionMode?: string;
  productLotSaleType?: number;
  productLotSalePrice?: number;
  productLotImage?: string;
  productLotPickupAddress?: string;
  productLotStatus?: number;
  created_at?: any;
  updated_at?: any;
  productLotImages?: ProductLotImage[];
  auctions?: Auction[];
  productLotPublished?: number;
  seller?: User;

}
