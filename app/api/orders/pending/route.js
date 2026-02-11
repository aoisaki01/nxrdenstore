import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        // 1. Verify Authentication
        const authHeader = request.headers.get('Authorization');
        const token = authHeader && authHeader.split(' ')[1];
        
        const { verifyFirebaseToken } = await import('@/lib/auth-server');
        const user = await verifyFirebaseToken(token);

        if (!user) {
             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Fetch Pending Orders from Firebase Realtime Database via REST
        // We use the ID Token to authenticate against the database (since rules require auth)
        // We also use orderBy="status"&equalTo="pending" to filter on the server side
        
        const dbUrl = "https://nordenstore-default-rtdb.asia-southeast1.firebasedatabase.app";
        const query = `?auth=${token}&orderBy="status"&equalTo="pending"`;
        
        const response = await fetch(`${dbUrl}/orders.json${query}`);
        
        if (!response.ok) {
            throw new Error(`Firebase Error: ${response.statusText}`);
        }

        const data = await response.json();

        // 3. Transform Data (Object to Array)
        // Firebase returns { "id1": {..}, "id2": {..} }
        // We want [ { id: "id1", ... }, { id: "id2", ... } ]
        const orders = data ? Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value
        })) : [];

        // Sort by date (newest first)
        orders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        return NextResponse.json(orders);

    } catch (error) {
        console.error("Pending Orders API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
