/* eslint-disable prettier/prettier */
import { useDispatch } from "react-redux";
import firebase from 'firebase/compat/app'
import { db } from "src/firebaseconfig";

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
            console.log('matchingValues', matchingValues);
            return matchingValues;
        })
        .catch((error) => {
            console.error('Error getting documents:', error);
            // return []

            throw error; // Re-throw the error to propagate it
        });
};

// export const addSingltObject = (collectionName, collectionuid, arrayName, data1) => {
//     // Assuming you have Firebase initialized and a Firestore instance called 'db'
//     console.log('data1', data1);
//     // Step 1: Retrieve the document
//     const documentRef = db.collection(collectionName).doc(collectionuid);

//     documentRef.get()
//         .then(async (doc) => {
//             if (doc.exists) {
//                 // Step 2: Modify the array value within the object
//                 const data = await doc.data();

//                 await data[arrayName].push(data1); // Example: Push a new item to the array
//                 console.log('updated', data);
//                 // Step 3: Update the document with the modified object
//                 return documentRef.update({
//                     [arrayName]: data[arrayName]
//                 });
//             } else {
//                 console.log('Document does not exist.');
//             }
//         })
//         .then(() => {
//             console.log('Document successfully updated!');
//         })
//         .catch((error) => {
//             console.error('Error updating document:', error);
//         });

// };

