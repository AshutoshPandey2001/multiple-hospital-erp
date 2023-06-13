/* eslint-disable prettier/prettier */
const { db } = require("src/firebaseconfig")


export const setData = (collectionName, collectionuid, arrayName, data) => {

    db.collection(collectionName).doc(collectionuid).set({
        [`${arrayName}`]: data
    }).then((res) => {

    }).catch((error) => {

    })
}

// export const getData = (collectionName, collectionuid, callback) => {
//     return db.collection(collectionName).doc(collectionuid).onSnapshot((snapshot) => {
//         // Retrieve the updated data from the snapshot
//         const data = snapshot.data();

//         // Call the provided callback function with the data
//         if (typeof callback === 'function') {
//             callback(data);
//         }
//     });
// };

export const getData = (collectionName, collectionuid) => {
    return db.collection(collectionName).doc(collectionuid).get()
};

// export const getDatawithhospitaluid = (collectionName, collectionuid, arrayName, hospitaluid) => {
//     // Assuming you have Firebase initialized and a Firestore instance called 'db'

//     // Step 1: Build the query to filter documents based on the desired ID
//     const collectionRef = db.collection(collectionName).doc(collectionuid);
//     // const query = collectionRef.where('patients.hospitaluid', '==', hospitaluid);

//     // Step 2: Execute the query and retrieve the matching documents
//     collectionRef.get()
//         .then((doc) => {
//             // querySnapshot.forEach((doc) => {
//             // Step 3: Access the values in the array that match the given ID
//             const data = doc.data();
//             const matchingValues = data[arrayName].filter((item) => item.hospitaluid === hospitaluid);
//             return matchingValues

//         })
//         .catch((error) => {
//             console.error('Error getting documents:', error);
//         });
// };
export const getDatawithhospitaluid = (collectionName, collectionuid, arrayName, hospitaluid) => {
    // Assuming you have Firebase initialized and a Firestore instance called 'db'

    // Step 1: Build the query to filter documents based on the desired ID
    const collectionRef = db.collection(collectionName).doc(collectionuid);

    // Step 2: Execute the query and retrieve the matching documents
    return collectionRef.get()
        .then((doc) => {
            // Step 3: Access the values in the array that match the given ID
            const data = doc.data();
            const matchingValues = data[arrayName].filter((item) => item.hospitaluid === hospitaluid);
            return matchingValues;
        })
        .catch((error) => {
            console.error('Error getting documents:', error);
            throw error; // Re-throw the error to propagate it
        });
};

export const addSingltObject = (collectionName, collectionuid, arrayName, data1) => {
    // Assuming you have Firebase initialized and a Firestore instance called 'db'
    console.log('data1', data1);
    // Step 1: Retrieve the document
    const documentRef = db.collection(collectionName).doc(collectionuid);

    documentRef.get()
        .then(async (doc) => {
            if (doc.exists) {
                // Step 2: Modify the array value within the object
                const data = await doc.data();

                await data[arrayName].push(data1); // Example: Push a new item to the array
                console.log('updated', data);
                // Step 3: Update the document with the modified object
                return documentRef.update({
                    [arrayName]: data[arrayName]
                });
            } else {
                console.log('Document does not exist.');
            }
        })
        .then(() => {
            console.log('Document successfully updated!');
        })
        .catch((error) => {
            console.error('Error updating document:', error);
        });

};

export const updateSingltObject = (collectionName, collectionuid, arrayName, data1, cond1, cond2) => {
    // Assuming you have Firebase initialized and a Firestore instance called 'db'
    console.log('data1', data1, cond1, cond2);
    // Step 1: Retrieve the document
    const documentRef = db.collection(collectionName).doc(collectionuid);

    documentRef.get()
        .then(async (doc) => {
            if (doc.exists) {
                // Step 2: Modify the array value within the object
                const data = await doc.data();

                // await data[arrayName].push(data1);
                const updatedArray = data[arrayName].map((item) => {
                    // Update the value of the object that matches a specific condition
                    if (item[cond1] === data1[cond1] && item[cond2] === data1[cond2]) {
                        return {
                            ...item, // Keep the existing object properties
                            ...data1 // Update the desired value
                        };
                    }
                    return item; // Return other objects unchanged
                });
                // Example: Push a new item to the array
                console.log('updated', updatedArray);
                // Step 3: Update the document with the modified object
                return documentRef.update({
                    [arrayName]: updatedArray
                });
            } else {
                console.log('Document does not exist.');
            }
        })
        .then(() => {
            console.log('Document successfully updated!');
        })
        .catch((error) => {
            console.error('Error updating document:', error);
        });

};



export const deleteSingltObject = (collectionName, collectionuid, arrayName, data1, cond1, cond2) => {
    // Assuming you have Firebase initialized and a Firestore instance called 'db'
    console.log('data1', data1[cond1], cond1, cond2);
    // Step 1: Retrieve the document
    const documentRef = db.collection(collectionName).doc(collectionuid);
    documentRef.get()
        .then(async (doc) => {
            if (doc.exists) {
                // Step 2: Modify the array by removing the desired object
                const data = await doc.data();
                const updatedArray = await data[arrayName].filter((item) => {
                    // Filter out the object(s) you want to delete from the array
                    // Example: Remove objects where key1 equals a specific value
                    return !(item[cond1] === data1[cond1] && item[cond2] === data1[cond2]);
                });

                // Step 3: Update the document with the modified array
                return documentRef.update({
                    [arrayName]: updatedArray
                });
            } else {
                console.log('Document does not exist.');
            }
        })
        .then(() => {
            console.log('Document successfully updated!');
        })
        .catch((error) => {
            console.error('Error updating document:', error);
        });

};
