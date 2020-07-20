/**
 * Created by 11485 on 2019/2/28.
 */
import {
    queryHome, queryUrlList, queryTaskCount, querySystem, queryKnowledge, deviceknchildqueryList, queryMyList, fbqueryMyList, queryMessage,
    missionsave, GGqueryList, GGsave, querySendReview, fqueryDetaila, fqueryDetailb, missionsubmit, missionaudit,
    queryEquipChartByCompanyId, queryEquipChart, queryShopsEquipChart, missiondeleteById,queryOther,
    queryEquipChartLine, queryEquipChartByCompanyIdLine, queryShopsEquipChartLine, queryRepair

} from '@/services/rs.js'

export default {
    namespace: 'home',
    state: {
        queryHome: [],
        queryUrlList: [],
        queryTaskCount: [],
        querySystem: [],
        queryOther:[],
        queryKnowledge: [],
        deviceknchildqueryList: [],
        queryMyList: [],
        queryMessage: [],
        GGqueryList: [],
        fqueryDetailb: [],
        queryShopsEquipChart: [],
        queryShopsEquipChartLine: [],
        shopNameList: [],
        queryRepair: [],
        fqueryDetaila: {
            publish: {},
            myWork: {},
        },
        total: {},
        list: [],
        totals: {},
        lists: [],
    },
    effects: {
        *queryShopsEquipChartLine({ payload }, { call, put }) {//datalist
            const responese = yield call(queryShopsEquipChartLine, payload);
            yield put({
                type: 'updateState',
                payload: {
                    shopNameList: responese.data.shopNameList ? responese.data.shopNameList : {}
                },
            })
            yield put({
                type: 'updateState',
                payload: {
                    queryShopsEquipChartLine: responese.data.dataList ? responese.data.dataList : {}
                },
            })
            return responese.code == "0000"
        },
        *queryShopsEquipChart({ payload }, { call, put }) {//datalist
            const responese = yield call(queryShopsEquipChart, payload);
            yield put({
                type: 'updateState',
                payload: {
                    shopNameList: responese.data.shopNameList ? responese.data.shopNameList : {}
                },
            })
            yield put({
                type: 'updateState',
                payload: {
                    queryShopsEquipChart: responese.data.dataList ? responese.data.dataList : {}
                },
            })
            return responese.code == "0000"
        },
        *queryEquipChartByCompanyId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryEquipChartByCompanyId, payload);
            yield put({
                type: 'updateState',
                payload: {
                    total: responese.data.data ? responese.data.data.total : {}
                },
            })
            yield put({
                type: 'updateState',
                payload: {
                    list: responese.data.data ? responese.data.data.list : {}
                },
            })
            return responese.code == "0000"
        },
        *queryEquipChartByCompanyIdLine({ payload }, { call, put }) {//datalist
            const responese = yield call(queryEquipChartByCompanyIdLine, payload);
            yield put({
                type: 'updateState',
                payload: {
                    totals: responese.data.data ? responese.data.data.total : {}
                },
            })
            yield put({
                type: 'updateState',
                payload: {
                    lists: responese.data.data ? responese.data.data.list : {}
                },
            })
            return responese.code == "0000"
        },
        *queryEquipChartLine({ payload }, { call, put }) {//datalist
            const responese = yield call(queryEquipChartLine, payload);
            yield put({
                type: 'updateState',
                payload: {
                    totals: responese.data.data ? responese.data.data.total : {}
                },
            })
            yield put({
                type: 'updateState',
                payload: {
                    lists: responese.data.data ? responese.data.data.list : {}
                },
            })
            return responese.code == "0000"
        },
        *queryEquipChart({ payload }, { call, put }) {//datalist
            const responese = yield call(queryEquipChart, payload);
            yield put({
                type: 'updateState',
                payload: {
                    total: responese.data.data ? responese.data.data.total : {}
                },
            })
            yield put({
                type: 'updateState',
                payload: {
                    list: responese.data.data ? responese.data.data.list : {}
                },
            })
            return responese.code == "0000"
        },

        *fqueryDetaila({ payload }, { call, put }) {//datalist
            const responese = yield call(fqueryDetaila, payload);
            yield put({
                type: 'updateState',
                payload: {
                    fqueryDetaila: responese.data.data ? responese.data.data : {
                        publish: {},
                        myWork: {}
                    }
                }
            })
            return responese.code == "0000"
        },

        *fqueryDetailb({ payload }, { call, put }) {//datalist
            const responese = yield call(fqueryDetailb, payload);
            yield put({
                type: 'updateState',
                payload: { fqueryDetailb: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *querySendReview({ payload }, { call, put }) {//datalist
            const responese = yield call(querySendReview, payload);
            yield put({
                type: 'updateState',
                payload: { GGqueryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *GGqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(GGqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { GGqueryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *queryMessage({ payload }, { call, put }) {//datalist
            const responese = yield call(queryMessage, payload);
            yield put({
                type: 'updateState',
                payload: { queryMessage: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *fbqueryMyList({ payload }, { call, put }) {//datalist
            const responese = yield call(fbqueryMyList, payload);
            yield put({
                type: 'updateState',
                payload: { queryMyList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *queryMyList({ payload }, { call, put }) {//datalist
            const responese = yield call(queryMyList, payload);
            yield put({
                type: 'updateState',
                payload: { queryMyList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },

        *missionsubmit({ payload }, { call, put }) {//datalist
            const responese = yield call(missionsubmit, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *missionaudit({ payload }, { call, put }) {//datalist
            const responese = yield call(missionaudit, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *missiondeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(missiondeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *deviceknchildqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(deviceknchildqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { deviceknchildqueryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *missionsave({ payload }, { call, put }) {//datalist
            const responese = yield call(missionsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *GGsave({ payload }, { call, put }) {//datalist
            const responese = yield call(GGsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *queryHome({ payload }, { call, put }) {//datalist
            const responese = yield call(queryHome, payload);
            yield put({
                type: 'updateState',
                payload: { queryHome: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *queryUrlList({ payload }, { call, put }) {//datalist
            const responese = yield call(queryUrlList, payload);
            yield put({
                type: 'updateState',
                payload: { queryUrlList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *queryTaskCount({ payload }, { call, put }) {//datalist
            const responese = yield call(queryTaskCount, payload);
            yield put({
                type: 'updateState',
                payload: { queryTaskCount: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *querySystem({ payload }, { call, put }) {//datalist
            const responese = yield call(querySystem, payload);
            yield put({
                type: 'updateState',
                payload: { querySystem: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *queryOther({ payload }, { call, put }) {//datalist
            const responese = yield call(queryOther, payload);
            yield put({
                type: 'updateState',
                payload: { queryOther: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *queryKnowledge({ payload }, { call, put }) {//datalist
            const responese = yield call(queryKnowledge, payload);
            yield put({
                type: 'updateState',
                payload: { queryKnowledge: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *queryRepair({ payload }, { call, put }) {//datalist
            const responese = yield call(queryRepair, payload);
            yield put({
                type: 'updateState',
                payload: { queryRepair: responese.data.page ? responese.data.page : [] }
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
