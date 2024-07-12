import { Col, Row, Table } from 'antd';
import useOrderDetail from 'api/useOrderDetail';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Styles from './Order.module.scss';
import classNames from 'classnames/bind';
import moment from 'moment';
import { render } from '@testing-library/react';
const cx = classNames.bind(Styles);

function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

const Detail = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState();
  const { getByid } = useOrderDetail();
  const handleget = async () => {
    const { data, success } = await getByid(id);
    if (success) {
      setOrders(data.data);
    }
  };

  console.log(orders);
  useEffect(() => {
    handleget();
  }, []);

  const clData = [
    {
      title: 'FullName',
      dataIndex: ['UserID', 'FullName'],
      key: 'FullName'
    },
    {
      title: 'ProductName',
      dataIndex: ['ProductID', 'ProductName'],
      key: 'ProductName'
    },
    {
      title: 'CategoryName',
      dataIndex: ['ProductID', 'CategoryID', 'CategoryName'],
      key: 'CategoryName'
    },
    {
      title: 'Description',
      dataIndex: ['ProductID', 'Description'],
      key: 'Description'
    },
    {
      title: 'Price',
      dataIndex: ['ProductID', 'Price'],
      key: 'Price'
    },
    {
      title: 'Quantity',
      dataIndex: ['Quantity'],
      key: 'Quantity'
    },
    {
      title: 'Total',
      render: (_, record) => {
        return <p>{formatCurrency(record.Quantity * record.ProductID.Price)}</p>;
      }
    }
  ];
  return (
    <>
      <div className={cx('order-form')}>
        <h2>Chi tiết đơn hàng</h2>
        {orders && orders.length > 0 && (
          <>
            <Row gutter={[10, 10]}>
              <Col xl={6}>
                <div className={cx('form-group')}>
                  <label>Tên khách hàng:</label>
                  <div className={cx('value')}>{orders[0].DetailCartData?.[0].UserID?.FullName}</div>
                </div>
              </Col>
              <Col xl={6}>
                <div className={cx('form-group')}>
                  <label>Email khách hàng:</label>
                  <div className={cx('value')}>{orders[0].DetailCartData?.[0].UserID?.Email}</div>
                </div>
              </Col>
              <Col xl={6}>
                <div className={cx('form-group')}>
                  <label>Số điện thoại khách hàng:</label>
                  <div className={cx('value')}>{orders[0].DetailCartData?.[0].UserID?.PhoneNumber}</div>
                </div>
              </Col>

              <Col xl={6}>
                <div className={cx('form-group')}>
                  <label>Số đơn hàng:</label>
                  <div className={cx('value')}>{orders[0]._id}</div>
                </div>
              </Col>

              <Col xl={6}>
                <div className={cx('form-group')}>
                  <label>Ngày đặt hàng:</label>
                  <div className={cx('value')}>{moment(orders[0].CreatedAt).format('DD/MM/YYYY HH:SS:mm')}</div>
                </div>
              </Col>

              <Col xl={6}>
                <div className={cx('form-group')}>
                  <label>Tổng số lượng giỏ hàng:</label>
                  <div className={cx('value')}>{orders[0].OrderID?.CartID?.length}</div>
                </div>
              </Col>

              <Col xl={6}>
                <div className={cx('form-group')}>
                  <label>Tổng giá tiền đơn hàng:</label>
                  <div className={cx('value')}>{formatCurrency(orders[0].OrderID?.TotalAmount)}</div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col xl={24}>
                <Table dataSource={orders[0].DetailCartData} columns={clData} />
              </Col>
            </Row>
          </>
        )}
      </div>
    </>
  );
};
export default Detail;
