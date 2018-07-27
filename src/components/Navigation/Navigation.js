import React from 'react';

const Navigation = (props) => {
    return(
    props.isSignedIn === true
        ? <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <p className='f3 link dim black underline pa3 pointer'
                onClick={() => props.onRouteChange('signout')}>
                Sign out</p>
        </nav>
        : <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <p className='f3 link dim black underline pa3 pointer'
                onClick={() => props.onRouteChange('signin')}>
                Sign in</p>
            <p className='f3 link dim black underline pa3 pointer'
                onClick={() => props.onRouteChange('register')}>
                Register</p>
        </nav>
    );
}
 
export default Navigation;