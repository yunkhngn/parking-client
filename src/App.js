import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_API_BASE;

function App() {
  const [slots, setSlots] = useState([]);
  const [licensePlate, setLicensePlate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [message, setMessage] = useState('');

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
    try {
      const res = await axios.post(`${API_BASE}/register`, {
        slot_number: selectedSlot,
        license_plate: licensePlate,
      });
      setMessage(`Đăng ký thành công! OTP: ${res.data.otp}`);
      fetchSlots();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Đăng ký thất bại');
    }
  };

  return (
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
  );
}

export default App;