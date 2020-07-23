import { stringify } from 'qs';
import request from '@/utils/request';

//登入
export async function fakeAccountLogin(params) {
  return request(`/rs/sysAccount/login`, {
    method: 'POST',
    body: params,
  });
}

//登入
export async function fakeAccountLoginOut(params) {
  return request(`/rs/sysAccount/logout`, {
    method: 'POST',
    body: params,
  });
}

//权限设置
export async function AdminqueryAll(params) {
  return request(`/rs/sysPermission/queryAll`, {
    method: 'POST',
    body: params,
  });
}

//角色设置列表
export async function AdminqueryList(params) {
  return request(`/rs/sysRole/queryList`, {
    method: 'POST',
    body: params,
  });
}
//新增修改角色
export async function Adminsave(params) {
  return request(`/rs/sysRole/save`, {
    method: 'POST',
    body: params,
  });
}

//删除角色
export async function AdmindeleteById(params) {
  return request(`/rs/sysRole/deleteById`, {
    method: 'POST',
    body: params,
  });
}

//用户列表
export async function AdminuserqueryList(params) {
  return request(`/rs/sysUser/queryList`, {
    method: 'POST',
    body: params,
  });
}

//新增修改用户
export async function Adminusersave(params) {
  return request(`/rs/sysUser/save`, {
    method: 'POST',
    body: params,
  });
}

//删除用户
export async function AdminuserdeleteById(params) {
  return request(`/rs/sysUser/deleteById`, {
    method: 'POST',
    body: params,
  });
}

//查询单位
export async function AdminqueryCompanyList(params) {
  return request(`/rs/sysDepartment/queryCompanyList`, {
    method: 'POST',
    body: params,
  });
}

//查询单位下的部门
export async function AdminqueryLeafListByParentId(params) {
  return request(`/rs/sysDepartment/queryLeafListByParentId`, {
    method: 'POST',
    body: params,
  });
}

//用户-角色
export async function AdmincaqueryAll(params) {
  return request(`/rs/sysUserRole/queryAll`, {
    method: 'POST',
    body: params,
  });
}

//用户-角色
export async function Admincasave(params) {
  return request(`/rs/sysUserRole/save`, {
    method: 'POST',
    body: params,
  });
}
//角色下权限
export async function AdminprqueryAll(params) {
  return request(`/rs/sysRolePermission/queryAll`, {
    method: 'POST',
    body: params,
  });
}
//角色下权限
export async function Adminprsave(params) {
  return request(`/rs/sysRolePermission/save`, {
    method: 'POST',
    body: params,
  });
}
//restPassword
export async function restPassword(params) {
  return request(`/rs/sysUser/restPassword`, {
    method: 'POST',
    body: params,
  });
}

//queryTreeList数据字典
export async function NoqueryTreeList(params) {
  return request(`/rs/sysDic/queryTreeList`, {
    method: 'POST',
    body: params,
  });
}

//queryTreeList数据字典 删除
export async function NodeleteById(params) {
  return request(`/rs/sysDic/deleteById`, {
    method: 'POST',
    body: params,
  });
}

//queryTreeList数据字典 删除
export async function Nosave(params) {
  return request(`/rs/sysDic/save`, {
    method: 'POST',
    body: params,
  });
}

//设备类型  新增一条记录    修改一条记录
export async function deviceTypesave(params) {
  return request(`/rs/equipmentType/save`, {
    method: 'POST',
    body: params,
  });
}

//设备类型  根据id删除一条记录
export async function deviceTypedeleteById(params) {
  return request(`/rs/equipmentType/deleteById`, {
    method: 'POST',
    body: params,
  });
}
//设备类型  查询树结构列表
export async function deviceTypequeryTreeList(params) {
  return request(`/rs/equipmentType/queryTreeList`, {
    method: 'POST',
    body: params,
  });
}
//设备类型  查询叶子节点列表(select框)
export async function deviceTypequeryLeafList(params) {
  return request(`/rs/equipmentType/queryLeafList`, {
    method: 'POST',
    body: params,
  });
}
//设备  新增一条记录    修改一条记录
export async function devicesave(params) {
  return request(`/rs/equipment/save`, {
    method: 'POST',
    body: params,
  });
}

//设备  根据id删除一条记录
export async function devicedeleteById(params) {
  return request(`/rs/equipment/deleteById`, {
    method: 'POST',
    body: params,
  });
}
//设备  根据条件查询设备列表(类型，编号，名称，状态，产品线)；状态，产品线下拉框内容
export async function devicequeryList(params) {
  return request(`/rs/equipment/queryList`, {
    method: 'POST',
    body: params,
  });
}

//设备  根据条件查询设备列表(类型，编号，名称，状态，产品线)；状态，产品线下拉框内容
export async function devicestepqueryList(params) {
  return request(`/rs/sysApprovalProcess/queryList`, {
    method: 'POST',
    body: params,
  });
}
//新增流转流程
export async function devicestepsave(params) {
  return request(`/rs/sysApprovalProcess/save`, {
    method: 'POST',
    body: params,
  });
}
//新增流转流程
export async function devicestepdeleteById(params) {
  return request(`/rs/sysApprovalProcess/deleteById`, {
    method: 'POST',
    body: params,
  });
}
//新增流转流程
export async function devicestepnodesave(params) {
  return request(`/rs/sysApprovalProcessNode/save`, {
    method: 'POST',
    body: params,
  });
}
//新增流转流程
export async function devicestepnodedeleteById(params) {
  return request(`/rs/sysApprovalProcessNode/deleteById`, {
    method: 'POST',
    body: params,
  });
}

//新增流转流程
export async function goqueryList(params) {
  return request(`/rs/equipmentApprovalProcess/queryList`, {
    method: 'POST',
    body: params,
  });
}

//新增流转流程
export async function gosave(params) {
  return request(`/rs/equipmentApprovalProcess/save`, {
    method: 'POST',
    body: params,
  });
}

//查看流转流程详情
export async function godetailqueryById(params) {
  return request(`/rs/equipmentApprovalProcess/queryById`, {
    method: 'POST',
    body: params,
  });
}

//查看流转流程详情
export async function recallById(params) {
  return request(`/rs/equipmentApprovalProcess/recallById`, {
    method: 'POST',
    body: params,
  });
}

//查看流转流程进度
export async function recallqueryList(params) {
  return request(`/rs/equipmentApprovalProcessNode/queryList`, {
    method: 'POST',
    body: params,
  });
}

//查看流转流程进度
export async function approvalProcess(params) {
  return request(`/rs/equipmentApprovalProcessNode/approvalProcess`, {
    method: 'POST',
    body: params,
  });
}

//履历列表
export async function dataqueryList(params) {
  return request(`/rs/equipmentLog/query`, {
    method: 'POST',
    body: params,
  });
}

//履历列表
export async function dataqueryAll(params) {
  return request(`/rs/equipmentLogItem/queryAll`, {
    method: 'POST',
    body: params,
  });
}

//保养计划列表
export async function verbqueryList(params) {
  return request(`/rs/equipmentMaintainPlan/queryList`, {
    method: 'POST',
    body: params,
  });
}

