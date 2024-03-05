import React from 'react';
import { Modal } from 'react-bootstrap';

const HelpModal = ({ onClose }) => {

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Help</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <div className="form-group">
                    <h5>How to add task?</h5>
                    <p className='p-2'>To add task
                        <li>Click "+" icon on left side menu</li>
                        <li>Fill in all the fields and click "Submit"</li>
                    </p>

                </div>
                <div className="form-group">
                    <h5>How to check my current task?</h5>
                    <p className='p-2'>To check your created task, navigate to task
                        <li>Navigate to Overviews</li>
                        <li>From "Select tasks" menu select categories</li>
                        <li>Choose the task you want and click on title</li>
                    </p>
                </div>
                <div className="form-group">
                    <h5>How to add comment?</h5>
                    <p className='p-2'>To add comment or check answer, navigate to task
                        <li>Navigate to Overviews</li>
                        <li>From "Select tasks" menu select categories</li>
                        <li>Choose the task you want and click on title</li>
                        <li>You can enter comment and click send icon</li>
                        <li>If you want you can click "Drag and drop files here" and select files as attachments or drag files and drop on this section</li>

                    </p>
                </div>
                <div className="form-group">
                    <h5>How to add attachments?</h5>
                    <p className='p-2'>To add attachments, navigate to task
                        <li>Navigate to Overviews</li>
                        <li>From "Select tasks" menu select categories</li>
                        <li>Choose the task you want and click on title</li>
                        <li>You can click "Drag and drop files here" and select files as attachments or drag files and drop on this section</li>
                        <li>If you want you can enter comment and click send icon</li>
                    </p>

                </div>

            </Modal.Body>
        </Modal>
    );
};

export default HelpModal;