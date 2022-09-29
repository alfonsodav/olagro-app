import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ProductLot} from '@core/models/product-lot';
import {AuthService} from '@core/services/auth.service';
import {Product} from '@core/models/product';
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiUrl = this.auth.apiUrl;
  private productLotsUrl = this.apiUrl + '/productLots';
  private productLotsStatsUrl = this.apiUrl + '/productLotsStats';
  private productsUrl = this.apiUrl + '/products';
  private productPriceUrl = this.apiUrl + '/productPrices';
  private productTypesUrl = this.apiUrl + '/productTypes';
  constructor(private auth: AuthService, private http: HttpClient){
  }

  getProductLots(queryParams: string): Observable<any> {
    return this.http.get<any>(this.productLotsUrl + queryParams, {headers: this.auth.headers});
  }

  getProductLot(id: number): Observable<any> {
    return this.http.get(this.productLotsUrl + `/${id}`, {headers: this.auth.headers});
  }

  publishProductLot(productLot: any): Observable<any> {
    return this.http.post<any>(this.productLotsUrl + '/publish', productLot, {headers: this.auth.headers});
  }

  addProductLot(productLot: ProductLot): Observable<ProductLot> {
    const formData = new FormData();
    formData.append('productLotSellerId', productLot.productLotSellerId.toString());
    formData.append('productId', productLot.productId.toString());
    formData.append('productMassMeasurementId', productLot.productMassMeasurementId.toString());
    formData.append('productQualityId', productLot.productQualityId.toString());
    formData.append('productLotQuantity', productLot.productLotQuantity.toString());
    formData.append('productLotAvailableDate', productLot.productLotAvailableDate.toString());
    formData.append('productLotCultivatedArea', productLot.productLotCultivatedArea.toString());
    formData.append('productLotCultivatedAreaAddress', productLot.productLotCultivatedAreaAddress.toString());
    formData.append('productLotCultivatedAreaPerformance', productLot.productLotCultivatedAreaPerformance.toString());
    formData.append('productLotProductionMode', productLot.productLotProductionMode.toString());
    formData.append('productLotSaleType', productLot.productLotSaleType.toString());
    formData.append('productLotSalePrice', productLot.productLotSalePrice.toString());
    formData.append('productLotPickupAddress', productLot.productLotPickupAddress.toString());

    return this.http.post<ProductLot>(this.productLotsUrl, formData, {headers: this.auth.headers});
  }

  updateProductLot(productLot: ProductLot, id: number): Observable<ProductLot> {
    const formData = new FormData();
    formData.append('productLotSellerId', productLot.productLotSellerId.toString());
    formData.append('productId', productLot.productId.toString());
    formData.append('productMassMeasurementId', productLot.productMassMeasurementId.toString());
    formData.append('productQualityId', productLot.productQualityId.toString());
    formData.append('productLotQuantity', productLot.productLotQuantity.toString());
    formData.append('productLotAvailableDate', productLot.productLotAvailableDate.toString());
    formData.append('productLotCultivatedArea', productLot.productLotCultivatedArea.toString());
    formData.append('productLotCultivatedAreaAddress', productLot.productLotCultivatedAreaAddress.toString());
    formData.append('productLotCultivatedAreaPerformance', productLot.productLotCultivatedAreaPerformance.toString());
    formData.append('productLotProductionMode', productLot.productLotProductionMode.toString());
    formData.append('productLotSaleType', productLot.productLotSaleType.toString());
    formData.append('productLotSalePrice', productLot.productLotSalePrice.toString());
    formData.append('productLotPickupAddress', productLot.productLotPickupAddress.toString());
    formData.append('_method', 'PUT');

    return this.http.post<ProductLot>(this.productLotsUrl + `/${id}`, formData, {headers: this.auth.headers});
  }

  deleteProductLot(id: number, userId: number): Observable<any> {
    const options = {
      body: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        user_id: userId
      },
      headers: new HttpHeaders({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json'
      }),
    };
    return this.http.delete<any>(this.productLotsUrl + `/${id}`, options);
  }

  getStats(queryParams: string): Observable<any> {
    return this.http.get<any>(this.productLotsStatsUrl + queryParams, {headers: this.auth.headers});
  }

  getProducts(queryParams: string): Observable<any> {
    return this.http.get<Product[]>(this.productsUrl + queryParams, {headers: this.auth.headers});
  }

  getCatalog(queryParams: string): Observable<any> {
    return this.http.get<Product[]>(this.productsUrl , {headers: this.auth.headers});
  }

  /** GET content detail from content-detail endpoint */
  getProduct(id: number): Observable<any> {
    return this.http.get<Product>(this.productsUrl + `/${id}`, {headers: this.auth.headers});
  }

  getProductPrices(queryParams: string): Observable<any[]> {
    return this.http.get<any[]>(this.productPriceUrl + queryParams, {headers: this.auth.headers});
  }

  getProductPrice(id: number): Observable<any> {
    return this.http.get(this.productPriceUrl + `/${id}`, {headers: this.auth.headers});
  }
  getProductTypes(queryParams: string): Observable<any> {
    return this.http.get<any>(this.productTypesUrl + queryParams, {headers: this.auth.headers});
  }
  addProduct(product: Product): Observable<Product> {
    const formData = new FormData();
    formData.append('product_name', product.product_name);
    formData.append('product_image', product.product_image);
    formData.append('product_type_code', product.product_type_code.toString());
    if (product.resourceFile) {
      formData.append('resourceFile', product.resourceFile);
    }

    return this.http.post<Product>(this.productsUrl, formData, {headers: this.auth.headers});
  }
  getProductMassMeasurements(queryParams: string): Observable<any> {
    return this.http.get(this.apiUrl+ '/productMassMeasurements' + queryParams, {headers: this.auth.headers});
  }

  getProductQualities(queryParams: string): Observable<any> {
    return this.http.get(this.apiUrl + '/productQualities' + queryParams, {headers: this.auth.headers});
  }
  getPurchaseTypes(): Observable<any> {
    return this.http.get(this.apiUrl + '/purchaseTypes', {headers: this.auth.headers});
  }
}
