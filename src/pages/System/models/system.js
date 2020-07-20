/**
 * Created by 11485 on 2019/2/28.
 */
import {
    AdminqueryAll, AdminqueryList, Adminsave, AdmindeleteById,
    AdminuserqueryList, Adminusersave, AdminuserdeleteById, AdminqueryCompanyList,
    AdminqueryLeafListByParentId, AdmincaqueryAll, Admincasave, AdminprqueryAll, Adminprsave,
    restPassword, NoqueryTreeList, NodeleteById, Nosave, sysqueryList, syssave,
    jgqueryTreeList, jgdeleteById, jgsave, queryListByParentId, AdminuserqueryAll,
    getShiftPage, insertShift, deleteShifts, getScheduleList, insertSchedule, queryUserByRoleId,
    partsqueryList, partsqueryById, partsdeleteById, partssave,
    syscomqueryList, syscomsave, syscomchangeStatus, sysqueryByRoleId, addcomsave,
    queryCondition, queryCount,
    EnequeryList, EneDequeryList, Enesave, EneDesave, EnedeleteById,evenupdate,
    queryYes, queryNo, querysave, queryupdate, csqueryQrCode, deleteBatch


} from '@/services/rs.js'

export default {
    namespace: 'system',
    state: {
        AdminqueryAll: [],
        AdminqueryAllmb: [],
        AdminqueryList: [],
        AdminuserqueryList: [],
        ZNList: [],
        csqueryQrCode: [],
        banci: [],
        partsqueryList: [],
        departmentList: [],
        AdminqueryCompanyList: [],
        AdminqueryLeafListByParentId: [],
        queryListByParentId: [],
        AdmincaqueryAll: [],
        AdminprqueryAll: [],
        NoqueryTreeList: [],
        jgqueryTreeList: [],
        sysqueryList: [],
        queryUserByRoleId: [],
        getShiftPage: [],
        getScheduleList: [],
        getShiftList: [],
        shopList: [],
        shopLists: [],
        roleList: [],
        companyList: [],
        queryCondition: [],
        AdminuserqueryAll: [],
        syscomqueryList: [],
        sysqueryByRoleId: {},
        userList: [],
        userLists: [],//default user list
        shiftList: [],
        partsqueryById: [],
        departmentLists: [],
        queryCount: [],
        EnequeryList: [],
        EneDequeryList: [],
        company: {},
        haveItemList: [],
        queryYes: {},
        queryNo: {},
        code: {}
    },
    effects: {
        *csqueryQrCode({ payload }, { call, put }) {//datalist
            const responese = yield call(csqueryQrCode, payload);
            yield put({
                type: 'updateState',
                payload: { csqueryQrCode: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *queryYes({ payload }, { call, put }) {//datalist
            const responese = yield call(queryYes, payload);
            yield put({
                type: 'updateState',
                payload: { queryYes: responese.data.yes ? responese.data.yes : [] }
            })

            yield put({
                type: 'updateState',
                payload: { haveItemList: responese.data.have ? responese.data.have : [] }
            })
            return responese.code == "0000"
        },
        *queryNo({ payload }, { call, put }) {//datalist
            const responese = yield call(queryNo, payload);
            yield put({
                type: 'updateState',
                payload: { queryNo: responese.data.no ? responese.data.no : [] }
            })
            return responese.code == "0000"
        },


        *queryCount({ payload }, { call, put }) {//datalist
            const responese = yield call(queryCount, payload);
            yield put({
                type: 'updateState',
                payload: { queryCount: responese.data ? responese.data : [] }
            })

            yield put({
                type: 'updateState',
                payload: { company: responese.data.company ? responese.data.company : [] }
            })
            return responese.code == "0000"
        },
        *EnequeryList({ payload }, { call, put }) {//datalist
            const responese = yield call(EnequeryList, payload);
            yield put({
                type: 'updateState',
                payload: { EnequeryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })

            return responese.code == "0000"
        },
        *EneDequeryList({ payload }, { call, put }) {//datalist
            const responese = yield call(EneDequeryList, payload);
            yield put({
                type: 'updateState',
                payload: { EneDequeryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *partsqueryById({ payload }, { call, put }) {//datalist
            const responese = yield call(partsqueryById, payload);
            yield put({
                type: 'updateState',
                payload: { partsqueryById: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *queryCondition({ payload }, { call, put }) {//datalist
            const responese = yield call(queryCondition, payload);
            yield put({
                type: 'updateState',
                payload: { shiftList: responese.data.shiftList ? responese.data.shiftList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { userList: responese.data.userList ? responese.data.userList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shopList: responese.data.shopList ? responese.data.shopList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { roleList: responese.data.roleList ? responese.data.roleList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { departmentLists: responese.data.departmentList ? responese.data.departmentList : [] }
            })
            return responese.code == "0000"
        },
        *syscomqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(syscomqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { syscomqueryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *sysqueryByRoleId({ payload }, { call, put }) {//datalist
            const responese = yield call(sysqueryByRoleId, payload);
            yield put({
                type: 'updateState',
                payload: { sysqueryByRoleId: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *partsqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(partsqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { partsqueryList: responese.data.shopOfCompanyList ? responese.data.shopOfCompanyList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { nodeList: responese.data.nodeList ? responese.data.nodeList : [] }
            })
            return responese.code == "0000"
        },
        *AdminuserqueryAll({ payload }, { call, put }) {//datalist
            const responese = yield call(AdminuserqueryAll, payload);
            yield put({
                type: 'updateState',
                payload: { AdminuserqueryAll: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *queryUserByRoleId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryUserByRoleId, payload);
            yield put({
                type: 'updateState',
                payload: { queryUserByRoleId: responese.data.page ? responese.data.page : [] }
            })

            yield put({
                type: 'updateState',
                payload: { departmentList: responese.data.dataList ? responese.data.dataList : [] }
            })

            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })

            return responese.code == "0000"
        },

        *getShiftPage({ payload }, { call, put }) {//datalist
            const responese = yield call(getShiftPage, payload);
            yield put({
                type: 'updateState',
                payload: { getShiftPage: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
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
                payload: { ZNList: responese.data.ZNList ? responese.data.ZNList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { banci: responese.data.data ? responese.data.data : [] }
            })
            yield put({
                type: 'updateState',
                payload: { departmentList: responese.data.dataList ? responese.data.dataList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shopLists: responese.data.shopList ? responese.data.shopList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { roleList: responese.data.roleList ? responese.data.roleList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { userLists: responese.data.userList ? responese.data.userList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
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
        *syscomsave({ payload }, { call, put }) {//data
            const responese = yield call(syscomsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *syscomchangeStatus({ payload }, { call, put }) {//data
            const responese = yield call(syscomchangeStatus, payload);
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

        *Enesave({ payload }, { call, put }) {//data
            const responese = yield call(Enesave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *EneDesave({ payload }, { call, put }) {//data
            const responese = yield call(EneDesave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *evenupdate({ payload }, { call, put }) {//data
            const responese = yield call(evenupdate, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *EnedeleteById({ payload }, { call, put }) {//data
            const responese = yield call(EnedeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *deleteBatch({ payload }, { call, put }) {//data
            const responese = yield call(deleteBatch, payload);
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

        *querysave({ payload }, { call, put }) {//data
            const responese = yield call(querysave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *queryupdate({ payload }, { call, put }) {//data
            const responese = yield call(queryupdate, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *addcomsave({ payload }, { call, put }) {//data
            const responese = yield call(addcomsave, payload);
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

        *partsdeleteById({ payload }, { call, put }) {//data
            const responese = yield call(partsdeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *partssave({ payload }, { call, put }) {//data
            const responese = yield call(partssave, payload);
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
