import firebase from './firebase';

export const getAuth = () => firebase.auth();

export const GithubOAuth = () => new firebase.auth.GithubAuthProvider();
