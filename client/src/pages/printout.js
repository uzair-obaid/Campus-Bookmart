import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Popup from './popup';

function PrintoutPage() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(false);
  const [doRedirect, setDoRedirect] = useState(false);

  const handleClosePopup = (doredirect) => {
    setShowPopup(false);
    if(doredirect){
      navigate('/login');
    }
    
  };
  const handleUpload = (e) => {
    e.preventDefault();
    const files = fileInputRef.current.files;

    

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    let token = null;
    try{
      token = JSON.parse(sessionStorage.getItem('token'));
      if (!token) {
        throw new Error('Invalid token');
    }}
    catch{
      console.log(token);
      navigate('/login');
      return;
    }
    

    
    axios.post('https://bookmart-website.onrender.com/api/upload/', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        if (response.status === 201) { 
          setMsg('Upload successful!');
          setStatus(true);
          setDoRedirect(false);
          setShowPopup(true);
        } else if (response.status === 401) {
          setMsg("Please login to order. Navigating to Login Page...")
          setStatus(false);
          setDoRedirect(true);
          setShowPopup(true);
          
        } else {
          setMsg('Upload failed. Please try again.');
          setStatus(false);
          setDoRedirect(false);
          setShowPopup(true);
        }
      })
      .catch((error) => {
        setMsg('Upload failed. Please try again.');
          setStatus(false);
          setDoRedirect(false);
          setShowPopup(true);
      });
  };

  return (
    <section className="content">
      <form id="uploadForm" onSubmit={handleUpload} >
        <label htmlFor="pdfFiles">Select PDF Files To Upload:</label>
        <input  type="file" id="files" name="files" accept=".pdf" multiple ref={fileInputRef} />
        <button className='btn-1' type="submit">Upload</button>
      </form>
     
      {showPopup && (
        <Popup
          message={msg}
          onClose={handleClosePopup}
          status={status}
          doRedirect={doRedirect}
        />
      )}
    </section>
  );
};

export default PrintoutPage;
