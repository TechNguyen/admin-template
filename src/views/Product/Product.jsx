import useProduct from 'api/useProduct';
import React, { useEffect, useState } from 'react';
import Styles from './Product.module.scss';
import classNames from 'classnames/bind';
import { Button, message, Popconfirm, Space, Table, Modal, Input, Select, Form } from 'antd';
import { Formik, ErrorMessage, useFormik } from 'formik';
import { Form as BootstrapForm, Row, Col } from 'react-bootstrap';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import useCategory from 'api/useCategory';
import { Link } from 'react-router-dom';

const cx = classNames.bind(Styles);
const Product = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const { get } = useCategory();
  const handleGetCategory = async () => {
    const { data, success } = await get();
    if (success) {
      setCategory(
        data.data.map((ca) => {
          return {
            label: ca.CategoryName,
            value: ca._id
          };
        })
      );
    }
  };
  const { getAll, delte, create } = useProduct();
  const [isOpen, setisopen] = useState(false);
  const handleGetAll = async () => {
    const { data, success } = await getAll();
    if (success) {
      setProducts(data.data);
    } else {
    }
  };
  useEffect(() => {
    handleGetAll();
    handleGetCategory();
  }, []);

  const handleDelete = async (id) => {
    const { data, success } = await delte(id);
    if (success) {
      handleGetAll();
      message.success('Delete success');
    }
  };
  const confirm = (id) => {
    handleDelete(id);
  };

  const columns = [
    {
      title: 'ProductName',
      dataIndex: 'ProductName',
      key: 'ProductName'
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      key: 'Price'
    },
    {
      title: 'Quanlity',
      dataIndex: 'StockQuantity',
      key: 'StockQuantity'
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      key: 'Description'
    },
    {
      title: 'importPrice',
      dataIndex: 'importPrice',
      key: 'importPrice'
    },
    {
      title: 'CategoryName',
      dataIndex: ['CategoryID', 'CategoryName'],
      key: 'CategoryName'
    },
    {
      title: 'species',
      dataIndex: 'species',
      key: 'species'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this product?"
            onConfirm={() => confirm(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
          <Link to={`/dashboard/product/${record._id}`}>
            <Button>Update</Button>
          </Link>
        </Space>
      )
    }
  ];

  const handleCreate = async (values, callBack) => {
    const { data, success } = await create(values);
    message.success('Add product success fully');
    callBack();
    setisopen(false);
    handleGetAll();
    // if (success) {
    //   message.success('Add product success fully');
    //   callBack();
    //   setisopen(false);
    // }
  };
  const onSubmit = (values, { setSubmitting, resetForm }) => {
    handleCreate(values, resetForm);
  };

  const validate = (values) => {
    const errors = {};
    if (!values.CategoryID) {
      errors.CategoryID = 'Category ID is required';
    }
    if (!values.Description) {
      errors.Description = 'Description is required';
    }
    if (!values.Price) {
      errors.Price = 'Price is required';
    } else if (isNaN(values.Price) || values.Price <= 0) {
      errors.Price = 'Price must be a positive number';
    }
    if (!values.ProductName) {
      errors.ProductName = 'Product Name is required';
    }
    if (!values.StockQuantity) {
      errors.StockQuantity = 'Stock Quantity is required';
    } else if (isNaN(values.StockQuantity) || values.StockQuantity < 0) {
      errors.StockQuantity = 'Stock Quantity cannot be negative';
    }
    if (!values.species) {
      errors.species = 'Species is required';
    }
    if (!values.importPrice) {
      errors.importPrice = 'Import Price is required';
    } else if (isNaN(values.importPrice) || values.importPrice <= 0) {
      errors.importPrice = 'Import Price must be a positive number';
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      CategoryID: '',
      Description: '',
      Price: '',
      ProductName: '',
      StockQuantity: '',
      species: '',
      importPrice: ''
    },
    validate: validate,
    onSubmit: onSubmit
  });

  const onChangeCategory = (value) => {
    formik.setValues({
      ...formik.values,
      CategoryID: value
    });
  };
  const onSearchCategory = (value) => {
    console.log('search:', value);
  };

  const handleOk = () => {
    // Đảm bảo form hiện tại hợp lệ trước khi submit
    if (formik.isValid) {
      formik.handleSubmit(); // Gọi handleSubmit từ Formik để xử lý submit
    } else {
      console.log('Form is invalid. Cannot submit.'); // Có thể hiển thị thông báo lỗi khác
    }
  };
  return (
    <React.Fragment>
      <div>
        <Button
          onClick={() => {
            setisopen(true);
          }}
          type="primary"
        >
          Add Product
        </Button>

        <Modal
          open={isOpen}
          okText={'Add product'}
          onCancel={() => {
            setisopen(false);
          }}
          onOk={handleOk}
          width={'60%'}
          title="Add new product"
        >
          <Form onSubmit={formik.handleSubmit} className="container mt-5">
            <Row className="mb-3">
              <Col md={6}>
                <BootstrapForm.Group
                  style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <BootstrapForm.Label htmlFor="CategoryID" className={cx('formLabel')}>
                    CategoryID
                  </BootstrapForm.Label>
                  <Select
                    showSearch
                    placeholder="Select a category"
                    optionFilterProp="label"
                    onChange={onChangeCategory}
                    onSearch={onSearchCategory}
                    options={category}
                  />

                  <span className={cx('textDanger')}>
                    {formik.touched.CategoryID && formik.errors.CategoryID ? formik.errors.CategoryID : ''}
                  </span>
                </BootstrapForm.Group>
              </Col>
              <Col md={6}>
                <BootstrapForm.Group>
                  <BootstrapForm.Label htmlFor="Description" className={cx('formLabel')}>
                    Description
                  </BootstrapForm.Label>
                  <Input
                    type="text"
                    id="Description"
                    name="Description"
                    value={formik.values.Description}
                    onChange={formik.handleChange}
                    as={BootstrapForm.Control}
                    className={cx('formControl')}
                  />

                  <span className={cx('textDanger')}>
                    {formik.touched.Description && formik.errors.Description ? formik.errors.Description : ''}
                  </span>
                </BootstrapForm.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <BootstrapForm.Group>
                  <BootstrapForm.Label htmlFor="Price" className={cx('formLabel')}>
                    Price
                  </BootstrapForm.Label>
                  <Input
                    type="number"
                    id="Price"
                    value={formik.values.Price}
                    name="Price"
                    as={BootstrapForm.Control}
                    onChange={formik.handleChange}
                    className={cx('formControl')}
                  />

                  <span className={cx('textDanger')}>{formik.touched.Price && formik.errors.Price ? formik.errors.Price : ''}</span>
                </BootstrapForm.Group>
              </Col>
              <Col md={6}>
                <BootstrapForm.Group>
                  <BootstrapForm.Label htmlFor="ProductName" className={cx('formLabel')}>
                    ProductName
                  </BootstrapForm.Label>
                  <Input
                    type="text"
                    id="ProductName"
                    value={formik.values.ProductName}
                    name="ProductName"
                    as={BootstrapForm.Control}
                    onChange={formik.handleChange}
                    className={cx('formControl')}
                  />
                  <span className={cx('textDanger')}>
                    {formik.touched.ProductName && formik.errors.ProductName ? formik.errors.ProductName : ''}
                  </span>
                </BootstrapForm.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <BootstrapForm.Group>
                  <BootstrapForm.Label htmlFor="StockQuantity" className={cx('formLabel')}>
                    StockQuantity
                  </BootstrapForm.Label>
                  <Input
                    type="number"
                    id="StockQuantity"
                    name="StockQuantity"
                    value={formik.values.StockQuantity}
                    as={BootstrapForm.Control}
                    onChange={formik.handleChange}
                    className={cx('formControl')}
                  />

                  <span className={cx('textDanger')}>
                    {formik.touched.StockQuantity && formik.errors.StockQuantity ? formik.errors.StockQuantity : ''}
                  </span>
                </BootstrapForm.Group>
              </Col>
              <Col md={6}>
                <BootstrapForm.Group>
                  <BootstrapForm.Label htmlFor="species" className={cx('formLabel')}>
                    species
                  </BootstrapForm.Label>
                  <Input
                    type="text"
                    id="species"
                    name="species"
                    value={formik.values.species}
                    as={BootstrapForm.Control}
                    onChange={formik.handleChange}
                    className={cx('formControl')}
                  />

                  <span className={cx('textDanger')}>{formik.touched.species && formik.errors.species ? formik.errors.species : ''}</span>
                </BootstrapForm.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <BootstrapForm.Group>
                  <BootstrapForm.Label htmlFor="importPrice" className={cx('formLabel')}>
                    importPrice
                  </BootstrapForm.Label>
                  <Input
                    type="number"
                    id="importPrice"
                    name="importPrice"
                    value={formik.values.importPrice}
                    as={BootstrapForm.Control}
                    onChange={formik.handleChange}
                    className={cx('formControl')}
                  />

                  <span className={cx('textDanger')}>
                    {formik.touched.importPrice && formik.errors.importPrice ? formik.errors.importPrice : ''}
                  </span>
                </BootstrapForm.Group>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
      <Table dataSource={products} columns={columns} />
    </React.Fragment>
  );
};
export default Product;
