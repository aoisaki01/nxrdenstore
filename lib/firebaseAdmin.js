import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        const serviceAccount = {
            projectId: "gen-lang-client-0093425634", // Using the same project ID as the service account
            clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        };

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
             // We can reuse the same service account for both Sheets and Firebase Auth
             // if it has the right permissions. If not, we might need to add "Firebase Admin" role to it in GCP.
             // Given the user said "sesuai auth di firebasenya", we are assuming this project is linked.
             // Wait, the project_id in .env.local is "gen-lang-client...". 
             // The Firebase config in lib/firebase.js says projectId is "nordenstore".
             // These are likely DIFFERENT projects. 
             // The Service Account in .env.local is for Google Sheets (likely a GCP project).
             // The Firebase Auth is on "nordenstore".
             // 
             // IF they are different, verifying "nordenstore" tokens with "gen-lang-client" SDK will FAIL.
             //
             // I need to check if I can verify tokens without a service account (just project ID) 
             // OR if I need a Service Account for "nordenstore".
             // 
             // Actually, `firebase-admin` needs a service account from the SAME project to verify tokens *easily*.
             // However, `verifyIdToken` verifies the signature. It checks if it was issued by the project.
             //
             // LET'S CHECK: The user provided a service account for "gen-lang-client-...".
             // The Firebase App is "nordenstore".
             // 
             // If I use the "gen-lang-client" cert to initialize the app, it might reject tokens from "nordenstore".
             // 
             // ALTERNATIVE: Use the "nordenstore" credentials if available?
             // The user only gave us the "gen-lang-client" key JSON.
             // 
             // Wait, maybe "gen-lang-client" IS "nordenstore"? 
             // lib/firebase.js: projectId: "nordenstore"
             // API/Sheets SA: project_id: "gen-lang-client-0093425634"
             // 
             // These are definitely different.
             // 
             // If I cannot verify the token with the provided Service Account, I CANNOT use firebase-admin easily 
             // unless I just trust the token decoding without signature verification (BAD) 
             // or I have the public keys for nordenstore (standard firebase auth public keys).
             // 
             // ACTUALLY, `admin.auth().verifyIdToken()` validates that the token was signed by Google 
             // and issued for the *app's* project.
             // If I init admin with Project A, and try to verify token from Project B, it will fail.
             //
             // RE-PLAN: checking if I can use a generic verify or if I need the user to provide
             // a Service Account specifically for "nordenstore".
             // 
             // Given the user wants "sesuai auth di firebase", they probably expect it to just work.
             // But I don't have the private key for "nordenstore".
             //
             // WORKAROUND: Client-side sending the token is good.
             // Server-side: I can use a simple `fetch` to Google's token info endpoint!
             // `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=[API_KEY]`
             // This uses the Web API Key (which I HAVE in lib/firebase.js) to validate the token.
             // 
             // This avoids needing a new Service Account for "nordenstore".
             // 
             // Let's DO THAT. It's lighter than firebase-admin and fits the constraints perfectly.
             
        });
    } catch (error) {
        console.error('Firebase Admin Init Error:', error.stack);
    }
}

export default admin;
