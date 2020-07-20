
import {
    verbqueryList, verbqueryItemForAdd, verbsave, verbupdate, verbqueryMaintainItem, verbdeleteById, verbqueryByMaintainPlanNo,
    werbproqueryList, werbprosave, werbprodeleteById, uiassociation, queryBusinessByUserId,
    equipmentqueryList, equipmentupdateById, equipmentdeleteById, equipmentqueryNoByUserId, equipmentqueryByUserId, equipmentsave,
    verbmsqueryList, verbmsstartMaintain, verbmsfinishMaintain, verbmscloseMaintain, verbmsupdateMaintainUser, verbmsqueryById, verbmsqueryByBillToExecuteId, verbtoqueryList, verbtoqueryById, taskdeleteById, association, missionconfirm, jkqueryList,
    taskqueryList, tasksave, queryByEquipId, queryOfMonth, deviceTypequeryTreeList, DonequeryList, createMaintainTask, queryUpdateByUserId, replaceUser,equipmentupdateByIdz,isUse,queryMaintainPool
} from '@/services/rs.js'

export default {
    namespace: 'verb',
    state: {
        verbqueryList: [],//保养计划
        maintainPlanType: [],//保养类型
        maintainPlanTypeOnce: [],
        maintainPlanTypePeriod: [],
        planType: [],//计划类型
        itemIds: [],//选中的id
        verbqueryItemForAdd: [],//保养项目列表(带排序)
        verbqueryMaintainItem: [],
        verbqueryByMaintainPlanNo: {},
        equipmentqueryNoByUserId: [],
        equipmentqueryByUserId: [],
        MaintainItemIds: [],
        werbproqueryList: [],
        equipmentqueryList: [],
        userList: [],
        DonequeryList: [],
        companyList: [],
        verbmsqueryList: {},
        verbtoqueryList: {},
        verbtoqueryById: {},
        sparePartsConsumeList: [],
        verbmsqueryById: {},
        taskqueryList: [],
        noticeType: [],
        businessModuleType: [],
        noticeTimesType: [],
        queryOfMonth: {},
        actualItemList: [],
        chartMap: [],
        roleList: [],
        code: {},
        deviceTypequeryTreeList: [],
        uiassociation: [],
        jkqueryList: [],
        queryBusinessByUserId: [],
        queryUpdateByUserId: [],
        queryMaintainPool:[]
    },
    effects: {
        *queryMaintainPool({ payload }, { call, put }) {//datalist
            const responese = yield call(queryMaintainPool, payload);
            yield put({
                type: 'updateState',
                payload: { queryMaintainPool: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *queryUpdateByUserId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryUpdateByUserId, payload);
            yield put({
                type: 'updateState',
                payload: { queryUpdateByUserId: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *replaceUser({ payload }, { call, put }) {//datalist
            const responese = yield call(replaceUser, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *jkqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(jkqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { jkqueryList: responese.data.dataList ? responese.data.dataList : [] }
            })

            return responese.code == "0000"
        },
        *queryBusinessByUserId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryBusinessByUserId, payload);
            yield put({
                type: 'updateState',
                payload: { queryBusinessByUserId: responese.data.companyList ? responese.data.companyList : [] }
            })

            return responese.code == "0000"
        },

        *uiassociation({ payload }, { call, put }) {//datalist
            const responese = yield call(uiassociation, payload);
            yield put({
                type: 'updateState',
                payload: { uiassociation: responese.data.dataList ? responese.data.dataList : [] }
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
        *deviceTypequeryTreeList({ payload }, { call, put }) {//datalist
            const responese = yield call(deviceTypequeryTreeList, payload);
            yield put({
                type: 'updateState',
                payload: { deviceTypequeryTreeList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },

        *queryByEquipId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryByEquipId, payload);
            yield put({
                type: 'updateState',
                payload: { userList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *queryOfMonth({ payload }, { call, put }) {//datalist
            const responese = yield call(queryOfMonth, payload);
            yield put({
                type: 'updateState',
                payload: { queryOfMonth: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { maintainPlanType: responese.data.maintainPlanType ? responese.data.maintainPlanType : [] }
            })
            return responese.code == "0000"
        },
        *taskqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(taskqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { taskqueryList: responese.data.dataList ? responese.data.dataList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { noticeType: responese.data.noticeType ? responese.data.noticeType : [] }
            })
            yield put({
                type: 'updateState',
                payload: { roleList: responese.data.roleList ? responese.data.roleList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { businessModuleType: responese.data.businessModuleType ? responese.data.businessModuleType : [] }
            })
            yield put({
                type: 'updateState',
                payload: { noticeTimesType: responese.data.noticeTimesType ? responese.data.noticeTimesType : [] }
            })
            return responese.code == "0000"
        },


        *verbmsqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(verbmsqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { verbmsqueryList: responese.data.page ? responese.data.page : {} }
            })
            yield put({
                type: 'updateState',
                payload: { chartMap: responese.data.chartMap ? responese.data.chartMap : [] }
            })
            yield put({
                type: 'updateState',
                payload: { maintainPlanType: responese.data.maintainPlanType ? responese.data.maintainPlanType : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })
            return responese.code == "0000"
        },

        *verbtoqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(verbtoqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { verbtoqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { chartMap: responese.data.chartMap ? responese.data.chartMap : [] }
            })
            yield put({
                type: 'updateState',
                payload: { maintainPlanType: responese.data.maintainPlanType ? responese.data.maintainPlanType : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })
            return responese.code == "0000"
        },
        *equipmentupdateByIdz({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentupdateByIdz, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *verbmsqueryById({ payload }, { call, put }) {//datalist
            const responese = yield call(verbmsqueryById, payload);
            yield put({
                type: 'updateState',
                payload: { verbmsqueryById: responese.data.data ? responese.data.data : [] }
            })
            yield put({
                type: 'updateState',
                payload: { sparePartsConsumeList: responese.data.sparePartsConsumeList ? responese.data.sparePartsConsumeList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { actualItemList: responese.data.actualItemList ? responese.data.actualItemList : [] }
            })
            return responese.code == "0000"
        },
        *verbtoqueryById({ payload }, { call, put }) {//datalist
            const responese = yield call(verbtoqueryById, payload);
            yield put({
                type: 'updateState',
                payload: { verbtoqueryById: responese.data.data ? responese.data.data : [] }
            })
            yield put({
                type: 'updateState',
                payload: { actualItemList: responese.data.actualItemList ? responese.data.actualItemList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { sparePartsConsumeList: responese.data.sparePartsConsumeList ? responese.data.sparePartsConsumeList : [] }
            })

            return responese.code == "0000"
        },

        *equipmentqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { equipmentqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { userList: responese.data.dataList ? responese.data.dataList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })
            return responese.code == "0000"
        },
        *equipmentqueryByUserId({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentqueryByUserId, payload);
            yield put({
                type: 'updateState',
                payload: { equipmentqueryByUserId: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *equipmentqueryNoByUserId({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentqueryNoByUserId, payload);
            yield put({
                type: 'updateState',
                payload: { equipmentqueryNoByUserId: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },

        *werbproqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(werbproqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { werbproqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })

            return responese.code == "0000"
        },
        *verbqueryByMaintainPlanNo({ payload }, { call, put }) {//datalist
            const responese = yield call(verbqueryByMaintainPlanNo, payload);
            yield put({
                type: 'updateState',
                payload: { verbqueryByMaintainPlanNo: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *verbqueryMaintainItem({ payload }, { call, put }) {//datalist
            const responese = yield call(verbqueryMaintainItem, payload);
            yield put({
                type: 'updateState',
                payload: { verbqueryMaintainItem: responese.data.dataList ? responese.data.dataList : [] }
            })

            yield put({
                type: 'updateState',
                payload: { MaintainItemIds: responese.data.MaintainItemIds ? responese.data.MaintainItemIds : [] }
            })
            return responese.code == "0000"
        },
        *verbqueryItemForAdd({ payload }, { call, put }) {//datalist
            const responese = yield call(verbqueryItemForAdd, payload);
            yield put({
                type: 'updateState',
                payload: { verbqueryItemForAdd: responese.data.page ? responese.data.page : [] }
            })

            yield put({
                type: 'updateState',
                payload: { itemIds: responese.data.itemIds ? responese.data.itemIds : [] }
            })
            return responese.code == "0000"
        },
        *verbqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(verbqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { verbqueryList: responese.data.page ? responese.data.page : [] }
            })

            yield put({
                type: 'updateState',
                payload: { maintainPlanTypePeriod: responese.data.maintainPlanTypePeriod ? responese.data.maintainPlanTypePeriod : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyList: responese.data.companyList ? responese.data.companyList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { maintainPlanTypeOnce: responese.data.maintainPlanTypeOnce ? responese.data.maintainPlanTypeOnce : [] }
            })


            yield put({
                type: 'updateState',
                payload: { planType: responese.data.planType ? responese.data.planType : [] }
            })

            return responese.code == "0000"
        },
        *taskdeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(taskdeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *tasksave({ payload }, { call, put }) {//datalist
            const responese = yield call(tasksave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *verbsave({ payload }, { call, put }) {//datalist
            const responese = yield call(verbsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *isUse({ payload }, { call, put }) {//datalist
            const responese = yield call(isUse, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *verbmsstartMaintain({ payload }, { call, put }) {//datalist
            const responese = yield call(verbmsstartMaintain, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *verbmsfinishMaintain({ payload }, { call, put }) {//datalist
            const responese = yield call(verbmsfinishMaintain, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *verbmscloseMaintain({ payload }, { call, put }) {//datalist
            const responese = yield call(verbmscloseMaintain, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *verbmsupdateMaintainUser({ payload }, { call, put }) {//datalist
            const responese = yield call(verbmsupdateMaintainUser, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *werbprosave({ payload }, { call, put }) {//datalist
            const responese = yield call(werbprosave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *equipmentsave({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *equipmentupdateById({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentupdateById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *equipmentdeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentdeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *werbprodeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(werbprodeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *verbupdate({ payload }, { call, put }) {//datalist
            const responese = yield call(verbupdate, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *missionconfirm({ payload }, { call, put }) {//datalist
            const responese = yield call(missionconfirm, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *verbdeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(verbdeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *association({ payload }, { call, put }) {//datalist
            const responese = yield call(association, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *createMaintainTask({ payload }, { call, put }) {//datalist
            const responese = yield call(createMaintainTask, payload);
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
