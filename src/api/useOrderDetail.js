import useRequest from './useRequest';

const useOrderDetail = () => {
  const { getRequest, postRequest } = useRequest('orderDetail');
  const getByid = (id) =>
    getRequest({
      endpoint: `/${id}`
    });

  const sastify = (params) =>
    getRequest({
      endpoint: `/statistics`,
      params: params
    });
  return {
    getByid,
    sastify
  };
};
export default useOrderDetail;
