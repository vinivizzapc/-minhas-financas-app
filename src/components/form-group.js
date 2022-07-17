import React from 'react';

function FromGroup(props) {
    return (
        <div className="form-group" style={{marginBottom: '15px'}}>
            <label htmlFor={props.htmlFor}>{props.label}</label>
            {props.children}
        </div>
    )
}

export default FromGroup