export const addSingltObject = (collectionName, collectionuid, arrayName, data1) => {
    // Assuming you have Firebase initialized and a Firestore instance called 'db'
    console.log('data1', data1);

    const documentRef = db.collection(collectionName).doc(collectionuid);

    // Use a Firestore transaction to ensure the document is created if it doesn't exist
    return db.runTransaction(async (transaction) => {
        const doc = await transaction.get(documentRef);

        if (doc.exists) {
            // If the document exists, modify the array value within the object
            const existingData = doc.data();
            existingData[arrayName].push(data1); // Push a new item to the array

            // Update the document with the modified object
            transaction.update(documentRef, { [arrayName]: existingData[arrayName] });
        } else {
            // If the document doesn't exist, create it and set the data
            const initialData = { [arrayName]: [data1] };
            transaction.set(documentRef, initialData);
        }
    })
        .then(() => {
            console.log('Document successfully updated/created!');
        })
        .catch((error) => {
            console.error('Error updating/creating document:', error);
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


// export const updateSingltObjectIndoor = (collectionName, collectionuid, arrayName, data1, cond1, cond2) => {
//     // Assuming you have Firebase initialized and a Firestore instance called 'db'
//     console.log('data1', data1, cond1, cond2);
//     // Step 1: Retrieve the document
//     const documentRef = db.collection(collectionName).doc(collectionuid);

//     documentRef.get()
//         .then(async (doc) => {
//             if (doc.exists) {
//                 // Step 2: Modify the array value within the object
//                 const data = await doc.data();

//                 // await data[arrayName].push(data1);
//                 const updatedArray = data[arrayName].map((item) => {
//                     // Update the value of the object that matches a specific condition
//                     if (item[cond1] === data1[cond1] && item[cond2] === data1[cond2]) {
//                         return {
//                             ...item, // Keep the existing object properties
//                             ...data1 // Update the desired value
//                         };s
//                     }
//                     return item; // Return other objects unchanged
//                 });
//                 // Example: Push a new item to the array
//                 console.log('updated', updatedArray);
//                 // Step 3: Update the document with the modified object
//                 return documentRef.update({
//                     [arrayName]: updatedArray
//                 });
//             } else {
//                 console.log('Document does not exist.');
//             }
//         })
//         .then(() => {
//             console.log('Document successfully updated!');
//         })
//         .catch((error) => {
//             console.error('Error updating document:', error);
//         });

// };
export const updatemultitObject = (collectionName, collectionuid, arrayName, data1, cond1, cond2, paymentStatus, state) => {
    // Assuming you have Firebase initialized and a Firestore instance called 'db'
    console.log('data1', data1, cond1, cond2, paymentStatus, state);
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
                    if (item[cond1] === state[cond1] && item[cond2] === state[cond2] && item[paymentStatus] === 'Pending') {
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


export const getTaxDatawithhospitaluid = (collectionName, collectionuid, arrayName, hospitaluid) => {
    // Assuming you have Firebase initialized and a Firestore instance called 'db'

    // Step 1: Build the query to filter documents based on the desired ID
    const collectionRef = db.collection(collectionName).doc(collectionuid);

    // Step 2: Execute the query and retrieve the matching documents
    return collectionRef.get()
        .then(async (doc) => {
            // Step 3: Access the values in the array that match the given ID
            const data = await doc.data();
            const matchingValues = await data[arrayName].filter((item) => item.hospitaluid === hospitaluid);
            console.log('matchingValues', matchingValues);
            if (matchingValues?.length === 0) {
                const defaultTaxData = [
                    {
                        taxUid: Math.floor(6745 + Math.random() * 1978),
                        taxName: "CGST",
                        taxValue: 0,
                        hospitaluid: hospitaluid,
                    },
                    {
                        taxUid: Math.floor(6745 + Math.random() * 1978),
                        taxName: "SGST",
                        taxValue: 0,
                        hospitaluid: hospitaluid,
                    }
                ];

                const updatedArray = [...data[arrayName], ...defaultTaxData];
                collectionRef.update({
                    [arrayName]: updatedArray
                });
                getTaxDatawithhospitaluid()
            } else {
                return matchingValues;
            }
        })
        .catch((error) => {
            console.error('Error getting documents:', error);
            // return []

            throw error; // Re-throw the error to propagate it
        });
};


export const uploadArray = (collectionName, collectionuid, arrayName, data1, cond1, cond2) => {
    // Assuming you have Firebase initialized and a Firestore instance called 'db'
    console.log('data1', data1);
    // Step 1: Retrieve the document
    const documentRef = db.collection(collectionName).doc(collectionuid);

    documentRef.get()
        .then(async (doc) => {
            if (doc.exists) {
                // Step 2: Modify the array value within the object
                const data = await doc.data();

                //  const updatedArray = [...data[arrayName], ...data1]

                const resultArray = [...data[arrayName]];

                data1.forEach((data1Object) => {
                    const index = resultArray.findIndex((dataObject) => dataObject[cond1] === data1Object[cond1] && dataObject[cond2] === data1Object[cond2]);

                    if (index !== -1) {
                        // Update object if medicineuid matches
                        resultArray[index] = { ...resultArray[index], ...data1Object };
                    } else {
                        // Add data1 object if no match found
                        resultArray.push(data1Object);
                    }
                });
                // const updatedArray = data[arrayName].map(obj => {
                //     const matchingObject = data1.find(item => item.medicineuid === obj.medicineuid && item.hospitaluid === obj.hospitaluid);
                //     return matchingObject ? matchingObject : obj;
                // });

                // const resultArray = [...updatedArray, ...data1];
                // const updatedArray = data[arrayName].map(obj => {
                //     const matchingObject = data1.find(item => item.medicineUid === obj.medicineUid && item.hospitaluid === obj.hospitaluid);
                //     return matchingObject ? matchingObject : obj;
                // });

                // const newObjects = data1.filter(item => !updatedArray.some(obj => obj.medicineUid === item.medicineUid && obj.hospitaluid === item.hospitaluid));
                // const resultArray = [...updatedArray, ...newObjects];
                // await data[arrayName].push(data1);
                // const updatedArray = data[arrayName].map((item) => {
                //     // Update the value of the object that matches a specific condition
                //     if (item[cond1] === data1[cond1] && item[cond2] === data1[cond2]) {
                //         return {
                //             ...item, // Keep the existing object properties
                //             ...data1 // Update the desired value
                //         };
                //     }
                //     return item; // Return other objects unchanged
                // });
                // Example: Push a new item to the array
                console.log('updated', resultArray);
                // Step 3: Update the document with the modified object
                return documentRef.update({
                    [arrayName]: resultArray
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






















// Add Data in Subcollections


export const addDatainsubcollection = async (collectionName, collectionuid, subcollectionName, data) => {
    const parentDocRef = db.collection(collectionName).doc(collectionuid);

    // Access the specific subcollection
    const subcollectionRef = parentDocRef.collection(subcollectionName);
    const timestamp = new Date();

    try {
        // Create a new document within the subcollection and set its data
        const docRef = await subcollectionRef.add({
            timestamp: timestamp,
            deleted: 0,
            ...data
        });

        const newDocSnapshot = await docRef.get();
        // const newDocData = newDocSnapshot.data();

        console.log("Document added to subcollection successfully!", newDocSnapshot);

        // Return the new added value
        return newDocSnapshot;
    } catch (error) {
        console.error("Error adding document to subcollection: ", error);
        throw error;
    }
};


export const addDatainsubcollectionmedicalAndPatients = async (collectionName, collectionuid, subcollectionName, data) => {
    const parentDocRef = db.collection(collectionName).doc(collectionuid);

    // Access the specific subcollection
    const subcollectionRef = parentDocRef.collection(subcollectionName);
    const timestamp = new Date();

    try {
        // Create a new document within the subcollection and set its data
        const docRef = await subcollectionRef.add({
            timestamp: timestamp,
            lastUpdated: timestamp,
            deleted: 0,
            ...data
        });

        const newDocSnapshot = await docRef.get();
        // const newDocData = newDocSnapshot.data();

        console.log("Document added to subcollection successfully!", newDocSnapshot);

        // Return the new added value
        return newDocSnapshot;
    } catch (error) {
        console.error("Error adding document to subcollection: ", error);
        throw error;
    }
};

// get sub collection data


export const getSubcollectionData = (collectionName, collectionuid, subcollectionName, hospitaluid, callback) => {
    return new Promise((resolve, reject) => {
        // Get a reference to the parent document
        const parentDocRef = db.collection(collectionName).doc(collectionuid);

        // Access the specific subcollection
        const subcollectionRef = parentDocRef.collection(subcollectionName);
        const query = subcollectionRef.where('hospitaluid', '==', hospitaluid).orderBy('timestamp', 'asc');;

        const unsubscribe = query.onSnapshot((querySnapshot) => {
            let temp_data = [];
            querySnapshot.forEach((doc) => {
                temp_data.push(doc.data());
            });
            callback(temp_data)
            // Resolve the promise with temp_data
            resolve(temp_data);
        }, (error) => {
            // Reject the promise with the error
            reject(error);
        });
        // Return the unsubscribe function so that the caller can unsubscribe from the snapshot listener if needed
        return unsubscribe;
    });
};
export const getSubcollectionDataWithoutsnapshotopdindoor = async (collectionName, collectionuid, subcollectionName, hospitaluid, callback) => {
    try {
        // Get a reference to the parent document
        const parentDocRef = db.collection(collectionName).doc(collectionuid);
        // Access the specific subcollection
        const subcollectionRef = parentDocRef.collection(subcollectionName);
        const query = subcollectionRef.where('hospitaluid', '==', hospitaluid).orderBy('timestamp', 'asc');
        const querySnapshot = await query.get();
        let temp_data = [];
        querySnapshot.forEach((doc) => {
            temp_data.push(doc.data());
        });
        callback(temp_data);
        return temp_data;
    } catch (error) {
        throw error;
    }
};

export const getSubcollectionDataWithoutsnapshot = async (collectionName, collectionuid, subcollectionName, hospitaluid, lastData, callback) => {
    try {
        // Get a reference to the parent document
        const parentDocRef = db.collection(collectionName).doc(collectionuid);
        // Access the specific subcollection
        const subcollectionRef = parentDocRef.collection(subcollectionName);
        let query = subcollectionRef.where('hospitaluid', '==', hospitaluid).orderBy('timestamp', 'asc');

        // If lastData is provided, add a filter to get data after the last timestamp
        console.log('last Data', lastData);
        if (lastData) {
            const timestamp = new firebase.firestore.Timestamp(lastData.timestamp.seconds, lastData.timestamp.nanoseconds);
            console.log('i am inside this', timestamp);
            query = query.where('timestamp', '>', timestamp);
        }

        const querySnapshot = await query.get();
        let temp_data = [];
        querySnapshot.forEach((doc) => {
            temp_data.push(doc.data());
        });
        console.log('temp_data', temp_data);

        // Get the last visible document for pagination
        let lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

        // Pass the ID of the last visible document to the callback function
        // This can be used for pagination to get the next set of data
        callback(temp_data, lastVisibleDoc ? lastVisibleDoc.data() : lastData);

        return temp_data;
    } catch (error) {
        throw error;
    }
};



export const getSubcollectionDataWithoutsnapshotMedicalAndPatients = async (collectionName, collectionuid, subcollectionName, hospitaluid, lastData, callback) => {
    try {
        // Get a reference to the parent document
        const parentDocRef = db.collection(collectionName).doc(collectionuid);
        // Access the specific subcollection
        const subcollectionRef = parentDocRef.collection(subcollectionName);
        let query = subcollectionRef.where('hospitaluid', '==', hospitaluid);

        // If lastData is provided, add a filter to get data after the last timestamp
        console.log('last Data', lastData);
        if (lastData) {
            const timestamp = new firebase.firestore.Timestamp(lastData.lastUpdated.seconds, lastData.lastUpdated.nanoseconds);
            console.log('i am inside this', timestamp);
            query = query.where('lastUpdated', '>', timestamp);
        }


        const querySnapshot = await query.get();
        let temp_data = [];
        querySnapshot.forEach((doc) => {
            temp_data.push(doc.data());
        });
        console.log('temp_data', temp_data);

        // Get the last visible document for pagination
        let lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

        // Pass the ID of the last visible document to the callback function
        // This can be used for pagination to get the next set of data
        callback(temp_data, lastVisibleDoc ? lastVisibleDoc.data() : lastData);

        return temp_data;
    } catch (error) {
        throw error;
    }
};
// update document in subcollection

export const updateDatainSubcollectionMedicalAndPatients = (collectionName, collectionuid, subcollectionName, data, cond1, cond2) => {
    const parentDocRef = db.collection(collectionName).doc(collectionuid);

    // Access the specific subcollection
    const subcollectionRef = parentDocRef.collection(subcollectionName);
    const query = subcollectionRef.where(cond2, '==', data[cond2]).where(cond1, '==', data[cond1])
    const timestamp = new Date();
    query.get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                doc.ref.update({
                    ...data,
                    lastUpdated: timestamp,

                })
                    .then(() => {
                        console.log('Document successfully updated!');
                    })
                    .catch(error => {
                        console.error('Error updating document: ', error);
                    });
            });
        })
        .catch(error => {
            console.log('Error getting documents: ', error);
        });
}


export const updateDatainSubcollection = (collectionName, collectionuid, subcollectionName, data, cond1, cond2) => {
    const parentDocRef = db.collection(collectionName).doc(collectionuid);

    // Access the specific subcollection
    const subcollectionRef = parentDocRef.collection(subcollectionName);
    const query = subcollectionRef.where(cond2, '==', data[cond2]).where(cond1, '==', data[cond1])

    query.get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                doc.ref.update({
                    ...data,
                })
                    .then(() => {
                        console.log('Document successfully updated!');
                    })
                    .catch(error => {
                        console.error('Error updating document: ', error);
                    });
            });
        })
        .catch(error => {
            console.log('Error getting documents: ', error);
        });
}
export const updateDatainSubcollectionmedicineinvoice = (collectionName, collectionuid, subcollectionName, data, cond1, cond2) => {
    const parentDocRef = db.collection(collectionName).doc(collectionuid);
    const subcollectionRef = parentDocRef.collection(subcollectionName);
    const query = subcollectionRef.where(cond2, '==', data[cond2]).where(cond1, '==', data[cond1])
    const timestampWithNanoseconds = data.timestamp.seconds * 1000 + Math.floor(data.timestamp.nanoseconds / 1e6);
    const dateObject = new Date(timestampWithNanoseconds);
    // const timestamp = new Date();
    query.get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                doc.ref.update({
                    ...data,
                    timestamp: dateObject,
                })
                    .then(() => {
                        console.log('Document successfully updated!');
                    })
                    .catch(error => {
                        console.error('Error updating document: ', error);
                    });
            });
        })
        .catch(error => {
            console.log('Error getting documents: ', error);
        });
}
export const updateDatainSubcollectionPatients = async (collectionName, collectionuid, subcollectionName, data, cond1, cond2) => {
    const parentDocRef = db.collection(collectionName).doc(collectionuid);

    // Access the specific subcollection
    const subcollectionRef = parentDocRef.collection(subcollectionName);
    const query = subcollectionRef.where(cond2, '==', data[cond2]).where(cond1, '==', data[cond1]);

    try {
        const querySnapshot = await query.get();
        const updatedData = [];

        // Perform the update and store updated data
        const updatePromises = querySnapshot.docs.map(async (doc) => {
            await doc.ref.update({ ...data });
            const updatedDoc = await doc.ref.get();
            updatedData.push({ ...updatedDoc.data() });
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);

        console.log('Documents successfully updated!');
        return updatedData;
    } catch (error) {
        console.error('Error updating documents: ', error);
        throw error;
    }
};


// Delete data in subcollection

// export const deleteDatainSubcollection = (collectionName, collectionuid, subcollectionName, data, cond1, cond2) => {
//     const parentDocRef = db.collection(collectionName).doc(collectionuid);

//     // Access the specific subcollection
//     const subcollectionRef = parentDocRef.collection(subcollectionName);
//     const query = subcollectionRef.where(cond2, '==', data[cond2]).where(cond1, '==', data[cond1])

//     query.get()
//         .then(querySnapshot => {
//             querySnapshot.forEach(doc => {
//                 doc.ref.delete()
//                     .then(() => {
//                         console.log('Document successfully Deleted!');
//                     })
//                     .catch(error => {
//                         console.error('Error deleting document: ', error);
//                     });
//             });
//         })
//         .catch(error => {
//             console.log('Error getting documents: ', error);
//         });
// }
export const deleteDatainSubcollectionLabparameter = async (collectionName, collectionuid, subcollectionName, data, cond1, cond2) => {
    try {
        const parentDocRef = db.collection(collectionName).doc(collectionuid);
        const subcollectionRef = parentDocRef.collection(subcollectionName);
        const query = subcollectionRef.where(cond2, '==', data[cond2]).where(cond1, '==', data[cond1]);

        const querySnapshot = await query.get();

        const deletePromises = querySnapshot.docs.map(doc => doc.ref.delete());

        await Promise.all(deletePromises);

        console.log('Documents successfully deleted!');
    } catch (error) {
        console.error('Error deleting documents: ', error);
    }
};

export const deleteDatainSubcollection = (collectionName, collectionuid, subcollectionName, data, cond1, cond2) => {
    const parentDocRef = db.collection(collectionName).doc(collectionuid);

    // Access the specific subcollection
    const subcollectionRef = parentDocRef.collection(subcollectionName);
    const query = subcollectionRef.where(cond2, '==', data[cond2]).where(cond1, '==', data[cond1])
    // const timestamp = new Date();
    query.get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                doc.ref.update({
                    ...data,
                    deleted: 1,
                })
                    .then(() => {
                        console.log('Document successfully updated!');
                    })
                    .catch(error => {
                        console.error('Error updating document: ', error);
                    });
            });
        })
        .catch(error => {
            console.log('Error getting documents: ', error);
        });
    // } catch (error) {
    //     console.error('Error deleting documents: ', error);
    // }
};

