import React from 'react';

class Card extends React.Component {

    render() {
        return (
            <div className='card'>
                <h3 className='card-header'>{this.props.title}</h3>
                <div className='card-body'>
                    {this.props.children}
                </div>
            </div>
        )
    }

}

export default Card