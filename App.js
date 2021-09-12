import React, {Component} from "react";
import {View, Text, Image, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import { color } from "react-native-elements/dist/helpers";
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from "react-native-image-picker";
import Tflite from 'tflite-react-native';


let tflite = new Tflite();
var modelfile  =  'models/model_unquant.tflite';
var labelsfile =  'models/labels.txt';


export default class App extends Component{

    constructor(props){
        super(props);
        this.state = {
            recognition : null,
            source : null
        };
        tflite.loadModel({model:modelfile,labels:labelsfile},(err,res) => {
            if(err) console.log(err);
            else console.log(res);
        });
    }


    selectGalleryImage() {
        const option = {};
        ImagePicker.launchImageLibrary(option,(response) => {
            if(response.didCancel){
                console.log("User Cancelled Image Selection");
            }else if(response.error){
                console.log("User Entered custom button")
            }else{
                 this.setState({
                     source : {uri : response.uri},
                 });
                 tflite.runModelOnImage({
                     path:response.path,
                     imagemean:128,
                     imageStd : 128,
                     numResults : 3,
                     threshold : 0.05
                 }, (err,res) => {
                       if(err) console.log(err);
                       else{
                           console.log(res)
                           this.setState({recognition:res[res.length -1]})
                       }
                 }
                 );
            }
        })
    }

    takeImage() {
        const option = {};
        ImagePicker.launchCamera(option,(response) => {
            if(response.didCancel){
                console.log("User Cancelled Image Selection");
            }else if(response.error){
                console.log("User Entered custom button")
            }else{
                 this.setState({
                     source : {uri : response.uri},
                 });
                 tflite.runModelOnImage({
                     path:response.path,
                     imagemean:128,
                     imageStd : 128,
                     numResults : 3,
                     threshold : 0.05
                 }, (err,res) => {
                       if(err) console.log(err);
                       else{
                           console.log(res)
                           this.setState({recognition:res[res.length -1]})
                       }
                 }
                 );
            }
        })
    }

    render(){
      
        const {recognition,source}  = this.state;

        return(
            <View style={styles.lineargradient}>
                <View style={styles.titlecontainer}>
                    <Text style={styles.title}>
                        NotHotDog
                    </Text>
                    <Text style={styles.subtitle}>
                        Seafood Startup
                    </Text>
                </View>
                <View style={styles.outputcontainer}>
                    {
                        recognition ?(
                        <View>
                            <Image source = {source} style={styles.hotdogimage}></Image>
                            <Text style={{textAlign:"center",color:"white",paddingTop:10,fontSize:25}}>{recognition['label'] + ' - ' + (recognition['confidence']*100).toFixed(0) + '%'}</Text>
                        </View> ) : (
                            <Image source = {require("./assets/hotdog.png")} style={styles.hotdogimage}></Image>
                        )
                
                    }

                    
                </View>
                <View style={styles.Buttoncontainer}>
                    <Button title="Camera Roll" titleStyle={{fontSize:20,color:"black"}} containerStyle={{margin:5}} buttonStyle = {styles.Button} onPress={this.selectGalleryImage.bind(this)}></Button>
                    <Button title="Take a Photo" titleStyle={{fontSize:20,color:"black"}} containerStyle={{margin:5}} buttonStyle = {styles.Button} onPress={this.takeImage.bind(this)}></Button>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
         lineargradient : {
             flex:1,
             backgroundColor:"#112031",
             width : "100%",
             alignContent:"center",
             textAlign:"center",
             
         },
          titlecontainer : {
              marginTop:70,
              alignItems:"center"
          },
          title : {
              fontSize : 40,
              color:"white"
          },
          subtitle : {
               fontSize : 20,
               color:"white"
          },
          outputcontainer : {
              flex:1,
              alignItems:"center",
              justifyContent:"center"
          },
          Buttoncontainer : {
              paddingBottom:40,
              alignItems:"center"
          },
          Button:{
             width: 200,
             height:57,
             backgroundColor:"#D4ECDD",
             
          },hotdogimage : {
              height:250,
              width:250
          } 
})