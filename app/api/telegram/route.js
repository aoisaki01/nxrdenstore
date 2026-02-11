export async function POST(request) {
    try {
        const body = await request.json();
        const { type = 'new_order', ...data } = body;

        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (!BOT_TOKEN || !CHAT_ID) {
            return Response.json({ error: 'Telegram configuration missing' }, { status: 500 });
        }

        let message = '';

        if (type === 'new_order') {
            message = [
                `*🛍️ New Order Received!*`,
                `🧾 *Code:* \`${data.orderCode}\``,
                ``,
                `📦 *Product:* ${data.productName}`,
                `💰 *Price:* Rp ${Number(data.price).toLocaleString('id-ID')}`,
                `📁 *Category:* ${data.category || 'Regular'}`,
                ``,
                `👤 *Username:* \`${data.username}\``,
                `🔑 *Password:* \`${data.password}\``,
                data.backupCode ? `🔐 *Backup:* \`${data.backupCode}\`` : '',
                `📱 *WhatsApp:* \`${data.whatsapp}\``,
                ``,
                `⏰ *Time:* ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`,
                `⏳ *Status:* PENDING`,
            ].filter(Boolean).join('\n');
        } else if (type === 'order_complete') {
            message = [
                `*✅ Order Completed!*`,
                `🧾 *Code:* \`${data.orderCode}\``,
                ``,
                `📦 *Product:* ${data.productName}`,
                `👤 *Username:* \`${data.username}\``,
                ``,
                `👮 *Processed By:* ${data.processedBy}`,
                `⏰ *Time:* ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`,
                `🎉 *Status:* DONE`,
            ].filter(Boolean).join('\n');
        } else {
            return Response.json({ error: 'Invalid notification type' }, { status: 400 });
        }

        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
            }),
        });

        const resData = await res.json();

        if (!resData.ok) {
            console.error('Telegram API error:', resData);
            return Response.json({ error: 'Telegram send failed' }, { status: 500 });
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error('Telegram notification error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