export const deleteDatainSubcollectionPatients = async (collectionName, collectionuid, subcollectionName, data, cond1, cond2) => {
    const parentDocRef = db.collection(collectionName).doc(collectionuid);

    // Access the specific subcollection
    const subcollectionRef = parentDocRef.collection(subcollectionName);
    const query = subcollectionRef.where(cond2, '==', data[cond2]).where(cond1, '==', data[cond1]);

    try {
        const querySnapshot = await query.get();
        const deletedData = [];

        // Perform the delete and store deleted data
        const deletePromises = querySnapshot.docs.map(async (doc) => {
            const deletedDocData = doc.data();
            await doc.ref.update({
                ...data,
                deleted: 1,
            });
            deletedData.push({ ...deletedDocData });
        });

        // Wait for all deletes to complete
        await Promise.all(deletePromises);

        console.log('Documents successfully updated and marked as deleted!');
        return deletedData;
    } catch (error) {
        console.error('Error updating and deleting documents: ', error);
        throw error;
    }
};


export const deleteDatainSubcollectionMedicalAndPatients = (collectionName, collectionuid, subcollectionName, data, cond1, cond2) => {
    const parentDocRef = db.collection(collectionName).doc(collectionuid);
    // Access the specific subcollection
    const subcollectionRef = parentDocRef.collection(subcollectionName);
    const query = subcollectionRef.where(cond2, '==', data[cond2]).where(cond1, '==', data[cond1])
    const timestamp = new Date();
    const timestampWithNanoseconds = data.timestamp.seconds * 1000 + Math.floor(data.timestamp.nanoseconds / 1e6);
    const dateObject = new Date(timestampWithNanoseconds);
    query.get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                doc.ref.update({
                    ...data,
                    timestamp: dateObject,
                    lastUpdated: timestamp,
                    deleted: 1,
                })
                    .then(() => {
                        console.log('Document successfully updated!');
                    })
                    .catch(error => {
                        console.error('Error updating document: ', error);
                    });
            });
        })
        .catch(error => {
            console.log('Error getting documents: ', error);
        });
    // } catch (error) {
    //     console.error('Error deleting documents: ', error);
    // }
};
// fill data in sub collection :-

