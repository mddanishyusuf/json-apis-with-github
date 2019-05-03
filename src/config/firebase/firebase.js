import * as firebase from 'firebase';

import { FirebaseConfig } from './keys';

firebase.initializeApp(FirebaseConfig);

export default firebase;
