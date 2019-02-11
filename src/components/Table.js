import React, { Component } from 'react';
import './Table.scss';
import Paginator from './Paginator';
import Search from './Search';

const TABLE_COLUMNS = [
    {
        label: `Id`,
        sort: `default`
    },
    {
        label: `First Name`,
        sort: `default`
    },
    {
        label: `Last Name`,
        sort: `default`
    },
    {
        label: `E-mail`,
        sort: `default`
    },
    {
        label: `Phone`,
        sort: `default`
    },
];



const TableHeader = (props) => {
    const { columns, onClickColumnTitle } = props;
    return (
        <thead>
            <tr>
            {columns.map((th, index) => {
                return (<th
                key={index}
                className={`table__header-cell sorting-arrows ${columns[index].sort}`}
                onClick={() => onClickColumnTitle(index, th.sort)}
                >
                    {th.label}
                </th>);
            }
                
      )}
            </tr>
        </thead>
    )
};

const TableBody = (props) => {
    const {data, onClickRow} = props;
    if (!data.length) {
        return (
            <tbody>
                <tr className="table--wait">
                    <td>Загрузка...</td>
                </tr>
            </tbody>
        )
    }

    if (data[0].searchError) {
        return (
            <tbody>
                <tr className="table--wait">
                    <td>Нет совпадений</td>
                </tr>
            </tbody>
        )
    }

    return (
        <tbody>
            {
                data.map((tr, i) => {
                    return (
                        <tr key={i} className="table__row" onClick={onClickRow}>
                            <td className="table__cell">{tr.id ? tr.id : null}</td>
                            <td className="table__cell">{tr.firstName ? tr.firstName : null}</td>
                            <td className="table__cell">{tr.lastName ? tr.lastName : null}</td>
                            <td className="table__cell">{tr.email ? tr.email : null}</td>
                            <td className="table__cell">{tr.phone ? tr.phone : null}</td>
                        </tr>
                    )
                })
            }
        </tbody>
    )
};

