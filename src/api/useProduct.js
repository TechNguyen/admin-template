import useRequest from './useRequest';

const useProduct = () => {
  const { getRequest, postRequest, deleteRequest, putRequest } = useRequest('product');
  const getAll = (params) =>
    getRequest({
      endpoint: '/getAll',
      param: params
    });

  const getById = (params) =>
    getRequest({
      endpoint: `/${params}`
    });
  const create = (data) =>
    postRequest({
      endpoint: '/create',
      data: data
    });
  const update = (data, id) =>
    putRequest({
      endpoint: `/updateProduct/${id}`,
      data: data
    });

  const getProduct = (id) =>
    getRequest({
      endpoint: `/category/${id}`
    });
  const delte = (id) =>
    deleteRequest({
      endpoint: `/deleteProduct/${id}`
    });
  return {
    getAll,
    create,
    delte,
    getProduct,
    update,
    getById
  };
};
export default useProduct;