//保养计划列表
export async function verbqueryItemForAdd(params) {
  return request(`/rs/equipmentMaintainPlan/queryItemForAdd`, {
    method: 'POST',
    body: params,
  });
}
//保养计划列表
export async function verbsave(params) {
  return request(`/rs/equipmentMaintainPlan/save`, {
    method: 'POST',
    body: params,
  });
}

//保养计划列表
export async function verbupdate(params) {
  return request(`/rs/equipmentMaintainPlan/update`, {
    method: 'POST',
    body: params,
  });
}

//保养计划列表
export async function verbqueryMaintainItem(params) {
  return request(`/rs/equipmentMaintainPlan/queryMaintainItem`, {
    method: 'POST',
    body: params,
  });
}
//保养计划列表
export async function verbdeleteById(params) {
  return request(`/rs/equipmentMaintainPlan/deleteById`, {
    method: 'POST',
    body: params,
  });
}
//保养计划列表
export async function verbqueryByMaintainPlanNo(params) {
  return request(`/rs/equipmentMaintainPlan/queryByMaintainPlanNo`, {
    method: 'POST',
    body: params,
  });
}

//设备知识库
export async function deviceknqueryList(params) {
  return request(`/rs/equipmentKnowledgeBase/queryList`, {
    method: 'POST',
    body: params,
  });
}

//设备知识库
export async function deviceknsave(params) {
  return request(`/rs/equipmentKnowledgeBase/save`, {
    method: 'POST',
    body: params,
  });
}

//设备知识库
export async function devicekndeleteById(params) {
  return request(`/rs/equipmentKnowledgeBase/deleteById`, {
    method: 'POST',
    body: params,
  });
}
//设备知识库
export async function deviceknchildqueryList(params) {
  return request(`/rs/equipmentKnowledgeBaseVersion/queryList`, {
    method: 'POST',
    body: params,
  });
}

//注册列表
export async function sysqueryList(params) {
  return request(`/rs/sysCompanyApply/queryList`, {
    method: 'POST',
    body: params,
  });
}
//注册列表
export async function syssave(params) {
  return request(`/rs/sysCompanyAudit/save`, {
    method: 'POST',
    body: params,
  });
}

//注册列表
export async function jgsave(params) {
  return request(`/rs/sysDepartment/save`, {
    method: 'POST',
    body: params,
  });
}
//注册列表
export async function jgdeleteById(params) {
  return request(`/rs/sysDepartment/deleteById`, {
    method: 'POST',
    body: params,
  });
}
//注册列表
export async function jgqueryTreeList(params) {
  return request(`/rs/sysDepartment/queryTreeList`, {
    method: 'POST',
    body: params,
  });
}

//保养项设置
export async function werbproqueryList(params) {
  return request(`/rs/equipmentMaintainItem/queryList`, {
    method: 'POST',
    body: params,
  });
}
//保养项设置
export async function werbprosave(params) {
  return request(`/rs/equipmentMaintainItem/save`, {
    method: 'POST',
    body: params,
  });
}

//保养项设置
export async function werbprodeleteById(params) {
  return request(`/rs/equipmentMaintainItem/deleteById`, {
    method: 'POST',
    body: params,
  });
}
//checkmainList,checkmainDetails

export async function checkmainList(params) {
  return request(`/rs/equipmentPointCheckItemDayTask/queryList`, {
    method: 'POST',
    body: params,
  });
}

export async function checkmainDetails(params) {
  return request(`/rs/equipmentPointCheckItemTask/queryDayDetails`, {
    method: 'POST',
    body: params,
  });
}

export async function checkstatistics(params) {
  return request(`/rs/equipmentPointCheckItemTask/statistics`, {
    method: 'POST',
    body: params,
  });
}

export async function queryByIdList(params) {
  return request(`/rs/equipment/queryByIdList`, {
    method: 'POST',
    body: params,
  });
}
//根据配置类型分页查询列表  post 0维修,1保养
export async function equipmentqueryList(params) {
  return request(`/rs/userEquipment/queryList`, {
    method: 'POST',
    body: params,
  });
}

//保养改负责人
export async function equipmentupdateById(params) {
  return request(`/rs/userEquipment/updateMaintainById`, {
    method: 'POST',
    body: params,
  });
}
//点检改负责人
export async function equipmentupdateByIds(params) {
  return request(`/rs/userEquipment/updateCheckById`, {
    method: 'POST',
    body: params,
  });
}
//验证改负责人
export async function equipmentupdateByIdc(params) {
  return request(`/rs/userEquipment/updateVerificationById`, {
    method: 'POST',
    body: params,
  });
}

//验证改负责人
export async function equipmentupdateByIdz(params) {
  return request(`/rs/userEquipment/updateRepairById`, {
    method: 'POST',
    body: params,
  });
}
//保养-删除
export async function equipmentdeleteById(params) {
  return request(`/rs/userEquipment/deleteMaintainById`, {
    method: 'POST',
    body: params,
  });
}
//点检-删除
export async function equipmentdeleteByIds(params) {
  return request(`/rs/userEquipment/deleteCheckById`, {
    method: 'POST',
    body: params,
  });
}

//验证-删除
export async function equipmentdeleteByIdc(params) {
  return request(`/rs/userEquipment/deleteVerificationById`, {
    method: 'POST',
    body: params,
  });
}

//验证-删除*********************
export async function equipmentdeleteByIdz(params) {
  return request(`/rs/userEquipment/deleteRepairById`, {
    method: 'POST',
    body: params,
  });
}

export async function equipmentqueryNoByUserId(params) {
  return request(`/rs/userEquipment/queryNoByUserId`, {
    method: 'POST',
    body: params,
  });
}

export async function equipmentqueryByUserId(params) {
  return request(`/rs/userEquipment/queryByUserId`, {
    method: 'POST',
    body: params,
  });
}
//v
export async function equipmentsave(params) {
  return request(`/rs/userEquipment/saveMaintain`, {
    method: 'POST',
    body: params,
  });
}
//d
export async function equipmentsaves(params) {
  return request(`/rs/userEquipment/saveCheck`, {
    method: 'POST',
    body: params,
  });
}
//y
export async function equipmentsavec(params) {
  return request(`/rs/userEquipment/saveVerification`, {
    method: 'POST',
    body: params,
  });
}
export async function equipmentsavez(params) {
  return request(`/rs/userEquipment/saveRepair`, {
    method: 'POST',
    body: params,
  });
}

//equipmentqueryList,equipmentupdateById,equipmentdeleteById,equipmentqueryNoByUserId,equipmentqueryByUserId,equipmentsave
//保养任务列表
export async function verbmsqueryList(params) {
  return request(`/rs/equipmentMaintainBillToExecute/queryList`, {
    method: 'POST',
    body: params,
  });
}

//保养任务列表-开始为报
export async function verbmsstartMaintain(params) {
  return request(`/rs/equipmentMaintainBillToExecute/startMaintain`, {
    method: 'POST',
    body: params,
  });
}

