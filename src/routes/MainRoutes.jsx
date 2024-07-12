import React, { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';

const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const UtilsTypography = Loadable(lazy(() => import('views/Utils/Typography')));
const Product = Loadable(lazy(() => import('views/Product/Product')));
const SamplePage = Loadable(lazy(() => import('views/SamplePage')));
const User = Loadable(lazy(() => import('views/User/User')));
const Order = Loadable(lazy(() => import('views/Order/Order')));
const Category = Loadable(lazy(() => import('views/Category/Category')));
const UpdateCategory = Loadable(lazy(() => import('views/Category/Update')));
const DetailOrder = Loadable(lazy(() => import('views/Order/Detail')));
const UpdateProduct = Loadable(lazy(() => import('views/Product/Update')));
const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/dashboard',
      element: <DashboardDefault />
    },
    {
      path: '/dashboard/product',
      element: <Product />
    },
    {
      path: '/dashboard/product/:id',
      element: <UpdateProduct />
    },
    {
      path: '/dashboard/account',
      element: <User />
    },
    {
      path: '/dashboard/order',
      element: <Order />
    },
    {
      path: '/dashboard/order/:id',
      element: <DetailOrder />
    },
    {
      path: '/dashboard/category',
      element: <Category />
    },
    {
      path: '/dashboard/category/:id',
      element: <UpdateCategory />
    }
  ]
};

export default MainRoutes;