export const multimedicineStockUpdate = (arrayName, collectionName, collectionuid, subcollectionName, cond1, cond2) => {
    arrayName.map(async (item) => {
        await updateDatainSubcollectionMedicalAndPatients(collectionName, collectionuid, subcollectionName, item, cond1, cond2)
    })
}

export const filDatainsubcollection = (arrayName, collectionName, collectionuid, subcollectionName, cond1, cond2) => {
    console.log('arrayName', arrayName);
    arrayName.map(async (item) => {
        await fillDeleteObject(collectionName, collectionuid, subcollectionName, item, cond1, cond2)
    })
}


// update multipleData in sub collection 
// export const updateMultiDatainSubcollection = (collectionName, collectionuid, subcollectionName, data, cond1, cond2, cond3, state) => {
//     const parentDocRef = db.collection(collectionName).doc(collectionuid);

//     // Access the specific subcollection
//     const subcollectionRef = parentDocRef.collection(subcollectionName);
//     const query = subcollectionRef.where(cond2, '==', state[cond2]).where(cond1, '==', state[cond1]).where(cond3, '==', state[cond3])

//     query.get()
//         .then(querySnapshot => {
//             querySnapshot.forEach(doc => {
//                 console.log('update', doc);
//                 doc.ref.update({
//                     ...data
//                 })
//                     .then(() => {
//                         console.log('Document successfully updated!');
//                     })
//                     .catch(error => {
//                         console.error('Error updating document: ', error);
//                     });
//             });
//         })
//         .catch(error => {
//             console.log('Error getting documents: ', error);
//         });
// }
export const updateMultiDatainSubcollection = async (collectionName, collectionuid, subcollectionName, data, cond1, cond2, cond3, state) => {
    try {
        const parentDocRef = db.collection(collectionName).doc(collectionuid);
        const subcollectionRef = parentDocRef.collection(subcollectionName);
        const query = subcollectionRef.where(cond2, '==', state[cond2]).where(cond1, '==', state[cond1]).where(cond3, '==', state[cond3]);

        const querySnapshot = await query.get();
        // console.log('Documents who updated!', querySnapshot);
        // const timestamp = new Date();
        const updatePromises = querySnapshot.docs.map(doc => {
            // console.log('update', doc);
            return doc.ref.update({ ...data });
        });

        await Promise.all(updatePromises);

        console.log('Documents successfully updated!');
    } catch (error) {
        console.error('Error updating documents: ', error);
    }
};