//保养任务列表-完成为报
export async function verbmsfinishMaintain(params) {
  return request(`/rs/equipmentMaintainBillToExecute/finishMaintain`, {
    method: 'POST',
    body: params,
  });
}

//保养任务列表-关闭为报
export async function verbmscloseMaintain(params) {
  return request(`/rs/equipmentMaintainBillToExecute/closeMaintain`, {
    method: 'POST',
    body: params,
  });
}

//保养任务列表-关闭为报
export async function verbmsupdateMaintainUser(params) {
  return request(`/rs/equipmentMaintainBillToExecute/updateMaintainUser`, {
    method: 'POST',
    body: params,
  });
}
//保养任务列表-关闭为报
export async function verbmsqueryById(params) {
  return request(`/rs/equipmentMaintainBillToExecute/queryById`, {
    method: 'POST',
    body: params,
  });
}

//保养任务列表-查看保养内容
export async function verbmsqueryByBillToExecuteId(params) {
  return request(`/rs/actualEquipmentMaintainItem/queryByBillToExecuteId`, {
    method: 'POST',
    body: params,
  });
}

//保养任务列表-查看保养内容
export async function verbtoqueryList(params) {
  return request(`/rs/equipmentMaintainBillExecute/queryList`, {
    method: 'POST',
    body: params,
  });
}
//保养任务列表-查看保养内容
export async function verbtoqueryById(params) {
  return request(`/rs/equipmentMaintainBillExecute/queryById`, {
    method: 'POST',
    body: params,
  });
}

//维修单列表
export async function repairqueryList(params) {
  return request(`/rs/equipmentRepair/queryList`, {
    method: 'POST',
    body: params,
  });
}
export async function modifyRepairUser(params) {
  return request(`/rs/equipmentRepair/modifyRepairUser`, {
    method: 'POST',
    body: params,
  });
}
export async function getRepairDetail(params) {
  return request(`/rs/equipmentRepair/getRepairDetail`, {
    method: 'POST',
    body: params,
  });
}

//配件列表
export async function sparequeryList(params) {
  return request(`/rs/spareParts/queryList `, {
    method: 'POST',
    body: params,
  });
}
//配件列表
export async function sparesave(params) {
  return request(`/rs/spareParts/save`, {
    method: 'POST',
    body: params,
  });
}
//配件列表
export async function sparedeleteById(params) {
  return request(`/rs/spareParts/deleteById`, {
    method: 'POST',
    body: params,
  });
}

//配件列表
export async function sparequeryTreeList(params) {
  return request(`/rs/sparePartsType/queryTreeList`, {
    method: 'POST',
    body: params,
  });
}
//配件列表
export async function spareTreesave(params) {
  return request(`/rs/sparePartsType/save`, {
    method: 'POST',
    body: params,
  });
}

//配件列表
export async function spareTreedeleteById(params) {
  return request(`/rs/sparePartsType/deleteById`, {
    method: 'POST',
    body: params,
  });
}

//配件列表
export async function spareRecordsave(params) {
  return request(`/rs/sparePartsRecord/save`, {
    method: 'POST',
    body: params,
  });
}

//配件列表
export async function spareRecordqueryList(params) {
  return request(`/rs/sparePartsRecord/queryList`, {
    method: 'POST',
    body: params,
  });
}

//配件列表
export async function spareUsequeryList(params) {
  return request(`/rs/sparePartsConsume/queryList`, {
    method: 'POST',
    body: params,
  });
}

//配件列表
export async function spareuspqueryList(params) {
  return request(`/rs/userSpareParts/queryList`, {
    method: 'POST',
    body: params,
  });
}

//设备图表
export async function queryAnalysis(params) {
  return request(`/rs/equipmentManufactureRecordHis/queryAnalysis`, {
    method: 'POST',
    body: params,
  });
}

//设备图表
export async function getCapacityAnalysis(params) {
  return request(`/rs/equipment/getCapacityAnalysis`, {
    method: 'POST',
    body: params,
  });
}

//设备图表
export async function queryListByParentId(params) {
  return request(`/rs/sysDepartment/queryListByParentId`, {
    method: 'POST',
    body: params,
  });
}

//配件申请
export async function getqueryList(params) {
  return request(`/rs/sparePartsApply/queryList`, {
    method: 'POST',
    body: params,
  });
}

//配件申请
export async function outqueryList(params) {
  return request(`/rs/sparePartsApply/queryApplyInfo`, {
    method: 'POST',
    body: params,
  });
}

//配件申请
export async function getsave(params) {
  return request(`/rs/sparePartsApply/save`, {
    method: 'POST',
    body: params,
  });
}

//配件申请
export async function getqueryListAndApplyInfo(params) {
  return request(`/rs/saprePartsApplyDetail/queryListAndApplyInfo`, {
    method: 'POST',
    body: params,
  });
}

//配件申请
export async function getaudit(params) {
  return request(`/rs/sparePartsApply/audit`, {
    method: 'POST',
    body: params,
  });
}

//配件申请
export async function getrecall(params) {
  return request(`/rs/sparePartsApply/recall`, {
    method: 'POST',
    body: params,
  });
}

//配件申请
export async function queryDiagram(params) {
  return request(`/rs/equipmentRepairHis/queryDiagram`, {
    method: 'POST',
    body: params,
  });
}

//班次列表-分页
export async function getShiftPage(params) {
  return request(`/rs/sysShift/queryList`, {
    method: 'POST',
    body: params,
  });
}
//班次列表-分页
export async function insertShift(params) {
  return request(`/rs/sysShift/save`, {
    method: 'POST',
    body: params,
  });
}
//班次列表-分页
export async function deleteShifts(params) {
  return request(`/rs/sysShift/deleteById`, {
    method: 'POST',
    body: params,
  });
}
//班次列表-分页
export async function getScheduleList(params) {
  return request(`/rs/sysShiftSchedule/queryThreeMonthsList`, {
    method: 'POST',
    body: params,
  });
}
//班次列表-分页
export async function insertSchedule(params) {
  return request(`/rs/sysShiftSchedule/save`, {
    method: 'POST',
    body: params,
  });
}
//班次列表-分页
export async function queryAllRepair(params) {
  return request(`/rs/sysShift/queryAllRepair`, {
    method: 'POST',
    body: params,
  });
}

//班次列表-分页
export async function rslmodifyRepairUser(params) {
  return request(`/rs/equipmentRepair/modifyRepairUser`, {
    method: 'POST',
    body: params,
  });
}

//班次列表-分页
export async function rslgetRepairDetail(params) {
  return request(`/rs/equipmentRepair/getRepairDetail`, {
    method: 'POST',
    body: params,
  });
}
//班次列表-分页
export async function hisgetRepairDetail(params) {
  return request(`/rs/equipmentRepairHis/getRepairDetail`, {
    method: 'POST',
    body: params,
  });
}

//班次列表-分页
export async function taskqueryList(params) {
  return request(`/rs/taskNotice/queryList`, {
    method: 'POST',
    body: params,
  });
}

