
export interface FetchModulesResponse {
    success: boolean;
    message: string;
    data: {
      modules: string[];
      useCoordinator: { [key: string]: boolean };
      useProducers: { [key: string]: boolean };
    };
  }

export interface SuperAdminState {
    modules: string[];
    loading: boolean;
    error: string | null;
    currentModule: string | null;
    success: boolean;
    successMessage: string | null;
    profile: AdminProfileResponse | null;
    useProducer: boolean | null;
    useCoordinator: { [key: string]: boolean };
    coordinator: Record<string, boolean>;
    useProducerr: { [key: string]: boolean };
  }
  
  export interface AdminProfilePayload {
    name: string;
    phone: string;
    email: string;
    country_code: string;
  }

  export interface UpdateUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    country_code: string;
    is_active: boolean;
    provider: string;
    created_by: string;
    updated_by: string;
    is_deleted: boolean;
    profile_pic: string;
    role: string;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface UpdateUserPayload {
    userId: string;
    userData: Partial<UpdateUser>;
  }

  export interface AdminProfileResponse {
    success: boolean;
    message: string;
    data: {
      id: string;
      name: string;
      email: string;
      phone: string;
      country_code: string;
      provider: string;
      role: string;
      created_at: string;
      updated_at: string;
      is_active: boolean;
      is_deleted: boolean;
    };
  }

  export type UpdateAdminProfileActionPayload = {
    id: string;
    payload: AdminProfilePayload;
  };
  
  export interface UpdateVendorResponse {
    success: boolean;
    message: string;
    data: {
      use_producer: boolean;
    };
  }

  export interface UpdateCoordinatorResponse {
    success: boolean;
    message: string;
    data: {
      updatedCoordinator: Record<string, boolean>;
    };
  }

  export type UpdateCoordinatorPayload = {
    coordinatorData: Record<string, boolean>;
    producerData: Record<string, boolean>;
  };