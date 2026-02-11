
// This uses the Google Identity Toolkit API to verify a Firebase ID Token.
// It requires the Firebase Web API Key (NEXT_PUBLIC_FIREBASE_API_KEY).
// This is a server-side helper to validate that a request comes from a logged-in user.

const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export async function verifyFirebaseToken(token) {
    if (!token) return null;

    try {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idToken: token,
            }),
        });

        const data = await response.json();

        if (data.users && data.users.length > 0) {
            return data.users[0]; // Returns user object including email, localId, etc.
        }
        
        console.error("Token verification failed:", data.error || "No user found");
        return null;
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
}