//班次列表-分页
export async function tasksave(params) {
  return request(`/rs/taskNotice/save`, {
    method: 'POST',
    body: params,
  });
}

//班次列表-分页
export async function taskdeleteById(params) {
  return request(`/rs/taskNotice/deleteById`, {
    method: 'POST',
    body: params,
  });
}

//点检增/改
export async function checksave(params) {
  return request(`/rs/equipmentPointCheckItem/save`, {
    method: 'POST',
    body: params,
  });
}

//点检增/改
export async function checkqueryList(params) {
  return request(`/rs/equipmentPointCheckItem/queryList`, {
    method: 'POST',
    body: params,
  });
}

//点检增/改
export async function checkdeleteById(params) {
  return request(`/rs/equipmentPointCheckItem/deleteById`, {
    method: 'POST',
    body: params,
  });
}

//点检设置
export async function checkmenuqueryList(params) {
  return request(`/rs/equipmentPointCheckItemRel/queryList`, {
    method: 'POST',
    body: params,
  });
}

//点检设置
export async function checkmenudeleteById(params) {
  return request(`/rs/equipmentPointCheckItemRel/deleteById`, {
    method: 'POST',
    body: params,
  });
}

//点检设置
export async function checkmenuqueryAll(params) {
  return request(`/rs/equipmentPointCheckItem/queryAll`, {
    method: 'POST',
    body: params,
  });
}

//点检设置
export async function queryListOfEquipment(params) {
  return request(`/rs/equipmentPointCheckItemRel/queryListOfEquipment`, {
    method: 'POST',
    body: params,
  });
}
//点检设置
export async function queryWithoutIds(params) {
  return request(`/rs/equipmentPointCheckItem/queryWithoutIds`, {
    method: 'POST',
    body: params,
  });
}

//点检设置
export async function checkmenusave(params) {
  return request(`/rs/equipmentPointCheckItemRel/save`, {
    method: 'POST',
    body: params,
  });
}

//公司老板
export async function adminqueryList(params) {
  return request(`/rs/sysCompany/queryList`, {
    method: 'POST',
    body: params,
  });
}

//公司老板 adminqueryList,adminupdate
export async function adminupdate(params) {
  return request(`/rs/sysCompany/update`, {
    method: 'POST',
    body: params,
  });
}

//设备维修
export async function queryByEquipmentId(params) {
  return request(`/rs/equipmentRepair/queryByEquipmentId`, {
    method: 'POST',
    body: params,
  });
}

//设备维修
export async function repair(params) {
  return request(`/rs/equipmentRepair/repair`, {
    method: 'POST',
    body: params,
  });
}

//设备维修
export async function queryByCompanyId(params) {
  return request(`/rs/equipment/queryByCompanyId`, {
    method: 'POST',
    body: params,
  });
}

//设备维修
export async function queryByDateAndWeekNum(params) {
  return request(`/rs/equipmentPointCheckItemDayTask/queryByDateAndWeekNum`, {
    method: 'POST',
    body: params,
  });
}

//设备维修
export async function queryItemTaskByDayTaskId(params) {
  return request(`/rs/equipmentPointCheckItemDayTask/queryItemTaskByDayTaskId`, {
    method: 'POST',
    body: params,
  });
}

//设备维修
export async function fatequeryListOfEquipment(params) {
  return request(`/rs/equipmentPointCheckTask/queryListOfEquipment`, {
    method: 'POST',
    body: params,
  });
}

//设备维修
export async function pairqueryPageByUserId(params) {
  return request(`/rs/userSpareParts/queryPageByUserId`, {
    method: 'POST',
    body: params,
  });
}
//设备维修
export async function queryByEquipId(params) {
  return request(`/rs/userEquipment/queryMainByEquipId`, {
    method: 'POST',
    body: params,
  });
}

//设备维修
export async function queryQrCode(params) {
  return request(`/rs/equipment/queryQrCode`, {
    method: 'POST',
    body: params,
  });
}

//adden
export async function SETqueryList(params) {
  return request(`/rs/sysSpareReplace/queryList`, {
    method: 'POST',
    body: params,
  });
}

//adden
export async function queryEquipmentAndSpareParts(params) {
  return request(`/rs/sysSpareReplace/queryEquipmentAndSpareParts`, {
    method: 'POST',
    body: params,
  });
}
//auden
export async function SETsave(params) {
  return request(`/rs/sysSpareReplace/save`, {
    method: 'POST',
    body: params,
  });
}

//auden
export async function SETdeleteById(params) {
  return request(`/rs/sysSpareReplace/deleteById`, {
    method: 'POST',
    body: params,
  });
}

//auden
export async function UndoqueryList(params) {
  return request(`/rs/equipmentSparePartsReplace/queryList`, {
    method: 'POST',
    body: params,
  });
}

//auden
export async function queryChangePerson(params) {
  return request(`/rs/equipmentSparePartsReplace/queryChangePerson`, {
    method: 'POST',
    body: params,
  });
}

//auden
export async function saveChangePerson(params) {
  return request(`/rs/equipmentSparePartsReplace/saveChangePerson`, {
    method: 'POST',
    body: params,
  });
}

//auden
export async function DonequeryList(params) {
  return request(`/rs/equipmentSparePartsReplaceHis/queryList`, {
    method: 'POST',
    body: params,
  });
}

//fate
export async function queryOfMonth(params) {
  return request(`/rs/equipmentMaintainBillToExecute/queryOfMonth`, {
    method: 'POST',
    body: params,
  });
}

//fate
export async function updatePointCheckUser(params) {
  return request(`/rs/equipmentPointCheckItemDayTask/updatePointCheckUser`, {
    method: 'POST',
    body: params,
  });
}

//fate
export async function TroublequeryTreeList(params) {
  return request(`/rs/equipmentFaultType/queryTreeList`, {
    method: 'POST',
    body: params,
  });
}

//fate
export async function Troublesave(params) {
  return request(`/rs/equipmentFaultType/save`, {
    method: 'POST',
    body: params,
  });
}

//fate
export async function TroubledeleteById(params) {
  return request(`/rs/equipmentFaultType/deleteById`, {
    method: 'POST',
    body: params,
  });
}

//fate
export async function getChildren(params) {
  return request(`/rs/equipmentFaultType/getChildren`, {
    method: 'POST',
    body: params,
  });
}

//fate
export async function hisToryqueryList(params) {
  return request(`/rs/equipmentRepairHis/queryList`, {
    method: 'POST',
    body: params,
  });
}

//fate
export async function queryPageList(params) {
  return request(`/rs/equipment/queryPageList`, {
    method: 'POST',
    body: params,
  });
}

export async function queryUseListByComId(params) {
  return request(`/rs/equipment/queryUseListByComId`, {
    method: 'POST',
    body: params,
  });
}

export async function queryPageListPlus(params) {
  return request(`/rs/equipment/queryPageListPlus`, {
    method: 'POST',
    body: params,
  });
}

//fate
export async function queryUseList(params) {
  return request(`/rs/equipment/queryUseList`, {
    method: 'POST',
    body: params,
  });
}

