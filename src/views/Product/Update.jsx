import { message } from 'antd';
import useProduct from 'api/useProduct';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, Popconfirm, Space, Table, Modal, Input, Select, Form } from 'antd';
import { Formik, ErrorMessage, useFormik } from 'formik';
import { Form as BootstrapForm, Row, Col } from 'react-bootstrap';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import classNames from 'classnames/bind';
import Styles from './Product.module.scss';
import useCategory from 'api/useCategory';
const cx = classNames.bind(Styles);
const Update = () => {
  const { id } = useParams();
  const { getById, update } = useProduct();
  const [updatePr, setUpdatePr] = useState();
  const [category, setCategory] = useState([]);
  const { get } = useCategory();
  const navigate = useNavigate();
  const handleUpdate = async (values) => {
    console.log(values);
    const { data, success } = await update(values, id);
    if (success) {
      message.success('Success');
      navigate('/dashboard/product/');
    }
    // if (success) {
    //   message.success('Add product success fully');
    //   callBack();
    //   setisopen(false);
    // }
  };
  const onSubmit = (values) => {
    handleUpdate(values);
  };

  const handleOk = () => {
    // Đảm bảo form hiện tại hợp lệ trước khi submit
    if (formik.isValid) {
      formik.handleSubmit(); // Gọi handleSubmit từ Formik để xử lý submit
    } else {
      console.log('Form is invalid. Cannot submit.'); // Có thể hiển thị thông báo lỗi khác
    }
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

  const onChangeCategory = (value) => {
    formik.setValues({
      ...formik.values,
      CategoryID: value
    });
  };
  const onSearchCategory = (value) => {
    console.log('search:', value);
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

  const handleGetById = async (values) => {
    const { data, success } = await getById(id);
    if (success) {
      formik.setValues({
        ...formik.values,
        ...data.data,
        CategoryID: data.data.CategoryID._id
      });

      console.log(data.data);
      setUpdatePr(data.data);
    }
  };
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

  useEffect(() => {
    handleGetById();
    handleGetCategory();
  }, []);

  return (
    <>
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
                defaultValue={formik.values.CategoryID}
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

        <Button type="submit" className={cx('submitButton')} onClick={handleOk}>
          Update
        </Button>
      </Form>
    </>
  );
};
export default Update;