// getTaxDatainsubCollection 
export const getTaxDatainsubCollection = (collectionName, collectionuid, subcollectionName, hospitaluid, callback) => {
    return new Promise((resolve, reject) => {
        // Get a reference to the parent document
        const parentDocRef = db.collection(collectionName).doc(collectionuid);

        // Access the specific subcollection
        const subcollectionRef = parentDocRef.collection(subcollectionName);
        const query = subcollectionRef.where('hospitaluid', '==', hospitaluid);

        const unsubscribe = query.onSnapshot(async (querySnapshot) => {
            let temp_data = [];
            await querySnapshot.forEach((doc) => {
                temp_data.push(doc.data());
            });
            if (temp_data.length === 0) {
                // Create a new document with your desired data
                const emptyData1 = {
                    taxUid: Math.floor(6745 + Math.random() * 1978),
                    taxName: "CGST",
                    taxValue: 0,
                    hospitaluid: hospitaluid,
                };
                const emptyData2 = {
                    taxUid: Math.floor(6745 + Math.random() * 1978),
                    taxName: "SGST",
                    taxValue: 0,
                    hospitaluid: hospitaluid,
                };

                // Add the empty documents to the subcollection
                subcollectionRef.add(emptyData1);
                subcollectionRef.add(emptyData2);
                temp_data.push(emptyData1, emptyData2)
                // Pass the empty objects to the callback function
                callback(temp_data);
            } else {
                callback(temp_data);
            }
            // callback(temp_data)
            // Resolve the promise with temp_data
            resolve(temp_data);
        }, (error) => {
            // Reject the promise with the error
            reject(error);
        });
        // Return the unsubscribe function so that the caller can unsubscribe from the snapshot listener if needed
        return unsubscribe;
    });
}