//homejs
export async function queryHome(params) {
  return request(`/rs/equipment/queryHome`, {
    method: 'POST',
    body: params,
  });
}

//homejs
export async function queryUserByRoleId(params) {
  return request(`/rs/sysRole/queryUserByRoleId`, {
    method: 'POST',
    body: params,
  });
}

//homejs
export async function stopRepair(params) {
  return request(`/rs/equipmentRepair/stopRepair`, {
    method: 'POST',
    body: params,
  });
}

//用户列表
export async function AdminuserqueryAll(params) {
  return request(`/rs/sysUser/queryAll`, {
    method: 'POST',
    body: params,
  });
}

//partsqueryList,partsqueryById,partsdeleteById,partssave
export async function partsqueryList(params) {
  return request(`/rs/sysShop/queryList`, {
    method: 'POST',
    body: params,
  });
}

export async function partsqueryById(params) {
  return request(`/rs/sysShop/queryById`, {
    method: 'POST',
    body: params,
  });
}

export async function partsdeleteById(params) {
  return request(`/rs/sysShop/deleteById`, {
    method: 'POST',
    body: params,
  });
}

export async function partssave(params) {
  return request(`/rs/sysShop/save`, {
    method: 'POST',
    body: params,
  });
}

//syscomqueryList,syscomsave,syscomchangeStatus
export async function syscomqueryList(params) {
  return request(`/rs/sysCompany/queryList`, {
    method: 'POST',
    body: params,
  });
}

export async function syscomsave(params) {
  return request(`/rs/sysCompany/save`, {
    method: 'POST',
    body: params,
  });
}

export async function syscomchangeStatus(params) {
  return request(`/rs/sysCompany/changeStatus`, {
    method: 'POST',
    body: params,
  });
}

export async function sysqueryByRoleId(params) {
  return request(`/rs/sysRoleCompany/queryByRoleId`, {
    method: 'POST',
    body: params,
  });
}

export async function addcomsave(params) {
  return request(`/rs/sysRoleCompany/save`, {
    method: 'POST',
    body: params,
  });
}

export async function queryCondition(params) {
  return request(`/rs/sysUser/queryCondition`, {
    method: 'POST',
    body: params,
  });
}

export async function queryApplyReapairList(params) {
  return request(`/rs/equipment/queryApplyReapairList`, {
    method: 'POST',
    body: params,
  });
}

export async function queryOEE(params) {
  return request(`/rs/equipmentRepairHis/queryOEE`, {
    method: 'POST',
    body: params,
  });
}

export async function queryJIA(params) {
  return request(`/rs/equipmentRepairHis/queryJIA`, {
    method: 'POST',
    body: params,
  });
}

export async function queryMTTR(params) {
  return request(`/rs/equipmentRepairHis/queryMTTR`, {
    method: 'POST',
    body: params,
  });
}

export async function queryMTBF(params) {
  return request(`/rs/equipmentRepairHis/queryMTBF`, {
    method: 'POST',
    body: params,
  });
}

export async function querySTOP(params) {
  return request(`/rs/equipmentRepairHis/querySTOP`, {
    method: 'POST',
    body: params,
  });
}

export async function queryCount(params) {
  return request(`/rs/sysUser/queryCountById`, {
    method: 'POST',
    body: params,
  });
}

export async function exportFile(params) {
  return request(`/rs/equipment/exportFile`, {
    method: 'POST',
    body: params,
  });
}

//导入接口合计
export async function uploadsysUser(params) {
  return request(`/rs/sysUser/importUser`, {
    method: 'POST',
    body: params,
  });
}

export async function uploadproductPlan(params) {
  return request(`/rs/productPlan/importProductPlan`, {
    method: 'POST',
    body: params,
  });
}

export async function uploaduserEquipment(params) {
  return request(`/rs/userEquipment/importUserEquip `, {
    method: 'POST',
    body: params,
  });
}
export async function uploadelectricityMeterReadDay(params) {
  return request(`/rs/electricityMeterReadDay/importReadDay`, {
    method: 'POST',
    body: params,
  });
}
export async function uploadequipment(params) {
  return request(`/rs/equipment/importExcel`, {
    method: 'POST',
    body: params,
  });
}
export async function uploadequipmentMaintainItem(params) {
  return request(`/rs/equipmentMaintainItem/importItem`, {
    method: 'POST',
    body: params,
  });
}
export async function uploadequipmentFaultType(params) {
  return request(`/rs/equipmentFaultType/importExcel `, {
    method: 'POST',
    body: params,
  });
}

export async function uploadspareParts(params) {
  return request(`/rs/spareParts/importExcel `, {
    method: 'POST',
    body: params,
  });
}
export async function uploadequipmentSpareRel(params) {
  return request(`/rs/equipmentSpareRel/importExcel `, {
    method: 'POST',
    body: params,
  });
}
export async function uploadequipmentMaintainPlan(params) {
  return request(`/rs/equipmentMaintainPlan/importMaintainPlan`, {
    method: 'POST',
    body: params,
  });
}
export async function uploadequipmentPointCheckPlan(params) {
  return request(`/rs/equipmentPointCheckPlan/import`, {
    method: 'POST',
    body: params,
  });
}
export async function uploadproductMonthPlanDetail(params) {
  return request(`/rs/productMonthPlanDetail/importExcel`, {
    method: 'POST',
    body: params,
  });
}

//首页
export async function queryUrlList(params) {
  return request(`/rs/sysDic/queryUrlList `, {
    method: 'POST',
    body: params,
  });
}
export async function queryRepair(params) {
  return request(`/rs/equipmentKnowledgeBase/queryRepair `, {
    method: 'POST',
    body: params,
  });
}
export async function queryTaskCount(params) {
  return request(`/rs/taskBill/queryTaskCount `, {
    method: 'POST',
    body: params,
  });
}

export async function querySystem(params) {
  return request(`/rs/equipmentKnowledgeBase/querySystem `, {
    method: 'POST',
    body: params,
  });
}

export async function queryKnowledge(params) {
  return request(`/rs/equipmentKnowledgeBase/queryKnowledge`, {
    method: 'POST',
    body: params,
  });
}

export async function fbqueryMyList(params) {
  return request(`/rs/sysAssignment/queryMyList`, {
    method: 'POST',
    body: params,
  });
}

export async function queryMyList(params) {
  return request(`/rs/assignmentUserExecute/queryMyList`, {
    method: 'POST',
    body: params,
  });
}

export async function queryMessage(params) {
  return request(`/rs/sysUser/queryMessage`, {
    method: 'POST',
    body: params,
  });
}

export async function missionsave(params) {
  return request(`/rs/sysAssignment/save`, {
    method: 'POST',
    body: params,
  });
}

export async function GGqueryList(params) {
  return request(`/rs/sysAnnouncement/queryList`, {
    method: 'POST',
    body: params,
  });
}

export async function GGsave(params) {
  return request(`/rs/sysAnnouncement/save`, {
    method: 'POST',
    body: params,
  });
}

