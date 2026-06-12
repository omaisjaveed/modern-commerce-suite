import React, { useState, useEffect } from 'react';
import API from '../api';
import Modal from './Modal';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { getImageUrl } from '../../config';

const MediaPicker = ({ onSelect, multi = false, selectedImages = [], trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [tempSelected, setTempSelected] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setTempSelected(Array.isArray(selectedImages) ? selectedImages : (selectedImages ? [selectedImages] : []));
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    try {
      const res = await API.get('/media');
      setMedia(res.data);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await API.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchMedia();
      if (!multi) {
        onSelect(res.data.url);
        setIsOpen(false);
      } else {
        setTempSelected(prev => [...prev, res.data.url]);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const toggleSelect = (url) => {
    if (!multi) {
      onSelect(url);
      setIsOpen(false);
    } else {
      setTempSelected(prev => 
        prev.includes(url) ? prev.filter(item => item !== url) : [...prev, url]
      );
    }
  };

  const handleConfirm = () => {
    onSelect(multi ? tempSelected : tempSelected[0]);
    setIsOpen(false);
  };

  return (
    <div className="media-picker-container">
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <button type="button" className="btn btn-dark d-flex align-items-center gap-2" onClick={() => setIsOpen(true)}>
          <ImageIcon size={18} /> Browse Media Library
        </button>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Select Media" size="lg">
        <div className="media-picker-content">
          <div className="picker-header">
            <label className="upload-label">
              <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload New'}
              <input type="file" onChange={handleFileUpload} hidden accept="image/*" disabled={uploading} />
            </label>
            {multi && (
              <button className="btn-primary" onClick={handleConfirm}>
                Confirm Selection ({tempSelected.length})
              </button>
            )}
          </div>

          <div className="picker-grid">
            {loading ? <p>Loading...</p> : media.map(file => (
              <div 
                key={file.name} 
                className={`picker-item ${tempSelected.includes(file.url) ? 'selected' : ''}`}
                onClick={() => toggleSelect(file.url)}
              >
                <img src={getImageUrl(file.url)} alt={file.name} />
                {tempSelected.includes(file.url) && <div className="selected-badge"><X size={12} /></div>}
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <style dangerouslySetInnerHTML={{ __html: `
        .media-picker-content {
          max-height: 70vh;
          overflow-y: auto;
          padding: 1rem;
        }
        .picker-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }
        .upload-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f0f0f0;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
        }
        .picker-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 1rem;
        }
        .picker-item {
          aspect-ratio: 1;
          border: 2px solid transparent;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
        }
        .picker-item.selected {
          border-color: #140b07;
        }
        .picker-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .selected-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: #140b07;
          color: white;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-dark {
          background: #140b07;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .btn-dark:hover {
          background: #2a1b15;
          transform: translateY(-1px);
        }
        .btn-outline {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
        }
      `}} />
    </div>
  );
};

export default MediaPicker;
