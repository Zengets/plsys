/**
 * Created by 11485 on 2019/2/28.
 */
import {
    deviceTypesave, deviceTypedeleteById, deviceTypequeryTreeList,
    deviceTypequeryLeafList, devicesave, devicedeleteById, devicequeryList,
    devicestepqueryList, devicestepsave, devicestepdeleteById, devicestepnodesave,
    devicestepnodedeleteById, queryAllRepair, getKnowledgeDetailByDicKey,
    goqueryList, gosave, godetailqueryById, recallById, recallqueryList, approvalProcess,
    dataqueryList, dataqueryAll, deviceknqueryList, deviceknsave, devicekndeleteById, deviceknchildqueryList,
    queryAnalysis, getCapacityAnalysis, queryByEquipmentId, repair, queryQrCode, getChildren, queryUseList,
    stopRepair, queryCondition, exportFile, cpyqueryAll, loanReturn,
    composequeryList, queryByBuddleId, queryNoByBuddleId, composesave, getDetailByDicId,
    queryListAndSpareList, DSparesave,checkRepairAfter,
    mdqueryList, mdsave, mddeleteById, mdqueryAll, mdqueryById


} from '@/services/rs.js';

export default {
    namespace: 'device',//作用域区间
    state: {
        deviceTypequeryTreeList: [],
        deviceTypequeryLeafList: [],
        deviceknchildqueryList: [],
        cpyqueryAll: [],
        devicequeryList: [],//数据
        exportFile: [],
        queryUseList: [],
        getDetailByDicId: [],
        devicestepqueryList: [],
        goqueryList: [],
        userList: [],
        transferType: [],
        departmentList: [],
        dataqueryList: [],
        dataList: [],
        deviceknqueryList: [],
        equipmentNoList: [],
        purposeTypeList: [],
        modelList:[],
        queryAnalysis: [],
        godetailqueryById: {},
        relList: [],
        recallqueryList: [],
        getCapacityAnalysis: [],
        companyDepartList: [],
        companyList: [],
        dataqueryAll: [],
        queryByEquipmentId: {},
        applyTypeList: [],
        repairConfirm: {},
        confirmUserList: [],
        confirmDetails: [],
        faultLevelList: [],//故障等级
        faultReasonList: [],//故障原因
        faultClassifyList: [],//故障类别
        repairTypeList: [],//维修类型
        faultTypeList: [],//故障类型
        recallReasonList: [],
        spareList: [],
        queryQrCode: [],
        getChildren: [],
        queryAllRepair: [],
        repairs: {},
        search: {},
        resumetype: [],
        queryCondition: {},
        shiftList: [],
        shopList: [],
        departmentLists: [],
        equipmentTypeLeafList: [],
        composequeryList: {},
        queryByBuddleId: {},
        queryNoByBuddleId: {},
        have: [],
        getKnowledgeDetailByDicKey: [],
        queryListAndSpareList: [],
        mdqueryList: [],
        checkRepairAfter:"",
        code: {}
    },

    effects: {
        *checkRepairAfter({ payload }, { call, put }) {//data
            const responese = yield call(checkRepairAfter, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *mdqueryList({ payload }, { call, put }) {//data
            const responese = yield call(mdqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { mdqueryList: responese.data.page ? responese.data.page : {} }
            })
            return responese.code == "0000"
        },

        *queryListAndSpareList({ payload }, { call, put }) {//data
            const responese = yield call(queryListAndSpareList, payload);
            yield put({
                type: 'updateState',
                payload: { queryListAndSpareList: responese.data.page ? responese.data.page : {} }
            })
            yield put({
                type: 'updateState',
                payload: { search: responese.data ? responese.data : {} }
            })
            return responese.code == "0000"
        },

        *getKnowledgeDetailByDicKey({ payload }, { call, put }) {//data
            const responese = yield call(getKnowledgeDetailByDicKey, payload);
            yield put({
                type: 'updateState',
                payload: { getKnowledgeDetailByDicKey: responese.data.dataList ? responese.data.dataList : {} }
            })
            return responese.code == "0000"
        },
        *composequeryList({ payload }, { call, put }) {//data
            const responese = yield call(composequeryList, payload);
            yield put({
                type: 'updateState',
                payload: { composequeryList: responese.data.page ? responese.data.page : {} }
            })
            yield put({
                type: 'updateState',
                payload: { search: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *queryByBuddleId({ payload }, { call, put }) {//data
            const responese = yield call(queryByBuddleId, payload);
            yield put({
                type: 'updateState',
                payload: { queryByBuddleId: responese.data.page ? responese.data.page : {} }
            })
            yield put({
                type: 'updateState',
                payload: { have: responese.data.have ? responese.data.have : {} }
            })
            return responese.code == "0000"
        },
        *queryNoByBuddleId({ payload }, { call, put }) {//data
            const responese = yield call(queryNoByBuddleId, payload);
            yield put({
                type: 'updateState',
                payload: { queryNoByBuddleId: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },


        *cpyqueryAll({ payload }, { call, put }) {//data
            const responese = yield call(cpyqueryAll, payload);
            yield put({
                type: 'updateState',
                payload: { cpyqueryAll: responese.data.dataList ? responese.data.dataList : [] }
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
                payload: { departmentLists: responese.data.departmentList ? responese.data.departmentList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { equipmentTypeLeafList: responese.data.equipmentTypeLeafList ? responese.data.equipmentTypeLeafList : [] }
            })
            return responese.code == "0000"
        },
        *queryAllRepair({ payload }, { call, put }) {//data
            const responese = yield call(queryAllRepair, payload);
            yield put({
                type: 'updateState',
                payload: { queryAllRepair: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *queryQrCode({ payload }, { call, put }) {//datalist
            const responese = yield call(queryQrCode, payload);
            yield put({
                type: 'updateState',
                payload: { queryQrCode: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *getChildren({ payload }, { call, put }) {//datalist
            const responese = yield call(getChildren, payload);
            yield put({
                type: 'updateState',
                payload: { getChildren: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *queryByEquipmentId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryByEquipmentId, payload);
            yield put({
                type: 'updateState',
                payload: { queryByEquipmentId: responese.data.data ? responese.data.data : [] }
            })
            yield put({
                type: 'updateState',
                payload: { applyTypeList: responese.data.applyTypeList ? responese.data.applyTypeList : [] }
            })

            yield put({
                type: 'updateState',
                payload: { faultLevelList: responese.data.faultLevelList ? responese.data.faultLevelList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { faultReasonList: responese.data.faultReasonList ? responese.data.faultReasonList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { confirmUserList: responese.data.confirmUserList ? responese.data.confirmUserList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { confirmDetails: responese.data.confirmDetails ? responese.data.confirmDetails : [] }
            })
            yield put({
                type: 'updateState',
                payload: { repairConfirm: responese.data.repairConfirm ? responese.data.repairConfirm : [] }
            })

            yield put({
                type: 'updateState',
                payload: { faultClassifyList: responese.data.faultClassifyList ? responese.data.faultClassifyList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { repairTypeList: responese.data.repairTypeList ? responese.data.repairTypeList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { faultTypeList: responese.data.faultTypeList ? responese.data.faultTypeList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { recallReasonList: responese.data.recallReasonList ? responese.data.recallReasonList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { spareList: responese.data.spareList ? responese.data.spareList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { repairs: responese.data.repair ? responese.data.repair : [] }
            })
            return responese.code == "0000"
        },

        *getCapacityAnalysis({ payload }, { call, put }) {//datalist
            const responese = yield call(getCapacityAnalysis, payload);
            yield put({
                type: 'updateState',
                payload: { getCapacityAnalysis: responese.data.data ? responese.data.data : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyDepartList: responese.data.companyDepartList ? responese.data.companyDepartList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
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
        *queryAnalysis({ payload }, { call, put }) {//datalist
            const responese = yield call(queryAnalysis, payload);
            yield put({
                type: 'updateState',
                payload: { queryAnalysis: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *deviceknqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(deviceknqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { deviceknqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { equipmentNoList: responese.data.equipmentNoList ? responese.data.equipmentNoList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { purposeTypeList: responese.data.purposeTypeList ? responese.data.purposeTypeList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { modelList: responese.data.modelList ? responese.data.modelList : [] }
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
        *goqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(goqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { goqueryList: responese.data.page ? responese.data.page : [] }
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

        *dataqueryList({ payload }, { call, put }) {//page
            const responese = yield call(dataqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { dataqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { dataList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },

        *dataqueryAll({ payload }, { call, put }) {//datalist
            const responese = yield call(dataqueryAll, payload);
            yield put({
                type: 'updateState',
                payload: { dataqueryAll: responese.data.dataList ? responese.data.dataList : [] }
            })

            return responese.code == "0000"
        },

        *devicestepqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(devicestepqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { devicestepqueryList: responese.data ? responese.data : [] }
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
        *deviceTypequeryLeafList({ payload }, { call, put }) {//datalist
            const responese = yield call(deviceTypequeryLeafList, payload);
            yield put({
                type: 'updateState',
                payload: { deviceTypequeryLeafList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *queryUseList({ payload }, { call, put }) {//datalist
            const responese = yield call(queryUseList, payload);
            yield put({
                type: 'updateState',
                payload: { queryUseList: responese.data.page ? responese.data.page : [] }
            })

            yield put({
                type: 'updateState',
                payload: { search: responese.data ? responese.data : [] }
            })

            yield put({
                type: 'updateState',
                payload: { resumetype: responese.data.resumetype ? responese.data.resumetype : [] }
            })
            return responese.code == "0000"
        },

        *devicequeryList({ payload }, { call, put }) {//datalist
            const responese = yield call(devicequeryList, payload);//调用接口
            yield put({
                type: 'updateState',
                payload: { devicequeryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { search: responese.data ? responese.data : [] }
            })
            yield put({
                type: 'updateState',
                payload: { resumetype: responese.data.resumetype ? responese.data.resumetype : [] }
            })
            return responese.code == "0000"
        },

        *deviceTypedeleteById({ payload }, { call, put }) {//data
            const responese = yield call(deviceTypedeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *deviceTypesave({ payload }, { call, put }) {//data
            const responese = yield call(deviceTypesave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *mdsave({ payload }, { call, put }) {//data
            const responese = yield call(mdsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *mddeleteById({ payload }, { call, put }) {//data
            const responese = yield call(mddeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *devicesave({ payload }, { call, put }) {//data
            const responese = yield call(devicesave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *gosave({ payload }, { call, put }) {//data
            const responese = yield call(gosave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *devicedeleteById({ payload }, { call, put }) {//data
            const responese = yield call(devicedeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *devicestepsave({ payload }, { call, put }) {//data
            const responese = yield call(devicestepsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *repair({ payload }, { call, put }) {//data
            const responese = yield call(repair, payload);
            yield put({
                type: 'updateState',
                payload: { checkRepairAfter: responese.data.data ? responese.data.data : ""  }
            })
            return responese.code == "0000"
        },
        *deviceknsave({ payload }, { call, put }) {//data
            const responese = yield call(deviceknsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
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
        *devicekndeleteById({ payload }, { call, put }) {//data
            const responese = yield call(devicekndeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *stopRepair({ payload }, { call, put }) {//data
            const responese = yield call(stopRepair, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *devicestepdeleteById({ payload }, { call, put }) {//data
            const responese = yield call(devicestepdeleteById, payload);
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
        *recallqueryList({ payload }, { call, put }) {//
            const responese = yield call(recallqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { recallqueryList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },

        *devicestepnodesave({ payload }, { call, put }) {//data
            const responese = yield call(devicestepnodesave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *devicestepnodedeleteById({ payload }, { call, put }) {//data
            const responese = yield call(devicestepnodedeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *composesave({ payload }, { call, put }) {//data
            const responese = yield call(composesave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *DSparesave({ payload }, { call, put }) {//data
            const responese = yield call(DSparesave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *getDetailByDicId({ payload }, { call, put }) {//data
            const responese = yield call(getDetailByDicId, payload);
            yield put({
                type: 'updateState',
                payload: { getDetailByDicId: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *loanReturn({ payload }, { call, put }) {//data
            const responese = yield call(loanReturn, payload);
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
