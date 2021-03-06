import Button from 'react-bootstrap/Button';
import iconURL from '../../assets/images/fe/membercenter/usericon.png';
import { Input } from 'antd';

const userInfoMemberarr = [
  { cn: '真實姓名', en: 'memberfullname' },
  { cn: '線上暱稱', en: 'membername' },
  { cn: '電子郵件', en: 'memberemail' },
  { cn: '出生日期', en: 'memberbirth' },
  { cn: '手機號碼', en: 'memberphone' },
  { cn: '居家住址', en: 'memberhome' },
];

const normFile = (e) => {
  console.log('Upload event:', e);

  if (Array.isArray(e)) {
    return e;
  }

  return e?.fileList;
};


const UserProfile = () => {
  return (
    <>
      <div className="userInfo-membercard">
        <div className="userInfo-memberuser">
          <div className="user-img">
            <img src={iconURL} alt="" />
          </div>
          <Button className="user-button" variant="light">
            編輯照片
          </Button>
        </div>

        <div className="userInfo-membertable">
          {userInfoMemberarr.map((v, i) => {
            if (i !== 0) {
              return (
                <div key={i} className="userInfo-memberinputpart">
                  <label className="userInfo-membertext" htmlFor="">
                    {v.cn}
                  </label>
                  <Input placeholder={v.cn} name={v.en} />
                </div>
              );
            } else {
              return (
                <div key={i} className="userInfo-memberinputpart">
                  <label className="userInfo-membertext" htmlFor="">
                    {v.cn}
                  </label>
                  <Input placeholder={v.cn} name={v.en} disabled={true} />
                </div>
              );
            }
          })}
        </div>
        <div className="userInfo-memberbutton">
          <button className="injoin-btn-outline">送出</button>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