export async function querySendReview(params) {
  return request(`/rs/sysAnnouncement/querySendReview`, {
    method: 'POST',
    body: params,
  });
}

//queryNoReview,auditReview,queryYesReview
export async function queryNoReview(params) {
  return request(`/rs/sysAnnouncement/queryNoReview`, {
    method: 'POST',
    body: params,
  });
}

export async function auditReview(params) {
  return request(`/rs/sysAnnouncement/auditReview`, {
    method: 'POST',
    body: params,
  });
}

export async function queryYesReview(params) {
  return request(`/rs/sysAnnouncement/queryYesReview`, {
    method: 'POST',
    body: params,
  });
}

export async function fqueryDetaila(params) {
  return request(`/rs/assignmentUserExecute/queryDetail`, {
    method: 'POST',
    body: params,
  });
}

export async function fqueryDetailb(params) {
  return request(`/rs/sysAssignment/queryDetail`, {
    method: 'POST',
    body: params,
  });
}
//missionsubmit,missionaudit
export async function missionsubmit(params) {
  return request(`/rs/assignmentUserExecute/submit`, {
    method: 'POST',
    body: params,
  });
}

export async function missionaudit(params) {
  return request(`/rs/assignmentUserExecute/audit`, {
    method: 'POST',
    body: params,
  });
}
export async function getDetailByDicId(params) {
  return request(`/rs/sysDic/getDetailByDicId`, {
    method: 'POST',
    body: params,
  });
}
//weiqueryList,weiauditExternalRepair,weiconfigBack
export async function weiqueryList(params) {
  return request(`/rs/externalRepair/queryList`, {
    method: 'POST',
    body: params,
  });
}

export async function weiauditExternalRepair(params) {
  return request(`/rs/externalRepair/auditExternalRepair`, {
    method: 'POST',
    body: params,
  });
}

export async function weiconfigBack(params) {
  return request(`/rs/externalRepair/configBack`, {
    method: 'POST',
    body: params,
  });
}

//queryEquipChartByCompanyId,queryEquipChart
export async function queryEquipChart(params) {
  return request(`/rs/equipment/queryEquipChart`, {
    method: 'POST',
    body: params,
  });
}

export async function queryEquipChartByCompanyId(params) {
  return request(`/rs/equipment/queryEquipChartByCompanyId`, {
    method: 'POST',
    body: params,
  });
}

export async function queryShopsEquipChart(params) {
  return request(`/rs/equipment/queryShopsEquipChart`, {
    method: 'POST',
    body: params,
  });
}

/*queryEquipChartLine,queryEquipChartByCompanyIdLine,queryShopsEquipChartLine */
export async function queryEquipChartLine(params) {
  return request(`/rs/equipment/queryEquipChartLine`, {
    method: 'POST',
    body: params,
  });
}

export async function queryEquipChartByCompanyIdLine(params) {
  return request(`/rs/equipment/queryEquipChartByCompanyIdLine`, {
    method: 'POST',
    body: params,
  });
}

export async function queryShopsEquipChartLine(params) {
  return request(`/rs/equipment/queryShopsEquipChartLine`, {
    method: 'POST',
    body: params,
  });
}

//查询所有公司
export async function cpyqueryAll(params) {
  return request(`/rs/sysCompany/queryAll`, {
    method: 'POST',
    body: params,
  });
}

export async function queryByApprovalProcessType(params) {
  return request(`/rs/equipmentApprovalProcessNode/queryByApprovalProcessType`, {
    method: 'POST',
    body: params,
  });
}

export async function queryBySparePartsNoList(params) {
  return request(`/rs/spareParts/queryBySparePartsNoList`, {
    method: 'POST',
    body: params,
  });
}

export async function queryApprovalTypeCount(params) {
  return request(`/rs/taskBill/queryApprovalTypeCount`, {
    method: 'POST',
    body: params,
  });
}

export async function weiwaicreate(params) {
  return request(`/rs/externalRepair/create`, {
    method: 'POST',
    body: params,
  });
}

export async function association(params) {
  return request(`/rs/userEquipment/association`, {
    method: 'POST',
    body: params,
  });
}

export async function loanReturn(params) {
  return request(`/rs/equipmentApprovalProcess/loanReturn`, {
    method: 'POST',
    body: params,
  });
}

//EnequeryList,EneDequeryList,Enesave,EneDesave,EnedeleteById
export async function EnequeryList(params) {
  return request(`/rs/sysElectricityMeter/queryList`, {
    method: 'POST',
    body: params,
  });
}

export async function Enesave(params) {
  return request(`/rs/sysElectricityMeter/save`, {
    method: 'POST',
    body: params,
  });
}

export async function EnedeleteById(params) {
  return request(`/rs/sysElectricityMeter/deleteById`, {
    method: 'POST',
    body: params,
  });
}

export async function EneDesave(params) {
  return request(`/rs/electricityMeterReadDay/save`, {
    method: 'POST',
    body: params,
  });
}

export async function EneDequeryList(params) {
  return request(`/rs/electricityMeterReadDay/queryList`, {
    method: 'POST',
    body: params,
  });
}

export async function createMaintainTask(params) {
  return request(`/rs/equipmentMaintainPlan/createMaintainTask`, {
    method: 'POST',
    body: params,
  });
}

//queryYes,queryNo,querysave,queryupdate
export async function queryYes(params) {
  return request(`/rs/electricityMeterRate/queryYes`, {
    method: 'POST',
    body: params,
  });
}

export async function queryNo(params) {
  return request(`/rs/electricityMeterRate/queryNo`, {
    method: 'POST',
    body: params,
  });
}

export async function querysave(params) {
  return request(`/rs/electricityMeterRate/save`, {
    method: 'POST',
    body: params,
  });
}

export async function queryupdate(params) {
  return request(`/rs/electricityMeterRate/update`, {
    method: 'POST',
    body: params,
  });
}
//composequeryList,queryByBuddleId,queryNoByBuddleId,composesave
export async function composequeryList(params) {
  return request(`/rs/buddleEquipment/queryList`, {
    method: 'POST',
    body: params,
  });
}

export async function queryByBuddleId(params) {
  return request(`/rs/buddleEquipment/queryByBuddleId`, {
    method: 'POST',
    body: params,
  });
}

export async function queryNoByBuddleId(params) {
  return request(`/rs/buddleEquipment/queryNoByBuddleId`, {
    method: 'POST',
    body: params,
  });
}

export async function composesave(params) {
  return request(`/rs/buddleEquipment/save`, {
    method: 'POST',
    body: params,
  });
}

export async function uploadbuddleEquipment(params) {
  return request(`/rs/buddleEquipment/importExcel`, {
    method: 'POST',
    body: params,
  });
}

export async function uploadproductionPecification(params) {
  return request(`/rs/productionPecification/importExcel`, {
    method: 'POST',
    body: params,
  });
}

export async function Energychart(params) {
  return request(`/rs/shopMeterDegree/chart`, {
    method: 'POST',
    body: params,
  });
}
//planqueryList,getProductors,plansave,plandeleteById,planshiftqueryList,saveOrUpdate,savedeleteById
export async function planqueryList(params) {
  return request(`/rs/productPlan/queryList`, {
    method: 'POST',
    body: params,
  });
}

