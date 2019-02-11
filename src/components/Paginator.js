import React, { Component } from 'react';
import './Paginator.scss'

export default class Paginator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: [],
            activePage: 1,
            prevActivePage: 1
        }
    }

    componentWillReceiveProps(nextProps) {
        const {pages} = nextProps;
        this.setState({pages: pages})
    }
    
    render() {
        const {pages, onClickPage} = this.props;
        return (
            <div className="paginator">
                <ul className="paginator__list" 
                    onMouseDown = {(e) => {
                        try {
                            this.setState({activePage: e.target.value});
                            e.target.classList.add(`paginator__item--active`);
                        } catch(error) {
                            console.error(error);
                        }
                    }}
                    onMouseUp={(e) => {
                        onClickPage(e);
                        try {
                            this.setState({prevActivePage: e.target.value});
                            e.currentTarget.children[this.state.prevActivePage - 1].children[0].classList.remove(`paginator__item--active`);
                            e.currentTarget.children[this.state.activePage - 1].children[0].disabled = true;
                            e.currentTarget.children[this.state.prevActivePage - 1].children[0].disabled = false;
                        } catch(error) {
                            console.error(error);
                        }
                    }}
                >
                    {pages.map((page, index) => {
                        return this.state.pages.length > 1 ? (
                            <li className="paginator__item" key={index}>
                                <button className="paginator__button" value={page}>
                                    {page}
                                </button>
                            </li>
                        ) :
                        null
                    })}
                </ul>
            </div>
        )
    }
};
