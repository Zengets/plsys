import { stringify } from 'qs';
import request from '@/utils/request';

let toString = (params)=>{
  for(let i in params){
    if(params[i]){
      params[i] = params[i].toString().replace(/^\s*$/g,'') ;
    }else{
      params[i] = "";
    }
  }
  return stringify(params)
}

/*------------------forget password sendCode----------------------*/
export async function sendCode(params){
  return request(`/rs/sysUser/sendVerificationCode`,{
    method: 'POST',
    body: params
  });
}
/*------------------forget password sendCode----------------------*/
export async function compairCode(params){
  return request(`/rs/sysUser/repareVerificationCode`,{
    method: 'POST',
    body: params
  });
}

/*------------------forget password updatePassword----------------------*/
export async function updatePassword(params){
  return request(`/rs/sysUser/reparePassword`,{
    method: 'POST',
    body: params,
  });
}


/*--------------1-login---------------*/
export async function exportit(params) {
  return request('/nangaoyun/test2/export');
}

/*--------------1-login---------------*/
export async function fakeAccountLogin(params) {
  let formData = toString(params);
  return request('/nangaoyun/login', {
    method: 'POST',
    body: formData,
  });
}
export async function fakeAccountLoginOut(params) {
  return request('/nangaoyun/logout', {
    method: 'POST',
  });
}
/*---------------------保养改-------------------------*/
export async function getall(params){
  return request(`/nangaoyun/upkeepplan/getall?${toString(params)}`);
}
/*---------------------保养改-------------------------*/
export async function getone(params){
  return request(`/nangaoyun/upkeepplan/getone?${toString(params)}`);
}
/*---------------------保养改-------------------------*/
export async function maintenanceRecord(params){
  return request(`/nangaoyun/upkeepplan/maintenanceRecord?${toString(params)}`);
}
/*---------------------保养改-------------------------*/
export async function UpkeepConfig(params){
  return request(`/nangaoyun/upkeepplan/UpkeepConfig?${toString(params)}`);
}
/*---------------------保养改-------------------------*/
export async function equipments(params){
  return request(`/nangaoyun/upkeepplan/equipments?${toString(params)}`);
}
/*--------------2.1-保养改-add-------------*/
export async function addconfig(params){
  return request(`/nangaoyun/upkeepplan/addconfig`,{
    method: 'POST',
    body: toString(params),
  });
}
/*---------------------保养改-------------------------*/
export async function editconfig(params){
  return request(`/nangaoyun/upkeepplan/editconfig`,{
    method: 'POST',
    body: toString(params),
  });
}
/*---------------------保养改-------------------------*/
export async function deleteconfig(params){
  return request(`/nangaoyun/upkeepplan/deleteconfig`,{
    method: 'POST',
    body: toString(params),
  });
}

