import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import 'tachyons';
import Particles from 'react-particles-js';
import SignInForm from './components/SignInForm/SignInForm';
import Register from './components/Register/Register'



const particleOptions = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imgUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
}
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,   
    }})
  }

  handleInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  calculateFaceLocation = (data) => {

    const clarifaiBox = data.outputs[0].data.regions[0].region_info.bounding_box;
    const img = document.getElementById('inputImage');
    const imgHeight = Number(img.height);
    const imgWidth = Number(img.width);
    const leftCol =  clarifaiBox.left_col * imgWidth;
    const rightCol = imgWidth - (clarifaiBox.right_col * imgWidth);
    const topRow = imgHeight * clarifaiBox.top_row;
    const bottomRow = imgHeight - (imgHeight * clarifaiBox.bottom_row);


    // console.log('CalculateFaceLocation: ',[leftCol, rightCol, topRow, bottomRow]);
    return {
      leftCol:  leftCol,
      rightCol: rightCol,
      topRow: topRow,
      bottomRow: bottomRow,
    };
  }

  displayFaceBox = (faceBoxData) => {
    this.setState({box: faceBoxData});
  }

  clarifaiPredict = () => {
    fetch('https://stark-badlands-31973.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json()) 
      .then(response => {
        if (response) {
          fetch('https://stark-badlands-31973.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log)
        }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(`Something happened: ${err.statusText}`));
  }

  handleSubmitChange = () => {
    this.setState({imgUrl: this.state.input}); 
    this.clarifaiPredict();
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
}

  render() {
    const { route, imgUrl, isSignedIn, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particleOptions}/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        {
          route === 'home' 
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm  
                handleInput={this.handleInputChange}
                handleClick={this.handleSubmitChange}/>
              <FaceRecognition imageUrl={imgUrl} faceLocation={box}/>
            </div> 
          : (route === 'register' 
              ? <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
              : <SignInForm onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
          )
        }
      </div>
    );
  }

  // componentDidMount () {
  //   fetch('https://stark-badlands-31973.herokuapp.com/', {
  //         method: 'GET',
  //         })
  //         .then(response => response.json())
  //         .then(console.log);
  // }
}

export default App;
