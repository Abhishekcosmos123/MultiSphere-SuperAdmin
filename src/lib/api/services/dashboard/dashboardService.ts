import { AdminProfilePayload, FetchModulesResponse } from '@/types/dashboard';
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
}; 