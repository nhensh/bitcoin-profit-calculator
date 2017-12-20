import React, { Component } from 'react';
import moment from 'moment';
import './InfoBox.css';

class InfoBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPrice: null,
      monthChangeD: null,
      monthChangeP: null,
      updatedAt: null
    }
  }
  componentDidMount(){
    this.getData = () => {
      const {data} = this.props;
      const url = 'https://api.coindesk.com/v1/bpi/currentprice.json';

      fetch(url).then(r => r.json())
        .then((bitcoinData) => {
          const price = bitcoinData.bpi.USD.rate_float;
          const change = price - data[0].y;
          const changeP = (price - data[0].y) / data[0].y * 100;

          this.setState({
            currentPrice: bitcoinData.bpi.GBP.rate_float,
            monthChangeD: change.toLocaleString('us-EN',{ style: 'currency', currency: 'GBP' }),
            monthChangeP: changeP.toFixed(2) + '%',
            updatedAt: bitcoinData.time.updated
          })
        })
        .catch((e) => {
          console.log(e);
        });
    }
    this.getData();
    this.refresh = setInterval(() => this.getData(), 90000);
  }
  componentWillUnmount(){
    clearInterval(this.refresh);
  }
  render(){
    const totalAmountAtDate = this.props.data[0].y * this.props.amountPurchased;
    const totalAmountNow = this.state.currentPrice * this.props.amountPurchased;
    const totalProfit = totalAmountNow - totalAmountAtDate;
    return (
      <div id="data-container">
        <div id="left" className='box'>
          <div className="subtext">Price At Purchase Date</div>
          <div className="heading">{this.props.data[0].y.toLocaleString('us-EN',{ style: 'currency', currency: 'GBP' })}</div>
          <div className="subtext">{this.props.data[0].d}</div>
          <br />
          <div className="subtext">Total Price At Purchase Date</div>
          <div className="heading">{totalAmountAtDate.toLocaleString('us-EN',{ style: 'currency', currency: 'GBP' })}</div>
          <div className="subtext">{this.props.data[0].d}</div>
        </div>
        { this.state.currentPrice ?
          <div id="middle" className='box'>
            <div className="subtext">Current Price</div>
            <div className="heading">{this.state.currentPrice.toLocaleString('us-EN',{ style: 'currency', currency: 'GBP' })}</div>
            <div className="subtext">{'Updated ' + moment(this.state.updatedAt).fromNow()}</div>
            <br />
            <div className="subtext">Total At Current Price</div>
            <div className="heading">{totalAmountNow.toLocaleString('us-EN',{ style: 'currency', currency: 'GBP' })}</div>
            <div className="subtext">{'Updated ' + moment(this.state.updatedAt ).fromNow()}</div>
          </div>
        : null}
        <div id="right" className='box'>
          <div className="subtext">Ammount Purchased</div>
          <div className="heading">{this.props.amountPurchased}</div>
          <div className="subtext">{'On ' + this.props.data[0].d}</div>
          <br />
          <div className="subtext">Total Profit</div>
          <div className="heading">{totalProfit.toLocaleString('us-EN',{ style: 'currency', currency: 'GBP' })}</div>
        </div>

      </div>
    );
  }
}

export default InfoBox;
