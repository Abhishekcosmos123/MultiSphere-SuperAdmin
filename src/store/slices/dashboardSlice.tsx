import { AdminProfilePayload, AdminProfileResponse, FetchModulesResponse, SuperAdminState, UpdateCoordinatorPayload } from '@/types/dashboard';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: SuperAdminState = {
  modules: [] as string[],
  loading: false,
  error: null,
  currentModule: null,
  success: false,
  successMessage: null,
  profile: null,
  useProducer: null,
  useCoordinator: {} as { [key: string]: boolean },
  coordinator: {},
  useProducerr: {} as { [key: string]: boolean },
};

const superAdminSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchModulesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchModulesSuccess: (state, action: PayloadAction<FetchModulesResponse>) => {
      state.loading = false;
      state.modules = action.payload.data.modules;
      state.useCoordinator = action.payload.data?.useCoordinator;
      state.useProducerr = action.payload.data?.useProducers;
    },
    fetchModulesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchCurrentModuleRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCurrentModuleSuccess(state, action: PayloadAction<string>) {
      state.currentModule = action.payload;
      state.loading = false;
    },
    fetchCurrentModuleFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    updateCurrentModuleRequest(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    updateCurrentModuleSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.success = true;
      state.currentModule = action.payload;
    },
    updateCurrentModuleFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetUpdateCurrentModule(state) {
      state.success = false;
      state.error = null;
    },
    clearloading: (state) => {
      state.loading = false;
      state.error = null;
    },
    updateAdminProfileRequest: (
      state,
      _action: PayloadAction<{ id: string; payload: AdminProfilePayload }>
    ) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    },
    updateAdminProfileSuccess: (state, action: PayloadAction<AdminProfileResponse>) => {
      state.loading = false;
      state.profile = action.payload;
      state.successMessage = action.payload.message;
    },
    updateAdminProfileFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateCoordinatorAsync: (state, action: PayloadAction<UpdateCoordinatorPayload>) => {
      state.successMessage = null;
      state.loading = true;
      state.error = null;
    },
    updateCoordinatorAsyncSuccess: (
      state,
      action: PayloadAction<{ success: boolean; message: string; data: Record<string, boolean> }>
    ) => {
      state.loading = false;
      state.coordinator = action.payload.data;
      state.successMessage = action.payload.message;
    },
    updateCoordinatorAsyncFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchModulesRequest,
  fetchModulesSuccess,
  fetchModulesFailure,
  fetchCurrentModuleRequest,
  fetchCurrentModuleSuccess,
  fetchCurrentModuleFailure,
  updateCurrentModuleRequest,
  updateCurrentModuleSuccess,
  updateCurrentModuleFailure,
  resetUpdateCurrentModule,
  clearloading,
  updateAdminProfileRequest,
  updateAdminProfileSuccess,
  updateAdminProfileFailure,
  updateCoordinatorAsync,
  updateCoordinatorAsyncSuccess,
  updateCoordinatorAsyncFailure,
} = superAdminSlice.actions;

export default superAdminSlice.reducer;
