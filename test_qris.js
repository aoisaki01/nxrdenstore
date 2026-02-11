
import { generateDynamicQRIS } from './lib/qris.js';

const base = "00020101021126570011ID.DANA.WWW011893600915302259148102090225914810303UMI51440014ID.CO.QRIS.WWW0215ID10200176114730303UMI5204581253033605802ID5922Warung Sayur Bu Sugeng6010Kab. Demak610559567630458C7";
const amount = 1500;

console.log("Original:", base);
try {
    const dynamic = generateDynamicQRIS(base, amount);
    console.log("Dynamic: ", dynamic);
} catch (e) {
    console.error("Error:", e);
}