export async function getProductors(params) {
  return request(`/rs/sysUser/getProductorsByShopId`, {
    method: 'POST',
    body: params,
  });
}

export async function plansave(params) {
  return request(`/rs/productPlan/save`, {
    method: 'POST',
    body: params,
  });
}
export async function plansaveList(params) {
  return request(`/rs/productPlan/saveList`, {
    method: 'POST',
    body: params,
  });
}
export async function plandeleteById(params) {
  return request(`/rs/productPlan/deleteById`, {
    method: 'POST',
    body: params,
  });
}

export async function planshiftqueryList(params) {
  return request(`/rs/equipmentShiftProduct/queryList`, {
    method: 'POST',
    body: params,
  });
}
export async function saveOrUpdate(params) {
  return request(`/rs/equipmentShiftProduct/saveOrUpdate`, {
    method: 'POST',
    body: params,
  });
}

export async function savedeleteById(params) {
  return request(`/rs/equipmentShiftProduct/deleteById`, {
    method: 'POST',
    body: params,
  });
}

export async function uiassociation(params) {
  return request(`/rs/userEquipment/queryUpdateUser`, {
    method: 'POST',
    body: params,
  });
}

export async function queryBusinessByUserId(params) {
  return request(`/rs/userEquipment/queryBusinessByUserId`, {
    method: 'POST',
    body: params,
  });
}

export async function missiondeleteById(params) {
  return request(`/rs/sysAssignment/deleteById`, {
    method: 'POST',
    body: params,
  });
}

export async function getKnowledgeDetailByDicKey(params) {
  return request(`/rs/sysDic/getKnowledgeDetailByDicKey`, {
    method: 'POST',
    body: params,
  });
}

export async function queryListAndSpareList(params) {
  return request(`/rs/equipment/queryListAndSpareList`, {
    method: 'POST',
    body: params,
  });
}

export async function DSparesave(params) {
  return request(`/rs/equipmentSpareRel/save`, {
    method: 'POST',
    body: params,
  });
}

export async function DSparequery(params) {
  return request(`/rs/spareParts/queryPageList`, {
    method: 'POST',
    body: params,
  });
}

export async function getProductorsByShopIdDown(params) {
  return request(`/rs/sysUser/getProductorsByShopIdDown`, {
    method: 'POST',
    body: params,
  });
}

export async function batchSaveOrUpdate(params) {
  return request(`/rs/equipmentShiftProduct/batchSaveOrUpdate`, {
    method: 'POST',
    body: params,
  });
}
// replysave,queryListByKnowledgeId,queryListByParentIds,replydeleteById
export async function replysave(params) {
  return request(`/rs/equipmentKnowledgeBaseComment/save`, {
    method: 'POST',
    body: params,
  });
}

export async function queryListByKnowledgeId(params) {
  return request(`/rs/equipmentKnowledgeBaseComment/queryListByKnowledgeId`, {
    method: 'POST',
    body: params,
  });
}

export async function queryListByParentIds(params) {
  return request(`/rs/equipmentKnowledgeBaseComment/queryListByParentId`, {
    method: 'POST',
    body: params,
  });
}
export async function replydeleteById(params) {
  return request(`/rs/equipmentKnowledgeBaseComment/deleteById`, {
    method: 'POST',
    body: params,
  });
}

export async function missionconfirm(params) {
  return request(`/rs/equipmentMaintainBillToExecute/confirm`, {
    method: 'POST',
    body: params,
  });
}

export async function csqueryQrCode(params) {
  return request(`/rs/sysElectricityMeter/queryQrCode`, {
    method: 'POST',
    body: params,
  });
}
//checkSqueryList,checkSsave,checkSdeleteById,checkssave,checksdeleteById,checksqueryList
export async function checkSqueryList(params) {
  return request(`/rs/equipment/queryUseList`, {
    method: 'POST',
    body: params,
  });
}
export async function queryListError(params) {
  return request(`/rs/equipmentPointCheckException/queryList`, {
    method: 'POST',
    body: params,
  });
}
export async function checkIgnore(params) {
  return request(`/rs/equipmentPointCheckException/checkIgnore`, {
    method: 'POST',
    body: params,
  });
}
export async function checkRepair(params) {
  return request(`/rs/equipmentPointCheckException/checkRepair`, {
    method: 'POST',
    body: params,
  });
}

export async function checkRepairAfter(params) {
  return request(`/rs/equipmentPointCheckException/checkRepairAfter`, {
    method: 'POST',
    body: params,
  });
}

export async function checkSsave(params) {
  return request(`/rs/equipmentPointCheckPlan/save`, {
    method: 'POST',
    body: params,
  });
}
export async function checkSdeleteById(params) {
  return request(`/rs/equipmentPointCheckPlan/deleteById`, {
    method: 'POST',
    body: params,
  });
}
export async function checkssave(params) {
  return request(`/rs/equipmentPointCheckItem/save`, {
    method: 'POST',
    body: params,
  });
}

export async function checksdeleteById(params) {
  return request(`/rs/equipmentPointCheckItem/deleteById`, {
    method: 'POST',
    body: params,
  });
}

export async function checksqueryList(params) {
  return request(`/rs/equipmentPointCheckItem/queryList`, {
    method: 'POST',
    body: params,
  });
}
//sizequeryList,sizesave,sizedeleteById,sizequeryById
export async function sizequeryList(params) {
  return request(`/rs/productionPecification/queryList`, {
    method: 'POST',
    body: params,
  });
}

export async function sizesave(params) {
  return request(`/rs/productionPecification/save`, {
    method: 'POST',
    body: params,
  });
}

export async function sizedeleteById(params) {
  return request(`/rs/productionPecification/deleteById`, {
    method: 'POST',
    body: params,
  });
}

export async function sizequeryById(params) {
  return request(`/rs/productionPecification/queryById`, {
    method: 'POST',
    body: params,
  });
}

//buyqueryList,buyaudit,buyrecall,buysave

export async function buyqueryList(params) {
  return request(`/rs/sparePartsPurchaseAudit/queryList`, {
    method: 'POST',
    body: params,
  });
}

export async function buyaudit(params) {
  return request(`/rs/sparePartsPurchaseAudit/audit`, {
    method: 'POST',
    body: params,
  });
}

export async function buyrecall(params) {
  return request(`/rs/sparePartsPurchaseAudit/recall`, {
    method: 'POST',
    body: params,
  });
}

export async function buysave(params) {
  return request(`/rs/sparePartsPurchaseAudit/save`, {
    method: 'POST',
    body: params,
  });
}

export async function queryByConditionPage(params) {
  return request(`/rs/productionPecification/queryByConditionPage`, {
    method: 'POST',
    body: params,
  });
}

export async function exportFileCheck(params) {
  return request(`/rs/equipmentShiftProduct/exportFileCheck`, {
    method: 'POST',
    body: params,
  });
}

