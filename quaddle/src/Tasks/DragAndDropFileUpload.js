import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const DragAndDropFileUpload = ({ handleAddedFiles, setClearFilesFn, onFilesChange }) => {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  useEffect(() => {
    onFilesChange(files);
  }, [files, selectedFile]);

  useEffect(() => {
    setClearFilesFn(() => clearFiles);
  }, [setClearFilesFn]);

  const clearFiles = () => {
    setFiles([]);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleDeleteFile = (index, e) => {
    if (!e.target.classList.contains('btn')) {
      return;
    }

    e.stopPropagation();

    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    setSelectedFile(null);
    onFilesChange(e);

  };

  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setSelectedFile(null);
    handleAddedFiles(e);
    onFilesChange(files);

  };

  const handleDropZoneClick = (e) => {
    if (e.target.classList.contains('selectFile')) {
      fileInputRef.current.click();
    }
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedFile(null);
    setShowModal(false);
  };

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    const isImage = selectedFile.type.startsWith('image/');
    const isPdf = selectedFile.type === 'application/pdf';
    const isText = selectedFile.type.startsWith('text/');

    if (isImage || isPdf || isText) {
      return (
        <iframe
          src={URL.createObjectURL(selectedFile)}
          width="100%"
          height="600"
          title="File Preview"
        />
      );
    } else {
      return (
        <div>
          <p>{selectedFile.name}</p>
          <p>Podgląd pliku nie jest obsługiwany.</p>
          <p>Obsługiwane podglądy: PDF, TXT, PNG</p></div>
      );
    }
  };

  const downloadFile = () => {
    const url = URL.createObjectURL(selectedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className={`drop-zone border ${dragging ? 'border-primary' : 'border-secondary'} rounded m-3 p-2 pt-3 pb-3 text-center light-bg `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleDropZoneClick}
    >
      <div className='selectFile btn btn-outline-light'>Drag and drop files here</div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
        multiple
      />

      {files.length > 0 && (
        <div>
          <div className="d-flex align-items-start">
            <p className="ms-0">Uploaded Files:</p>
          </div>
          <ul className="list-unstyled">

            {files.map((file, index) => (
              <li
                key={index}
                className="d-flex align-items-center"
                onClick={() => handleFileClick(file)}
              >
                <span className="me-2">{file.name}</span>
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={(e) => handleDeleteFile(index, e)}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Modal show={showModal} onHide={closeModal} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>File Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderFilePreview()}
        </Modal.Body>
        <Modal.Footer>

          <Button variant="btn btn-outline-dark" onClick={downloadFile}>
            Download
          </Button>
          <Button variant="btn btn-outline-dark" onClick={closeModal}>
            Close
          </Button>

        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DragAndDropFileUpload;
