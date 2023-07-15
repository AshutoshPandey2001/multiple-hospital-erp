/* eslint-disable prettier/prettier */
import { useDispatch } from "react-redux";
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

export const addDatainsubcollection = (collectionName, collectionuid, subcollectionName, data) => {
    const parentDocRef = db.collection(collectionName).doc(collectionuid);

    // Access the specific subcollection
    const subcollectionRef = parentDocRef.collection(subcollectionName);
    const timestamp = new Date();
    // Create a new document within the subcollection and set its data
    subcollectionRef.add({
        timestamp: timestamp,
        ...data
    })
        .then(async (docRef) => {
            // console.log("Document added to subcollection successfully!", await docRef.get());
        })
        .catch(function (error) {
            console.error("Error adding document to subcollection: ", error);
        });
}


// get sub collection data

// export const getSubcollectionData = (collectionName, collectionuid, subcollectionName, hospitaluid) => {
//     // Get a reference to the parent document
//     var parentDocRef = db.collection(collectionName).doc(collectionuid);

//     // Access the specific subcollection
//     var subcollectionRef = parentDocRef.collection(subcollectionName);
//     var query = subcollectionRef.where('hospitaluid', '==', hospitaluid);

//     let temp_data = []
//     // Retrieve all documents from the subcollection
//     query.onSnapshot((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//             temp_data.push(doc.data())
//         });
//     })
//     return temp_data
//     // .then(function (querySnapshot) {
//     //     // 
//     //     console.log(querySnapshot);
//     //     // Iterate through the query snapshot to access the documents
//     //     // querySnapshot.forEach(function (doc) {
//     //     //     // Access the data of each document
//     //     //     var data = doc.data();
//     //     //     temp_data.push(data)
//     //     // });
//     //     // console.log('subcollection', temp_data);

//     // })
//     // .catch(function (error) {
//     //     console.error("Error getting documents: ", error);
//     // });

// }
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
export const getSubcollectionDataopd = async (collectionName, collectionuid, subcollectionName, hospitaluid, callback) => {
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


// update document in subcollection

export const updateDatainSubcollection = (collectionName, collectionuid, subcollectionName, data, cond1, cond2) => {
    const parentDocRef = db.collection(collectionName).doc(collectionuid);

    // Access the specific subcollection
    const subcollectionRef = parentDocRef.collection(subcollectionName);
    const query = subcollectionRef.where(cond2, '==', data[cond2]).where(cond1, '==', data[cond1])

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


// Delete data in subcollection

export const deleteDatainSubcollection = (collectionName, collectionuid, subcollectionName, data, cond1, cond2) => {
    const parentDocRef = db.collection(collectionName).doc(collectionuid);

    // Access the specific subcollection
    const subcollectionRef = parentDocRef.collection(subcollectionName);
    const query = subcollectionRef.where(cond2, '==', data[cond2]).where(cond1, '==', data[cond1])

    query.get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                doc.ref.delete()
                    .then(() => {
                        console.log('Document successfully Deleted!');
                    })
                    .catch(error => {
                        console.error('Error deleting document: ', error);
                    });
            });
        })
        .catch(error => {
            console.log('Error getting documents: ', error);
        });
}


// fill data in sub collection :-

export const filDatainsubcollection = (arrayName, collectionName, collectionuid, subcollectionName, cond1, cond2) => {
    arrayName.map(async (item) => {
        await updateDatainSubcollection(collectionName, collectionuid, subcollectionName, item, cond1, cond2)
    })
}


// update multipleData in sub collection 
export const updateMultiDatainSubcollection = (collectionName, collectionuid, subcollectionName, data, cond1, cond2, cond3, state) => {
    const parentDocRef = db.collection(collectionName).doc(collectionuid);

    // Access the specific subcollection
    const subcollectionRef = parentDocRef.collection(subcollectionName);
    const query = subcollectionRef.where(cond2, '==', state[cond2]).where(cond1, '==', state[cond1]).where(cond3, '==', state[cond3])

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
            console.log('querySnapshot', temp_data);
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

// get prev billNo

// export const getprevBillNo = (collectionName, collectionuid, subcollectionName, hospitaluid, callback) => {
//     return new Promise((resolve, reject) => {
//         // Get a reference to the parent document
//         const parentDocRef = db.collection(collectionName).doc(collectionuid);

//         // Access the specific subcollection
//         const subcollectionRef = parentDocRef.collection(subcollectionName);
//         const query = subcollectionRef.where('hospitaluid', '==', hospitaluid);

//         const unsubscribe = query.onSnapshot((querySnapshot) => {
//             let temp_data = {};
//             querySnapshot.forEach((doc) => {
//                 temp_data = doc.data();
//             });
//             console.log('querySnapshot', temp_data);
//             callback(temp_data)
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


// for only  changes  listeners

export const getOnlyChangesLisitnor = (collectionName, collectionuid, subcollectionName, hospitaluid, callback) => {
    return new Promise((resolve, reject) => {
        // Get a reference to the parent document
        const parentDocRef = db.collection(collectionName).doc(collectionuid);

        // Access the specific subcollection
        const subcollectionRef = parentDocRef.collection(subcollectionName);
        const query = subcollectionRef.where('hospitaluid', '==', hospitaluid);

        // Keep track of the latest document snapshot
        let latestSnapshot = null;

        const unsubscribe = query.onSnapshot((querySnapshot) => {
            let temp_data = undefined;

            // Process only the changes in the subcollection
            querySnapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    // Add new documents to temp_data
                    temp_data = change.doc.data()
                    console.log('new object', change.doc.data());
                }
                if (change.type === 'modified') {
                    temp_data = change.doc.data()
                    // console.log('modified object', change.doc.data());
                }
                if (change.type === 'removed') {
                    temp_data = change.doc.data()
                    // console.log('removed index', change.doc.data());
                }
            });

            // Update the latest snapshot for subsequent changes
            latestSnapshot = querySnapshot;

            // Pass temp_data to the callback function
            callback(temp_data);

            // Resolve the promise with temp_data
            resolve(temp_data);
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
};
