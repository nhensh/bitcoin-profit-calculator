import React, { Component } from 'react'
import moment from 'moment'
import './App.css'
import LineChart from './LineChart'
import ToolTip from './ToolTip'
import InfoBox from './InfoBox'
import DatePicker from 'react-date-picker'
import NumericInput from 'react-numeric-input'
import ContainerDimensions from 'react-container-dimensions'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true,
      amountPurchased: 1,
      purchasedDate: moment(new Date('03/10/2017')).format('YYYY-MM-DD'),
      currentDate: moment(new Date()).format('YYYY-MM-DD'),
      data: null,
      hoverLoc: null,
      activePoint: null
    }
  }

  handleChartHover(hoverLoc, activePoint){
    this.setState({
      hoverLoc: hoverLoc,
      activePoint: activePoint
    })
  }

  componentDidMount(){
    this.getData(this.state.purchasedDate, this.state.currentDate);
  }

  getData = (start, end, value) => {
    const url = `http://api.coindesk.com/v1/bpi/historical/close.json?start=${start}&end=${end}&currency=GBP`;

    fetch(url).then( r => r.json())
      .then((bitcoinData) => {
        const sortedData = [];
        let count = 0;
        for (let date in bitcoinData.bpi){
          sortedData.push({
            d: moment(date).format('DD MMM YYYY'),
            p: bitcoinData.bpi[date].toLocaleString('us-EN',{ style: 'currency', currency: 'GPB' }),
            x: count, //previous days
            y: bitcoinData.bpi[date] // numerical price
          });
          count++;
        }
        this.setState({
          data: sortedData,
          fetchingData: false
        })
      })
      .catch((e) => {
        console.log(e);
      });
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value
    }, function() {
      this.getData(this.state.purchasedDate, this.state.currentDate, value);
    });
  }

  render() {

    return (

      <div className='container'>
        <div className='row'>
          <h1>Bitcoin Price Calculator</h1>
        </div>
        <div className='row'>
          <div className='box'>
            <p>Purchased Date: </p>
            <DatePicker
              onChange={value => this.onChange('purchasedDate', moment(value).format('YYYY-MM-DD'))}
              value={this.state.purchasedDate} />
          </div>
          <div className='box'>
            <p>Amount Purchased:</p>
            <NumericInput
              step={0.00100}
              precision={5}
              onChange={value => this.onChange('amountPurchased', value)}
              value={this.state.amountPurchased} />
          </div>
        </div>
        <div className='row'>
          { !this.state.fetchingData ?
          <InfoBox data={this.state.data} amountPurchased={this.state.amountPurchased} />
          : null }
        </div>
        <div className='row'>
          <div className='popup'>
            {this.state.hoverLoc ? <ToolTip hoverLoc={this.state.hoverLoc} activePoint={this.state.activePoint}/> : null}
          </div>
        </div>
        <div className='row'>
          <div className='chart'>
            { !this.state.fetchingData ?
            <ContainerDimensions>
              { ({ width, height }) =>
                <LineChart
                  data={this.state.data}
                  svgWidth={width}
                  svgHeight={300}
                  onChartHover={ (a,b) => this.handleChartHover(a,b) } />
              }
            </ContainerDimensions>
          : null }
          </div>
        </div>
        <div className='row'>
          <div id="coindesk"> Powered by <a href="http://www.coindesk.com/price/" target="_blank">CoinDesk</a></div>
        </div>
      </div>

    );
  }
}

export default App;
