import React, { Component } from 'react';

import { range } from 'lodash';
import CarsList from './CarsList';
import { fetchFiltredCars, turnOffHomefilter } from '../../actions'
import { connect } from 'react-redux';
import $ from 'jquery';


class CarsContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            pageSize: 6,
            displayType: 'cards',
            fetchedCars: props.fetchedCars,
            renderedCars :{},
            buttonSearchClicked: false,
            condition: '',
            body: '',
            make: '',
            model: '',
            year: '',
            transition: '',
            priceRange: '$60,000 - $130,000'
        };
        this.setCarCondition = this.setCarCondition.bind(this);
        this.setCarBody = this.setCarBody.bind(this);
        this.setCarMake = this.setCarMake.bind(this);
        this.setCarYear = this.setCarYear.bind(this);
        this.setCarTransition = this.setCarTransition.bind(this);
        this.renderCars = this.renderCars.bind(this);
    }

    buttonSearchClicked() {

        if (this.state !== null) {
            var { condition, body, make, model, year, transition, priceRange } = this.state;
            var filter = {};
            priceRange = $("#priceslider").val();
            
            filter = { condition, body, make, model, year, transition, priceRange };
            this.props.fetchFiltredCars(filter);

            this.setState({priceRange});
            
            
        }
        this.setState({buttonSearchClicked : true});
        this.props.turnOffHomefilter();
        
    }

    setCarCondition(event) {
        this.setState({ condition: event.target.id });
    }
    setCarBody(event) {
        this.setState({ body: event.target.id });
    }
    setCarMake(event) {
        this.setState({ make: event.target.id });
    }
    setCarYear(event) {
        this.setState({ year: event.target.id });
    }
    setCarTransition(event) {
        this.setState({ transition: event.target.id });
    }

    setActivePage(activePage) {
        this.setState({ activePage: activePage });
    }
    setPageSize(size) {
        this.setState({ activePage: 1, pageSize: size });
    }
    setDisplayType(displayType) {
        this.setState({ displayType });
    }

    getallCars() {
        this.props.fetchFiltredCars({});
    }
    viewAllCars(){
        this.setState({buttonSearchClicked : false});
        this.setState({fetchedCars : {}});
        this.setState({priceRange: '$60,000 - $130,000'});
        if(!this.state.buttonSearchClicked)this.props.turnOffHomefilter();
    }

    renderCars() {
        var {buttonSearchClicked, pageSize, activePage, displayType} = this.state;
        var {fetchedCars, carsList, homefilterActivated }=this.props;
        var cars = fetchedCars.length !== 0 ? fetchedCars : carsList;
        
        /**this condition is if the user search for something from the  search button in car cntainer and no results are found 
         * or enters to car listing throught the home search button and no results found */
        if (fetchedCars.length === 0 && (buttonSearchClicked  || homefilterActivated)) {
            return <div className="banner-item banner-2x no-bg ">
                <h2 className="f-weight-300"><i className="fa fa-search m-r-lg-10"> </i>No RESULTS</h2>
                <a className="ht-btn ht-btn-default ht-btn-2x m-t-lg-35" onClick={()=>this.viewAllCars()}>
                    View all cars
                        </a>
            </div>;
        }
        else {
            return <CarsList displayType={displayType} carslist={cars.slice((activePage - 1) * pageSize, (activePage - 1) * pageSize + pageSize)} />
        }
    }

    render() {
        var {fetchedCars, carsList, filters, homefilterActivated}= this.props;
        var {pageSize, buttonSearchClicked}= this.state;
        const { condition, body, make, year, transition, priceRange } = filters;
        var cars = fetchedCars.length !== 0 ? fetchedCars : carsList;
        /**cars list will be empty if a search returns no result */
        if(fetchedCars.length === 0 && buttonSearchClicked) cars= {} ;
        /**returns a number to know the number of pages */
        const table = range(1, Math.ceil(cars.length / pageSize) + 1, 1);
        
 
        /**if I am in cars container And I was in home containers , and I already had a filter then the slider should follow the previous slider 
         *  filter that was setted in state */
        if (!homefilterActivated && buttonSearchClicked) {
            var priceIntervall=this.state.priceRange;
            var min = 1000 * priceIntervall.slice(1, priceIntervall.indexOf(","));
            var max = 1000 * priceIntervall.slice(priceIntervall.indexOf("-") + 3, priceIntervall.indexOf(",", priceIntervall.indexOf("-")));
            window.reRenderRangeSliderOther(min, max);
        }
        /**If I was in cars containers and I did not changed yet the slider in cars container then the slider should be as in filters */
        if (homefilterActivated && !buttonSearchClicked) {
             min = 1000 * priceRange.slice(1, priceRange.indexOf(","));
             max = 1000 * priceRange.slice(priceRange.indexOf("-") + 3, priceRange.indexOf(",", priceRange.indexOf("-")));
            window.reRenderRangeSliderOther(min, max);
        }else if (!buttonSearchClicked){window.reRenderRangeSlider()}

        return (
            <section className="m-t-lg-30 m-t-xs-0">
                <div className="row">
                    <div className="col-sm-5 col-md-4 col-lg-3">
                        <div className="search-option m-b-lg-50 p-lg-20">
                            <div className="select-wrapper m-b-lg-15">
                                <div className="dropdown">
                                    <button className="dropdown-toggle form-item" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        {(filters !== undefined && condition !== undefined && condition !== ''  &&  homefilterActivated) ? condition.toUpperCase() : 'Condition'}
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                                        <li id="" onClick={this.setCarCondition}>Any State</li>
                                        <li id="new" onClick={this.setCarCondition}>New Cars</li>
                                        <li id="used" onClick={this.setCarCondition} >Used Cars</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="select-wrapper m-b-lg-15">
                                <div className="dropdown">
                                    <button className="dropdown-toggle form-item" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        {filters !== undefined && body !== undefined && body !== '' ? body.toUpperCase() : 'Body'}
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                        <li id="" onClick={this.setCarBody} >Any Body</li>
                                        <li id="sedan" onClick={this.setCarBody} >Sedan</li>
                                        <li id="suv" onClick={this.setCarBody}>SUV</li>
                                        <li id="truck" onClick={this.setCarBody}>Truck</li>
                                        <li id="coupe" onClick={this.setCarBody}>Coupe</li>
                                        <li id="minivan" onClick={this.setCarBody}>Minivan</li>
                                        <li id="compact" onClick={this.setCarBody}>Compact</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="select-wrapper m-b-lg-15">
                                <div className="dropdown">
                                    <button className="dropdown-toggle form-item" type="button" id="dropdownMenu3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        {filters !== undefined && make !== undefined && make !== '' ? make.toUpperCase() : 'Make'}
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenu3">
                                        <li id="" onClick={this.setCarMake} >Any Car Make</li>
                                        <li id="ford" onClick={this.setCarMake} >Ford</li>
                                        <li id="huyndai" onClick={this.setCarMake}>Huyndai</li>
                                        <li id="nissan" onClick={this.setCarMake}>Nissan</li>
                                        <li id="chevrolet" onClick={this.setCarMake}>Chevrolet</li>
                                        <li id="kia" onClick={this.setCarMake}>Kia</li>
                                        <li id="mazda" onClick={this.setCarMake}>Mazda</li>
                                        <li id="bmw" onClick={this.setCarMake}>BMW</li>
                                        <li id="toyota" onClick={this.setCarMake}>Toyota</li>
                                        <li id="mercedes" onClick={this.setCarMake}>Mercedes Benz</li>
                                        <li id="ford" onClick={this.setCarMake}>FOrd</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="select-wrapper m-b-lg-15">
                                <div className="dropdown">
                                    <button className="dropdown-toggle form-item" type="button" id="dropdownMenu5" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        {filters !== undefined && year !== undefined && year !== '' ? year.toUpperCase() : 'Year'}
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenu5">
                                        <li id="" onClick={this.setCarYear}>Any Year</li>
                                        <li id="2016" onClick={this.setCarYear}>2016</li>
                                        <li id="2015" onClick={this.setCarYear}>2015</li>
                                        <li id="2014" onClick={this.setCarYear}>2014</li>
                                        <li id="2013" onClick={this.setCarYear}>2013</li>
                                        <li id="2012" onClick={this.setCarYear}>2012</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="select-wrapper m-b-lg-15">
                                <div className="dropdown">
                                    <button className="dropdown-toggle form-item" type="button" id="dropdownMenu6" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        {filters !== undefined && transition !== undefined && transition !== '' ? transition.toUpperCase() : 'Tranmission'}
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenu6">
                                        <li id="" onClick={this.setCarTransition}>Any Type</li>
                                        <li id="automatic" onClick={this.setCarTransition}>Automatic</li>
                                        <li id="manual" onClick={this.setCarTransition}>Manual</li>
                                        <li id="semi_automatic" onClick={this.setCarTransition}>Semi-automatic</li>
                                    </ul>
                                </div>
                            </div>
                            <input id="priceslider" type="text" disabled className="slider_amount m-t-lg-10" value={priceRange!==undefined && homefilterActivated ? priceRange : this.state.priceRange} />
                            <div id="spanrange" className="slider-range"></div>
                            <button type="button" className="ht-btn ht-btn-default m-t-lg-30" onClick={() => this.buttonSearchClicked()}><i className="fa fa-search"></i>Search Now</button>
                        </div>
                        <div className="clearfix"></div>
                        <div className="banner-item banner-bg-4 banner-1x color-inher">
                            <h5>Lorem ipsum dolor</h5>
                            <h3 className="f-weight-300"><strong>Interior</strong> Accessories</h3>
                            <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel</p>
                            <a className="ht-btn ht-btn-default">Shop now</a>
                        </div>
                    </div>
                    <div className="col-sm-7 col-md-8 col-lg-9">
                        <div className="product product-grid product-grid-2 car">
                            <div className="heading heading-2 m-b-lg-0">
                                <h3 className="p-l-lg-20">Cars ({cars.length})</h3>
                            </div>
                            <div className="product-filter p-t-xs-20 p-l-xs-20">
                                <div className="m-b-xs-10 pull-left">
                                    <a onClick={() => this.setDisplayType('cards')} className={this.state.displayType === 'cards' ? 'active' : ''}>
                                        <i className="fa fa-th" />
                                    </a>
                                    <a onClick={() => this.setDisplayType('list')} className={this.state.displayType === 'list' ? 'active' : ''}>
                                        <i className="fa fa-th-list" />
                                    </a>
                                </div>
                                <div className="pull-right">
                                    <div className="pull-left">
                                        <div className="select-wrapper">
                                        <label>
                                            <i className="fa fa-sort-alpha-asc" />Show :{" "}
                                        </label>
                                        <div className="dropdown pull-left">
                                            <button className="dropdown-toggle form-item w-80" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            {this.state.pageSize}
                                            </button>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                            <li>
                                                <a onClick={() => this.setPageSize(4)}>4</a>
                                            </li>
                                            <li>
                                                <a onClick={() => this.setPageSize(6)}>6</a>
                                            </li>
                                            <li>
                                                <a
                                                onClick={() =>
                                                    this.setPageSize(
                                                        cars.length
                                                    )}
                                                >
                                                All
                                                </a>
                                            </li>
                                            </ul>
                                        </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="clearfix"></div>
                            <div className="row">
                                {this.renderCars()}
                            </div>
                            <nav aria-label="Page navigation">
                                <ul className="pagination ht-pagination">
                                    <li>
                                        <a aria-label="Previous" style={this.state.activePage === 1 || cars.length !==0 ? { display: 'none' } : { display: 'block' }}>
                                            <span aria-hidden="true" >
                                                <i className="fa fa-chevron-left" onClick={() => { this.setActivePage(this.state.activePage - 1) }} />
                                            </span>
                                        </a>
                                    </li>
                                    {table.map(i => {
                                        if(table.length<=1) return ''
                                        else{
                                            return <li key={i} className={this.state.activePage === i ? "active" : ""}>
                                                    <a onClick={() => { this.setActivePage(i) }}>{i}</a>
                                                </li>;
                                        }
                                        
                                    })}
                                    <li>
                                        <a aria-label="Next" style={this.state.activePage === Math.ceil(cars.length / this.state.pageSize) || cars.length !==0  ? { display: 'none' } : { display: 'block' }}>
                                            <span aria-hidden="true">
                                                <i className="fa fa-chevron-right" onClick={() => { this.setActivePage(this.state.activePage + 1) }} />
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>


        );
    }
}
/**fetchedCars is the reducer state for the cars fetched from the API ,
 *  and homefilterActivated is to know if the user entred this page throught the home filter or not */
function mapStateToProps({ fetchedCars, homefilterActivated }) {
    return { fetchedCars, homefilterActivated };
}

export default connect(mapStateToProps, { fetchFiltredCars, turnOffHomefilter })(CarsContainer);