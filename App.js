import React, {useState} from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing'
import uploadToAnonymousFilesAsync from 'anonymous-files'

const App = () => {

  const [selectedImage, setSelectedImage] = useState(null)

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    
    if (pickerResult.cancelled === true) {
      return
    }

    if (Platform.OS === 'web') {
      const remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri)  
      selectedImage({localUri: pickerResult.uri, remoteUri})
    } else{
      setSelectedImage({localUri: pickerResult.uri})
    }

    
  }

  const openShareDialog = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`The image is avaliable for sharing at: ${selectedImage.remoteUri}` );
      return;
    }

    await Sharing.shareAsync(selectedImage.localUri);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick an Image!</Text>
      <TouchableOpacity
        onPress={openImagePickerAsync}
      >
        <Image 
          source={{
            uri: 
              selectedImage !== null 
                ? selectedImage.localUri  
                : 'https://picsum.photos/200/200' 
          }}
          style={styles.image}
        >
        </Image>
      </TouchableOpacity>
      
      {
        selectedImage ? (

        <TouchableOpacity 
          onPress={() => openShareDialog()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Share this image</Text>
        </TouchableOpacity>

        ) : (
          <View/>
        )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: "#292929",
  },
  title: {
    fontSize: 30, 
    color: "#fff",
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 100,
    resizeMode: 'contain'
  },
  button: {
    backgroundColor: 'deepskyblue',
    padding: 7,
    marginTop: 10

  },
  buttonText: {
    color: '#fff',
    fontSize: 20
  }
});

export default App; 