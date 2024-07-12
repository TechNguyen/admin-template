import axios from 'axios';
import { HOST, PORT, PROTOCOL } from 'config/appConfig';
import { useCallback, useState } from 'react';

const useRequest = (prefixPath = '') => {
  const [controller, setController] = useState(new AbortController());
  const instance = () =>
    axios.create({
      baseURL: `${PROTOCOL}://${HOST}:${PORT}/api/${prefixPath}`,
      timeout: 8000,
      headers: {
        Accept: 'application/json; charset=utf-8',
        'Content-Type': 'application/json'
        //    Authorization: `Bearer `
      },
      signal: controller.signal
    });
  const [request, setRequest] = useState(() => instance());
  const getRequest = useCallback(
    ({ endpoint, params, query, headers, successCallBack }) => {
      return request
        .get(endpoint, { params: params, headers: headers })
        .then((res) => {
          return {
            success: true,
            data: res.data
          };
        })
        .catch((err) => {
          return {
            success: false,
            err
          };
        });
    },
    [request]
  );
  const postRequest = useCallback(
    ({ endpoint, data, headers, params, ...props }) => {
      return request
        .post(endpoint, data, { headers: headers }, { ...props })
        .then((res) => {
          return {
            success: true,
            data: res.data
          };
        })
        .catch((err) => {
          return {
            success: false,
            err
          };
        });
    },
    [request]
  );

  const putRequest = useCallback(
    ({ endpoint, data, headers, params, ...props }) => {
      return request
        .put(endpoint, data, { headers: headers }, { ...props })
        .then((res) => {
          return {
            success: true,
            data: res.data
          };
        })
        .catch((err) => {
          return {
            success: false,
            err
          };
        });
    },
    [request]
  );

  const deleteRequest = useCallback(
    ({ endpoint, data, params, ...props }) => {
      return request
        .delete(endpoint, { data, params, ...props })
        .then((res) => {
          return {
            success: true,
            data: res.data
          };
        })
        .catch((err) => {
          return {
            success: false,
            err
          };
        });
    },
    [request]
  );

  const cancle = () => {
    controller.abort();
    setController(new AbortController());
  };

  return {
    request,
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    cancle
  };
};

export default useRequest;
