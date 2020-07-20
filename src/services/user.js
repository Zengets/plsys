import request from '@/utils/request';
import { stringify } from 'qs';


//当班人员
export async function findShiftsUser(params) {
  return request(`/nangaoyun/maintenance/findShiftsUser?${stringify(params)}`);
}
//查询验证人
export async function findCheckUser() {
  return request('/nangaoyun/maintenance/findCheckUser');
}
/*---------------main.获取用户-------------------*/
export async function currentUser(params){
  return request(`/rs/sysUser/query`, {
    method: 'POST',
    body: params,
  });
}
/*------------------------修改密码---------------------------------*/
export async function changePwd(params){
  return request(`/rs/sysUser/changePassword`, {
    method: 'POST',
    body: params,
  });
}