//queryTypeFault,queryTypeFaultByCompanyId,queryFaultTypeFault,queryFaultTypeFaultByCompanyId
export async function queryTypeFault(params) {
  return request(`/rs/equipmentRepairHis/queryTypeFault`, {
    method: 'POST',
    body: params,
  });
}

export async function queryTypeFaultByCompanyId(params) {
  return request(`/rs/equipmentRepairHis/queryTypeFaultByCompanyId`, {
    method: 'POST',
    body: params,
  });
}

export async function queryFaultTypeFault(params) {
  return request(`/rs/equipmentRepairHis/queryFaultTypeFault`, {
    method: 'POST',
    body: params,
  });
}

export async function queryFaultTypeFaultByCompanyId(params) {
  return request(`/rs/equipmentRepairHis/queryFaultTypeFaultByCompanyId`, {
    method: 'POST',
    body: params,
  });
}

export async function queryFaultRate(params) {
  return request(`/rs/equipmentRepairHis/queryFaultRate`, {
    method: 'POST',
    body: params,
  });
}

export async function jkqueryList(params) {
  return request(`/rs/actualEquipmentMaintainItem/queryByBillToExecuteId`, {
    method: 'POST',
    body: params,
  });
}

//mdqueryList,mdsave,mddeleteById,mdqueryAll,mdqueryById

export async function mdqueryList(params) {
  return request(`/rs/equipmentModel/queryList`, {
    method: 'POST',
    body: params,
  });
}

export async function mdsave(params) {
  return request(`/rs/equipmentModel/save`, {
    method: 'POST',
    body: params,
  });
}

export async function mddeleteById(params) {
  return request(`/rs/equipmentModel/deleteById`, {
    method: 'POST',
    body: params,
  });
}

export async function mdqueryAll(params) {
  return request(`/rs/equipmentModel/queryAll`, {
    method: 'POST',
    body: params,
  });
}

export async function mdqueryById(params) {
  return request(`/rs/equipmentModel/queryById`, {
    method: 'POST',
    body: params,
  });
}

export async function mdexportFileCheck(params) {
  return request(`/rs/productPlan/exportFileCheck`, {
    method: 'POST',
    body: params,
  });
}

export async function exportEquipmentShiftProductCheck(params) {
  return request(`/rs/equipmentShiftProduct/exportEquipmentShiftProductCheck`, {
    method: 'POST',
    body: params,
  });
}

export async function productConfig(params) {
  return request(`/rs/equipmentShiftProduct/productConfig`, {
    method: 'POST',
    body: params,
  });
}
export async function changeProductConfig(params) {
  return request(`/rs/equipmentShiftProduct/changeProductConfig`, {
    method: 'POST',
    body: params,
  });
}

export async function exportPlanRateFileCheck(params) {
  return request(`/rs/equipmentShiftProduct/exportPlanRateFileCheck`, {
    method: 'POST',
    body: params,
  });
}

export async function queryTaskRate(params) {
  return request(`/rs/equipmentPointCheckItemTask/queryTaskRate`, {
    method: 'POST',
    body: params,
  });
}
export async function queryCheckAbnormal(params) {
  return request(`/rs/equipmentPointCheckItemTask/queryCheckAbnormal`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteBatch(params) {
  return request(`/rs/sysUser/deleteBatch`, {
    method: 'POST',
    body: params,
  });
}

export async function queryUpdateByUserId(params) {
  return request(`/rs/userEquipment/queryUpdateByUserId`, {
    method: 'POST',
    body: params,
  });
}

export async function replaceUser(params) {
  return request(`/rs/userEquipment/replaceUser`, {
    method: 'POST',
    body: params,
  });
}

export async function queryDailyReport(params) {
  return request(`/rs/equipmentShiftProduct/queryDailyReport`, {
    method: 'POST',
    body: params,
  });
}

export async function queryMonthlyReport(params) {
  return request(`/rs/equipmentShiftProduct/queryMonthlyReport`, {
    method: 'POST',
    body: params,
  });
}
export async function evenupdate(params) {
  return request(`/rs/electricityMeterReadDay/update`, {
    method: 'POST',
    body: params,
  });
}

export async function promonqueryList(params) {
  return request(`/rs/productMonthPlan/queryList`, {
    method: 'POST',
    body: params,
  });
}

export async function queryByShopIdAndPlanMonth(params) {
  return request(`/rs/productMonthPlanDetail/queryByShopIdAndPlanMonth`, {
    method: 'POST',
    body: params,
  });
}

export async function takequeryList(params) {
  return request(`/rs/productMonthPlanDetail/queryList`, {
    method: 'POST',
    body: params,
  });
}

export async function takesave(params) {
  return request(`/rs/productMonthPlanDetail/save`, {
    method: 'POST',
    body: params,
  });
}

export async function takedeleteById(params) {
  return request(`/rs/productMonthPlanDetail/deleteById`, {
    method: 'POST',
    body: params,
  });
}

export async function queryExcelList(params) {
  return request(`/rs/shopProductMonthReportDetail/queryExcelList`, {
    method: 'POST',
    body: params,
  });
}

export async function excqueryList(params) {
  return request(`/rs/shopMonthFinishReport/queryList`, {
    method: 'POST',
    body: params,
  });
}

export async function productDayReport(params) {
  return request(`/rs/equipmentShiftProduct/productDayReport`, {
    method: 'POST',
    body: params,
  });
}

export async function aexportFileCheck(params) {
  return request(`/rs/shopMonthFinishReport/exportFileCheck`, {
    method: 'POST',
    body: params,
  });
}

export async function bexportFileCheck(params) {
  return request(`/rs/shopProductMonthReportDetail/exportFileCheck`, {
    method: 'POST',
    body: params,
  });
}

export async function queryOther(params) {
  return request(`/rs/equipmentKnowledgeBase/queryOther`, {
    method: 'POST',
    body: params,
  });
}

export async function isUse(params) {
  return request(`/rs/equipmentMaintainPlan/isUse`, {
    method: 'POST',
    body: params,
  });
}

export async function queryOfCompany(params) {
  return request(`/rs/sysShop/queryOfCompany`, {
    method: 'POST',
    body: params,
  });
}

export async function queryMaintainPool(params) {
  return request(`/rs/equipmentMaintainBillToExecute/queryMaintainPool`, {
    method: 'POST',
    body: params,
  });
}
//dayinfoqueryList,dayinfosave,dayinfodeleteById,queryInOrNotByShopId
export async function dayinfoqueryList(params) {
  return request(`/rs/equipmentShiftProductDetail/queryList`, {
    method: 'POST',
    body: params,
  });
}

export async function dayinfosave(params) {
  return request(`/rs/equipmentShiftProductDetail/save`, {
    method: 'POST',
    body: params,
  });
}

export async function dayinfodeleteById(params) {
  return request(`/rs/equipmentShiftProductDetail/deleteById`, {
    method: 'POST',
    body: params,
  });
}

export async function queryInOrNotByShopId(params) {
  return request(`/rs/sysUser/queryInOrNotByShopId`, {
    method: 'POST',
    body: params,
  });
}
