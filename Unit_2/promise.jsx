// Creating a promise
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        const randomNum = Math.random();
        if (randomNum > 0.5) {
            resolve(`Success! Number: ${randomNum}`);
        } else {
            reject(`Failure! Number too low: ${randomNum}`);
        }
    }, 1000);
    