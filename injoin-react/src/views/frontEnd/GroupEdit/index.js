// scss
import './_index.scss';

import axios from 'axios';
import { API_URL } from '../../../utils/config';

// icon
import { BsCalendar2Date, BsFillFileEarmarkTextFill, BsPeopleFill } from 'react-icons/bs';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { AiFillDollarCircle, AiOutlineFieldTime } from 'react-icons/ai';

// component
import FePage1Header from '../../../components/FePage1Header';
import { useNavigate } from 'react-router-dom';
import EmptyImage from '../../../components/EmptyImage';

// 圖片upload
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, Button, Form, Input, DatePicker, Select, InputNumber, Spin, message } from 'antd';
import { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { userState } from '../../../App';

// upload
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

const normFile = (e) => {
  console.log('Upload event:', e);

  if (Array.isArray(e)) {
    return e;
  }

  return e?.fileList;
};

const GroupEdit = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // 檢查登入
  const [isLogin, setisLogin] = useState('');
  const loginInfo = useContext(userState);

  const [memberInfo, setMemberInfo] = useState({
    userId: loginInfo.member ? loginInfo.member.id : -1,
  });

  useEffect(() => {
    if (loginInfo.member) {
      setMemberInfo({ userId: loginInfo.member.id });
    }
  }, [loginInfo]);

  // header 資料
  const page1HeaderInfo = {
    titleEn: 'Editgroup',
    titleCn: '編輯揪團',
    menuList: [
      {
        href: '#groupAddB1',
        name: '活動內容',
      },
    ],
    imgs: {
      m: 'group-list-header-m.png',
      pc: 'group-list-header.png',
    },
    pageSelector: {
      isShow: true,
      pageParent: {
        href: '/account/user',
        name: '會員中心',
      },
      selected: '揪團管理',
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
          name: '我的評價',
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

  // city
  const [cities, setCities] = useState([]);

  useEffect(() => {
    let getCities = async () => {
      // axios.get(URL, config)
      let response = await axios.get(API_URL + '/cityoptions');
      setCities(response.data);
    };
    getCities();
  }, []);

  // 取得詳細資訊
  const { groupId } = useParams();
  let [data, setData] = useState([]);
  let [isOwn, setIsOwn] = useState(false);

  const formRef = useRef(null);

  useEffect(() => {
    let getGroupDetail = async () => {
      let res = await axios.get(`${API_URL}/group/editgroupdetail/${groupId}`, {
        params: {
          // TODO:待接sesssion
          userId: memberInfo.userId,
        },
      });
      if (res.data.code !== 0) {
        setIsOwn(false);
        // console.log(isOwn);
        return;
      }
      setIsOwn(true);
      // console.log(isOwn);
      setData(res.data.data);
      // console.log(res.data.data);

      formRef.current.setFieldsValue({
        groupName: res.data.data[0].name,
        groupAddress: { city: res.data.data[0].cityCode, street: res.data.data[0].place_detail },
        groupFee: res.data.data[0].price,
        groupPeopleNum: res.data.data[0].max_num,
        groupDisc: res.data.data[0].disc,
      });
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: `http://localhost:3001/images${res.data.data[0].img}`,
        },
      ]);
    };
    getGroupDetail();
  }, [groupId, memberInfo]);

  // 圖片upload
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: ``,
    },
  ]);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  // loading
  const [loading, setLoading] = useState(false);
  // 提示
  const success = () => {
    message.success('活動更新成功');
  };
  const error = () => {
    message.error('活動更新失敗');
  };

  // 表單
  const [form] = Form.useForm();
  const { Option } = Select;
  const { TextArea } = Input;
  const onFinish = async (fieldsValue) => {
    setLoading(true);
    // 判斷是否有更新圖片
    let groupData = {};
    if (fileList[0]['originFileObj']) {
      groupData = {
        ...fieldsValue,
        groupImg: fileList[0]['originFileObj'],
      };
    } else {
      groupData = {
        ...fieldsValue,
        groupImg: '',
      };
    }
    console.log('Received values of form: ', groupData);
    console.log('Received values of form: ', fileList);

    // 送出
    try {
      let formData = new FormData();
      formData.append('groupName', groupData.groupName);
      formData.append('groupAddressCounty', groupData.groupAddress.city);
      formData.append('groupAddressDetail', groupData.groupAddress.street);
      formData.append('groupFee', groupData.groupFee);
      formData.append('groupPeopleNum', groupData.groupPeopleNum);
      formData.append('groupDisc', groupData.groupDisc);
      formData.append('groupImg', groupData.groupImg);
      formData.append('vipLevel', 1);
      formData.append('userId', memberInfo.userId);

      let response = await axios.post(`${API_URL}/group/update/${groupId}`, formData);
      console.log(response.data);
      if (response.data.result === 'OK') {
        setLoading(false);
        success();
        navigate(-1);
      } else {
        setLoading(false);
        error();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ladel
  const addressLabel = (
    <div className="group-add-info-title">
      <FaMapMarkerAlt />
      <span>活動地點</span>
    </div>
  );
  const feeLabel = (
    <div className="group-add-info-title">
      <AiFillDollarCircle />
      <span>預計費用</span>
    </div>
  );
  const peopleNumLabel = (
    <div className="group-add-info-title">
      <BsPeopleFill />
      <span>人數上限</span>
    </div>
  );
  const discLabel = (
    <div className="group-add-info-title">
      <BsFillFileEarmarkTextFill />
      <span>活動介紹</span>
    </div>
  );

  return (
    <>
      <FePage1Header titleEn={titleEn} titleCn={titleCn} menuList={menuList} imgs={imgs} pageSelector={pageSelector} />
      <div className="group-add-info-wraper" data-aos="fade-up" data-aos-easing="ease-in" data-aos-duration="1000">
        <div className="container">
          <div className="page-type1-area-title" id="groupAddB1">
            活動內容
          </div>

          <div className="position-relative">
            <div className="group-add-info-bg-square"></div>
            <div className="p-3 p-md-5">
              {isOwn ? (
                data.map((item, i) => {
                  let startTime = item.start_time;
                  let endTime = item.end_time;
                  let auditTime = item.audit_time;
                  startTime = startTime.slice(0, startTime.length - 3);
                  endTime = endTime.slice(0, endTime.length - 3);
                  auditTime = auditTime.slice(0, auditTime.length - 3);
                  return (
                    <Spin spinning={loading} tip="Loading..." key={i}>
                      <Form
                        layout="vertical"
                        form={form}
                        initialValues={{
                          layout: 'vertical',
                          groupName: '',
                          groupAddress: { city: 0, street: '' },
                          groupFee: 0,
                          groupPeopleNum: 0,
                          groupDisc: '',
                        }}
                        onFinish={onFinish}
                        ref={formRef}
                      >
                        {/* 活動名稱 */}
                        <Form.Item
                          name="groupName"
                          rules={[
                            {
                              required: true,
                              message: '請輸入活動名稱',
                            },
                          ]}
                        >
                          <Input placeholder="活動名稱" />
                        </Form.Item>
                        <hr />
                        <div className="d-flex flex-column flex-md-row justify-content-between">
                          <div className="group-add-info">
                            <div className="ant-row ant-form-item">
                              <div className="group-add-info-title">
                                <BsCalendar2Date />
                                <span>活動時間</span>
                              </div>
                              <div>
                                {startTime} ~ {endTime}
                              </div>
                            </div>
                            {/* 活動地點 */}
                            <Form.Item label={addressLabel}>
                              <Input.Group compact>
                                <Form.Item
                                  name={['groupAddress', 'city']}
                                  noStyle
                                  rules={[
                                    {
                                      required: true,
                                      message: '請選擇活動縣市',
                                    },
                                  ]}
                                >
                                  <Select placeholder="請選擇縣市">
                                    {cities.map((city) => {
                                      return (
                                        <Option value={city.code} key={city.code}>
                                          {city.name}
                                        </Option>
                                      );
                                    })}
                                    {/* <Option value="1">台北市</Option>
                                  <Option value="2">新北市</Option> */}
                                  </Select>
                                </Form.Item>
                                <Form.Item
                                  name={['groupAddress', 'street']}
                                  noStyle
                                  rules={[
                                    {
                                      required: true,
                                      message: '請輸入活動地點',
                                    },
                                  ]}
                                >
                                  <Input
                                    style={{
                                      width: '60%',
                                    }}
                                    placeholder="活動地址"
                                  />
                                </Form.Item>
                              </Input.Group>
                            </Form.Item>
                            {/* 預計費用 */}
                            <Form.Item
                              label={feeLabel}
                              name="groupFee"
                              rules={[
                                {
                                  required: true,
                                  message: '請輸入預計費用',
                                },
                              ]}
                            >
                              <InputNumber placeholder="預計費用" />
                            </Form.Item>
                            {/* 人數上限 */}
                            <Form.Item
                              label={peopleNumLabel}
                              name="groupPeopleNum"
                              rules={[
                                {
                                  required: true,
                                  message: '請輸入人數上限',
                                },
                              ]}
                            >
                              <InputNumber placeholder="人數上限" />
                            </Form.Item>
                            {/* 最終審核日 */}
                            <div className="ant-row ant-form-item">
                              <div className="group-add-info-title">
                                <AiOutlineFieldTime />
                                <span>最終審核日</span>
                              </div>
                              <div>{auditTime}</div>
                            </div>
                            {/* 活動介紹 */}
                            <Form.Item
                              label={discLabel}
                              name="groupDisc"
                              rules={[
                                {
                                  required: true,
                                  message: '請輸入活動介紹',
                                },
                              ]}
                            >
                              <TextArea showCount maxLength={100} placeholder="活動說明" />
                            </Form.Item>
                          </div>
                          <div className="group-add-img">
                            <Form.Item name="groupImg" valuePropName="fileList" getValueFromEvent={normFile}>
                              <Upload customRequest={dummyRequest} listType="picture-card" fileList={fileList} onPreview={handlePreview} onChange={handleChange}>
                                {fileList.length >= 1 ? null : uploadButton}
                              </Upload>
                              <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                                <img
                                  alt="example"
                                  style={{
                                    width: '100%',
                                  }}
                                  src={previewImage}
                                />
                              </Modal>
                            </Form.Item>
                          </div>
                        </div>
                        <Form.Item className="w-100 text-center mt-4">
                          <Button className="btn btn-none injoin-btn-outline text-gold h-auto" htmlType="submit">
                            更新活動內容
                          </Button>
                        </Form.Item>
                      </Form>
                    </Spin>
                  );
                })
              ) : (
                <EmptyImage discText="您沒有編輯權限" />
              )}
            </div>
          </div>

          <button onClick={() => navigate(-1)} className="back-page btn btn-none mt-3">
            <div>
              <svg width="37" height="24" viewBox="0 0 37 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.935198 13.0565C0.351696 12.4684 0.355391 11.5187 0.943452 10.9352L10.5265 1.42643C11.1145 0.842929 12.0643 0.846624 12.6478 1.43469C13.2313 2.02275 13.2276 2.97249 12.6395 3.55599L5.62711 10.514L36.4814 10.6341L36.4698 13.6341L5.61543 13.514L12.5735 20.5264C13.157 21.1145 13.1533 22.0642 12.5652 22.6477C11.9772 23.2312 11.0274 23.2275 10.4439 22.6395L0.935198 13.0565Z"
                />
              </svg>
            </div>
            <span className="ms-3 ff-cn-main">返回上一頁</span>
          </button>
        </div>
      </div>
    </>
  );
};
export default GroupEdit;
