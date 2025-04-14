// store/sagas/superAdminSaga.ts
import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchModulesRequest,
  fetchModulesSuccess,
  fetchModulesFailure,
  fetchCurrentModuleRequest,
  fetchCurrentModuleSuccess,
  fetchCurrentModuleFailure,
  updateCurrentModuleRequest,
  updateCurrentModuleSuccess,
  updateCurrentModuleFailure,
  updateAdminProfileSuccess,
  updateAdminProfileFailure,
  updateAdminProfileRequest,
} from '../slices/dashboardSlice';
import { dashboardService } from '@/lib/api/services/dashboard/dashboardService';
import { UpdateAdminProfileActionPayload } from '@/types/dashboard';

function* handleFetchModules(): Generator<any, void, any> {
  try {
    const response = yield call(dashboardService.fetchModules);
    const modules = response?.data?.modules || [];
    yield put(fetchModulesSuccess(modules));
  } catch (error: any) {
    yield put(fetchModulesFailure(error.message || 'Something went wrong'));
  }
}

function* handleFetchCurrentModule(): Generator<any, void, any> {
  try {
    const response = yield call(dashboardService.fetchCurrentModule);
    if (response.success) {
      yield put(fetchCurrentModuleSuccess(response.data.current_module));
    } else {
      yield put(fetchCurrentModuleFailure(response.message || 'Something went wrong'));
    }
  } catch (error: any) {
    yield put(fetchCurrentModuleFailure(error.message || 'Something went wrong'));
  }
}

function* handleUpdateCurrentModule(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    const response = yield call(dashboardService.updateCurrentModule, action.payload);
    yield put(updateCurrentModuleSuccess(response.data.current_module));
  } catch (error: any) {
    yield put(updateCurrentModuleFailure(error?.response?.data?.message || 'Something went wrong'));
  }
}

function* handleUpdateAdminProfile(
  action: PayloadAction<UpdateAdminProfileActionPayload>
): any {
  try {
    const { id, payload } = action.payload;
    const response = yield call(dashboardService.updateAdminProfile, id, payload);
    yield put(updateAdminProfileSuccess(response));
  } catch (error: any) {
    yield put(updateAdminProfileFailure(error?.response?.data?.message || 'Something went wrong'));
  }
}

export function* dashboardSaga() {
  yield takeLatest(fetchModulesRequest.type, handleFetchModules);
  yield takeLatest(fetchCurrentModuleRequest.type, handleFetchCurrentModule);
  yield takeLatest(updateCurrentModuleRequest.type, handleUpdateCurrentModule);
  yield takeLatest(updateAdminProfileRequest.type, handleUpdateAdminProfile);
}