export const getHospitalProfile = (collectionName, collectionuid, subcollectionName, hospitaluid, callback) => {
    return new Promise((resolve, reject) => {
        // Get a reference to the parent document
        const parentDocRef = db.collection(collectionName).doc(collectionuid);

        // Access the specific subcollection
        const subcollectionRef = parentDocRef.collection(subcollectionName);
        const query = subcollectionRef.where('hospitaluid', '==', hospitaluid);

        const unsubscribe = query.onSnapshot((querySnapshot) => {
            let temp_data = {};
            querySnapshot.forEach((doc) => {
                temp_data = doc.data();
            });
            // console.log('querySnapshot', temp_data);
            callback(temp_data)
            // Resolve the promise with temp_data
            resolve(temp_data);
        }, (error) => {
            // Reject the promise with the error
            reject(error);
        });
        // Return the unsubscribe function so that the caller can unsubscribe from the snapshot listener if needed
        return unsubscribe;
    });
};


export const updateHospitalProfile = (collectionName, collectionuid, subcollectionName, data) => {
    const parentDocRef = db.collection(collectionName).doc(collectionuid);

    // Access the specific subcollection
    const subcollectionRef = parentDocRef.collection(subcollectionName);
    const query = subcollectionRef.where('hospitaluid', '==', data.hospitaluid)

    query.get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                doc.ref.update({
                    ...data
                })
                    .then(() => {
                        console.log('Document successfully updated!');
                    })
                    .catch(error => {
                        console.error('Error updating document: ', error);
                    });
            });
        })
        .catch(error => {
            console.log('Error getting documents: ', error);
        });
}



