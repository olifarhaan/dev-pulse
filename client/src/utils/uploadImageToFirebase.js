import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"

const uploadImageToDatabase = (uploadImage, setUploadImageProgress) => {
  return new Promise((resolve, reject) => {
    const storage = getStorage()
    const fileName =
      uploadImage.name +
      new Date().getTime() +
      Math.random().toString(36).slice(-8)
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, uploadImage)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setUploadImageProgress(progress.toFixed(0))
      },
      (error) => {
        reject(error)
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          resolve(downloadURL)
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}

export default uploadImageToDatabase
