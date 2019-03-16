import React, { Component } from 'react';
import MaterialIcon, { colorPalette } from 'material-icons-react';

export default class Indicator extends Component {

  state = {
    loading: true,
    hasPassed: false,
    flutter: 0,
    react: 0,
    diff: 0,
  }

  fetchFlutterStars = async () => {
    const res = await fetch('https://api.github.com/repos/flutter/flutter')
    if (res.ok) {
      const json = await res.json();
      return json.stargazers_count;
    }
    throw new Error('Ooops! Error encountered 💀')
  }

  fetchRNStars = async () => {
    const res = await fetch('https://api.github.com/repos/facebook/react-native')
    if (res.ok) {
      const json = await res.json();
      return json.stargazers_count;
    }
    throw new Error('Ooops! Error encountered 💀')
  }

  refetch = async () => {
    this.setState({ loading: true })
    const flutter = await this.fetchFlutterStars();
    const react = await this.fetchRNStars();
    const hasPassed = Number(flutter) > Number(react);
    const diff = Number(react) - Number(flutter);
    this.setState({ flutter, react, diff, hasPassed, loading: false });
  }

  onRefresh = async () => await this.refetch()

  numberFormatter = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  componentDidMount = async () => {
    await this.refetch();
  }

  render() {
    const { flutter, react, diff, hasPassed, loading } = this.state;
    if (!flutter) return <div>loading..</div>
    return (
      <div id="indicator">
        <div id="result">
          <p>Has Flutter passed React Native yet ?</p>
          <h1>{`${hasPassed ? 'YES' : 'NOPE'}`}</h1>
          <p>{`${hasPassed ? 'Ahead' : 'Behind'}`} by {this.numberFormatter(Math.abs(diff))} stars!</p>
        </div>
        <div id="links">
          <div id="refresher" onClick={this.onRefresh}>
            <div className={loading ? 'loading' : ''}>
              <MaterialIcon icon="refresh" size={22} color="#333" />
            </div>
          </div>
          <a target="_blank" href="https://github.com/flutter/flutter">
            <div className="sdk">
              <div className="img">
                <img src={require('./flutter-sdk.png')} alt="" />
              </div>
              <p>{this.numberFormatter(flutter)}</p>
              <MaterialIcon icon="star" size={18} color="#333" />
            </div>
          </a>
          <a target="_blank" href="https://github.com/facebook/react-native">
            <div className="sdk">
              <div className="img">
                <img src={require('./react-native.png')} alt="" />
              </div>
              <p>{this.numberFormatter(react)}</p>
              <MaterialIcon icon="star" size={18} color="#333" />
            </div>
          </a>
        </div>
      </div>
    )
  }
}
