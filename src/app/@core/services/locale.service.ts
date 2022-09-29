import {Injectable} from '@angular/core';
import {BaseService} from '@core/services/base.service';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocaleService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getDepartament() {
    return this.http.get(this.baseUrl + '/departamentos')
      .pipe(map(roles => roles));
  }

  getMunicipe(departamentoId: number) {
    return this.http.get(this.baseUrl + '/municipios/' + departamentoId)
      .pipe(map(data => data));
  }
}