const ExtraInfo = ({personData}) => {
    if (Object.keys(personData).length) {
        
        return (
            <>
                {personData.map((elem, index) => 
                    <article className="person-info" key={index}>
                        <ul className="person-info__list">
                            <li className="person-info__item">
                                <p>Выбран пользователь <b>{elem.firstName ? elem.firstName : null} {elem.lastName ? elem.lastName : null}</b></p>
                            </li>
                            <li className="person-info__item">
                                <p>Описание:</p>
                                <p><i>{elem.description ? elem.description : null}</i></p>
                            </li>
                            <li className="person-info__item">
                                {<>
                                    <p>Адрес проживания: <b>{elem.address ? elem.address.streetAddress : null}</b></p>
                                    <p>Город: <b>{elem.address ? elem.address.city : null}</b></p>
                                    <p>Провинция: <b>{elem.address ? elem.address.state : null}</b></p>
                                    <p>Индекс: <b>{elem.address ? elem.address.zip : null}</b></p>
                                </>}
                            </li>
                        </ul>
                    </article>
                )}
            </>
        )
    }
    return null;
}

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialData: [],
            dataFull: [],
            dataOnPage: [],
            columns: TABLE_COLUMNS,
            pages: [],
            currentPage: 1,
            personInfo: []
        };
    }

    calculatePagesNumber = (data) => Array.from({length: Math.ceil(data.length / 50)}).map((num, i) => i + 1);

    async componentWillMount() {
        const {data} = this.props;
        const responsedData = this.loadData(data);
        responsedData.then((data) => {
            this.setState({
                initialData: data,
                dataFull: data,
                dataOnPage: data.slice(0, 50),
                pages: this.calculatePagesNumber(data)
            });
        });
    }

    async componentWillReceiveProps(nextProps) {
        const {data} = nextProps;
        const responsedData = this.loadData(data);
        responsedData.then((data) => {
            this.setState({
                initialData: data,
                dataFull: data,
                dataOnPage: data.slice(0, 50),
                pages: this.calculatePagesNumber(data)
            });
        });
    }

    async loadData(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Ошибка загрузки данных ${error}`);
        }
    }

    sortTable = (index, sort) => {
        const {dataFull, columns} = this.state;
        let currentSort = 'default';
        
        switch (sort) {
            case 'default':
                currentSort = 'asc';
                break;
            case 'asc':
                currentSort = 'desc';
                break;
            case 'desc':
                currentSort = 'asc';
                break;
            default:
                currentSort = 'asc';
                break;
        }
        const changeColumn = columns.map((it, i) => ({...it, sort: i === index ? currentSort : `default`}));
    
        const columnIndexToSortingKey = {
            0: `id`,
            1: `firstName`,
            2: `lastName`,
            3: `email`,
            4: `phone`
        }

        const sortData = (sortMethod) => {
            if (sortMethod === `desc`) {
                return dataFull.sort((a, b) => a[columnIndexToSortingKey[index]] < b[columnIndexToSortingKey[index]] ? 1 : 
                                              a[columnIndexToSortingKey[index]] > b[columnIndexToSortingKey[index]] ? -1 : 0);
            }
            return dataFull.sort((a, b) => a[columnIndexToSortingKey[index]] > b[columnIndexToSortingKey[index]] ? 1 : 
                                              a[columnIndexToSortingKey[index]] < b[columnIndexToSortingKey[index]] ? -1 : 0);
        }

        this.setState({
            dataFull: sortData(currentSort),
            dataOnPage: this.state.dataFull.slice((this.state.currentPage - 1) * 50, (this.state.currentPage - 1) * 50 + 50),
            columns: changeColumn
        });

        return currentSort;
    }

    changePage = (e) => {
        this.setState({
            dataOnPage: this.state.dataFull.slice((e.target.value - 1) * 50, (e.target.value - 1) * 50 + 50),
            currentPage: e.target.value
        });
    }

    getPersonInfo = (e) => {
        const personId = e.currentTarget.firstChild.textContent;
        this.setState({
            personInfo: this.state.dataFull.filter((it) => +it.id === +personId)
        })
    }

    onSearch = (request) => {

        if (request.length) {

            const filteredData = this.state.dataFull.filter((it) => {
                const checkList = [];
                for (let key in it) {
                    if (it[key].toString().toLowerCase().includes(request.toLowerCase()) && key !== `address` && key !== `description`) {
                        checkList.push(true);
                    };
                }
                return checkList.some((it) => it === true);
            });
            
            if (filteredData.length) {
                this.setState({
                    dataFull: filteredData,
                    dataOnPage: filteredData.slice((this.state.currentPage - 1) * 50, (this.state.currentPage - 1) * 50 + 50),
                    pages: this.calculatePagesNumber(filteredData)
                });

            } else {
                this.setState({
                    dataFull: this.state.initialData,
                    dataOnPage: [{searchError: `Ничего не найдено`}],
                    pages: []
                })
            }
        } else {
            this.setState({
                dataFull: this.state.initialData,
                dataOnPage: this.state.initialData.slice((this.state.currentPage - 1) * 50, (this.state.currentPage - 1) * 50 + 50),
                pages: this.calculatePagesNumber(this.state.initialData)
            });
        }
    }

    render() {
        const {changeData} = this.props;
        return (
            <> 
                <div className="search-block">
                    <div className="data-changer">
                        <button className="data-changer__button" value="small-data" onClick={(e) => {
                            this.setState({dataOnPage: [], personInfo: []});
                            changeData(e);
                        }}>Загрузить малую базу</button>
                        <button className="data-changer__button" value="big-data" onClick={(e) => {
                            this.setState({dataOnPage: [], personInfo: []});
                            changeData(e);
                        }}>Загрузить большую базу</button>
                    </div>
                    <Search onSearch={this.onSearch} />
                </div>
                <table className="table">
                    <TableHeader columns={this.state.columns} onClickColumnTitle={this.sortTable} />
                    <TableBody data={this.state.dataOnPage} onClickRow={this.getPersonInfo} />
                </table>
                <Paginator pages={this.state.pages} onClickPage={this.changePage} />
                <ExtraInfo personData={this.state.personInfo} />
            </> 
        );
    }
}
  
export default Table;
