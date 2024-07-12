import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import Styles from './Category.module.scss';
import useCategory from 'api/useCategory';
import { Table, Button, Popconfirm, Space, message, Modal, Input, Form } from 'antd';
import { Field, ErrorMessage, useFormik } from 'formik';
import { Row, Col } from 'react-bootstrap';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
const cx = classNames.bind(Styles);
const Category = () => {
  const { get, delte, add } = useCategory();
  const [category, setCategory] = useState([]);
  const [isOpen, setisopen] = useState(false);
  const handleGetCategory = async () => {
    const { data, success } = await get();
    if (success) {
      setCategory(data.data);
    }
  };
  useEffect(() => {
    handleGetCategory();
  }, []);

  const handleDelete = async (id) => {
    const { data, success } = await delte(id);
    if (success) {
      handleGetCategory();
      message.success('Delete success');
    }
  };
  const confirm = (id) => {
    handleDelete(id);
  };

  const handleAdd = async (values, callBack) => {
    const { data, success } = await add(values);
    if (success) {
      handleGetCategory();
      toast.success('Success');
      setTimeout(() => {
        callBack();
        setisopen(false);
      }, 1000);
    }
  };
  const columns = [
    {
      title: 'CategoryName',
      dataIndex: 'CategoryName',
      key: 'CategoryName'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this category?"
            onConfirm={() => confirm(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
          <Link to={`/dashboard/category/${record._id}`}>
            <Button>Update</Button>
          </Link>
        </Space>
      )
    }
  ];
  const validate = (values) => {
    const errors = {};
    if (!values.CategoryName) {
      errors.CategoryName = 'Category Name is required';
    }
    return errors;
  };
  const onSubmit = (values, { setSubmitting, resetForm }) => {
    handleAdd(values, resetForm);
    setSubmitting(false);
  };
  const formik = useFormik({
    initialValues: {
      CategoryName: ''
    },
    validate: validate,
    onSubmit: onSubmit
  });

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
          Add Category
        </Button>

        <Modal
          open={isOpen}
          okText={'Add category'}
          onCancel={() => {
            setisopen(false);
          }}
          width={'60%'}
          title="Add new category"
          onOk={handleOk}
        >
          <Form>
            <div className="mb-3">
              <label htmlFor="CategoryName" className="form-label">
                Category Name
              </label>
              <Input type="text" id="CategoryName" value={formik.values.CategoryName} name="CategoryName" onChange={formik.handleChange} />

              <span className={cx('textDanger')}>
                {formik.touched.CategoryName && formik.errors.CategoryName ? formik.errors.CategoryName : ''}
              </span>
            </div>
          </Form>
        </Modal>
      </div>
      <Table dataSource={category} columns={columns} />
    </React.Fragment>
  );
};

export default Category;
