import useRequest from './useRequest';

const useCategory = () => {
  const { getRequest, postRequest, deleteRequest, putRequest } = useRequest('category');
  const get = (data) =>
    getRequest({
      endpoint: '/getAll',
      params: data
    });

  const edit = (data, id) =>
    putRequest({
      endpoint: `/u/${id}`,
      data: data
    });
  const delte = (id) =>
    deleteRequest({
      endpoint: `/d/${id}`
    });

  const add = (data) =>
    postRequest({
      endpoint: '/create',
      data: data
    });
  return {
    get,
    delte,
    add,
    edit
  };
};
export default useCategory;
