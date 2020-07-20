/**
 * Created by 11485 on 2019/2/28.
 */
import {
    sparequeryList, sparesave, sparedeleteById, sparequeryTreeList, spareTreesave, SETsave, SETdeleteById, spareTreedeleteById, spareRecordsave, spareRecordqueryList,
    spareUsequeryList, spareuspqueryList,
    getqueryList, outqueryList, getsave, getqueryListAndApplyInfo, getaudit, getrecall, SETqueryList, queryEquipmentAndSpareParts,
    UndoqueryList, queryChangePerson, saveChangePerson, DonequeryList, queryBySparePartsNoList, deviceTypequeryTreeList,
    buyqueryList, buyaudit, buyrecall, buysave


} from '@/services/rs.js'

export default {
    namespace: 'spare',
    state: {
        sparequeryList: {},
        userList: [],
        spareRecordqueryList: {},
        search: {},
        spareuspqueryList: {},
        getqueryList: {},
        sparePartsTypeList: [],
        spareUsequeryList: [],
        outqueryList: [],
        getqueryListAndApplyInfo: [],
        sparePartsApply: [],
        SETqueryList: [],
        sparePartsList: [],
        equipmentList: [],
        UndoqueryList: [],
        DonequeryList: [],
        queryChangePerson: [],
        queryBySparePartsNoList: [],
        code: {},
        deviceTypequeryTreeList: [],
        buyqueryList: [],

    },
    effects: {
        *deviceTypequeryTreeList({ payload }, { call, put }) {//datalist
            const responese = yield call(deviceTypequeryTreeList, payload);
            yield put({
                type: 'updateState',
                payload: { deviceTypequeryTreeList: responese.data.dataList ? responese.data.dataList : [] }
            })

            return responese.code == "0000"
        },
        *buyqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(buyqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { buyqueryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *queryBySparePartsNoList({ payload }, { call, put }) {//datalist
            const responese = yield call(queryBySparePartsNoList, payload);
            yield put({
                type: 'updateState',
                payload: { queryBySparePartsNoList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *DonequeryList({ payload }, { call, put }) {//datalist
            const responese = yield call(DonequeryList, payload);
            yield put({
                type: 'updateState',
                payload: { DonequeryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *queryChangePerson({ payload }, { call, put }) {//datalist
            const responese = yield call(queryChangePerson, payload);
            yield put({
                type: 'updateState',
                payload: { queryChangePerson: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *SETqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(SETqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { SETqueryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *UndoqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(UndoqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { UndoqueryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *queryEquipmentAndSpareParts({ payload }, { call, put }) {//datalist
            const responese = yield call(queryEquipmentAndSpareParts, payload);
            yield put({
                type: 'updateState',
                payload: { sparePartsList: responese.data.sparePartsList ? responese.data.sparePartsList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { equipmentList: responese.data.equipmentList ? responese.data.equipmentList : [] }
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
        *outqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(outqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { outqueryList: responese.data.page ? responese.data.page : [] }
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


        *spareuspqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(spareuspqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { spareuspqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { userList: responese.data.userList ? responese.data.userList : [] }
            })
            return responese.code == "0000"
        },
        *sparequeryList({ payload }, { call, put }) {//datalist
            const responese = yield call(sparequeryList, payload);
            yield put({
                type: 'updateState',
                payload: { sparequeryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { userList: responese.data.userList ? responese.data.userList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { sparePartsTypeList: responese.data.sparePartsTypeList ? responese.data.sparePartsTypeList : [] }
            })
            return responese.code == "0000"
        },
        *spareRecordqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(spareRecordqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { spareRecordqueryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },

        *spareUsequeryList({ payload }, { call, put }) {//datalist
            const responese = yield call(spareUsequeryList, payload);
            yield put({
                type: 'updateState',
                payload: { spareUsequeryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },

        *sparequeryTreeList({ payload }, { call, put }) {//datalist
            const responese = yield call(sparequeryTreeList, payload);
            yield put({
                type: 'updateState',
                payload: { sparequeryTreeList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        // getaudit, getrecall
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
        *getsave({ payload }, { call, put }) {//datalist
            const responese = yield call(getsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *sparesave({ payload }, { call, put }) {//datalist
            const responese = yield call(sparesave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *sparedeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(sparedeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *SETdeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(SETdeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *SETsave({ payload }, { call, put }) {//datalist
            const responese = yield call(SETsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *spareTreesave({ payload }, { call, put }) {//datalist
            const responese = yield call(spareTreesave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *saveChangePerson({ payload }, { call, put }) {//datalist
            const responese = yield call(saveChangePerson, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *spareTreedeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(spareTreedeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *spareRecordsave({ payload }, { call, put }) {//datalist
            const responese = yield call(spareRecordsave, payload);
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
        *buysave({ payload }, { call, put }) {//datalist
            const responese = yield call(buysave, payload);
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
