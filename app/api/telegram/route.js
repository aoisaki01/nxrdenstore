import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { event, order, stockAccount, usdCost, exchangeRate } = body;

        // AUTHENTICATION STRATEGY
        // - 'new_order': Public (No Auth required) - for customers
        // - 'processed': Protected (Token required) - for admins
        
        if (event !== 'new_order') {
             const authHeader = request.headers.get('Authorization');
             const token = authHeader && authHeader.split(' ')[1];
             
             const { verifyFirebaseToken } = await import('@/lib/auth-server');
             const user = await verifyFirebaseToken(token);
     
             if (!user) {
                  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
             }
        }

        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
            console.error("Telegram config missing");
            return NextResponse.json({ error: 'Telegram configuration missing' }, { status: 500 });
        }

        let message = '';

        if (event === 'new_order') {
            // Format for New Order (Customer Side)
            /*
            blur transaksi
            🛒 Web Site
            Receipt Order Code: ...
            */
            const { orderCode, productName, price, category, username, password, backupCode, whatsapp } = body;
            const timeString = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

            message = `
blur transaksi
🛒 *Web Site*
🧾 *Order Code:* \`${orderCode}\`
📦 *Product:* ${productName}
💰 *Price:* Rp ${Number(price).toLocaleString('id-ID')}
Bg *Category:* ${category}
👤 *Username:* \`${username}\`
🔑 *Password:* \`${password}\`
${backupCode ? `🔐 *Backup Code:* \`${backupCode}\`\n` : ''}
⏰ *Time:* ${timeString}
📌 *Status:* PENDING
            `.trim();

        } else {
            // Format for Processed Order (Admin Side)
            if (!order) return NextResponse.json({ error: 'Missing order details' }, { status: 400 });

            message = `
✅ *ORDER PROCESSED*

📦 *Item:* ${order.productName}
Rp ${order.price?.toLocaleString('id-ID')}

👤 *Customer:* ${order.username}
🔐 *Pass:* ${order.password}
${order.backupCode ? `🔏 *Backup:* \`${order.backupCode}\`\n` : ''}
📱 *WhatsApp:* ${order.whatsapp || '-'}

---
💰 *Internal Cost:* $${usdCost?.toFixed(2)} (Rate: ${exchangeRate})
📧 *Processed via:* ${stockAccount}
            `.trim();
        }

        // Send to Telegram
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const res = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const telegramData = await res.json();

        if (!telegramData.ok) {
            console.error("Telegram Error:", telegramData);
            return NextResponse.json({ error: 'Failed to send to Telegram', details: telegramData }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Telegram API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
