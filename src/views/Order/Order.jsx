import { Button, Popconfirm, Space, Table, Tag } from 'antd';
import useOrder from 'api/useOrder';
import useUser from 'api/useUser';
import classNames from 'classnames/bind';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Styles from './Order.module.scss';
const cx = classNames.bind(Styles);
const Order = () => {
  const [users, setuser] = useState([]);
  const [orders, setOrder] = useState([]);
  const { get } = useUser();
  const { getByUserId } = useOrder();
  const handleUser = async () => {
    const { data: userData, success: userSuccess } = await get();
    if (userSuccess) {
      setuser(userData.data);
      const promises = userData.data.map(async (user) => {
        const { data: orderData, success: orderSuccess } = await getByUserId(user._id);
        if (orderSuccess) {
          return orderData.data;
        }
        return [];
      });
      const ordersData = await Promise.all(promises);
      setOrder(ordersData.flat()); // Gộp mảng các đơn hàng lại thành một mảng duy nhất
    } else {
      setuser([]);
      setOrder([]);
    }
  };

  const confirm = (id) => {
    // handleDelete(id);
    console.log(id);
  };

  useEffect(() => {
    handleUser();
  }, []);

  console.log(orders);
  const columns = [
    {
      title: 'UserID',
      dataIndex: ['UserID', 'FullName'],
      key: 'UserID'
    },
    {
      title: 'Email',
      dataIndex: ['UserID', 'Email'],
      key: 'Email'
    },
    {
      title: 'PhoneNumber',
      dataIndex: ['UserID', 'PhoneNumber'],
      key: 'PhoneNumber'
    },
    {
      title: 'OrderDate',
      dataIndex: 'OrderDate',
      key: 'OrderDate',
      render: (text) => <p>{moment(text).format('DD/MM/YYYY HH:SS:mm')}</p>
    },
    {
      title: 'TotalAmount',
      dataIndex: 'TotalAmount',
      key: 'TotalAmount'
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      render: (_, rc) => (
        <>
          {rc.Status == 1 ? (
            <Tag color={'green'} key={rc.Status}>
              Thành Công
            </Tag>
          ) : (
            <></>
          )}
        </>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`${record._id}`}>
            <a>Detail </a>
          </Link>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this account?"
            onConfirm={() => confirm(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <React.Fragment>
      <Table columns={columns} dataSource={orders} />
    </React.Fragment>
  );
};

export default Order;
