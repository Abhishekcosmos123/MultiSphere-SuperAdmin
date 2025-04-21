import { AdminProfilePayload, FetchModulesResponse, UpdateCoordinatorResponse, UpdateVendorResponse } from '@/types/dashboard';
import { apiClient } from '../../client';

export const dashboardService = {
  async fetchModules(): Promise<FetchModulesResponse> {
    return apiClient.post('/super-admin/modules');
  },

  async fetchCurrentModule(): Promise<FetchModulesResponse> {
    return apiClient.post('/super-admin/current-module');
  },

  async updateCurrentModule(moduleName: string): Promise<FetchModulesResponse> {
    return apiClient.put(`/super-admin/current-module`, { moduleName });
  },

  async updateAdminProfile(id: string, payload: AdminProfilePayload): Promise<FetchModulesResponse> {
    return apiClient.patch(`/super-admin/profile/${id}`, payload);
  },

  async updateCoordinator(
    coordinatorData: Record<string, boolean>,
    producerData: Record<string, boolean>,
    currentModule: string,
    jsonFile?: File
  ): Promise<UpdateCoordinatorResponse> {
    const formData = new FormData();
    formData.append('use_coordinator', JSON.stringify(coordinatorData));
    formData.append('use_producers', JSON.stringify(producerData));
    formData.append('current_module', currentModule);

    if (jsonFile) {
      formData.append('jsonFile', jsonFile, jsonFile.name);
    }
  
    return apiClient.patch(`/super-admin/update-module`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}; 