import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = (props) => {
    console.log('FaceRecognition component');
    // console.log(props.faceLocation);
    const box = props.faceLocation;
    console.log(box);
    return (
        <div className='center'>
            <div className='absolute mt2'>
                <img id='inputImage' src={props.imageUrl} alt='' width='500px' height='auto'/>
                <div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div> 
            </div>
        </div>
    );
}

export default FaceRecognition;