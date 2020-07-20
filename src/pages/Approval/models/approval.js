/**
 * Created by 11485 on 2019/2/28.//
 */
import {
    queryNoReview, auditReview, queryYesReview, gosave, queryByApprovalProcessType, approvalProcess, recallqueryList, recallById, godetailqueryById,
    getqueryList, getsave, getqueryListAndApplyInfo, getrecall, getaudit, weiqueryList, weiauditExternalRepair, weiconfigBack,
    queryApprovalTypeCount,
    buyqueryList, buyaudit, buyrecall



} from '@/services/rs.js'

export default {
    namespace: 'approval',
    state: {
        queryReview: {},
        queryByApprovalProcessType: {},
        userList: [],
        transferType: [],
        departmentList: [],
        recallqueryList: [],
        godetailqueryById: [],
        relList: [],
        getqueryListAndApplyInfo: [],
        sparePartsApply: [],
        getqueryList: {},
        weiqueryList: [],
        queryApprovalTypeCount: [],
        buyqueryList: [],

        code: {}
    },
    effects: {
        *buyqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(buyqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { buyqueryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *weiqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(weiqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { weiqueryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *queryApprovalTypeCount({ payload }, { call, put }) {//datalist
            const responese = yield call(queryApprovalTypeCount, payload);
            yield put({
                type: 'updateState',
                payload: { queryApprovalTypeCount: responese.data.dataList ? responese.data.dataList : [] }
            })

            return responese.code == "0000"
        },
        *getqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(getqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { getqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { userList: responese.data.userList ? responese.data.userList : [] }
            })
            return responese.code == "0000"
        },
        *getqueryListAndApplyInfo({ payload }, { call, put }) {//datalist
            const responese = yield call(getqueryListAndApplyInfo, payload);
            yield put({
                type: 'updateState',
                payload: { getqueryListAndApplyInfo: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { sparePartsApply: responese.data.sparePartsApply ? responese.data.sparePartsApply : [] }
            })
            return responese.code == "0000"
        },
        *godetailqueryById({ payload }, { call, put }) {//datalist
            const responese = yield call(godetailqueryById, payload);
            yield put({
                type: 'updateState',
                payload: { godetailqueryById: responese.data.data ? responese.data.data : [] }
            })
            yield put({
                type: 'updateState',
                payload: { relList: responese.data.relList ? responese.data.relList : [] }
            })
            return responese.code == "0000"
        },
        *approvalProcess({ payload }, { call, put }) {//data
            const responese = yield call(approvalProcess, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *recallById({ payload }, { call, put }) {//data
            const responese = yield call(recallById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *queryByApprovalProcessType({ payload }, { call, put }) {//datalist
            const responese = yield call(queryByApprovalProcessType, payload);
            yield put({
                type: 'updateState',
                payload: { queryByApprovalProcessType: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { userList: responese.data.userList ? responese.data.userList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { transferType: responese.data.transferType ? responese.data.transferType : [] }
            })
            yield put({
                type: 'updateState',
                payload: { departmentList: responese.data.departmentList ? responese.data.departmentList : [] }
            })
            return responese.code == "0000"
        },
        *gosave({ payload }, { call, put }) {//datalist
            const responese = yield call(gosave, payload);
            yield put({
                type: 'updateState',
                payload: { queryReview: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *recallqueryList({ payload }, { call, put }) {//
            const responese = yield call(recallqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { recallqueryList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *getaudit({ payload }, { call, put }) {//datalist
            const responese = yield call(getaudit, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *getrecall({ payload }, { call, put }) {//datalist
            const responese = yield call(getrecall, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *weiauditExternalRepair({ payload }, { call, put }) {//datalist
            const responese = yield call(weiauditExternalRepair, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *weiconfigBack({ payload }, { call, put }) {//datalist
            const responese = yield call(weiconfigBack, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *queryNoReview({ payload }, { call, put }) {//datalist
            const responese = yield call(queryNoReview, payload);
            yield put({
                type: 'updateState',
                payload: { queryReview: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *getsave({ payload }, { call, put }) {//datalist
            const responese = yield call(getsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *queryYesReview({ payload }, { call, put }) {//datalist
            const responese = yield call(queryYesReview, payload);
            yield put({
                type: 'updateState',
                payload: { queryReview: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },

        *auditReview({ payload }, { call, put }) {//datalist
            const responese = yield call(auditReview, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *buyaudit({ payload }, { call, put }) {//datalist
            const responese = yield call(buyaudit, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *buyrecall({ payload }, { call, put }) {//datalist
            const responese = yield call(buyrecall, payload);
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
