import { Button, Col, Row, Form, Input, message } from 'antd';
import useCategory from 'api/useCategory';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Styles from './Category.module.scss';
import { useFormik } from 'formik';
import { Value } from 'sass';
import { toast } from 'react-toastify';
const cx = classNames.bind(Styles);
const Update = () => {
  const validate = (values) => {
    const errors = {};
    if (!values.CategoryName) {
      errors.CategoryName = 'Category Name is required';
    }
    return errors;
  };
  const onSubmit = (values, { setSubmitting, resetForm }) => {
    handleUpdate(values, resetForm);
    setSubmitting(false);
  };
  const formik = useFormik({
    initialValues: {
      CategoryName: ''
    },
    validate: validate,
    onSubmit: onSubmit
  });

  const navigate = useNavigate();

  const { edit, get } = useCategory();
  const [ca, setCa] = useState();
  const { id } = useParams();
  const getByid = async () => {
    const { data, success } = await get();
    if (success) {
      data.data.forEach((c) => {
        if (c._id == id) {
          formik.setValues({
            ...formik.values,
            CategoryName: c.CategoryName
          });
          setCa(c);
        }
      });
    }
  };
  const handleUpdate = async (values, callBack) => {
    const { data, success } = await edit(values, ca?._id);
    if (success) {
      message.success('Update success');
      callBack();
      navigate('/dashboard/category');
    }
  };

  const handleOk = () => {
    if (formik.isValid) {
      formik.handleSubmit(); // Gọi handleSubmit từ Formik để xử lý submit
    } else {
      console.log('Form is invalid. Cannot submit.'); // Có thể hiển thị thông báo lỗi khác
    }
  };
  useEffect(() => {
    getByid();
  }, []);
  return (
    <>
      <Form>
        <Row>
          <Col xl={6}>
            <label htmlFor="CategoryName" className={cx('formLabel')}>
              CategoryName
            </label>
            <Input
              value={formik.values.CategoryName}
              onChange={formik.handleChange}
              name="CategoryName"
              id="CategoryName"
              style={{
                margin: '20px 0'
              }}
            />
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
