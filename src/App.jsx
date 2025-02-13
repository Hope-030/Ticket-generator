import React, { useState, useRef, useEffect } from 'react';
import './TicketBooking.css';

const TicketBooking = () => {
  const [step, setStep] = useState(1);
  const [ticketType, setTicketType] = useState('');
  const [numTickets, setNumTickets] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('hello@avioflagos.io');
  const [specialRequest, setSpecialRequest] = useState('');
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [tickets, setTickets] = useState([]);
  const fileInputRef = useRef(null);
  
  
  useEffect(() => {
    const savedTickets = localStorage.getItem('bookedTickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }
  }, []);
  
  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1 && !ticketType) {
      newErrors.ticketType = 'Please select a ticket type';
    }
    
    if (currentStep === 2) {
      if (!name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (!email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Email is invalid';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };
  
  const handleCancel = () => {
    setStep(1);
    setTicketType('');
    setNumTickets(1);
    setName('');
    setEmail('hello@avioflagos.io');
    setSpecialRequest('');
    setProfileImage(null);
    setErrors({});
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleBookAnotherTicket = () => {
    
    const newTicket = {
      ticketType,
      numTickets,
      name,
      email,
      specialRequest,
      profileImage,
      date: new Date().toISOString()
    };
    
    const updatedTickets = [...tickets, newTicket];
    setTickets(updatedTickets);
    
    
    localStorage.setItem('bookedTickets', JSON.stringify(updatedTickets));
    
    
    handleCancel();
  };
  
  return (
    <div className="ticket-booking">
      {step === 1 && (
        <div className="ticket-selection">
          <h1>Attendee Details</h1>
          <span className="step-indicator">Step 1/3</span>
          
          <div className="event-card">
            <h2>Techember Fest '25</h2>
            <p>Join us for an unforgettable experience at<br />[Event Name]! Secure your spot now.</p>
            <p>📍 [Event Location]  ||  March 15, 2025 | 7:00 PM</p>
          </div>
          
          <div className="ticket-selection-container">
            <p>Select Ticket Type:</p>
            {errors.ticketType && <div className="error-message">{errors.ticketType}</div>}
            <div className="ticket-types">
              <div 
                className={`ticket-type ${ticketType === 'free' ? 'selected' : ''}`}
                onClick={() => setTicketType('free')}
              >
                <h3>Free</h3>
                <p className="access-type">REGULAR ACCESS</p>
                <p className="availability">20/52</p>
              </div>
              <div 
                className={`ticket-type ${ticketType === 'vip' ? 'selected' : ''}`}
                onClick={() => setTicketType('vip')}
              >
                <h3>$150</h3>
                <p className="access-type">VIP ACCESS</p>
                <p className="availability">20/52</p>
              </div>
              <div 
                className={`ticket-type ${ticketType === 'vvip' ? 'selected' : ''}`}
                onClick={() => setTicketType('vvip')}
              >
                <h3>$150</h3>
                <p className="access-type">VVIP ACCESS</p>
                <p className="availability">20/52</p>
              </div>
            </div>
            
            <div className="ticket-count">
              <p>Number of Tickets</p>
              <select 
                value={numTickets} 
                onChange={(e) => setNumTickets(e.target.value)}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
            
            <div className="button-group">
              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
              <button className="next-btn" onClick={handleNext}>Next</button>
            </div>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div className="profile-info">
          <div className="photo-upload">
            <h3>Upload Profile Photo</h3>
            <div className="upload-area">
              <div 
                className="upload-box"
                onClick={handleUploadClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile preview" className="profile-preview" />
                ) : (
                  <>
                    <span className="upload-icon">⬆️</span>
                    <p>Drag & drop or click to upload</p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label>Enter your name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label>Enter your email *</label>
            <div className={`email-input ${errors.email ? 'input-error-container' : ''}`}>
              <span className="email-icon">✉️</span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@avioflagos.io"
                className={errors.email ? 'input-error' : ''}
              />
            </div>
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label>Special request?</label>
            <textarea 
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder="Textarea"
            />
          </div>
          
          <div className="button-group">
            <button className="back-btn" onClick={() => setStep(1)}>Back</button>
            <button className="next-btn" onClick={handleNext}>Next</button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="confirmation">
          <h2>Your Ticket is Booked!</h2>
          <p>Check your email for a copy or you can <span className="download-link">download</span></p>
          
          <div className="ticket">
            <div className="ticket-header">
              <h2>Techember Fest '25</h2>
              <p>📍 54 Rumens road, Ikoyi, Lagos</p>
              <p>🗓️ March 15, 2025 | 7:00 PM</p>
            </div>
            
            <div className="ticket-profile">
              <div className="profile-placeholder">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="profile-image" />
                ) : (
                  <div className="profile-avatar"></div>
                )}
              </div>
            </div>
            
            <div className="ticket-details">
              <div className="ticket-info">
                <div className="info-row">
                  <span className="label">First name:</span>
                  <span className="value">{name || 'Avi Chukwu'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Ticket Type:</span>
                  <span className="value">{ticketType === 'free' ? 'Regular' : ticketType === 'vip' ? 'VIP' : 'VVIP'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Special request:</span>
                  <span className="value">{specialRequest|| 'No 7.0! the users sad story they write in there gets the whole space. Max of three lines'}</span>
                </div>
              </div>
              <div className="ticket-user">
                <div className="info-row">
                  <span className="label">{email}</span>
                </div>
                <div className="info-row">
                  <span className="label">Ticket for:</span>
                  <span className="value">{numTickets}</span>
                </div>
              </div>
            </div>
            
            <div className="ticket-barcode">
              <div className="barcode-lines"></div>
              <div className="barcode-numbers">234567 891234</div>
            </div>
          </div>
          
          <div className="confirmation-buttons">
            <button className="book-another-btn" onClick={handleBookAnotherTicket}>
              Book Another Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketBooking;