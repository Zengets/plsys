/**
 * Created by 11485 on 2019/2/28.
 */
import {
    planqueryList, getProductors, plansave, plansaveList, plandeleteById, planshiftqueryList, saveOrUpdate, savedeleteById, deviceTypequeryTreeList, getProductorsByShopIdDown, batchSaveOrUpdate, exportFileCheck, exportEquipmentShiftProductCheck,
    sizequeryList, sizesave, sizedeleteById, sizequeryById, mdexportFileCheck, productConfig,changeProductConfig, exportPlanRateFileCheck, promonqueryList,
    queryByShopIdAndPlanMonth, takequeryList, takesave, takedeleteById, queryExcelList, excqueryList, productDayReport, aexportFileCheck, bexportFileCheck, queryOfCompany,
    dayinfoqueryList, dayinfosave, dayinfodeleteById, queryInOrNotByShopId



} from '@/services/rs.js'

export default {
    namespace: 'produce',
    state: {
        dayinfoqueryList: [],
        planqueryList: [],
        getProductors: [],
        planshiftqueryList: [],
        shopList: [],
        shiftList: [],
        deviceTypequeryTreeList: [],
        getProductorsByShopIdDown: [],
        sizequeryList: [],
        sizequeryById: {},
        promonqueryList: [],
        queryByShopIdAndPlanMonth: [],
        takequeryList: {},
        sysCompanyList: [],
        pecificationList: [],
        queryExcelList: [],
        excqueryList: [],
        productDayReport: [],
        queryInOrNotByShopId: []
    },
    effects: {
        *dayinfoqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(dayinfoqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { dayinfoqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shopList: responese.data.shopList ? responese.data.shopList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shiftList: responese.data.shiftList ? responese.data.shiftList : [] }
            })
            return responese.code == "0000"
        },
        *queryInOrNotByShopId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryInOrNotByShopId, payload);
            yield put({
                type: 'updateState',
                payload: { queryInOrNotByShopId: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },

        *queryOfCompany({ payload }, { call, put }) {//datalist
            const responese = yield call(queryOfCompany, payload);
            yield put({
                type: 'updateState',
                payload: { shopList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *productDayReport({ payload }, { call, put }) {//datalist
            const responese = yield call(productDayReport, payload);
            yield put({
                type: 'updateState',
                payload: { productDayReport: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shiftList: responese.data.shiftList ? responese.data.shiftList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shopList: responese.data.shopList ? responese.data.shopList : [] }
            })
            return responese.code == "0000"
        },
        *excqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(excqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { excqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { sysCompanyList: responese.data.sysCompanyList ? responese.data.sysCompanyList : [] }
            })
            return responese.code == "0000"
        },
        *queryExcelList({ payload }, { call, put }) {//datalist
            const responese = yield call(queryExcelList, payload);
            yield put({
                type: 'updateState',
                payload: { queryExcelList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *takequeryList({ payload }, { call, put }) {//datalist
            const responese = yield call(takequeryList, payload);
            yield put({
                type: 'updateState',
                payload: { takequeryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shopList: responese.data.shopList ? responese.data.shopList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { sysCompanyList: responese.data.sysCompanyList ? responese.data.sysCompanyList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { pecificationList: responese.data.pecificationList ? responese.data.pecificationList : [] }
            })
            return responese.code == "0000"
        },
        *queryByShopIdAndPlanMonth({ payload }, { call, put }) {//datalist
            const responese = yield call(queryByShopIdAndPlanMonth, payload);
            yield put({
                type: 'updateState',
                payload: { queryByShopIdAndPlanMonth: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *promonqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(promonqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { promonqueryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *sizequeryList({ payload }, { call, put }) {//datalist
            const responese = yield call(sizequeryList, payload);
            yield put({
                type: 'updateState',
                payload: { sizequeryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shopList: responese.data.shopList ? responese.data.shopList : [] }
            })
            return responese.code == "0000"
        },
        *sizequeryById({ payload }, { call, put }) {//datalist
            const responese = yield call(sizequeryById, payload);
            yield put({
                type: 'updateState',
                payload: { sizequeryById: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *getProductorsByShopIdDown({ payload }, { call, put }) {//datalist
            const responese = yield call(getProductorsByShopIdDown, payload);
            yield put({
                type: 'updateState',
                payload: { getProductorsByShopIdDown: responese.data.dataList ? responese.data.dataList : [] }
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
        *planqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(planqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { planqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shopList: responese.data.shopList ? responese.data.shopList : [] }
            })

            yield put({
                type: 'updateState',
                payload: { shiftList: responese.data.shiftList ? responese.data.shiftList : [] }
            })
            return responese.code == "0000"
        },
        *getProductors({ payload }, { call, put }) {//datalist
            const responese = yield call(getProductors, payload);
            yield put({
                type: 'updateState',
                payload: { getProductors: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *planshiftqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(planshiftqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { planshiftqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shopList: responese.data.shopList ? responese.data.shopList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shiftList: responese.data.shiftList ? responese.data.shiftList : [] }
            })
            return responese.code == "0000"
        },
        *plansave({ payload }, { call, put }) {//datalist
            const responese = yield call(plansave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *dayinfosave({ payload }, { call, put }) {//datalist
            const responese = yield call(dayinfosave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *dayinfodeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(dayinfodeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *plansaveList({ payload }, { call, put }) {//datalist
            const responese = yield call(plansaveList, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *plandeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(plandeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *productConfig({ payload }, { call, put }) {//datalist
            const responese = yield call(productConfig, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *changeProductConfig({ payload }, { call, put }) {//datalist
            const responese = yield call(changeProductConfig, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *batchSaveOrUpdate({ payload }, { call, put }) {//datalist
            const responese = yield call(batchSaveOrUpdate, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *saveOrUpdate({ payload }, { call, put }) {//datalist
            const responese = yield call(saveOrUpdate, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *exportFileCheck({ payload }, { call, put }) {//datalist
            const responese = yield call(exportFileCheck, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *aexportFileCheck({ payload }, { call, put }) {//datalist
            const responese = yield call(aexportFileCheck, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *bexportFileCheck({ payload }, { call, put }) {//datalist
            const responese = yield call(bexportFileCheck, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *exportPlanRateFileCheck({ payload }, { call, put }) {//datalist
            const responese = yield call(exportPlanRateFileCheck, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *sizesave({ payload }, { call, put }) {//datalist
            const responese = yield call(sizesave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *mdexportFileCheck({ payload }, { call, put }) {//datalist
            const responese = yield call(mdexportFileCheck, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *exportEquipmentShiftProductCheck({ payload }, { call, put }) {//datalist
            const responese = yield call(exportEquipmentShiftProductCheck, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *sizedeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(sizedeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *savedeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(savedeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *takedeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(takedeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *takesave({ payload }, { call, put }) {//datalist
            const responese = yield call(takesave, payload);
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