export const getOnlyChangesListener = (collectionName, collectionuid, subcollectionName, hospitaluid, callback) => {
    return new Promise((resolve, reject) => {
        // Get a reference to the parent document
        const parentDocRef = db.collection(collectionName).doc(collectionuid);

        // Access the specific subcollection
        const subcollectionRef = parentDocRef.collection(subcollectionName);
        const query = subcollectionRef.where('hospitaluid', '==', hospitaluid);

        // Keep track of the latest document snapshot
        let latestSnapshot = null;

        // Array to store the initial data
        const initialDataArray = [];

        // Fetch all initial data
        query.get().then((initialSnapshot) => {
            initialSnapshot.forEach((doc) => {
                const initialData = doc.data();
                // Add the initial data to the array
                initialDataArray.push(initialData);
            });
            callback(initialDataArray)
            // Update the latest snapshot for subsequent changes
            latestSnapshot = initialSnapshot.docs[initialSnapshot.docs.length - 1];

            // Pass the initial data array to the resolve function
            resolve(initialDataArray);

            // Set up the listener to fetch only changes after the latest snapshot
            const unsubscribe = query.startAfter(latestSnapshot).onSnapshot((querySnapshot) => {
                // Process only the changes in the subcollection
                querySnapshot.docChanges().forEach((change) => {
                    if (change.type === 'added' || change.type === 'modified' || change.type === 'removed') {
                        const changedData = change.doc.data();
                        // Process the added, modified, or removed data here
                        console.log('changed object:', changedData);
                        callback(changedData);
                    }
                });

                // Update the latest snapshot for subsequent changes
                latestSnapshot = querySnapshot.docs[querySnapshot.docs.length - 1];
            }, (error) => {
                // Reject the promise with the error
                reject(error);
            });

            // Return an object with the unsubscribe function and the latestSnapshot
            return {
                unsubscribe: unsubscribe,
                latestSnapshot: latestSnapshot
            };
        });
    });
};


// get Data after getting all Data
// export const getSubcollectionDatafter = (collectionName, collectionuid, subcollectionName, hospitaluid, lastgetData, callback) => {
//     return new Promise((resolve, reject) => {
//         // Get a reference to the parent document
//         const parentDocRef = db.collection(collectionName).doc(collectionuid);

//         // Access the specific subcollection
//         const subcollectionRef = parentDocRef.collection(subcollectionName);
//         let query = subcollectionRef.where('hospitaluid', '==', hospitaluid).orderBy('timestamp', 'asc');;
//         console.log('lastgetData', lastgetData);
//         if (lastgetData) {
//             query = query
//                 .startAfter(lastgetData);
//         }
//         const unsubscribe = query.onSnapshot((querySnapshot) => {
//             let temp_data = [];
//             querySnapshot.forEach((doc) => {
//                 temp_data.push(doc.data());
//             });
//             const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
//             callback(temp_data, lastVisibleDoc)
//             // Resolve the promise with temp_data
//             resolve(temp_data);
//         }, (error) => {
//             // Reject the promise with the error
//             reject(error);
//         });
//         // Return the unsubscribe function so that the caller can unsubscribe from the snapshot listener if needed
//         return unsubscribe;
//     });
// };


// export const getSubcollectionDatafter = (collectionName, collectionuid, subcollectionName, hospitaluid, lastgetData, callback) => {
//     // Get a reference to the parent document
//     const parentDocRef = db.collection(collectionName).doc(collectionuid);

//     // Access the specific subcollection
//     const subcollectionRef = parentDocRef.collection(subcollectionName);

//     let query = subcollectionRef.where('hospitaluid', '==', hospitaluid).orderBy('timestamp', 'asc');

//     if (lastgetData) {
//         console.log('i am in if');
//         // subcollectionRef.doc(lastgetData).get()
//         //     .then((lastVisibleDocSnapshot) => {
//         //         const lastTimestamp = lastVisibleDocSnapshot.get('timestamp');
//         query = query.startAfter(lastgetData);

//         // Subscribe to the query
//         const unsubscribe = query.onSnapshot((querySnapshot) => {
//             const temp_data = [];
//             querySnapshot.forEach((doc) => {
//                 temp_data.push({
//                     id: doc.id,
//                     ...doc.data()
//                 });
//             });

//             // Update lastgetData to reflect the ID of the last retrieved document
//             const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
//             lastgetData = lastVisibleDoc;

//             callback(temp_data, lastgetData);
//         }, (error) => {
//             console.error("Error fetching subcollection data: ", error);
//         });

//         // Return the unsubscribe function so that the caller can unsubscribe from the snapshot listener if needed
//         return unsubscribe;
//         // })
//         // .catch((error) => {
//         //     console.error("Error fetching last visible document: ", error);
//         // });
//     } else {
//         console.log('i am in else');

//         // Subscribe to the query
//         const unsubscribe = query.onSnapshot((querySnapshot) => {
//             const temp_data = [];
//             querySnapshot.forEach((doc) => {
//                 temp_data.push({

//                     ...doc.data()
//                 });
//             });

//             // Update lastgetData to reflect the ID of the last retrieved document
//             const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
//             lastgetData = lastVisibleDoc;

