import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee } from 'react-feather';
import axios from 'axios';
import moment from 'moment';

function RepositoryList({ history }) {
    const [repoList, setRepoList] = useState(null);
    const [isAppInstalled, setIsAppInstalled] = useState(false);

    function getRepositryList(installationId) {
        const accessToken = localStorage.getItem('token');
        axios
            .get(
                `https://api.github.com/user/installations/${installationId}/repositories?access_token=${accessToken}`,
                {
                    headers: { Accept: 'application/vnd.github.machine-man-preview+json', 'If-None-Match': '' },
                }
            )
            .then(res => {
                setRepoList(res.data.repositories);
            });
    }

    useEffect(() => {
        const accessToken = localStorage.getItem('token');
        axios
            .get(`https://api.github.com/user/installations?access_token=${accessToken}`, {
                headers: { Accept: 'application/vnd.github.machine-man-preview+json', 'If-None-Match': '' },
            })
            .then(res => {
                const appsArray = res.data.installations;
                const appInstalled = appsArray.findIndex(x => x.app_id === 29383);
                if (appInstalled > -1) {
                    setIsAppInstalled(true);
                    getRepositryList(appsArray[appInstalled].id);
                }
            });
    }, []);

    function AddedRepoList() {
        return (
            <div className="list-repo">
                {repoList.map((repo, key) => (
                    <div key={key} className="list">
                        <Link to={`/editor/${repo.full_name}`}>{repo.full_name}</Link>
                        <br />
                        <small>
                            last change: <b>{moment(repo.pushed_at).fromNow()}</b>
                        </small>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="container">
            <div className="repository-section">
                <div className="list-header">
                    <h3>
                        API with
                        <br />
                        GitHub
                    </h3>
                    <div className="donate-btn">
                        <a href="https://www.paypal.me/mddanishyusuf" target="_blank" rel="noopener noreferrer">
                            <button type="button" className="btn btn-warning">
                                <Coffee size={16} />
                                <span>Coffee To Maker</span>
                            </button>
                        </a>
                    </div>
                </div>
                {repoList === null ? (
                    <div className="no-repository-container">
                        <div>
                            <h4>Create your first Database</h4>
                            <small>
                                1. Create new <b>Public GitHub Repository</b> with default <b>README.md</b> file, go to{' '}
                                <a href="https://github.com/new" target="_blank" rel="noopener noreferrer">
                                    https://github.com/new{' '}
                                </a> to create new repository.
                                <br />
                                {isAppInstalled ? '✅' : ''}2. Install {/* 2. {' '} */}
                                <a
                                    href="https://github.com/apps/api-with-github"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    this
                                </a>{' '}
                                app on your GitHub Profile and give repository access.
                            </small>
                            <hr />
                        </div>
                        {/* <a
                            href="https://github.com/apps/api-with-github"
                            className="btn btn-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Install the App
                        </a>
                        <img src={DemoGifToCreateImage} alt="how to make new repository" /> */}
                    </div>
                ) : (
                    <div className="list-container">
                        <h4>List of Repository(DataBase)</h4>
                        <small>
                            Make new database{' '}
                            <a href="https://github.com/new" target="_blank" rel="noopener noreferrer">
                                https://github.com/new{' '}
                            </a>
                        </small>
                        <br />
                        <br />
                        <br />
                        <AddedRepoList List={repoList} />
                        {/* <br />
                        <br />
                        <br />
                        <h4>If Repository not listed above</h4>
                        <p>
                            There is only one possibility that we don;t have access to that Repository. So, No problem
                            Below is the GIF image is showing how to give access.
                        </p>
                        <img
                            src={GivePermission}
                            style={{ width: '100%' }}
                            alt="Tutorial to give access to repository"
                        /> */}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RepositoryList;
