import React from 'react';
import { Player, ControlBar } from 'video-react';
import { auth, firebase } from '../config/firebase';

function LandingPage({ history }) {
    const loginWithGitHub = () => {
        const providerOAuth = new auth.GithubOAuth();

        firebase
            .auth()
            .signInWithPopup(providerOAuth)
            .then(result => {
                localStorage.setItem('token', result.credential.accessToken);
                history.push('/database');
            })
            .catch(err => console.error(err));
    };

    return (
        <div>
            <div style={{ background: '#11105f' }}>
                <div className="container">
                    <div className="row landing-section">
                        <div className="col-md-6 cta-section">
                            <h2>API with GitHub</h2>
                            <div>
                                Now build simple API quickly with JSON and store on GitHub Repository. Seems cool?
                            </div>
                            <button type="button" className="btn btn-primary login-button" onClick={loginWithGitHub}>
                                Make Simple API
                            </button>
                        </div>
                        <div className="col-md-6" style={{ padding: 20, display: 'grid', alignSelf: 'center' }}>
                            <div className="product-video-section">
                                <Player
                                    playsInline
                                    poster={require(`../assets/images/video-poster.png`)}
                                    autoPlay="true"
                                    src={require(`../assets/apiwithgithub-tutorial.mp4`)}
                                >
                                    <ControlBar hide className="my-class" />
                                </Player>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="how-it-work">
                    <h2 style={{ textAlign: 'center' }}>How it works</h2>
                    <div className="row key-points">
                        <div className="col-md-6 key-points-value">
                            <h5>1. Setup GitHub APP</h5>
                            <p>
                                Install Our GitHub App on your GitHub Account and give the access to new repository you
                                make to build APIs. We are not storing any data on our server.
                            </p>
                        </div>
                        <div className="col-md-6">
                            <img
                                src="https://user-images.githubusercontent.com/9165019/57060615-b7dd1a80-6cd7-11e9-9f64-4a203d1ea04a.png"
                                alt="setup github app"
                            />
                            <div className="overlay" />
                        </div>
                    </div>
                    <div className="row flex-column-reverse flex-sm-row key-points">
                        <div className="col-md-6">
                            <img
                                src="https://user-images.githubusercontent.com/9165019/57060865-8f095500-6cd8-11e9-84ee-78be2856be7f.png"
                                alt="create reposiotry"
                            />
                            <div className="overlay" />
                        </div>
                        <div className="col-md-6 key-points-value">
                            <h5>2. Create Repository</h5>
                            <p>
                                Make new public GitHub repository with README file. So, we using repository as a JSON
                                files Storage.
                            </p>
                        </div>
                    </div>
                    <div className="row key-points">
                        <div className="col-md-6 key-points-value">
                            <h5>3. Make API & Save</h5>
                            <p>
                                Make new JSON files with our editor and save. So, when you save the file the changes
                                will reflect on your GitHub repository.
                            </p>
                        </div>
                        <div className="col-md-6">
                            <img
                                src="https://user-images.githubusercontent.com/9165019/57061060-31c1d380-6cd9-11e9-8198-0aa9ea12c71d.png"
                                alt="make api and save"
                            />
                            <div className="overlay" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid text-center footer">
                Build by{' '}
                <a href="https://twitter.com/mddanishyusuf" target="_blank" rel="noopener noreferrer">
                    @mddanishyusuf
                </a>{' '}
                <span> I love 🍳 ☕ & 🔨 </span> More projects{' '}
                <a href="https://mohddanish.me" target="_blank" rel="noopener noreferrer">
                    mohddanish.me
                </a>
            </div>
        </div>
    );
}

export default LandingPage;
