import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Aapki Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBbkeL5K-XCRjskiLjR1h1pDzLRLWwvIXg",
    authDomain: "nitesh-75d47.firebaseapp.com",
    projectId: "nitesh-75d47",
    storageBucket: "nitesh-75d47.firebasestorage.app",
    messagingSenderId: "319671865593",
    appId: "1:319671865593:web:98fd66daa5062e4f401228",
    measurementId: "G-NJNBZQNZNG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

document.getElementById('uploadBtn').addEventListener('click', () => {
    const file = document.getElementById('fileInput').files[0];
    if (!file) {
        alert("Please select a file first!");
        return;
    }

    const storageRef = ref(storage, 'uploads/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    const statusText = document.getElementById('status');
    const linkContainer = document.getElementById('linkContainer');

    statusText.innerText = 'Uploading started...';
    statusText.style.color = '#ff9800'; // Orange while uploading
    linkContainer.style.display = 'none';

    uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            statusText.innerText = 'Upload Progress: ' + Math.round(progress) + '%';
        }, 
        (error) => {
            console.error("Upload failed!", error);
            statusText.innerText = "Error in uploading!";
            statusText.style.color = 'red';
        }, 
        async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            statusText.innerText = "Upload Complete!";
            statusText.style.color = '#28a745'; // Green when complete
            
            linkContainer.style.display = 'block';
            linkContainer.innerHTML = `
                <p style="margin: 0 0 5px 0; color: #333;">Share this link:</p>
                <a href="${downloadURL}" target="_blank">${downloadURL}</a>
            `;

            try {
                await addDoc(collection(db, "shared_files"), {
                    fileName: file.name,
                    fileUrl: downloadURL,
                    uploadTime: new Date()
                });
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
    );
});
