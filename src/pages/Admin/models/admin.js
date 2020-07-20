/**
 * Created by 11485 on 2019/2/28.
 */
import {
    AdminqueryAll, AdminqueryList, Adminsave, AdmindeleteById,
    AdminuserqueryList, Adminusersave, AdminuserdeleteById, AdminqueryCompanyList,
    AdminqueryLeafListByParentId, AdmincaqueryAll, Admincasave, AdminprqueryAll, Adminprsave,
    restPassword, NoqueryTreeList, NodeleteById, Nosave, sysqueryList, syssave,
    jgqueryTreeList, jgdeleteById, jgsave, queryListByParentId,
    getShiftPage, insertShift, deleteShifts, getScheduleList, insertSchedule,
    adminqueryList, adminupdate,queryByCompanyId


} from '@/services/rs.js'

export default {
    namespace: 'admin',
    state: {
        adminqueryList: [],
        AdminqueryAll: [],
        AdminqueryAllmb: [],
        AdminqueryList: [],
        AdminuserqueryList: [],
        banci: [],
        AdminqueryCompanyList: [],
        AdminqueryLeafListByParentId: [],
        queryListByParentId: [],
        AdmincaqueryAll: [],
        AdminprqueryAll: [],
        NoqueryTreeList: [],
        jgqueryTreeList: [],
        sysqueryList: [],

        queryByCompanyId:[],
        companyList:[],

        getShiftPage: [],
        getScheduleList: [],
        getShiftList: [],

        code: {}
    },
    effects: {
        *queryByCompanyId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryByCompanyId, payload);
            yield put({
                type: 'updateState',
                payload: { queryByCompanyId: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })
            return responese.code == "0000"
        },
        
        *adminqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(adminqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { adminqueryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },

        *getShiftPage({ payload }, { call, put }) {//datalist
            const responese = yield call(getShiftPage, payload);
            yield put({
                type: 'updateState',
                payload: { getShiftPage: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *getScheduleList({ payload }, { call, put }) {//datalist   
            const responese = yield call(getScheduleList, payload);
            yield put({
                type: 'updateState',
                payload: { getScheduleList: responese.data.sysShiftScheduleList ? responese.data.sysShiftScheduleList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { getShiftList: responese.data.sysShiftList ? responese.data.sysShiftList : [] }
            })
            return responese.code == "0000"
        },
        *jgqueryTreeList({ payload }, { call, put }) {//datalist
            const responese = yield call(jgqueryTreeList, payload);
            yield put({
                type: 'updateState',
                payload: { jgqueryTreeList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *sysqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(sysqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { sysqueryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *NoqueryTreeList({ payload }, { call, put }) {//datalist
            const responese = yield call(NoqueryTreeList, payload);
            yield put({
                type: 'updateState',
                payload: { NoqueryTreeList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *AdminprqueryAll({ payload }, { call, put }) {//datalist
            const responese = yield call(AdminprqueryAll, payload);
            yield put({
                type: 'updateState',
                payload: { AdminprqueryAll: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *AdmincaqueryAll({ payload }, { call, put }) {//datalist
            const responese = yield call(AdmincaqueryAll, payload);
            yield put({
                type: 'updateState',
                payload: { AdmincaqueryAll: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *queryListByParentId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryListByParentId, payload);
            yield put({
                type: 'updateState',
                payload: { queryListByParentId: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *AdminqueryLeafListByParentId({ payload }, { call, put }) {//datalist
            const responese = yield call(AdminqueryLeafListByParentId, payload);
            yield put({
                type: 'updateState',
                payload: { AdminqueryLeafListByParentId: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *AdminqueryCompanyList({ payload }, { call, put }) {//datalist
            const responese = yield call(AdminqueryCompanyList, payload);
            yield put({
                type: 'updateState',
                payload: { AdminqueryCompanyList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *AdminqueryAll({ payload }, { call, put }) {//datalist
            const responese = yield call(AdminqueryAll, payload);
            yield put({
                type: 'updateState',
                payload: { AdminqueryAll: responese.data.dataList ? responese.data.dataList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { AdminqueryAllmb: responese.data.data ? responese.data.data : [] }
            })

            return responese.code == "0000"
        },

        *AdminuserqueryList({ payload }, { call, put }) {//page
            const responese = yield call(AdminuserqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { AdminuserqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { banci: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *restPassword({ payload }, { call, put }) {//data
            const responese = yield call(restPassword, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *Adminprsave({ payload }, { call, put }) {//data
            const responese = yield call(Adminprsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *jgdeleteById({ payload }, { call, put }) {//data
            const responese = yield call(jgdeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *jgsave({ payload }, { call, put }) {//data
            const responese = yield call(jgsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *insertShift({ payload }, { call, put }) {//data
            const responese = yield call(insertShift, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *deleteShifts({ payload }, { call, put }) {//data
            const responese = yield call(deleteShifts, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *insertSchedule({ payload }, { call, put }) {//data
            const responese = yield call(insertSchedule, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *Admincasave({ payload }, { call, put }) {//data
            const responese = yield call(Admincasave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *Nosave({ payload }, { call, put }) {//data
            const responese = yield call(Nosave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *syssave({ payload }, { call, put }) {//data
            const responese = yield call(syssave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *adminupdate({ payload }, { call, put }) {//data
            const responese = yield call(adminupdate, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *Adminusersave({ payload }, { call, put }) {//data
            const responese = yield call(Adminusersave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *AdminuserdeleteById({ payload }, { call, put }) {//data
            const responese = yield call(AdminuserdeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *NodeleteById({ payload }, { call, put }) {//data
            const responese = yield call(NodeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *AdminqueryList({ payload }, { call, put }) {//page
            const responese = yield call(AdminqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { AdminqueryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },

        *Adminsave({ payload }, { call, put }) {//data
            const responese = yield call(Adminsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *AdmindeleteById({ payload }, { call, put }) {//data
            const responese = yield call(AdmindeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },


    },

    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        },
    }
}
