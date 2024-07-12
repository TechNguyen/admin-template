import { Popconfirm, Space, Button, Table, message } from 'antd';
import useUser from 'api/useUser';
import { useEffect, useState } from 'react';
import moment from 'moment';
const User = () => {
  const { get, del } = useUser();
  const [users, setuser] = useState([]);
  const handleUser = async () => {
    const { data, success } = await get();
    if (success) {
      setuser(data.data);
    } else {
      setuser([]);
    }
  };
  useEffect(() => {
    handleUser();
  }, []);

  const handleDelete = async (id) => {
    const { data, success } = await del(id);
    if (success) {
      handleUser();
      message.success('Delete success');
    }
  };

  const confirm = (id) => {
    handleDelete(id);
  };

  const columns = [
    {
      title: 'FullName',
      dataIndex: 'FullName',
      key: 'FullName'
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email'
    },
    {
      title: 'PhoneNumber',
      dataIndex: 'PhoneNumber',
      key: 'PhoneNumber'
    },
    {
      title: 'RegistrationDate',
      dataIndex: 'RegistrationDate',
      key: 'RegistrationDate',
      render: (text) => moment(text).format('DD/MM/YYYY HH:mm:SS') // Chuyển đổi định dạng thời gian
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
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
    <>
      <Table dataSource={users} columns={columns} />
    </>
  );
};

export default User;
