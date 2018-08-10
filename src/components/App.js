import '../assets/css/ReactToastify.css'
import '../assets/css/App.css'
import React, { Component } from 'react'
import ReactDropzone from 'react-dropzone'
import { BounceLoader } from 'react-spinners'
import Promise from 'bluebird'
import animationData from '../assets/animations/success.json'
import Lottie from 'react-lottie'
import { ToastContainer, toast } from 'react-toastify'
import { Slide } from 'react-toastify';

import '../util/index.js'
const { download, recursive, path, isVideo, isDirectory } = window.global

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


  async downloadSubtitle(filePath){
    let result = await download(filePath)
    if(result!==null) this.addToSucceeded(filePath)
    else this.addToFailed(filePath)
    return result
  }
  async onDrop(files){
    this.setState({
      loading: true 
    })
    this.clearArrays()
    for(const file of files){
      let result = null
      if(isDirectory(file.path)){
        const files = await recursive(file.path)
        for(const file of files){
          if(isVideo(file)) await this.downloadSubtitle(file)
        }
      }
      else{
        await this.downloadSubtitle(file.path)
      }
    }
    this.setState({
      loading: false 
    })
    this.setState({
      complete: true
    })
    toast.info(`Downloaded ${this.state.succeeded.length} subtitles!`)
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
    return (
      <React.Fragment>
        <ToastContainer 
          transition={Slide}
          toastClassName="toast"
          autoClose={3000} 
          position="bottom-right"
        />
        <div className="invisible"></div>
          	{
              this.state.loading && 
              <div className="loading-container">
                <BounceLoader
                  size={120}
                  color={'#0199db'} 
                  loading={this.state.loading} 
                />
              </div>
            }
            { this.state.complete &&
              <div className="loading-container">
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
  	        	onDrop={(files)=> {
                if(files.some(file => isVideo(file.path) || isDirectory(file.path) ))
                  this.onDrop(files)
              }}
  	        >+
          	</ReactDropzone>
          }
          <div className="info-box">
            <h6>{this.state.loading ? 'Hang tight!' : 'Drop a movie or a folder'}</h6>
          </div>
      </React.Fragment>
    )
  }
}

export default App
