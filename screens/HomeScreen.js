import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import RNTesseractOcr from 'react-native-tesseract-ocr';

class HomeScreen extends Component {
  state = { zoomValue: 0, flashMode: RNCamera.Constants.FlashMode.off, ocrResult: null };

  static navigationOptions = {
    header: null,
  };

  render() {
  
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={this.state.flashMode}
          autoFocus={RNCamera.Constants.AutoFocus.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          zoom={this.state.zoomValue}
        >
            <View>
            <Text  onPress={this.takePicture} style={styles.icon}>take picture</Text>
          </View>
        </RNCamera>
      </View>
    );
  }
  flash = () => {
    if (this.state.flashMode == RNCamera.Constants.FlashMode.off) {
      this.setState({ flashMode: RNCamera.Constants.FlashMode.torch });
    } else this.setState({ flashMode: RNCamera.Constants.FlashMode.off });
  };
  takePicture = async () => {
    
    try {
     
      
      const options = {
        quality: 0.8
      };
      const tessOptions = {
        whitelist: null, 
        blacklist: '1234567890\'!"#$%&/()={}[]+*-_:;<>'
      };
      const { uri } = await this.camera.takePictureAsync(options);
      console.log(uri)
      //const visionResp = await RNTextDetector.detectFromUri(uri);
      RNTesseractOcr.recognize(uri, 'LANG_ENGLISH', tessOptions)
                    .then((result) => {
                        this.setState({ ocrResult: result });
                        console.log("OCR Result: ", result);
                    })
                    .catch((err) => {
                        console.log("OCR Error: ", err);
                    })
                    .done();
    } catch (e) {
      console.warn(e);
    }
    
  };
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    height: '100%',
  },
  icon: {
    flex: 0,
    color: 'white',
    fontSize: 40,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  spinnerStyle: {
    flex: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    alignSelf: 'flex-start',
  },
});