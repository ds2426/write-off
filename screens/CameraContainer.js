import React, { Component } from 'react';
import Scan from './scan';
import config from '../config';
class CameraContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            camera: false,
            cameraResult: false,
            result: null,
            visionResponse: '',
            loading: false,
            googleVisionDetetion: undefined
        };
    }

    takePicture = async (value) => {
        if (value) {
            const options = { quality: 0.5, base64: true };
            const data = await value.takePictureAsync(options);
            this.setState({
                cameraResult: true,
                result: data.base64,
                camera: false
            }, () =>
            this.callGoogleVIsionApi(this.state.result))
            this.setState({ loading: true });
        }
    };
    callGoogleVIsionApi = async (base64) => {
        let googleVisionRes = await fetch(config.googleCloud.api + config.googleCloud.apiKey, {
            method: 'POST',
            body: JSON.stringify({
                "requests": [
                    {
                        "image": {
                            "content": base64
                        },
                        features: [
                            { type: "TEXT_DETECTION", maxResults: 10 },
                            { type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 },
                            
                        ],
                    }
                ]
            })
        });

        await googleVisionRes.json()
            .then(googleVisionRes => {
                
                if (googleVisionRes) {
                    this.setState(
                        {
                            loading: false,
                            googleVisionDetetion: googleVisionRes.responses[0].fullTextAnnotation
                        }
                    )
                    console.log('the response', this.state.googleVisionDetetion);
                }
            }).catch((error) => { console.log(error) })
    }
    activeCamera = () => {
        this.setState({
            camera: true
        })
    }
    clickAgain = () => {
        this.setState({
            camera: true,
            googleVisionDetetion: false,
            loading: false
        })
    }
    render() {
        const { camera, cameraResult, result, googleVisionDetetion, loading } = this.state
        return (
            <Scan
                camera={camera}
                cameraResult={cameraResult}
                result={result}
                clickAgain={this.clickAgain}
                takePicture={(value) => this.takePicture(value)}
                activeCamera={this.activeCamera}
                googleVisionDetetion={googleVisionDetetion}
                loading={loading}
            />
        );
    }
}

export default CameraContainer;