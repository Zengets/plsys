import fetch from 'dva/fetch';
import { notification, message, Alert } from 'antd';
import router from 'umi/router';
import hash from 'hash.js';
import { isAntdPro } from './utils';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队(异步任务)。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限(令牌、用户名、密码错误)。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

window.ipandport = 'http://' + window.location.host;
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  const options = {
    expirys: isAntdPro(),
    ...option,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');
  let token = localStorage.getItem("TOKEN");
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    newOptions.credentials = "include";
    if (typeof newOptions.body == 'string') {
      // newOptions.body is Json
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Requested-With': 'XMLHttpRequest',
        'base.session.id': token ? token : "",
        ...newOptions.headers,
      };
    } else if (newOptions.body instanceof FormData) {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'base.session.id': token ? token : "",
        ...newOptions.headers,
      };
    } else {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Requested-With': 'XMLHttpRequest',
        'base.session.id': token ? token : "",
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    }
  } else {
    newOptions.headers = {
      'base.session.id': token ? token : "",
      'X-Requested-With': 'XMLHttpRequest',
      ...newOptions.headers,
    };
  }

  const expirys = options.expirys && 60;
  // options.expirys !== false, return the cache,
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      for (var pair of response.headers.entries()) {
        if (pair[0] == "base.session.id") {
          localStorage.setItem("TOKEN", pair[1]);
        }
      }
      let res = response.json();
      return res.then(data => {


        if (url.indexOf("import") != -1) {
          let result = data.data ? data.data.dataList ? data.data.dataList : [] : [],
            fileName = data.data ? data.data.fileName ? data.data.fileName : "文件" : "文件";
          const args = {
            message: `${fileName}的导入信息`,
            description: <div>
              {
                <Alert
                  style={{ marginTop: 20 }}
                  message="错误信息"
                  description={
                    <div style={{ height: 400, overflow: "auto" }}>
                      {
                        result.map((item, i) => {
                          return <p key={i} style={{ padding: 4, margin: 0 }}>{item.name}: <span style={{ color: "red" }}>{item.error}</span> </p>
                        })
                      }
                    </div>
                  }
                  type="error"
                  showIcon
                  closable
                />
              }
            </div>,
            duration: 0,
          };
          result && result.length != 0 ?
            notification.open(args) : null
        }

        //权限
        if (data.code === "0001" && url.indexOf("findByUserid") == -1) {
          window.g_app._store.dispatch({ //redux
            type: 'login/logout',
          }).then(() => {
            message.destroy();
          })
        }

        if (data.code !== "0000") {
          if (data.msg) {
            message.destroy();
            message.error(data.msg);
          }
        }
        return data;
      });
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        return;
      }
      // environment should not be used
      if (status === 403) {
        router.push('/exception/403');
        return;
      }
      if (status <= 504 && status >= 500) {
        router.push('/exception/500');
        return;
      }
      if (status >= 404 && status < 422) {
        router.push('/exception/404');
      }
    });
}
