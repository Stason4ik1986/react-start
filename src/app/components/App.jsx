import React from 'react';

import logo from'../images/logo.svg';

export class App extends React.Component {
    constructor(props) {
        super();
    }
    render() {
        return (
            <div className="content">
                <div className="logo">
                    <img src={logo} />
                    <h1>Base react template</h1>
                </div>
            </div>
        );
    }
}