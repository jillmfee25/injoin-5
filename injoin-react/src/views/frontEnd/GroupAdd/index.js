// scss
import './_index.scss';

import moment from 'moment';
import axios from 'axios';
import { API_URL } from '../../../utils/config';

// icon
import { BsCalendar2Date, BsFillFileEarmarkTextFill, BsPeopleFill } from 'react-icons/bs';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { AiFillDollarCircle, AiOutlineFieldTime } from 'react-icons/ai';

// component
import FePage1Header from '../../../components/FePage1Header';
import LogoutPage from '../LogoutPage/LogoutPage.js';

// 圖片upload
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, Button, Form, Input, DatePicker, Select, InputNumber, Spin, message } from 'antd';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
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

const { RangePicker } = DatePicker;

const GroupAdd = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // header 資料
  const page1HeaderInfo = {
    titleEn: 'Newgroup',
    titleCn: '我要開團',
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
      isShow: false,
      pageParent: {
        href: '/',
        name: '首頁',
      },
      selected: 'groupList',
      selectOptions: [
        {
          name: '揪團專區',
          value: 'groupList',
        },
      ],
    },
  };
  const { titleEn, titleCn, menuList, imgs, pageSelector } = page1HeaderInfo;

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

  // 圖片upload
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([
    // {
    //   uid: '-1',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
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

  // const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

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
    message.success('活動新增成功');
  };
  const error = () => {
    message.error('活動新增失敗');
  };
  // 表單
  const [form] = Form.useForm();
  const { Option } = Select;
  const { TextArea } = Input;

  const range = (start, end) => {
    const result = [];

    for (let i = start; i < end; i++) {
      result.push(i);
    }

    return result;
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment();
  };

  const onFinish = async (fieldsValue) => {
    setLoading(true);
    const groupData = {
      ...fieldsValue,
      groupStartDate: fieldsValue['groupDate'][0].format('YYYY-MM-DD HH:mm'),
      groupEndDate: fieldsValue['groupDate'][1].format('YYYY-MM-DD HH:mm'),
      groupDeadLine: fieldsValue['groupDeadLine'].format('YYYY-MM-DD HH:mm'),
      groupImg: fieldsValue['groupImg'][0]['originFileObj'],
    };
    console.log('Received values of form: ', groupData);

    // 送出
    try {
      let formData = new FormData();
      formData.append('groupName', groupData.groupName);
      formData.append('groupStartDate', groupData.groupStartDate);
      formData.append('groupEndDate', groupData.groupEndDate);
      formData.append('groupAddressCounty', groupData.groupAddress.city);
      formData.append('groupAddressDetail', groupData.groupAddress.street);
      formData.append('groupFee', groupData.groupFee);
      formData.append('groupPeopleNum', groupData.groupPeopleNum);
      formData.append('groupDeadLine', groupData.groupDeadLine);
      formData.append('groupDisc', groupData.groupDisc);
      formData.append('groupImg', groupData.groupImg);
      formData.append('groupIsOfficial', 2);
      formData.append('userId', loginInfo.member.id);
      formData.append('vipLevel', 1);
      formData.append('auditStatus', 1);
      let response = await axios.post(`${API_URL}/group/post`, formData);
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
  const dateStartLabel = (
    <div className="group-add-info-title">
      <BsCalendar2Date />
      <span>活動時間</span>
    </div>
  );
  const dateEndLabel = (
    <div className="group-add-info-title">
      <BsCalendar2Date />
      <span>活動結束時間</span>
    </div>
  );
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
  const deadLineLabel = (
    <div className="group-add-info-title">
      <AiOutlineFieldTime />
      <span>最終審核日</span>
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
      {loginInfo.islogin ? (
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
                  <Spin spinning={loading} tip="Loading...">
                    <Form
                      layout="vertical"
                      form={form}
                      initialValues={{
                        layout: 'vertical',
                      }}
                      onFinish={onFinish}
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
                          {/* 活動開始日期 */}
                          <Form.Item
                            label={dateStartLabel}
                            name="groupDate"
                            rules={[
                              {
                                type: 'array',
                                required: true,
                                message: '請選擇活動日期',
                              },
                            ]}
                          >
                            {/* <DatePicker showTime format="YYYY-MM-DD HH:mm" /> */}
                            <RangePicker
                              disabledDate={disabledDate}
                              showTime={{
                                hideDisabledOptions: true,
                                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                              }}
                              format="YYYY-MM-DD HH:mm"
                            />
                          </Form.Item>
                          {/* 活動結束日期 */}
                          {/* <Form.Item
                            label={dateEndLabel}
                            name="groupEndDate"
                            rules={[
                              {
                                type: 'object',
                                required: true,
                                message: '請選擇活動日期',
                              },
                            ]}
                          >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                          </Form.Item> */}
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
                          <Form.Item
                            label={deadLineLabel}
                            name="groupDeadLine"
                            rules={[
                              {
                                type: 'object',
                                required: true,
                                message: '請輸入最終審核日',
                              },
                            ]}
                          >
                            <DatePicker disabledDate={disabledDate} showTime format="YYYY-MM-DD HH:mm" />
                          </Form.Item>
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
                          <Form.Item name="groupImg" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: '請上傳揪團照片' }]}>
                            <Upload customRequest={dummyRequest} listType="picture-card" fileList={fileList} onPreview={handlePreview} onChange={handleChange}>
                              {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                          </Form.Item>
                          <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                            <img
                              alt="example"
                              style={{
                                width: '100%',
                              }}
                              src={previewImage}
                            />
                          </Modal>
                        </div>
                      </div>
                      <Form.Item className="w-100 text-center mt-4">
                        <Button className="btn btn-none injoin-btn-outline text-gold h-auto" htmlType="submit">
                          新增揪團
                        </Button>
                      </Form.Item>
                    </Form>
                  </Spin>
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
      ) : (
        <LogoutPage setisLogin={setisLogin} />
      )}
    </>
  );
};
export default GroupAdd;
