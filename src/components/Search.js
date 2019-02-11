import React, { Component } from 'react';
import './Search.scss';

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputText: ``
        }
    }

    onInput = (e) => {
        this.setState({inputText: e.target.value});
    }

    render() {
        const {onSearch} = this.props;
        return (
            <form className="search" onSubmit={(e) => {e.preventDefault()}}>
                <input type="text" 
                       name="search" 
                       id="searchInput" 
                       onInput={this.onInput} 
                       className="search__input" 
                       placeholder="Введите данные для поиска"
                       />
                <button onClick={() => {
                        onSearch(this.state.inputText)}} 
                        className="search__button"
                        >
                            Найти
                        </button>
            </form>
        )
    }
}
