import '../assets/css/App.css';
import React, { Component } from 'react';
import ReactDropzone from 'react-dropzone';
import { BounceLoader } from 'react-spinners';
import Promise from 'bluebird'
import animationData from '../assets/animations/success.json'
import Lottie from 'react-lottie'
import fs from 'bro-fs'

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

class App extends React.Component {
  constructor(props){
  	super(props)
  	this.state = {
  		loading: false,
      complete: false,
  		files: [],
  		succeeded: [],
  		failed: []
  	}
  }

  addToSucceeded(fileName){
    this.setState({
      succeeded : this.state.succeeded.concat(fileName)
    })
  }

  addToFailed(fileName){
    this.setState({
      failed : this.state.failed.concat(fileName)
    })
  }

  clearArrays(){
    this.setState({
      failed : [],
      succeeded: []
    })
  }
  async onDrop(files){
    this.setState({
      loading: true 
    })
    this.clearArrays()
    for(const file of files){
      const result = await window.global.download(file.path)
      if(result!==null) this.addToSucceeded(file.name)
      else this.addToFailed(file.name)
    }
    this.setState({
      loading: false 
    })
    this.setState({
      complete: true
    })
  }
  render() {
    const defaultOptions = {
      loop: false,
      autoplay: true, 
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    }
    const {succeeded, failed} = this.state
    const succeededNumber = succeeded.length
    const failedNumber = failed.length
    return (
      <React.Fragment>
        <div class="invisible"></div>
          	{
              this.state.loading && 
              <div class="loading-container">
                <BounceLoader
                  size={120}
                  color={'#0199db'} 
                  loading={this.state.loading} 
                />
              </div>
            }
            { this.state.complete &&
              <div class="loading-container">
              <Lottie options={defaultOptions}
                height={120}
                width={120}
                eventListeners={[{
                  eventName: 'complete',
                  callback: ()=> setTimeout(this.setState({complete:false}), 2000)
                }]}
                />
              </div>  
            }
           
          {!this.state.loading && !this.state.complete && <ReactDropzone
          		className="downloader"
          		acceptClassName="downloader accept"
              rejectClassName="downloader reject"
              accept="video/*"
  	        	onDrop={(files)=> this.onDrop(files)}
  	        >+
          	</ReactDropzone>
          }
          <h6>{this.state.loading ? 'Hang tight!' : 'Drop a movie or a folder!'}!</h6>
          {(succeededNumber + failedNumber > 1) && 
            <div class="count">
              {succeededNumber > 0 && <React.Fragment>{succeededNumber}<img class="icons" src={require('../assets/img/success.png')} /> </React.Fragment>}
              {failedNumber > 0 && <React.Fragment>{failedNumber}<img class="icons" src={require('../assets/img/failure.png')} /> </React.Fragment>}
            </div>
          }
      </React.Fragment>
    );
  }
}

export default App;
