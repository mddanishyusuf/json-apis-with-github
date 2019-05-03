import React, { useEffect, useState } from 'react';
import Delay from 'react-delay';

import { auth } from './firebase';

export default WrappedComponent => {
    function WithAuthentication({ history }, props) {
        const [data, setData] = useState([]);

        useEffect(() => {
            auth.getAuth().onAuthStateChanged(user => {
                if (user) {
                    setData(user.providerData);
                } else {
                    history.push('/');
                }
            });
        }, [history]);

        return data.length > 0 ? (
            <WrappedComponent {...props} history={history} location={history.location} providerData={data} />
        ) : (
            <Delay wait={250}>
                <p>Loading...</p>
            </Delay>
        );
    }

    return WithAuthentication;
};