//             callback(temp_data, lastgetData);
//         }, (error) => {
//             console.error("Error fetching subcollection data: ", error);
//         });

//         // Return the unsubscribe function so that the caller can unsubscribe from the snapshot listener if needed
//         return unsubscribe;
//     }
// };


export const fillDeleteObject = (collectionName, collectionuid, subcollectionName, data, cond1, cond2) => {
    const parentDocRef = db.collection(collectionName).doc(collectionuid);
    const timestampWithNanoseconds = data.timestamp.seconds * 1000 + Math.floor(data.timestamp.nanoseconds / 1e6);
    const dateObject = new Date(timestampWithNanoseconds);
    // Access the specific subcollection
    const subcollectionRef = parentDocRef.collection(subcollectionName);
    const query = subcollectionRef.where(cond2, '==', data[cond2]).where(cond1, '==', data[cond1])
    query.get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                doc.ref.update({
                    ...data,
                    timestamp: dateObject,
                    deleted: 0,
                })
                    .then(() => {
                        console.log('Document successfully updated!');
                    })
                    .catch(error => {
                        console.error('Error updating document: ', error);
                    });
            });
        })
        .catch(error => {
            console.log('Error getting documents: ', error);
        });
    // } catch (error) {
    //     console.error('Error deleting documents: ', error);
    // }
};


export const getOnePatientsData = async (collectionName, collectionuid, subcollectionName, hospitaluid, pid, paymentStatus) => {
    try {
        // Get a reference to the parent document
        const parentDocRef = db.collection(collectionName).doc(collectionuid);

        // const subcollectionRef = parentDocRef.collection('opdPatient').where('hospitaluid', '==', hospitaluid);
        const subcollectionRef = parentDocRef.collection(subcollectionName).where('hospitaluid', '==', hospitaluid).where('deleted', '==', 0);
        let query = subcollectionRef.where('pid', "==", pid);
        if (paymentStatus) {
            query = query.where('paymentStatus', "==", paymentStatus)
        }
        // If lastData is provided, add a filter to get data after the last timestamp


        const querySnapshot = await query.get();
        let temp_data = [];
        querySnapshot.forEach((doc) => {
            temp_data.push(doc.data());
        });
        console.log('One patients Data', temp_data);

        // Get the last visible document for pagination

        // Pass the ID of the last visible document to the callback function
        // This can be used for pagination to get the next set of data

        return temp_data;
    } catch (error) {
        throw error;
    }
}

export const getSelectedFieldData = async (collectionName, collectionuid, subcollectionName, hospitaluid, dischargeDate) => {
    try {

        // Get a reference to the parent document
        const parentDocRef = db.collection(collectionName).doc(collectionuid);

        // const subcollectionRef = parentDocRef.collection('opdPatient').where('hospitaluid', '==', hospitaluid);
        const subcollectionRef = parentDocRef.collection(subcollectionName).where('hospitaluid', '==', hospitaluid).where('deleted', '==', 0);
        let query = subcollectionRef
        if (dischargeDate) {
            query = query.where('dischargeDate', "==", "")
        }
        // if (selectedFields.length > 0) {
        //     query = query.select([...selectedFields])
        // }


        const querySnapshot = await query.get();
        let temp_data = [];
        querySnapshot.forEach((doc) => {
            temp_data.push(doc.data());
        });
        console.log('Selected fields data', temp_data);

        // Get the last visible document for pagination

        // Pass the ID of the last visible document to the callback function
        // This can be used for pagination to get the next set of data

        return temp_data;
    } catch (error) {
        throw error;
    }
}


export const addDataincollection = async (collectionName, data) => {
    const parentDocRef = db.collection(collectionName);
    const timestamp = new Date();
    try {
        // Create a new document within the subcollection and set its data
        const docRef = await parentDocRef.add({
            timestamp: timestamp,
            ...data
        });

        const newDocSnapshot = await docRef.get();
        // const newDocData = newDocSnapshot.data();

        console.log("Document added to subcollection successfully!", newDocSnapshot);

        // Return the new added value
        return newDocSnapshot;
    } catch (error) {
        console.error("Error adding document to subcollection: ", error);
        throw error;
    }
};



export const updateDataincollection = async (collectionName, data) => {
    const parentDocRef = db.collection(collectionName);

    const timestamp = new Date();
    const query = parentDocRef.where('hospitaluid', '==', data.hospitaluid)
    query.get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                doc.ref.update({
                    ...data,
                    timestamp: timestamp
                })
                    .then(() => {
                        console.log('Document successfully updated!');
                    })
                    .catch(error => {
                        console.error('Error updating document: ', error);
                    });
            });
        })
        .catch(error => {
            console.log('Error getting documents: ', error);
        });

};