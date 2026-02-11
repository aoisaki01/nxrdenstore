import { getSheetData, updateSheetBalance } from '@/lib/googleSheets';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const data = await getSheetData();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const authHeader = request.headers.get('Authorization');
        const token = authHeader && authHeader.split(' ')[1];
        
        const { verifyFirebaseToken } = await import('@/lib/auth-server');
        const user = await verifyFirebaseToken(token);

        if (!user) {
             return NextResponse.json({ error: 'Unauthorized: Invalid Token' }, { status: 401 });
        }
        
        // Optional: Check if email matches admin email if needed
        // const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        // if (ADMIN_EMAIL && user.email !== ADMIN_EMAIL) { ... }

        const body = await request.json();

        // CREATE: Add new row
        if (body.email && body.balance !== undefined) {
             const { appendRow } = await import('@/lib/googleSheets');
             await appendRow(body.email, body.balance);
             return NextResponse.json({ success: true, action: 'create' });
        }

        // UPDATE: Update existing row balance
        if (body.rowIndex && body.newBalance !== undefined) {
            // Require secondary password for processing orders (deducting balance)
            const processSecret = request.headers.get('x-process-secret');
            if (processSecret !== process.env.PROCESS_ORDER_SECRET) {
                return NextResponse.json({ error: 'Invalid Process Password' }, { status: 403 });
            }

            await updateSheetBalance(body.rowIndex, body.newBalance);
            return NextResponse.json({ success: true, action: 'update' });
        }
        
        return NextResponse.json({ error: 'Invalid payload. Use {email, balance} for create or {rowIndex, newBalance} for update.' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
