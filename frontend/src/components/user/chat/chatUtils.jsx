import React, { useEffect, useState, useContext, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Send, ArrowLeft, Paperclip, Download, Loader2, Check, Smile, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { motion } from 'framer-motion';
import Picker from 'emoji-picker-react';
import { AuthContext } from '../../../context/authContext.jsx';




const getInitials = (name) => {
  if (!name) return "US";
  const names = name.split(" ");
  return names.map((n) => n[0].toUpperCase()).join('').slice(0, 2);
};

const compressFile = async (file) => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!imageTypes.includes(file.type)) return file;

  return new Promise((resolve) => {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], file.name, { type: file.type });
          resolve(compressedFile);
        }, file.type, 0.7);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

const handleDownloadFile = async (fileUrl, fileName) => {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName?.split('-').pop() || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed", error);
  }
};

const FilePreview = ({ file, onRemove }) => {
  const isImage = file.type.startsWith('image/');
  return (
    <div className="relative bg-blue-50 rounded-lg p-2 flex items-center gap-3 mb-2">
      {isImage ? (
        <img src={URL.createObjectURL(file)} alt="Preview" className="h-12 w-12 object-cover rounded-md" />
      ) : (
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 flex items-center justify-center">
          <Paperclip size={18} className="text-gray-500" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-gray-500">
          {file.type.split('/')[1].toUpperCase()} • {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>
      <button onClick={onRemove} className="text-gray-500 hover:text-red-500 transition-colors">
        <X size={18} />
      </button>
    </div>
  );
};

export { getInitials, compressFile, handleDownloadFile, FilePreview };
