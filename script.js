const firebaseConfig = {
    apiKey: "AIzaSyCQncYbw-OAJ4_LNVK7D3TPc88M1JFpFDQ",
    authDomain: "te-extra-4345c.firebaseapp.com",
    databaseURL: "https://te-extra-4345c-default-rtdb.firebaseio.com",
    projectId: "te-extra-4345c",
    storageBucket: "te-extra-4345c.appspot.com",
    messagingSenderId: "119824797320",
    appId: "1:119824797320:web:0d3a9f746521c085d5593d"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const counterDylan = document.getElementById('counterDylan');
const counterMel = document.getElementById('counterMel');
const dylanButton = document.getElementById('dylanButton');
const melButton = document.getElementById('melButton');
const dylanNotification = document.getElementById('dylanNotification');
const melNotification = document.getElementById('melNotification');

const dylanRef = database.ref('contadores/dylan');
const melRef = database.ref('contadores/mel');

dylanRef.once('value', (snapshot) => {
    if (snapshot.val() === null) {
        dylanRef.set(0);
    }
});

melRef.once('value', (snapshot) => {
    if (snapshot.val() === null) {
        melRef.set(0);
    }
});

dylanRef.on('value', (snapshot) => {
    const count = snapshot.val() || 0;
    counterDylan.textContent = count;
});

melRef.on('value', (snapshot) => {
    const count = snapshot.val() || 0;
    counterMel.textContent = count;
});

dylanButton.addEventListener('click', () => {
    dylanRef.transaction((contadorActual) => {
        createFloatingHeart();
        database.ref('notificaciones/mel').set({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            estado: true
        });
        
    }, (error, committed, snapshot) => {
        if (error) {
            console.error('Error en la transacción de Dylan:', error);
        } else if (!committed) {
            console.log('Transacción de Dylan cancelada');
        } else {
            console.log('Contador de Dylan actualizado:', snapshot.val());
        }
    });
});

melButton.addEventListener('click', () => {
    melRef.transaction((contadorActual) => {
        createFloatingHeart();
        database.ref('notificaciones/dylan').set({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            estado: true
        });
        
    }, (error, committed, snapshot) => {
        if (error) {
            console.error('Error en la transacción de Mel:', error);
        } else if (!committed) {
            console.log('Transacción de Mel cancelada');
        } else {
            console.log('Contador de Mel actualizado:', snapshot.val());
        }
    });
});

database.ref('notificaciones/dylan').on('value', (snapshot) => {
    const notificacion = snapshot.val();
    if (notificacion && notificacion.estado) {
        dylanNotification.style.display = 'block';
        setTimeout(() => {
            dylanNotification.style.display = 'none';
            database.ref('notificaciones/dylan').set({estado: false});
        }, 3000);
    }
});

database.ref('notificaciones/mel').on('value', (snapshot) => {
    const notificacion = snapshot.val();
    if (notificacion && notificacion.estado) {
        melNotification.style.display = 'block';
        setTimeout(() => {
            melNotification.style.display = 'none';
            database.ref('notificaciones/mel').set({estado: false});
        }, 3000);
    }
});

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.style.left = `${Math.random() * window.innerWidth}px`;
    heart.style.top = '0';
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 10000);
}

function createFallingHearts() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.classList.add('falling-heart');
            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.animationDuration = `${Math.random() * 2 + 3}s`; // Between 3-5s
            document.body.appendChild(heart);

            // Remove the heart from the DOM after animation
            setTimeout(() => {
                heart.remove();
            }, 5000);
        }, i * 100); // Stagger the creation of hearts
    }
}

dylanButton.addEventListener('click', () => {
    dylanRef.transaction((contadorActual) => {
        createFloatingHeart();
        createFallingHearts(); // Add this line
        database.ref('notificaciones/mel').set({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            estado: true
        });
        
        return Number(contadorActual || 0) + 1;
    }, (error, committed, snapshot) => {
        if (error) {
            console.error('Error en la transacción de Dylan:', error);
        } else if (!committed) {
            console.log('Transacción de Dylan cancelada');
        } else {
            console.log('Contador de Dylan actualizado:', snapshot.val());
        }
    });
});

melButton.addEventListener('click', () => {
    melRef.transaction((contadorActual) => {
        createFloatingHeart();
        createFallingHearts(); // Add this line
        database.ref('notificaciones/dylan').set({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            estado: true
        });
        
        return Number(contadorActual || 0) + 1;
    }, (error, committed, snapshot) => {
        if (error) {
            console.error('Error en la transacción de Mel:', error);
        } else if (!committed) {
            console.log('Transacción de Mel cancelada');
        } else {
            console.log('Contador de Mel actualizado:', snapshot.val());
        }
    });
});