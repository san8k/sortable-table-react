import React, { Component } from 'react';
import Table from './components/Table';
import './App.scss';

const Urls = {
    BIG_DATA: `http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D`,
    SMALL_DATA: `http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D`
};

class App extends Component {
    constructor() {
        super();
        this.state = {
            url: Urls.SMALL_DATA
        }
    }

    changeUrl = (e) => {
        this.setState({url: e.target.value === `small-data` ? Urls.SMALL_DATA : Urls.BIG_DATA});
    }
    
    render() {
    return (
        <div className="app">
        <section className="container">
            <Table data={this.state.url} changeData={this.changeUrl} />
        </section>
        </div>
    );
    }
}

export default App;
