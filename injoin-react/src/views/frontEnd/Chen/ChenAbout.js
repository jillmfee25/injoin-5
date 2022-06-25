import axios from 'axios';
import { useState, useEffect } from 'react';
import { API_URL,BE_IMAGE_URL } from '../../../utils/config';

const ChenAbout = () => {
  const [member, setMember] = useState(null);
  useEffect(() => {
    let getMemberInfo = async () => {
      let response = await axios.get(`${API_URL}/member/info`, {
        // 允許跨源讀寫 cookie
        // 這樣才可以把之前有紀錄登入資料的 session id 送回去後端
        withCredentials: true,
      });
      console.log(response.data);
      setMember(response.data);
    };
    getMemberInfo();
  }, []);

  // member.photo /members/1655003608497.jpg
  return (
    <div className="m-7">
      <h2 className="m-7 text-2xl text-gray-600">這是登入</h2>
      {member ? (
        <>
          <h3>Hi, {member.name}</h3>
          <h2>useriD : {member.id}</h2>
          <img src={`localhost:3001/images${member.img}`} />
          <img src={`http://localhost:3001/images/members/1656142795971.jpg`} alt="" />
          
        </>
      ) : (
        <h3>尚未登入</h3>
      )}
    </div>
  );
};

export default ChenAbout;