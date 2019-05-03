import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import { Base64 } from 'js-base64';
import { Folder, Code, PlusSquare, Save, ExternalLink, Coffee, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import JSONEditorReact from './JSONEditorReact';
import { getData, UpdateFile, CrateANewFile, sortContentArray, checkFileType, deleteFile } from '../config/api';

// https://codepen.io/khoama/pen/hpljA

function Application({ location, history }) {
    const [filesList, setFilesList] = useState([]);
    const [jsonContent, setJsonContent] = useState(null);
    const [activeMode, setActiveMode] = useState('tree');
    const [newFileName, setNewFileName] = useState('');
    const [eventMessage, setEventMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [show, setShow] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);

    const [activePathObj, setActivePathObj] = useState({});
    const modes = ['tree', 'form', 'view', 'code', 'text'];

    useEffect(() => {
        let ignore = false;

        async function firstCall() {
            const result = await getData(location);
            const dataArray = result.data;
            if (result.status === 404) {
                history.push('/database');
            }
            for (let i = 0; i < dataArray.length; i += 1) {
                dataArray[i].childObj = [];
            }
            setFilesList(dataArray);
        }

        firstCall();
        return () => {
            ignore = true;
        };
    }, [history, location]);

    const fetchData = async paramObj => {
        const result = await getData(location);
        const dataArray = result.data;
        if (result.status === 404) {
            history.push('/database');
        }
        for (let i = 0; i < dataArray.length; i += 1) {
            dataArray[i].childObj = [];
        }
        setFilesList(dataArray);
    };

    const previewData = (content, e) => {
        e.preventDefault();
        setActivePathObj(content);
        // const urlParamArray = content.git_url.split('/');
        // console.log(urlParamArray);
        // const userName = urlParamArray[4];
        // const repoName = urlParamArray[5];
        const accessToken = localStorage.getItem('token');
        axios
            .get(`${content.git_url}?access_token=${accessToken}`, {
                headers: { 'If-None-Match': '' },
            })
            .then(res => {
                const decoded = JSON.parse(Base64.decode(res.data.content));
                setJsonContent(decoded);
            });
    };

    function onChangeJSON(json) {
        setJsonContent(json);
    }

    async function commitThisFile() {
        const { path, sha } = activePathObj;
        const activePathObjSHA = filesList.findIndex(x => x.path === path);
        const shaID = filesList[activePathObjSHA].sha;
        setEventMessage(`${path} is commiting...`);
        setShowSnackbar(true);
        const param = {
            message: 'Updating file with API',
            content: Base64.encode(JSON.stringify(jsonContent)),
            sha: shaID,
        };
        const result = await UpdateFile(path, param, location);
        if (result.status === 200) {
            setEventMessage(`${path} is saved`);
            setTimeout(() => {
                setShowSnackbar(false);
                fetchData();
            }, 2000);
        }
    }

    async function createAFile() {
        setEventMessage('Creating File and pushing on GitHub');
        const path = newFileName;
        const param = {
            message: 'Creating file with API',
            content: Base64.encode('{}'),
        };
        const result = await CrateANewFile(path, param, location);
        if (result.status === 201) {
            setEventMessage('Successfully! Yes, file created. Refresh after 60s');
            fetchData();
            setTimeout(() => {
                setShow(false);
            }, 1500);
        }
    }

    function openDeleteAction() {
        setShowActionModal(true);
    }

    function closeActionModal() {
        setShowActionModal(false);
    }

    async function deleteThisFile() {
        setEventMessage(`Deleting file ${activePathObj.path}`);
        const { path } = activePathObj;
        const param = {
            message: `Deleting file ${activePathObj.path}`,
            sha: activePathObj.sha,
        };
        const result = await deleteFile(param, location, path);
        if (result.status === 200) {
            setEventMessage('Successfully! Yes, file deleted. Refresh after 60s');
            setActivePathObj({});
            setJsonContent(null);
            fetchData();
            setTimeout(() => {
                setShowActionModal(false);
            }, 1500);
        }
    }

    async function renderNestedList(obj, index, e) {
        e.preventDefault();
        const accessToken = localStorage.getItem('token');
        const result = await axios.get(`${obj.url}&access_token=${accessToken}`);
        filesList[index].childObj = result.data;

        setFilesList(filesList);
        setJsonContent({});
    }

    function updateNewFileName(e) {
        setNewFileName(e.target.value);
    }

    function renderFilesList(content, key) {
        if (checkFileType(content)) {
            return (
                <li
                    key={content.name}
                    onClick={
                        content.type === 'dir'
                            ? renderNestedList.bind(this, content, key)
                            : previewData.bind(this, content)
                    }
                    role="presentation"
                >
                    <div className="file-list">
                        <div className="file-icon">
                            {content.type === 'dir' ? <Folder size={14} /> : <Code size={14} />}
                        </div>
                        <div className="file-name">{content.name}</div>
                    </div>
                    <ul>
                        {content.childObj.map(child => (
                            <li key={child.name} role="presentation" onClick={previewData.bind(this, child)}>
                                <div className="file-list">
                                    <div className="file-icon">
                                        {child.type === 'dir' ? <Folder size={14} /> : <Code size={14} />}
                                    </div>
                                    <div className="file-name">{child.name}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </li>
            );
        }
    }

    function handleClose() {
        setShow(false);
    }

    function handleShow() {
        setShow(true);
    }

    // function RefreshList() {
    //     fetchData();
    // }

    return (
        <div>
            <div id="snackbar" className={showSnackbar ? 'show' : ''}>
                {eventMessage}
            </div>

            <div className="editor">
                <div className="side-navbar">
                    <h3>
                        <Link to="/database">
                            API with
                            <br />
                            GitHub
                        </Link>
                    </h3>
                    <hr />
                    <div className="row events-btn">
                        <div className="col-md-12">
                            <button type="submit" onClick={handleShow}>
                                <PlusSquare size={16} /> Make API
                            </button>
                        </div>
                    </div>
                    <ul className="file-structure">{sortContentArray(filesList).map(renderFilesList)}</ul>
                    <div className="donate-btn btn-bottom">
                        <a href="https://www.paypal.me/mddanishyusuf" target="_blank" rel="noopener noreferrer">
                            <button type="button" className="btn btn-warning">
                                <Coffee size={16} />
                                <span>Coffee To Maker</span>
                            </button>
                        </a>
                    </div>
                </div>
                <div className="content-area">
                    <div className="db-options">
                        {activePathObj.download_url && (
                            <div>
                                <div className="file-table">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th scope="row">Active File</th>
                                                <td>{activePathObj.path}</td>
                                                <th scope="row">API</th>
                                                <td>
                                                    <a
                                                        href={activePathObj.download_url}
                                                        target="_blank"
                                                        rel="noreferrer noopener"
                                                    >
                                                        {activePathObj.download_url && (
                                                            <span>
                                                                link
                                                                <ExternalLink size={14} />
                                                            </span>
                                                        )}
                                                    </a>
                                                </td>
                                                <th scope="row">Action</th>
                                                <td>
                                                    <span className="delete-file" onClick={openDeleteAction}>
                                                        <Trash2 size={14} /> Delete This File
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="save-file events-btn">
                                    <button type="submit" onClick={commitThisFile}>
                                        <Save size={16} />
                                        save
                                    </button>{' '}
                                </div>
                            </div>
                        )}
                    </div>
                    <JSONEditorReact
                        json={jsonContent}
                        onChangeJSON={onChangeJSON}
                        indentation={4}
                        mode={activeMode}
                        modes={modes}
                    />
                </div>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create New JSON File</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Just give the name to the file and create. So, File will save to your GitHub Repository.
                        <Form.Control
                            type="text"
                            placeholder="file name (es: new.json)"
                            onChange={updateNewFileName.bind(this)}
                        />
                        {eventMessage}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={createAFile}>
                            Make
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showActionModal} onHide={closeActionModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete File</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Sure, you wanna delete the file <b>{activePathObj.path}</b>
                        <br />
                        <br />
                        <span className="event-message">{eventMessage}</span>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeActionModal}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={deleteThisFile}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default Application;
