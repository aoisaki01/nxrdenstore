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
        const password = request.headers.get('x-admin-password');
        if (password !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // CREATE: Add new row
        if (body.email && body.balance !== undefined) {
             const { appendRow } = await import('@/lib/googleSheets');
             await appendRow(body.email, body.balance);
             return NextResponse.json({ success: true, action: 'create' });
        }

        // UPDATE: Update existing row balance
        if (body.rowIndex && body.newBalance !== undefined) {
            await updateSheetBalance(body.rowIndex, body.newBalance);
            return NextResponse.json({ success: true, action: 'update' });
        }
        
        return NextResponse.json({ error: 'Invalid payload. Use {email, balance} for create or {rowIndex, newBalance} for update.' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
