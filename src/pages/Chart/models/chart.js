/**
 * Created by 11485 on 2019/2/28.//
 */
import {
    deviceTypequeryTreeList, queryDiagram, queryOEE, queryJIA, queryMTTR, queryMTBF, querySTOP, queryCondition, Energychart,
    queryTypeFault, queryTypeFaultByCompanyId, queryFaultTypeFault, queryFaultTypeFaultByCompanyId, queryTaskRate, queryDailyReport,
    queryMonthlyReport

} from '@/services/rs.js'

export default {
    namespace: 'chart',
    state: {
        deviceTypequeryTreeList: [],
        queryDiagram: [],
        companyDepartList: [],
        queryOEE: [],
        queryJIA: [],
        queryMTTR: [],
        queryMTBF: [],
        queryTaskRate: [],
        querySTOP: [],
        companyList: [],
        queryCondition: [],
        shiftList: [],
        userList: [],
        shopList: [],
        departmentList: [],
        equipmentTypeLeafList: [],
        Energychart: [],
        queryTypeFault: {},
        queryTypeFaultByCompanyId: [],
        queryFaultTypeFault: {},
        queryFaultTypeFaultByCompanyId: [],
        main: [],
        mains: [],
        total: [],
        totals: [],
        detail: [],
        details: [],
        shiftList: [],
        code: {}
    },
    effects: {
        *queryDailyReport({ payload }, { call, put }) {//datalist
            const responese = yield call(queryDailyReport, payload);
            yield put({
                type: 'updateState',
                payload: { main: responese.data.data ? responese.data.data.dailyReport : [] }
            })
            yield put({
                type: 'updateState',
                payload: { total: responese.data.data ? responese.data.data.total : [] }
            })
            yield put({
                type: 'updateState',
                payload: { detail: responese.data.data ? responese.data.data.detail : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shiftList: responese.data.shiftList ? responese.data.shiftList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })
            return responese.code == "0000"
        },
        *queryMonthlyReport({ payload }, { call, put }) {//datalist
            const responese = yield call(queryMonthlyReport, payload);
            yield put({
                type: 'updateState',
                payload: { mains: responese.data.data ? responese.data.data.monthlyReport : [] }
            })
            yield put({
                type: 'updateState',
                payload: { totals: responese.data.data ? responese.data.data.total : [] }
            })
            yield put({
                type: 'updateState',
                payload: { details: responese.data.data ? responese.data.data.detail : [] }
            })
            return responese.code == "0000"
        },

        *queryTypeFault({ payload }, { call, put }) {//datalist
            const responese = yield call(queryTypeFault, payload);
            yield put({
                type: 'updateState',
                payload: { queryTypeFault: responese.data.table ? responese.data.table : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })
            return responese.code == "0000"
        },
        *queryTypeFaultByCompanyId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryTypeFaultByCompanyId, payload);
            yield put({
                type: 'updateState',
                payload: { queryTypeFaultByCompanyId: responese.data.table ? responese.data.table : [] }
            })
            return responese.code == "0000"
        },
        *queryFaultTypeFault({ payload }, { call, put }) {//datalist
            const responese = yield call(queryFaultTypeFault, payload);
            yield put({
                type: 'updateState',
                payload: { queryFaultTypeFault: responese.data.table ? responese.data.table : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })
            return responese.code == "0000"
        },
        *queryFaultTypeFaultByCompanyId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryFaultTypeFaultByCompanyId, payload);
            yield put({
                type: 'updateState',
                payload: { queryFaultTypeFaultByCompanyId: responese.data.table ? responese.data.table : [] }
            })
            return responese.code == "0000"
        },



        *deviceTypequeryTreeList({ payload }, { call, put }) {//datalist
            const responese = yield call(deviceTypequeryTreeList, payload);
            yield put({
                type: 'updateState',
                payload: { deviceTypequeryTreeList: responese.data.dataList ? responese.data.dataList : [] }
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
                payload: { departmentList: responese.data.departmentList ? responese.data.departmentList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { equipmentTypeLeafList: responese.data.equipmentTypeLeafList ? responese.data.equipmentTypeLeafList : [] }
            })
            return responese.code == "0000"
        },
        *queryOEE({ payload }, { call, put }) {//datalist
            const responese = yield call(queryOEE, payload);
            yield put({
                type: 'updateState',
                payload: { queryOEE: responese.data.moee ? responese.data.moee : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })
            return responese.code == "0000"
        },
        *Energychart({ payload }, { call, put }) {//datalist
            const responese = yield call(Energychart, payload);
            yield put({
                type: 'updateState',
                payload: { Energychart: responese.data.chart ? responese.data.chart : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })
            return responese.code == "0000"
        },




        *queryJIA({ payload }, { call, put }) {//datalist
            const responese = yield call(queryJIA, payload);
            yield put({
                type: 'updateState',
                payload: { queryJIA: responese.data.jia ? responese.data.jia : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })
            return responese.code == "0000"
        },
        *queryMTTR({ payload }, { call, put }) {//datalist
            const responese = yield call(queryMTTR, payload);
            yield put({
                type: 'updateState',
                payload: { queryMTTR: responese.data.mttr ? responese.data.mttr : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })
            return responese.code == "0000"
        },
        *queryMTBF({ payload }, { call, put }) {//datalist
            const responese = yield call(queryMTBF, payload);
            yield put({
                type: 'updateState',
                payload: { queryMTBF: responese.data.mtbf ? responese.data.mtbf : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })
            return responese.code == "0000"
        },
        *queryTaskRate({ payload }, { call, put }) {//datalist
            const responese = yield call(queryTaskRate, payload);
            yield put({
                type: 'updateState',
                payload: { queryTaskRate: responese.data.chart ? responese.data.chart : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })
            return responese.code == "0000"
        },

        *querySTOP({ payload }, { call, put }) {//datalist
            const responese = yield call(querySTOP, payload);
            yield put({
                type: 'updateState',
                payload: { querySTOP: responese.data.stop ? responese.data.stop : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })
            return responese.code == "0000"
        },

        *queryDiagram({ payload }, { call, put }) {//datalist
            const responese = yield call(queryDiagram, payload);
            yield put({
                type: 'updateState',
                payload: { queryDiagram: responese.data ? responese.data : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyDepartList: responese.data.DEPARTLIST ? responese.data.DEPARTLIST : [] }
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
