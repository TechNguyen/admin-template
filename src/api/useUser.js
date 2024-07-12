import useRequest from './useRequest';
const useUser = () => {
  const { getRequest, deleteRequest } = useRequest('u');
  const get = (params) =>
    getRequest({
      endpoint: '/getAll',
      params: params
    });
  const del = (id) =>
    deleteRequest({
      endpoint: `/del/${id}`
    });

  return {
    get,
    del
  };
};
export default useUser;
