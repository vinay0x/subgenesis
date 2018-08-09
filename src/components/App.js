import '../assets/css/App.css';
import React, { Component } from 'react';
import ReactDropzone from 'react-dropzone';
import { BounceLoader } from 'react-spinners';
import Promise from 'bluebird'

class App extends React.Component {
  constructor(props){
  	super(props)
  	this.state = {
  		loading: false,
  		files: [],
  		succeeded: [],
  		failed: []
  	}
  }
  async onDrop(files){
    this.setState({
      loading: true 
    })
    const promises = {}
    files.forEach(file => {
      promises[file.name] = (window.global.download(file.path))
    })
    console.log(promises)
    const result = await Promise.props(promises)
    this.setState({
      loading: false 
    })
  }
  render() {
    return (
      <React.Fragment>
        <div class="invisible"></div>
        	{
            this.state.loading ? <div class="loading-container">
              <BounceLoader
                size={120}
                color={'#0199db'} 
                loading={this.state.loading} 
              />
            </div>: 
            <ReactDropzone
          		className="downloader"
          		acceptClassName="downloader accept"
              rejectClassName="downloader reject"
  	        	onDrop={(files)=> files.length >0 && this.onDrop(files)}
              accept="video/*"
  	        >+
          	</ReactDropzone>
          }
          <h6>Drop a movie!</h6>
      </React.Fragment>
    );
  }
}

export default App;
