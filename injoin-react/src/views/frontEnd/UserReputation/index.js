import './index.scss';

import FePagination from '../../../components/FePagination1';
import FePage1Header from '../../../components/FePage1Header';

import React, { useState } from 'react';
import { Rate } from 'antd';
import ReputationList from '../../../components/FeUserReputation/ReputationList';
import ReputationOrder from '../../../components/FeUserReputation/ReputationOrder';

//test
import reputationimg from '../../../assets/images/fe/userReputation/reputation_1.png';
const UserReputation = () => {
  const page1HeaderInfo = {
    titleEn: 'Reputation',
    titleCn: '會員評價',
    menuList: [
      {
        href: '#user-reputation-bolck1',
        name: '歷史評價',
      },
      {
        href: '#user-reputation-bolck2',
        name: '待評價訂單',
      },
    ],
    imgs: {
      m: 'user-reputation-header-m.png',
      pc: 'user-reputation-header.png',
    },
    pageSelector: {
      isShow: true,
      pageParent: {
        href: '/account/user',
        name: '會員中心',
      },
      selected: '評價',
      selectOptions: [
        {
          name: '會員資訊',
          value: '/account/user',
        },
        {
          name: '我的收藏',
          value: '/account/like',
        },
        {
          name: '會員等級',
          value: '/account/vip',
        },
        {
          name: '優惠券',
          value: '/account/coupon',
        },
        {
          name: '評價',
          value: '/account/reputation',
        },
        {
          name: '我的訂單',
          value: '/account/order',
        },
        {
          name: '揪團管理',
          value: '/account/group',
        },
      ],
    },
  };
  const { titleEn, titleCn, menuList, imgs, pageSelector } = page1HeaderInfo;
  const listarr = [
    {
      id: 1,
      img: 'reputation_1.png',
      time: '2022-03-20',
      name: '金黑波本威士忌',
      commit: '很快就收到商品了，品質很好，與照片相符，包裝也很完整。',
      star: 4,
    },
    {
      id: 2,
      img: 'reputation_1.png',
      time: '2022-03-20',
      name: '金黑波本威士忌',
      commit: '很快就收到商品了，品質很好，與照片相符，包裝也很完整。',
      star: 2,
    },
    {
      id: 3,
      img: 'reputation_1.png',
      time: '2022-03-20',
      name: '金黑波本威士忌',
      commit: '很快就收到商品了，品質很好，與照片相符，包裝也很完整。',
      star: 3,
    },
    {
      id: 4,
      img: 'reputation_1.png',
      time: '2022-03-20',
      name: '金黑波本威士忌',
      commit: '很快就收到商品了，品質很好，與照片相符，包裝也很完整。',
      star: 5,
    },
    {
      id: 5,
      img: 'reputation_1.png',
      time: '2022-03-20',
      name: '金黑波本威士忌',
      commit: '很快就收到商品了，品質很好，與照片相符，包裝也很完整。',
      star: 4,
    },
  ];
  const orderarr = [
    {
      id: 1,
      time: '2022/01/02',
      ordernumber: '20EROVWDCZhV',
    },
    {
      id: 2,
      time: '2022/01/02',
      ordernumber: '20EROVWDCZhV',
    },
    {
      id: 3,
      time: '2022/01/02',
      ordernumber: '20EROVWDCZhV',
    },
    {
      id: 4,
      time: '2022/01/02',
      ordernumber: '20EROVWDCZhV',
    },
    { id: 5, time: '2022/01/02', ordernumber: '20EROVWDCZhV' },
  ];

  return (
    <>
      <FePage1Header titleEn={titleEn} titleCn={titleCn} menuList={menuList} imgs={imgs} pageSelector={pageSelector} />

      <div className="page-type1-list-area reputation-list mode-reputation py-3 mb-4">
        <div className="container">
          <div className="page-type1-area-title" id="user-reputation-bolck1">
            我的評價
          </div>
          <div className="reputation-list-wraper ">
            <div className="reputation-list-title pc-view">
              <div className="reputation-list-date">評價日期</div>
              <div className="reputation-list-name">商品名稱</div>
              <div className="reputation-list-commit">評論</div>
              <div className="reputation-list-img">商品圖片</div>
            </div>

            {listarr.map((v, i) => {
              return <ReputationList key={v.id} data={v} />;
            })}
          </div>
        </div>
        <FePagination />
      </div>

      <div className="page-type1-list-area reputation-orderlist mode-reputation-order py-3 mb-4">
        <div className="container">
          <div className="page-type1-area-title" id="user-reputation-bolck2">
            待評價訂單
          </div>
          <div className="page-type1-list-wraper">
            <div className="page-type1-list-title pc-view">
              <div className="reputation-orderlist-date">日期</div>
              <div></div>
              <div className="reputation-orderlist-number">訂單編號</div>
            </div>
            {orderarr.map((v, i) => {
              return <ReputationOrder key={v.id} data={v} />;
            })}
          </div>
        </div>
        <FePagination />
      </div>
    </>
  );
};
export default UserReputation;
