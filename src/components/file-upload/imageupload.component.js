import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios'

class ImageUploader extends Component {
  constructor() {
    super();
    this.onDrop = (files) => {
      this.setState({files})
    };
    this.state = {
      files: []
    };
  }

  

  render() {
    
    const files = this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));

    return (
      <Dropzone onDrop={this.onDrop}>
        {({getRootProps, getInputProps}) => (
          <section className="container">
            <div {...getRootProps({className: 'dropzone'})}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop image here, or click to select image file</p>
            </div>  
            <aside>
              <ul>{files}</ul>
            </aside>
            
          </section>
        
        )}
        
      </Dropzone>
    );
  }
}

export default ImageUploader