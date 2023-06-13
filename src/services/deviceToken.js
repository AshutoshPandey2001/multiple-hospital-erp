/* eslint-disable prettier/prettier */
import { messaging } from "src/firebaseconfig";

export const getDeviceToken = () => {
    return new Promise((resolve, reject) => {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                messaging.getToken().then(token => {
                    resolve(token);
                }).catch(error => {
                    reject(error);
                });
            } else {
                reject('Permission denied');
            }
        }).catch(error => {
            reject(error);
        });
    });
}
