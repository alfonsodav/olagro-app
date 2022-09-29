import { Roles } from './roles';
export interface User {
  id: number;
  name: string;
  email: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  email_verified_at: any;
  password: string;
  phone: string;
  departmentId: number;
  municipalityId: number;
  address: string;
  lat: string;
  long: string;
  sex: string;
  identity: string;
  identityImage: string;
  rtn: string;
  rtnImage: string;
  role: string;
  groupId?: number;
  groupImage?: string;
  vehicleDescription?: string;
  contract?: string;
  agree?: string;
  endsDate?: string;
  authorizationDate?: string;
  companyName?: string;
  companyAddress?: string;
  companyRTN?: string;
  companyRTNImage?: string;
  companyPosition?: string;
  bankName?: string;
  bankAccount?: string;
  status?: boolean;
  new?: boolean;
  passwordAttempt?: boolean;
  resourceFile?: any;
  departamento: {
    departamento: string;
  };
  municipio: {
    municipio: string;
  };
  roles: Roles;
  group: any;
}
