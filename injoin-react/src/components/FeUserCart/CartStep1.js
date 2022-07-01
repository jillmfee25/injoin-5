import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';
import { BE_IMAGE_URL } from '../../utils/config';
import faveriteImg from '../../../src/assets/images/fe/faverite/faverite-product-img-1.png';
import { BsTrashFill } from 'react-icons/bs';

function CartStep1(props) {
  const { data } = props;
  // console.log('data',data);
  const [cartprds, setCartPrds] = useState([]);

  const plusOne = (id) => {
    const newCartPrds = cartprds.map((v) => {
      return v.id === id ? { ...v, count: v.count + 1 } : v;
    });

    setCartPrds(newCartPrds);
    console.log('plusOne', newCartPrds);
  };

  const minusOne = (id) => {
    const newCartPrds = cartprds.map((v) => {
      if (v.count - 1 < 1) return v;

      return v.id === id ? { ...v, count: v.count - 1 } : v;
    });
    
    setCartPrds(newCartPrds);
    console.log('minusOne', newCartPrds);
  };
  
  useEffect(() => {
    axios.get('http://localhost:3000/cart').then((res) => {
      const newCartPrds = res.data.map((v) => {
        return { ...v, count: 1 };
      });

      setCartPrds(newCartPrds);
    });
  }, []);

  //假資料
  // const cartstep1arr = [
  //   {
  //     id:1,
  //     cartprdImg: 'faverite-product-img-1.png',
  //     cartprdNum: 'AB123',
  //     cartprdName: '金彬黑波本威士忌',
  //     cartprdPrice: '680',
  //     cartprdCount: '2',
  //     cartprdTotal: '680',
  //   },
  // ]

  return (
    <>
      <div className="cart-prd-info-content d-flex mt-3 flex-nowrap justify-content-between">
        <img src={faveriteImg} alt="faverite-product-img-1" className="w-25 h-25 faverite-product-img-1" />
        <div className="cart-prd-content d-flex flex-column ms-2">
          <div className="cart-prd-num">{data.cartprdNum}</div>
          <div className="cart-prd-name">{data.cartprdName}</div>
          <div className="cart-prd-price">NT${data.cartprdTotal}</div>
        </div>
        <div className="cart-prd-number-content d-flex flex-column flex-md-row justify-content-between">
          <div className="cart-prd-icon text-center">
            <BsTrashFill />
          </div>
          <div
            className="cart-prd-number d-flex ms-2 border border-white justify-content-between
        "
          >
            <button
              className="prd-plus btn-none"
              onClick={() => {
                plusOne(data.id);
              }}
            >
              +
            </button>
            <div className=" border-end border-start prd-number text-center">{data.cartprdCount}</div>
            <button
              className="prd-minus btn-none"
              onClick={() => {
                minusOne(data.id);
              }}
            >
              -
            </button>
          </div>
        </div>
      </div>
      <div className="bottom-line border-bottom"></div>
    </>
  );
}

export default CartStep1;