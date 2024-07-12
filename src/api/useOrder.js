import useRequest from './useRequest';
const useOrder = () => {
  const { getRequest, postRequest } = useRequest('order');
  const get = (params) =>
    getRequest({
      endpoint: '/getAll',
      params: params
    });
  const getByUserId = (params) =>
    getRequest({
      endpoint: `/${params}`
    });
  return {
    get,
    getByUserId
  };
};
export default useOrder;