/*--------------2.1-保养改-add-------------*/
export async function newverbadd(params){
  return request(`/nangaoyun/upkeepplan/add`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------2.1-保养改-add-------------*/
export async function newverbedit(params){
  return request(`/nangaoyun/upkeepplan/edit`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------2.1-保养改-add-------------*/
export async function newverbdelete(params){
  return request(`/nangaoyun/upkeepplan/delete`,{
    method: 'POST',
    body: toString(params),
  });
}
/*---------------------保养改-------------------------*/
export async function detailList(params){
  return request(`/nangaoyun/upkeepplan/detailList?${toString(params)}`);
}
/*---------------------保养改-------------------------*/
export async function adddetail(params){
  return request(`/nangaoyun/upkeepplan/adddetail`,{
    method: 'POST',
    body: toString(params),
  });
}
/*---------------------保养改-------------------------*/
export async function editdetail(params){
  return request(`/nangaoyun/upkeepplan/editdetail`,{
    method: 'POST',
    body: toString(params),
  });
}

/*---------------------保养改-------------------------*/
export async function startExecute(params){
  return request(`/nangaoyun/upkeepplan/startExecute`,{
    method: 'POST',
    body: toString(params),
  });
}
/*---------------------保养改-------------------------*/
export async function finishExecute(params){
  return request(`/nangaoyun/upkeepplan/finishExecute`,{
    method: 'POST',
    body: toString(params),
  });
}
/*---------------------保养改-------------------------*/
export async function startAccept(params){
  return request(`/nangaoyun/upkeepplan/startAccept`,{
    method: 'POST',
    body: toString(params),
  });
}
/*---------------------保养改-------------------------*/
export async function cancelMaintenance(params){
  return request(`/nangaoyun/upkeepplan/cancelMaintenance`,{
    method: 'POST',
    body: toString(params),
  });
}

/*--------------2-Charater-alldata--------------*/
export async function getCharaterList(params){
  return request(`/nangaoyun/sysRole/sysRoleList?${toString(params)}`);
}
/*--------------2.1-Charater-change--------------*/
export async function changeCharater(params){
  return request(`/nangaoyun/sysRole/updateSysRole`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------2.2-Charater-add--------------*/
export async function addCharater(params){
  return request(`/nangaoyun/sysRole/addSysRole`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------2.3-Charater-delete--------------*/
export async function deleteCharater(params){
  return request(`/nangaoyun/sysRole/deleteSysRole`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------2.4-Charater-Role--------------*/
export async function getCharaterRole(params){
  return request(`/nangaoyun/sysRole/findAllPremesBySysRoleId?${toString(params)}`);
}
/*--------------2.4-Charater-Role-update-------------*/
export async function updateCharaterRole(params){
  return request(`/nangaoyun/sysRole/addPremesToSysRole`,{
    method: 'POST',
    body: toString(params),
  });
}



/*--------------3-Staff---------------*/
export async function getStaff(params){
  return request(`/nangaoyun/userInfo/findAllUser?${toString(params)}`);
}
export async function getStaffList(params){
  return request(`/nangaoyun/userInfo/getRoleInCompany?${toString(params)}`);
}
/*--------------3.1-updateStaff---------------*/
export async function updateStaff(params){
  return request(`/nangaoyun/userInfo/updateUser`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------3.2-updateStaff---------------*/
export async function updateRole(params){
  return request(`/nangaoyun/userInfo/addSysRoleToUser`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------3.3-updateStaff---------------*/
export async function addRole(params){
  return request(`/nangaoyun/userInfo/addUser`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------3.3-deleteStaff---------------*/
export async function deleteRole(params){
  return request(`/nangaoyun/userInfo/deleteUser`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------4-设备列表------------*/
export async function getApplicationList(params){
  return request(`/nangaoyun/equipmentManage/findByCondition`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------4.end-findTransferEquip-------------*/
export async function findbyeid(params){
  return request(`/nangaoyun/equipmentManage/findbyeid?${toString(params)}`);
}

/*--------------4.end-findTransferEquip-------------*/
export async function getTransferInfo(params){
  return request(`/nangaoyun/equipmentManage/findTransferEquip?${toString(params)}`);
}

/*--------------4.end-findTransferEquip-------------*/
export async function findTransfer(params){
  return request(`/nangaoyun/equipmentManage/findTransfer?${toString(params)}`);
}

/*--------------4.1-新增设备-------------*/
export async function appendDevice(params){
  let formData = new FormData();
  for(let key in params){
      formData.append(key, params[key]);
  }
  return request(`/nangaoyun/equipmentManage/appendDevice`,{
    method: 'POST',
    body: formData,
  });
}

/*--------------4.1-修改设备-------------*/
export async function updateDevice(params){
  let formData = new FormData();
  for(let key in params){
    formData.append(key, params[key]);
  }
  return request(`/nangaoyun/equipmentManage/updateEquipment`,{
    method: 'POST',
    body: formData,
  });
}
/*--------------4.1-设备转移-------------*/
export async function scarpEquipment(params){
  return request(`/nangaoyun/equipmentManage/scarpEquipment`,{
    method: 'POST',
    body: toString(params),
  });
}

/*--------------4.1-设备转移-------------*/
export async function transferEquip(params){
  return request(`/nangaoyun/equipmentManage/transferEquip`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------4.1-删除设备-------------*/
export async function deleteEquipment(params){
  return request(`/nangaoyun/equipmentManage/deleteEquipment`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------4.1-设备查重-------------*/
export async function findcheck(params){
  return request(`/nangaoyun/equipmentManage/findcheck?${toString(params)}`);
}
/*--------------4.1-全部设备列表-------------*/
export async function obtainEquip(params){
  return request(`/nangaoyun/equipmentManage/obtainEquip?${toString(params)}`);
}

/*--------------4.2-getDefaultData-------------*/
export async function getDefaultDatas(params){
  let Data = {
    gongying:request(`/nangaoyun/supplierNew/getSupplierList`),
    chejian:request(`/nangaoyun/departmentNew/getDepartmentList`),
    anquan:request(`/nangaoyun/equipmentManage/findSaveLevel`),
    shebei:request(`/nangaoyun/equiptype/getEquiptypeList`),
    fuzeren:request(`/nangaoyun/userInfo/getUserByPerms`),
    bumen:request(`/nangaoyun/originNew/getOrginList`),
  },newData;
  if(params=="gongying"){
      newData = Data.gongying
  }else if(params=="chejian"){
    newData = Data.chejian
  }else if(params=="anquan"){
    newData = Data.anquan
  }else if(params=="shebei"){
    newData = Data.shebei
  }else if(params=="fuzeren"){
    newData = Data.fuzeren
  }else{
    newData = Data.bumen
  }
  return newData;
}

/*--------------4.3-获取产品线-------------*/
export async function getDepartmentList(params){
  return request(`/nangaoyun/departmentNew/getDepartmentList`);
}
/*--------------4.3-获取分组-------------*/
export async function getChangeData(params){
  return request(`/nangaoyun/groupNew/getGroupList?${toString(params)}`);
}
/*--------------4.3-新增車間分組-------------*/
export async function insertGroup(params){
  return request(`/nangaoyun/groupNew/insertGroup`,{
    method: 'POST',
    body: toString(params),
  });
}

/*--------------4.3-更新車間分組-------------*/
export async function updateGroup(params){
  return request(`/nangaoyun/groupNew/updateGroup`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------4.3-删除車間分組-------------*/
export async function deleteGroup(params){
  return request(`/nangaoyun/groupNew/deleteGroup`,{
    method: 'POST',
    body: toString(params),
  });
}

/*--------------4.3-getDefaultData-------------*/
export async function getWillDesData(params){
  return request(`/nangaoyun/equipment/obtainWillScrapEquip.do?${toString(params)}`);
}
/*--------------4.4-获取设备类型-------------*/
export async function getServiceData(params){
  return request(`/nangaoyun/equiptype/getEquiptypeList`);
}
/*--------------4.4-获取所有配件-------------*/
export async function obtainSpare(params){
  return request(`/nangaoyun/spare/getSpareByEquip?${toString(params)}`);
}

/*--------------4.4-修改配件名称-------------*/
export async function changeServiceData(params){
  return request(`/nangaoyun/equiptype/updateEquiptype`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------4.4-根据设备类型id查询所有的配件类型-------------*/
export async function getsServiceData(params){
  return request(`/nangaoyun/sparetype/findSpareType?${toString(params)}`);
}
/*--------------4.4-配件关联设备-------------*/
export async function relateSparetype(params){
  return request(`/nangaoyun/equiptype/relateSparetype`,{
    method: 'POST',
    body: toString(params),
  });
}

/*--------------4.4-新增配件-------------*/
export async function addServiceData(params){
  return request(`/nangaoyun/equiptype/addEquiptype`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------4.4-删除配件-------------*/
export async function deleteServiceData(params){
  return request(`/nangaoyun/equiptype/deleteEquiptype`,{
    method: 'POST',
    body: toString(params),
  });
}

/*--------------5-设备报修盒子配置-------------*/
export async function selectheziconfig(params){
  return request(`/nangaoyun/maintenance/selectheziconfig?${toString(params)}`);
}
/*--------------5-设备报修盒子配置-------------*/
export async function maingetList(params){
  return request(`/nangaoyun/maintenance/getList?${toString(params)}`);
}

/*--------------5-设备报修盒子配置device list-------------*/
export async function findequiphz(params){
  return request(`/nangaoyun/equipmentManage/findequiphz?${toString(params)}`);
}
/*--------------5-删除盒子报修-------------*/
export async function deleteheziconfig(params){
  return request(`/nangaoyun/maintenance/deleteheziconfig`,{
    method: 'POST',
    body:toString(params),
  });
}

/*--------------5-删除盒子报修-------------*/
export async function transfer(params){
  return request(`/nangaoyun/equipmentManage/transfer`,{
    method: 'POST',
    body:toString(params),
  });
}

/*--------------4.3-批量新增------------*/
export async function addhezimore(params){
  return request(`/nangaoyun/maintenance/addhezimore`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------5-新增盒子报修-------------*/
export async function addheziconfig(params){
  return request(`/nangaoyun/maintenance/addheziconfig`,{
    method: 'POST',
    body:toString(params),
  });
}
/*--------------5-查找记录-------------*/
export async function findOld(params){
  return request(`/nangaoyun/maintenance/findOld?${toString(params)}`);
}

/*--------------5-查询人员/可传参-------------*/
export async function getUserByPerms(params){
  return request(`/nangaoyun/userInfo/getUserByPerms?${toString(params)}`);
}
/*--------------5-配置报修盒子-------------*/
export async function updateheziconfig(params){
  return request(`/nangaoyun/maintenance/updateheziconfig`,{
    method: 'POST',
    body:toString(params),
  });
}
/*--------------5-获取等级不分页-------------*/
export async function getLevelList(params){
  return request(`/nangaoyun/maintenance/getLevelList`);
}
/*--------------5-获取保养等级分页-------------*/
export async function getLevelPage(params){
  return request(`/nangaoyun/maintenance/getLevelPage?${toString(params)}`);
}
/*--------------5-获取维修看板-------------*/
export async function getForMaintenanceList(params){
  return request(`/nangaoyun/maintenance/getForMaintenanceList?${toString(params)}`);
}

/*--------------5-insertLevel-------------*/
export async function insertLevel(params){
  return request(`/nangaoyun/maintenance/insertLevel`,{
    method: 'POST',
    body:toString(params),
  });
}
/*--------------5-updateLevel-------------*/
export async function updateLevel(params){
  return request(`/nangaoyun/maintenance/updateLevel`,{
    method: 'POST',
    body:toString(params),
  });
}
/*--------------5-deleteLevel-------------*/
export async function deleteLevel(params){
  return request(`/nangaoyun/maintenance/deleteLevel`,{
    method: 'POST',
    body:toString(params),
  });
}





/*--------------5-设备报修列表-------------*/
export async function distributeUser(params){
  return request(`/nangaoyun/maintenance/distributeUser`,{
    method: 'POST',
    body:toString(params),
  });
}
/*--------------5-报修按钮-------------*/
export async function addMaintenance(params){
  let formData = new FormData();
  for(let key in params){
    if(key=="fileList"&&params.fileList.length!=0){
      params.fileList.forEach((file,i) => {
        formData.append(`files[${i}]`, file.originFileObj);
      });
    }else{
      formData.append(key, params[key]);
    }
  }
  return request(`/nangaoyun/maintenance/addMaintenance`,{
    method: 'POST',
    body:formData,
  });
}

/*--------------5-点击按钮开始维修-------------*/
export async function startMaintenance(params){
  return request(`/nangaoyun/maintenance/startMaintenance`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------5-设备报修列表状态查询-------------*/
export async function getMainenanceList(params){
  //0已完成 //1待派发 //2待维修 //3维修中 //4待验证
  return request(`/nangaoyun/maintenance/getMainenanceList?${toString(params)}`);
}
/*--------------5-获取审批人1-------------*/
export async function findUserByOriginId(params){
  //0已完成 //1待派发 //2待维修 //3维修中 //4待验证
  return request(`/nangaoyun/spareapply/findUserByOriginId?${toString(params)}`);
}
/*--------------5-修改维修纪要-------------*/
export async function updatemaintenance(params){
  return request(`/nangaoyun/maintenance/updatemaintenance`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------5-设备报修列表-------------*/
export async function getRepairList(params){
  return request(`/api/getRepair`);
}

/*--------------5-设备报修列表状态查询-------------*/
export async function getMyMainenanceList(params){
  //0已完成 //1待派发 //2待维修 //3维修中 //4待验证
  return request(`/nangaoyun/maintenance/getMyMainenanceList?${toString(params)}`);
}

/*--------------5-设备报修列表状态故障类型-------------*/
export async function findType(params){
  return request(`/nangaoyun/maintenance/findType`);
}
export async function findType2(params){
  return request(`/nangaoyun/maintenance/findType2?${toString(params)}`);
}
export async function selectbyid(params){
  return request(`/nangaoyun/troublep/selectbyid?${toString(params)}`);
}
export async function findPbyT(params){
  return request(`/nangaoyun/troublep/findPbyT?${toString(params)}`);
}
export async function findP(params){
  return request(`/nangaoyun/troublep/findP`);
}

/*--------------5-设备报修流程-------------*/
export async function getRepairProcess(params){
  return request(`/nangaoyun/maintenance/getRepairProcess`);
}

/*--------------5-增加故障类型-------------*/
export async function addType(params){
  return request(`/nangaoyun/maintenance/addType`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------5-删除故障类型-------------*/
export async function deleteType(params){
  return request(`/nangaoyun/maintenance/deleteType`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------5-修改故障类型-------------*/
export async function updateType(params){
  return request(`/nangaoyun/maintenance/updateType`,{
    method: 'POST',
    body: toString(params),
  });
}


/*--------------5-解决方案列表-------------*/
export async function findTroubler(params){
  return request(`/nangaoyun/troubler/findTroubler?${toString(params)}`);
}
/*--------------5-解决方案列表-------------*/
export async function findRbyP(params){
  return request(`/nangaoyun/troubler/findRbyP?${toString(params)}`);
}
/*--------------5-解决方案列表-------------*/
export async function findsolve(params){
  return request(`/nangaoyun/troubler/findsolve`);
}

/*--------------5-增加故障解决方案-------------*/
export async function addTroubler(params){
  return request(`/nangaoyun/troubler/addTroubler`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------5-增加故障解决方案-------------*/
export async function updateTroubler(params){
  return request(`/nangaoyun/troubler/updateTroubler`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------5-增加故障解决方案-------------*/
export async function deleteTroubler(params){
  return request(`/nangaoyun/troubler/deleteTroubler`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------5-增加故障解决方案-------------*/
export async function solveselectbyid(params){
  return request(`/nangaoyun/troubler/selectbyid?${toString(params)}`);
}




/*--------------5-提交验证人-------------*/
export async function stopMaintenance(params){
  return request(`/nangaoyun/maintenance/stopMaintenance`,{
    method: 'POST',
    body: params,
  });
}
/*--------------5-验证是否成功-------------*/
export async function check(params){
  return request(`/nangaoyun/maintenance/check`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------5-获取设置列表-------------*/
export async function getPageList(params){
  return request(`/nangaoyun/waringConfig/getPageList`);
}
/*--------------5-新增修改设置列表-------------*/
export async function insertConfig(params){
  return request(`/nangaoyun/waringConfig/insertConfig`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------5-删除设置列表-------------*/
export async function deleteConfig(params){
  return request(`/nangaoyun/waringConfig/deleteConfig`,{
      method: 'POST',
      body: toString(params),
  });
}
/*--------------5-获取配置角色-------------*/
export async function getRoleInConfig(params){
  return request(`/nangaoyun/waringConfig/getRoleInConfig?${toString(params)}`);
}
/*--------------5-新增/修改配置角色-------------*/
export async function addOrUpdateRoleConfig(params){
  return request(`/nangaoyun/waringConfig/addOrUpdateRoleConfig`,{
    method: 'POST',
    body: toString(params),
  });
}
/*--------------5-新增/修改配置角色-------------*/
export async function deleteRoleInConfig(params){
  return request(`/nangaoyun/waringConfig/deleteRoleInConfig`,{
    method: 'POST',
    body: toString(params),
  });
}

/*--------------6-fate-------------*/
export async function getTreeNode(params){
  return request(`/nangaoyun/premes/findAllPremes`);
}
/*--------------6-获取全部配件类型-------------*/
export async function obtainSpareType(params){
  return request(`/nangaoyun/sparetype/getSpareType`);
}

/*--------------6-申领配件-------------*/
export async function applySpare(params){
  return request(`/nangaoyun/spareapply/applySpare`,{
    method: 'POST',
    body:params,
  });
}
/*--------------6-根据维修记录的id查询申领情况get-------------*/
export async function findByMaintenanceId(params){
  return request(`/nangaoyun/spareapply/findByMaintenanceId?${toString(params)}`);
}




/*----------------7-查询设备安全等级列表-----------------*/
export async function findSaveLevel(params){
  return request(`/nangaoyun/equipmentManage/findSaveLevel`);
}
/*----------------7.1-新增安全等级-----------------*/
export async function addSafeLevel(params){
  return request(`/nangaoyun/equipmentManage/addSafeLevel`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------7.1-修改新增安全等级-----------------*/
export async function updateSafeLevel(params){
  return request(`/nangaoyun/equipmentManage/updateSafeLevel`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------7.1-修改新增安全等级-----------------*/
export async function deleteSafeLevel(params){
  return request(`/nangaoyun/equipmentManage/deleteSafeLevel`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-获取当前公司-----------------*/
export async function getCurrentCompany(params){
  return request(`/nangaoyun/companyNew/getCurrentCompany`);
}
/*----------------8-修改当前公司信息-----------------*/
export async function updateCompany(params){
  return request(`/nangaoyun/companyNew/updateCompany`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-获取产品线列表-----------------*/
export async function getDepartmentLists(params){
  return request(`/nangaoyun/departmentNew/getPageList?${toString(params)}`);
}
/*----------------8-修改产品线信息-----------------*/
export async function updateDepartment(params){
  return request(`/nangaoyun/departmentNew/updateDepartment`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-获取部门列表-----------------*/
export async function getOrginList(params){
  return request(`/nangaoyun/originNew/getOrginList`);
}
/*----------------8-新增部门列表-----------------*/
export async function insertOrgin(params){
  return request(`/nangaoyun/originNew/insertOrgin`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-修该部门列表-----------------*/
export async function updateOrgin(params){
  return request(`/nangaoyun/originNew/updateOrgin`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-删除部门列表-----------------*/
export async function deleteOrgin(params){
  return request(`/nangaoyun/originNew/deleteOrgin`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-获取员工列表-----------------*/
export async function findUserList(params){
  return request(`/nangaoyun/userInfo/findUserList`);
}
/*----------------8-获取角色列表 全部-----------------*/
export async function findAllSysRole(params){
  return request(`/nangaoyun/sysRole/findAllSysRole`);
}

/*----------------8-新增产品线信息-----------------*/
export async function insertDepartment(params){
  return request(`/nangaoyun/departmentNew/insertDepartment`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-删除产品线-----------------*/
export async function deleteDepartment(params){
  return request(`/nangaoyun/departmentNew/deleteDepartment`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-获取通知配置列表-----------------*/
export async function getConfigList(params){
  return request(`/nangaoyun/waringConfig/getConfigList?${toString(params)}`);
}
/*----------------8-新增/修改通知配置-----------------*/
export async function WinsertConfig(params){
  return request(`/nangaoyun/waringConfig/insertConfig`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-删除通知配置-----------------*/
export async function WdeleteConfig(params){
  return request(`/nangaoyun/waringConfig/deleteConfig`,{
    method: 'POST',
    body: toString(params),
  });
}

/*----------------8-获取供应商列表-----------------*/
export async function supplierPageList(params){
  return request(`/nangaoyun/supplierNew/getPageList?${toString(params)}`);
}
/*----------------8-获取供应商列表-----------------*/
export async function getSupplierList(params){
  return request(`/nangaoyun/supplierNew/getSupplierList`);
}
/*----------------8-新增供应商列表-----------------*/
export async function insertSupplier(params){
  return request(`/nangaoyun/supplierNew/insertSupplier`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-修改供应商列表-----------------*/
export async function updateSupplier(params){
  return request(`/nangaoyun/supplierNew/updateSupplier`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-删除供应商列表-----------------*/
export async function deleteSupplier(params){
  return request(`/nangaoyun/supplierNew/deleteSupplier`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-获取班次-----------------*/
export async function getShiftPage(params){
  return request(`/nangaoyun/shiftNew/getShiftPage?${toString(params)}`);
}
/*----------------8-全部班次-----------------*/
export async function getShiftList(params){
  return request(`/nangaoyun/shiftNew/getShiftList`);
}
/*----------------8-新增班次-----------------*/
export async function insertShift(params){
  return request(`/nangaoyun/shiftNew/insertShift`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-修改班次-----------------*/
export async function updateShifts(params){
  return request(`/nangaoyun/shiftNew/updateShifts`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-删除班次-----------------*/
export async function deleteShifts(params){
  return request(`/nangaoyun/shiftNew/deleteShifts`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-排班列表-----------------*/
export async function getScheduleList(params){
  return request(`/nangaoyun/shiftNew/getScheduleList?${toString(params)}`);
}

/*----------------8-新增班次列表-----------------*/
export async function insertSchedule(params){
  return request(`/nangaoyun/shiftNew/insertSchedule`,{
    method: 'POST',
    body: params,
  });
}


/*----------------8-配件列表-----------------*/
export async function getSpare(params){
  return request(`/nangaoyun/spare/getSpare?${toString(params)}`);
}
/*----------------8-查询配件类型的库存情况-----------------*/
export async function selectSpareStock(params){
  return request(`/nangaoyun/sparestock/selectSpareStock?${toString(params)}`);
}
/*----------------8-根据类型id修改类型库存基线-----------------*/
export async function updateStockMin(params){
  return request(`/nangaoyun/sparestock/updateStockMin`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-查询缺货通知人-----------------*/
export async function selectStockUser(params){
  return request(`/nangaoyun/sparestock/selectStockUser?${toString(params)}`);
}
/*----------------8-根据id修改缺货通知人-----------------*/
export async function updateStockUser(params){
  return request(`/nangaoyun/sparestock/updateStockUser`,{
    method: 'POST',
    body: toString(params),
  });
}

/*----------------8-查询配件列表-----------------*/
export async function getSpareList(params){
  return request(`/nangaoyun/spare/getSpareList?${toString(params)}`);
}
/*----------------8-新增配件-----------------*/
export async function addSpare(params){
  return request(`/nangaoyun/spare/addSpare`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-修改配件-----------------*/
export async function updateSpare(params){
  return request(`/nangaoyun/spare/updateSpare`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-删除配件-----------------*/
export async function deleteSpare(params){
  return request(`/nangaoyun/spare/deleteSpare`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-查询配件列表-----------------*/
export async function getDetailSpare(params){
  return request(`/nangaoyun/sparestock/getDetailSpare?${toString(params)}`);
}















/*----------------8-新增配件类型-----------------*/
export async function addSparetype(params){
  return request(`/nangaoyun/sparetype/addSparetype`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-修改配件类型-----------------*/
export async function updateSparetype(params){
  return request(`/nangaoyun/sparetype/updateSparetype`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-删除配件类型-----------------*/
export async function deleteSparetype(params){
  return request(`/nangaoyun/sparetype/deleteSparetype`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-申领记录-----------------*/
export async function findSparyapplyBystate(params){
  return request(`/nangaoyun/spareapply/findSparyapplyByapplyuserid?${toString(params)}`);
}
/*----------------8-圣皮列表-----------------*/
export async function findSparyByCurrent(params){
  return request(`/nangaoyun/spareapply/findSparyapplyByCurrentid?${toString(params)}`);
}

/*----------------8-判断是否存在下一步-----------------*/
export async function findManagerByOriginId(params){
  return request(`/nangaoyun/spareapply/findManagerByOriginId?${toString(params)}`);
}
/*----------------8-审批！-----------------*/
export async function approver(params){
  return request(`/nangaoyun/spareapply/approver`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-配件流程设置-----------------*/
export async function obtainSpareConfig(params){
  return request(`/nangaoyun/spareapply/obtainSpareConfig?${toString(params)}`);
}
/*----------------8-新增配件审批人-----------------*/
export async function insertSpareConfig(params){
  return request(`/nangaoyun/spareapply/insertSpareConfig`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-新增配件审批人-----------------*/
export async function deleteSpareConfig(params){
  return request(`/nangaoyun/spareapply/deleteSpareConfig`,{
    method: 'POST',
    body: toString(params),
  });
}

/*----------------8-配件流程设置-----------------*/
export async function spareConfig(params){
  return request(`/nangaoyun/spareapply/spareConfig`, {
    method: 'POST',
    body: toString(params),
  });
}

/*----------------8-获取保养配置列表-----------------*/
export async function getMaintenanceConfigList(params){
  return request(`/nangaoyun/maintenance/getMaintenanceConfigList?${toString(params)}`);
}
/*----------------8-获取保养配置列表-----------------*/
export async function getMaintenanceConfig(params){
  return request(`/nangaoyun/maintenance/getMaintenanceConfig?${toString(params)}`);
}

/*----------------8-新增保养配置-----------------*/
export async function newMaintenanceConfig(params){
  return request(`/nangaoyun/maintenance/newMaintenanceConfig`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-修改保养配置-----------------*/
export async function updateConfig(params){
  return request(`/nangaoyun/maintenance/updateConfig`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-删除保养配置-----------------*/
export async function wbdeleteConfig(params){
  return request(`/nangaoyun/maintenance/deleteConfig`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-保养记录查看列表-----------------*/
export async function getMaintenanceList(params){
  return request(`/nangaoyun/maintenance/getMaintenanceDetail?${toString(params)}`);
}


/*----------------8-获取各区间id-----------------*/
export async function getMaintenancesRange(params){
  return request(`/nangaoyun/maintenance/getMaintenancesRange?${toString(params)}`);
}
/*----------------8-新增保养管理-----------------*/
export async function insertMaintenance(params){
  return request(`/nangaoyun/maintenance/insertMaintenance`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-修改保养管理-执行保养-----------------*/
export async function executorMaintenance(params){
  return request(`/nangaoyun/maintenance/executorMaintenance`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-修改保养管理-完成保养-----------------*/
export async function finishMaintenance(params){
  return request(`/nangaoyun/maintenance/finishMaintenance`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-修改保养管理-验收保养-----------------*/
export async function acceptMaintenance(params){
  return request(`/nangaoyun/maintenance/acceptMaintenance`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-修改保养管理-验收保养-----------------*/
export async function updateMaintenance(params){
  return request(`/nangaoyun/maintenance/updateMaintenance`, {
    method: 'POST',
    body: toString(params),
  });
}


/*----------------8-删除保养管理-----------------*/
export async function deleteMaintenance(params){
  return request(`/nangaoyun/maintenance/deleteMaintenance`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-删除保养细则-----------------*/
export async function reomveEquipment(params){
  return request(`/nangaoyun/maintenance/reomveEquipment`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-新增保养细则-----------------*/
export async function addNewEquipment(params){
  return request(`/nangaoyun/maintenance/addNewEquipment`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-修改保养细则-----------------*/
export async function updateDetail(params){
  return request(`/nangaoyun/maintenance/updateDetail`, {
    method: 'POST',
    body: toString(params),
  });
}

/*----------------8-保养看板-----------------*/
export async function getMaintenancesBoard(params){
  return request(`/nangaoyun/maintenance/getMaintenancesBoard?${toString(params)}`);
}

/*----------------8-知识库/文件列表-----------------*/
export async function getDownList(params){
  return request(`/nangaoyun/articles/getDownList?${toString(params)}`);
}
/*----------------8-知识库/上传文件-----------------*/
export async function upload(params){
  return request(`/nangaoyun/articles/upload`, {
    method: 'POST',
    body: params,
  });
}
/*----------------8-知识库/删除文件-----------------*/
export async function deletefile(params){
  return request(`/nangaoyun/common/delete/${params.attachmentId}`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-知识库/文件列表-----------------*/
export async function getList(params){
  return request(`/nangaoyun/articles/getList?${toString(params)}`);
}
/*----------------8-知识库/附件查询列表-----------------*/
export async function getDownListById(params){
  return request(`/nangaoyun/articles/getDownListById?${toString(params)}`);
}
/*----------------8-知识库/添加文件-----------------*/
export async function pointadd(params){
  return request(`/nangaoyun/articles/add`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-知识库/修改文件-----------------*/
export async function pointedit(params){
  return request(`/nangaoyun/articles/edit`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-知识库/修改文件-----------------*/
export async function deletearticle(params){
  return request(`/nangaoyun/articles/delete`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------8-知识库/知识点详情-----------------*/
export async function getarticles(params){
  return request(`/nangaoyun/articles/get?${toString(params)}`);
}

/*----------------9-报表分析/设备状态-----------------*/
export async function getEquipState(params){
  return request(`/nangaoyun/statistics/getEquipState?${toString(params)}`);
}
/*----------------9-报表分析/故障类型统计-----------------*/
export async function getAbnormalType(params){
  return request(`/nangaoyun/statistics/getAbnormalType?${toString(params)}`);
}
/*----------------9-报表分析/设备利用率-----------------*/
export async function getMaintenByTime(params){
  return request(`/nangaoyun/statistics/getMaintenByTime?${toString(params)}`);
}
/*----------------9-报表分析/维修时间-----------------*/
export async function getMaintenanceTime(params){
  return request(`/nangaoyun/statistics/getMaintenanceTime?${toString(params)}`);
}
/*----------------10-系统管理/公司列表-----------------*/
export async function getCompanyPageList(params){
  return request(`/nangaoyun/sysBase/getCompanyPageList?${toString(params)}`);
}
/*----------------10-系统管理/公司列表quanbu-----------------*/
export async function getCompanyList(params){
  return request(`/nangaoyun/sysBase/getCompanyList`);
}
/*----------------10-系统管理/更新公司列表-----------------*/
export async function updateallCompany(params){
  return request(`/nangaoyun/sysBase/updateCompany`, {
    method: 'POST',
    body: toString(params),
  });
}





/*----------------10-系统管理/用户列表-----------------*/
export async function getUserPageList(params){
  return request(`/nangaoyun/sysBase/getUserPageList?${toString(params)}`);
}
/*----------------10-系统管理/新增用户列表-----------------*/
export async function insertUser(params){
  return request(`/nangaoyun/sysBase/insertUser`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-系统管理/修改用户列表-----------------*/
export async function updatetUser(params){
  return request(`/nangaoyun/sysBase/updatetUser`, {
    method: 'POST',
    body: toString(params),
  });
}

/*----------------10-系统管理/删除用户列表-----------------*/
export async function deleteUser(params){
  return request(`/nangaoyun/sysBase/deleteUser`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-系统管理/给用户添加角色-----------------*/
export async function addRoleToUser(params){
  return request(`/nangaoyun/sysBase/addRoleToUser`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-系统管理/重置密码-----------------*/
export async function restPassword(params){
  return request(`/nangaoyun/sysBase/restPassword`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-系统管理/角色列表-----------------*/
export async function getRolePageList(params){
  return request(`/nangaoyun/sysBase/getRolePageList?${toString(params)}`);
}
/*----------------10-系统管理/新建角色-----------------*/
export async function insertRole(params){
  return request(`/nangaoyun/sysBase/insertRole`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-系统管理/更新角色-----------------*/
export async function updatetRole(params){
  return request(`/nangaoyun/sysBase/updatetRole`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-系统管理/角色权限列表-----------------*/
export async function findAllPremesByRole(params){
  return request(`/nangaoyun/sysBase/findAllPremesByRole?${toString(params)}`);
}

/*----------------10-系统管理/删除角色-----------------*/
export async function deletesysRole(params){
  return request(`/nangaoyun/sysBase/deleteRole`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-系统管理/角色授权-----------------*/
export async function addPermesToRole(params){
  return request(`/nangaoyun/sysBase/addPermesToRole`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-注册模块/获取注册列表-----------------*/
export async function getApplyList(params){
  return request(`/nangaoyun/comapnyApply/getApplyList?${toString(params)}`);
}
/*----------------10-注册模块/获取注册列表记录-----------------*/
export async function getApplyInfoById(params){
  return request(`/nangaoyun/comapnyApply/getApplyInfoById?${toString(params)}`);
}
/*----------------10-注册模块/获取注册列表记录-----------------*/
export async function dealApply(params){
  return request(`/nangaoyun/comapnyApply/dealApply`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-注册模块/获取申请进度-----------------*/
export async function getApplyInfo(params){
  return request(`/rs/sysCompanyApply/queryByApplyNo`,{
    method: 'POST',
    body: params,
  });
}
/*----------------10-注册模块/修改注册记录-----------------*/
export async function updateApply(params){
  return request(`/rs/sysCompanyApply/save`,{
    method: 'POST',
    body: params,
  });
}
/*----------------10-注册模块/获取申请进度-----------------*/
export async function exportfile(params){
  return request(`/nangaoyun/userInfo/exportfile`);
}
export async function addTreeNode(params){
  return request(`/nangaoyun/premes/addPremes`, {
    method: 'POST',
    body: toString(params),
  });
}
export async function delTreeNode(params){
  return request(`/nangaoyun/premes/deletePremes`, {
    method: 'POST',
    body: toString(params),
  });
}
export async function editTreeNode(params){
  return request(`/nangaoyun/premes/updatePremes`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-设备模块add/可处置设备列表-----------------*/
export async function findByState(params){
  return request(`/nangaoyun/equipmentManage/findByState?${toString(params)}`);
}
/*----------------10-设备模块add/已处置设备列表-----------------*/
export async function findDisposeEquipment(params){
  return request(`/nangaoyun/equipmentManage/findDisposeEquipment?${toString(params)}`);
}
/*----------------10-设备模块add/处置方式----------------*/
export async function disposeEquipment(params){
  return request(`/nangaoyun/equipmentManage/disposeEquipment`, {
    method: 'POST',
    body: toString(params),
  });
}

/*----------------10-设备模块add/借用归还列表-----------------*/
export async function findequip(params){
  return request(`/nangaoyun/equipmentManage/findequip?${toString(params)}`);
}
/*----------------10-设备模块add/借用-----------------*/
export async function borrowEquip(params){
  return request(`/nangaoyun/equipmentManage/borrowEquip`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-设备模块add/归还----------------*/
export async function returnEquip(params){
  return request(`/nangaoyun/equipmentManage/returnEquip`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-设备模块add/分页查看设备借用记录 -----------------*/
export async function findRecord(params){
  return request(`/nangaoyun/equipmentManage/findRecord?${toString(params)}`);
}
/*----------------10-设备模块add/查找换过配件的设备 -----------------*/
export async function findEquipCounts(params){
  return request(`/nangaoyun/spareapply/findEquipCounts?${toString(params)}`);
}
/*----------------10-设备模块add/查看该设备换了多少配件 -----------------*/
export async function selectSpare(params){
  return request(`/nangaoyun/spareapply/selectSpare?${toString(params)}`);
}
/*----------------10-设备模块add/分页查询设备折旧规则 -----------------*/
export async function findEquipDepreciation(params){
  return request(`/nangaoyun/equipDepreciation/findEquipDepreciation?${toString(params)}`);
}
/*----------------10-设备模块add/分页查询折旧记录 -----------------*/
export async function findRecod(params){
  return request(`/nangaoyun/equipDepreciation/findRecod?${toString(params)}`);
}
/*----------------10-设备模块add/添加一个设备折旧----------------*/
export async function addEquipDepreciation(params){
  return request(`/nangaoyun/equipDepreciation/addEquipDepreciation`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-设备模块add/修改一个设备折旧----------------*/
export async function updateEquipDepreciation(params){
  return request(`/nangaoyun/equipDepreciation/updateEquipDepreciation`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-设备模块add/删除一个设备折旧----------------*/
export async function deleteEquipDepreciation(params){
  return request(`/nangaoyun/equipDepreciation/deleteEquipDepreciation`, {
    method: 'POST',
    body: toString(params),
  });
}


/*----------------10-设备模块add/设备报废列表 -----------------*/
export async function findScrap(params){
  return request(`/nangaoyun/equipScrap/findScrap?${toString(params)}`);
}
/*----------------10-设备模块add/设备报废通知列表-----------------*/
export async function findScrapConfig(params){
  return request(`/nangaoyun/equipScrap/findScrapConfig?${toString(params)}`);
}
/*----------------10-设备模块add/添加设备报废期----------------*/
export async function addScrap(params){
  return request(`/nangaoyun/equipScrap/addScrap`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-设备模块add/修改设备报废期----------------*/
export async function updateScrap(params){
  return request(`/nangaoyun/equipScrap/updateScrap`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-设备模块add/删除设备报废期----------------*/
export async function deleteScrap(params){
  return request(`/nangaoyun/equipScrap/deleteScrap`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-设备模块add/编辑报废通知----------------*/
export async function updateScrapConfig(params){
  return request(`/nangaoyun/equipScrap/updateScrapConfig`, {
    method: 'POST',
    body: toString(params),
  });
}

/*----------------10-设备模块add/组合设备-----------------*/
export async function findequipcombinationByName(params){
  return request(`/nangaoyun/equipcombination/findequipcombinationByName?${toString(params)}`);
}
/*----------------10-设备模块add/组合设备-----------------*/
export async function findEquipment(params){
  return request(`/nangaoyun/equipcombination/findEquipment?${toString(params)}`);
}
/*----------------10-设备模块add/添加组合设备----------------*/
export async function addEquipcombination(params){
  return request(`/nangaoyun/equipcombination/addEquipcombination`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-设备模块add/拆分组合设备----------------*/
export async function updateEquipcombination(params){
  return request(`/nangaoyun/equipcombination/updateEquipcombination`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-设备模块add/拆分组合设备----------------*/
export async function deleteEquipcombination(params){
  return request(`/nangaoyun/equipcombination/deleteEquipcombination`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-设备模块add/点检记录-----------------*/
export async function getEquipmentHistory(params){
  return request(`/nangaoyun/checkpoint/getEquipmentHistory?${toString(params)}`);
}
/*----------------10-设备模块add/确认点检记录----------------*/
export async function updateRecord(params){
  return request(`/nangaoyun/checkpoint/updateRecord`, {
    method: 'POST',
    body: toString(params),
  });
}

/*----------------10-设备模块add/点检规则设置-----------------*/
export async function allCheckPoint(params){
  return request(`/nangaoyun/checkpoint/allCheckPoint?${toString(params)}`);
}
/*----------------10-设备模块add/新增点检设置----------------*/
export async function addCheckPoint(params){
  return request(`/nangaoyun/checkpoint/addCheckPoint`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-设备模块add/编辑点检设置----------------*/
export async function editCheckPoint(params){
  return request(`/nangaoyun/checkpoint/editCheckPoint`, {
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-设备模块add/删除点检设置----------------*/
export async function deletePoint(params){
  return request(`/nangaoyun/checkpoint/deletePoint`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-设备模块add/盘点list-----------------*/
export async function devicegetPageList(params){
  return request(`/nangaoyun/equipmentCheck/getPageList?${toString(params)}`);
}
/*----------------10-设备模块add/盘点list 历史纪录-----------------*/
export async function getHistoryList(params){
  return request(`/nangaoyun/equipmentCheck/getHistoryList?${toString(params)}`);
}
/*----------------10-设备模块add/盘点list 细则-----------------*/
export async function getDetailList(params){
  return request(`/nangaoyun/equipmentCheck/getDetailList?${toString(params)}`);
}
/*----------------10-设备模块add/新增main盘点----------------*/
export async function devicesinsert(params){
  return request(`/nangaoyun/equipmentCheck/insert`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-设备模块add/修改main盘点----------------*/
export async function devicesupdate(params){
  let formData = new FormData();
  for(let key in params){
    formData.append(key, params[key]);
  }
  return request(`/nangaoyun/equipmentCheck/update`,{
    method: 'POST',
    body: formData,
  });
}
/*----------------10-设备模块add/删除main盘点----------------*/
export async function devicesdelete(params){
  return request(`/nangaoyun/equipmentCheck/delete`,{
    method: 'POST',
    body: toString(params),
  });
}

/*----------------10-设备模块add/新增detail盘点----------------*/
export async function devicesaddNewEquipment(params){
  return request(`/nangaoyun/equipmentCheck/addNewEquipment`,{
    method: 'POST',
    body: toString(params),
  });
}

/*----------------10-设备模块add/删除detail盘点----------------*/
export async function removeEquipment(params){
  return request(`/nangaoyun/equipmentCheck/removeEquipment`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-设备模块add/完成main盘点----------------*/
export async function finished(params){
  return request(`/nangaoyun/equipmentCheck/finished`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------10-设备模块add/完成detail盘点----------------*/
export async function finishEquipment(params){
  return request(`/nangaoyun/equipmentCheck/finishEquipment`,{
    method: 'POST',
    body: toString(params),
  });
}
/*-------------------------修改/配件库存列表---------------------------------*/
export async function RgetList(params){
  return request(`/nangaoyun/sparestock/getList?${toString(params)}`);
}
/*-------------------------修改/配件库存列表---------------------------------*/
export async function getSpareRecordList(params){
  return request(`/nangaoyun/sparestock/getSpareRecordList?${toString(params)}`);
}
/*-------------------------修改/配件库存列表---------------------------------*/
export async function getApproveList(params){
  return request(`/nangaoyun/spareApprove/getApproveList?${toString(params)}`);
}
/*-------------------------修改/配件库存列表---------------------------------*/
export async function getApplyDetails(params){
  return request(`/nangaoyun/spareApprove/getApplyDetails?${toString(params)}`);
}
/*-------------------------修改/配件库存列表---------------------------------*/
export async function getOutDetails(params){
  return request(`/nangaoyun/spareApprove/getOutDetails?${toString(params)}`);
}
/*-------------------------修改/配件库存列表---------------------------------*/
export async function getReturnApproveList(params){
  return request(`/nangaoyun/spareApprove/getReturnApproveList?${toString(params)}`);
}
/*-------------------------修改/配件库存列表---------------------------------*/
export async function myGetSpareList(params){
  return request(`/nangaoyun/mySpare/getSpareList?${toString(params)}`);
}
/*-------------------------修改/配件库存列表---------------------------------*/
export async function getSpareRecord(params){
  return request(`/nangaoyun/mySpare/getSpareRecord?${toString(params)}`);
}
/*-------------------------修改/配件库存列表---------------------------------*/
export async function getSpareReturnList(params){
  return request(`/nangaoyun/mySpare/getSpareReturnList?${toString(params)}`);
}
/*-------------------------修改/配件库存列表---------------------------------*/
export async function returnSpares(params){
  return request(`/nangaoyun/mySpare/returnSpares`,{
    method: 'POST',
    body: toString(params),
  });
}

/*-------------------------修改/配件库存列表---------------------------------*/
export async function approveApply(params){
  return request(`/nangaoyun/spareApprove/approveApply`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------修改/新增配件库存----------------*/
export async function Rinsert(params){
  return request(`/nangaoyun/sparestock/insert`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------修改/修改配件库存----------------*/
export async function Rupdate(params){
  return request(`/nangaoyun/sparestock/update`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------修改/删除配件库存----------------*/
export async function Rdelete(params){
  return request(`/nangaoyun/sparestock/delete`,{
    method: 'POST',
    body: toString(params),
  });
}
/*-------------------------修改/配件库存详情列表---------------------------------*/
export async function RgetSpareList(params){
  return request(`/nangaoyun/sparestock/getSpareList?${toString(params)}`);
}
/*----------------修改/新增配件库存详情----------------*/
export async function RinsertSpare(params){
  return request(`/nangaoyun/sparestock/insertSpare`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------修改/新增配件库存详情(批量)----------------*/
export async function RinsertBatchSpare(params){
  return request(`/nangaoyun/sparestock/insertBatchSpare`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------故障现象----------------*/
export async function findTroublep(params){
  return request(`/nangaoyun/troublep/findTroublep?${toString(params)}`);
}
/*----------------add 故障现象----------------*/
export async function addTroublep(params){
  return request(`/nangaoyun/troublep/addTroublep`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------update 故障现象----------------*/
export async function updateTroublep(params){
  return request(`/nangaoyun/troublep/updateTroublep`,{
    method: 'POST',
    body: toString(params),
  });
}
/*----------------delete 故障现象----------------*/
export async function deleteTroublep(params){
  return request(`/nangaoyun/troublep/deleteTroublep`,{
    method: 'POST',
    body: toString(params),
  });
}


/*----------------10-设备模块add/导出excel----------------*/
export async function devicesexportfile(params){
  return request(`/nangaoyun/equipmentCheck/exportfile?${toString(params)}`);
}

/*---------------main.获取菜单-------------------*/
export async function getMenu(params){
  return request(`/rs/sysPermission/queryMenu`, {
    method: 'POST',
  });
}
/*---------------main.获取菜单-------------------*/
export async function reflush(params){
  return request(`/nangaoyun/maintenance/reflush`);
}
export async function fakeRegister(params) {
  return request('/rs/sysCompanyApply/save', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${toString(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
