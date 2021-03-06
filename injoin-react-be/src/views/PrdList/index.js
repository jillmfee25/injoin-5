import { FaEye } from 'react-icons/fa';
import { AiFillEdit } from 'react-icons/ai';
import { HiOutlineTrash } from 'react-icons/hi';
import logo from '../../assets/images/shared/injoinlogo.png';
import './index.scss';

import { API_URL, BE_IMAGE_URL } from '../../utils/config';
import BePagination from '../../components/BePagination';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrdList = () => {
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    let getPrdList = async () => {
      let res = await axios.get(`${API_URL}/prd/be/prdlist`, { params: { page } });
      setData(res.data.data);
      setPagination(res.data.pagination);
    };
    getPrdList();
  }, [page]);

  return (
    <div className="container">
      <h4 className="page-type1-area-title">商品列表</h4>
      <div className="d-flex justify-content-end">
        <Link to="/production" className="btn injoin-btn-outline">
          新增商品
        </Link>
      </div>

      <div className="be-prdlist-area mt-3">
        <div className="pc-view prdlist-title">
          <div>商品編號</div>
          <div>商品圖片</div>
          <div>商品名稱</div>
          <div>商品價格</div>
          <div>商品狀態</div>
          <div></div>
        </div>
        {data.map((prd) => {
          return (
            <div className="prdlist-content" key={prd.id}>
              <div>{prd.prdnum}</div>
              <div>
                <div className="prd-img">
                  <img src={`${BE_IMAGE_URL}/production/${prd.main_img}`} alt="" className="img-fluid object-cover" />
                </div>
              </div>
              <div>{prd.name}</div>
              <div>NT. {prd.price}</div>
              <div>{prd.statusName}</div>
              <div>
                <div>
                  <FaEye />
                </div>
                <div>
                  <AiFillEdit />
                </div>
                <div>
                  <HiOutlineTrash />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="d-flex justify-content-center mt-3">
        <BePagination pagination={pagination} current={page} setCurrent={setPage} />
      </div>
    </div>
  );
};
export default PrdList;
