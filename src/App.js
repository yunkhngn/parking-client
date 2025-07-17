import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_API_BASE;

function App() {
  const [slots, setSlots] = useState([]);
  const [licensePlate, setLicensePlate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [message, setMessage] = useState('');

  const [checkPlate, setCheckPlate] = useState('');
  const [checkOtp, setCheckOtp] = useState('');
  const [checkMessage, setCheckMessage] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await axios.get(`${API_BASE}/slots`);
      setSlots(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Không thể tải danh sách slot');
    }
  };

  const handleRegister = async () => {
    if (!selectedSlot || !licensePlate) {
      setMessage('Vui lòng nhập biển số và chọn slot');
      return;
    }

    const platePattern = /^\w{2,3}-\d{4,5}$/;
    if (!platePattern.test(licensePlate)) {
      setMessage('Biển số không đúng định dạng (VD: ABC-12345)');
      return;
    }

    try {
      const resSlots = await axios.get(`${API_BASE}/slots`);
      const latestSlot = resSlots.data.find(slot => slot.slot_number === selectedSlot);

      if (!latestSlot || latestSlot.status !== 'available') {
        setMessage('Slot này đã được đăng ký, hãy chọn slot khác');
        fetchSlots(); 
        return;
      }
      const res = await axios.post(`${API_BASE}/register`, {
        slot_number: selectedSlot,
        license_plate: licensePlate.toUpperCase(),
      });
      setMessage(`Đăng ký thành công! OTP: ${res.data.otp}`);
      // alert đã được loại bỏ theo yêu cầu
      fetchSlots();

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Đăng ký thất bại');
    }
  };

  const handleSmartCheck = async () => {
  if (!checkPlate || !checkOtp) {
    setCheckMessage('Vui lòng nhập biển số và OTP');
    return;
  }

  try {
    const res = await axios.post(`${API_BASE}/status`, {
      license_plate: checkPlate.toUpperCase(),
      otp: checkOtp
    });

    if (res.data.status === 'checked_in') {
      // Đã check-in → thực hiện check-out
      try {
        const outRes = await axios.post(`${API_BASE}/checkout`, {
          license_plate: checkPlate.toUpperCase(),
          otp: checkOtp
        });
        setCheckMessage(outRes.data.message || 'Check-out thành công');
        try {
          await axios.post(`${API_BASE}/update-slot-after-checkout`, {
            license_plate: checkPlate.toUpperCase(),
            otp: checkOtp
          });
          console.log('✅ Updated DB after checkout');
          await fetchSlots();
        } catch (updateErr) {
          console.error('❌ Failed to update DB:', updateErr);
        }
        setIsCheckedIn(false);
        fetchSlots();
      } catch (err) {
        if (err.response?.status === 403) {
          setCheckMessage('Không thể check-out: Xe vẫn đang ở slot');
        } else {
          setCheckMessage(err.response?.data?.error || 'Lỗi khi check-out');
        }
      }

    } else if (res.data.status === 'checked_out') {
      setIsCheckedIn(false);
      setCheckMessage('Xe đã check-out. Bạn cần đăng ký lại.');

    } else {
      // Chưa check-in → thực hiện check-in
      try {
        const inRes = await axios.post(`${API_BASE}/checkin`, {
          license_plate: checkPlate.toUpperCase(),
          otp: checkOtp
        });
        setCheckMessage(inRes.data.message || 'Check-in thành công');
        setIsCheckedIn(true);
      } catch (err) {
        setCheckMessage(err.response?.data?.error || 'Lỗi khi check-in');
      }
    }
  } catch (err) {
    console.error(err);
    setCheckMessage(err.response?.data?.error || 'Không kiểm tra được trạng thái');
  }
};

  return (
    <div className="App">
      <div className="container">
        <h1>Đăng ký chỗ đỗ xe</h1>
        <div className="slot-list">
          {slots.map((slot) => (
            <button
              key={slot.slot_number}
              onClick={() => setSelectedSlot(slot.slot_number)}
              className={`slot-button ${slot.status === 'available' ? 'available' : 'occupied'} ${selectedSlot === slot.slot_number ? 'selected' : ''}`}
              disabled={slot.status !== 'available'}
            >
              Slot {slot.slot_number}
            </button>
          ))}
        </div>
        <input
          className="input-field"
          placeholder="Nhập biển số xe..."
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
        />
        <button className="register-button" onClick={handleRegister}>
          Đăng ký
        </button>
        {message && <p className="message">{message}</p>}
      </div>

      <div className="container">
        <h2>Check-in / Check-out</h2>
        <input
          className="input-field"
          placeholder="Nhập biển số xe..."
          value={checkPlate}
          onChange={(e) => setCheckPlate(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Nhập OTP..."
          value={checkOtp}
          onChange={(e) => setCheckOtp(e.target.value)}
        />
        <button className="register-button" onClick={handleSmartCheck}>
          Submit
        </button>
        {checkMessage && <p className="message">{checkMessage}</p>}
      </div>
    </div>
  );
}

export default App;