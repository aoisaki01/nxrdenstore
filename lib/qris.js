
/**
 * Calculates CRC16 (CCITT-FALSE) for the QRIS string.
 * Polymer / EMVCo standard.
 */
function crc16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Generates a dynamic QRIS string with the specified amount.
 * @param {string} qris - The original static QRIS string.
 * @param {number} amount - The amount to inject.
 * @returns {string} - The new dynamic QRIS string.
 */
export function generateDynamicQRIS(qris, amount) {
  // 1. Remove CRC (Tag 63) and everything after it (if any)
  // QRIS ends with "6304" then 4 chars of CRC.
  // We need to rebuild it.
  
  // Actually, simpler method: 
  // Locate Tag 54 (Transaction Amount). If not present, we insert it.
  // If present, we replace it.
  // Tag 58 (Country Code) is usually before 59 (Merchant Name).
  // Tag 53 (Currency) -> 360 (IDR).
  // Tag 54 (Amount).

  // A naive replace might allow multiple tags if order matters, but usually standard order is maintained.
  // Let's parse minimally.
  
  // Note: This is a simplified "inject or replace" approach.
  // Real parsing is safer but complex. 
  // Assuming standard Qris: 
  // It usually has "5303360" (IDR).
  // We want to add/replace "54" (Amount) after "53".

  let newQris = qris;
  
  // Trim existing CRC (last 4 chars) and its tag "6304"
  if (newQris.slice(-4).match(/^[0-9A-F]{4}$/i)) {
      // Check if ends with 6304XXXX
      if (newQris.slice(-8, -4) === '6304') {
          newQris = newQris.slice(0, -8);
      }
  }

  // Remove existing Amount (Tag 54) if exists
  // Regex: 54 + length (01-99) + value
  // It's safer to just build a new string if we had a parser.
  // For now, let's try to remove tag 54 manually if we find it.
  // This is risky with regex on global string.
  
  // Implementation Strategy:
  // 1. Split into TLV.
  // 2. Rebuild with new Amount.
  // 3. Append CRC.
  
  const tags = {};
  let index = 0;
  while (index < newQris.length) {
      const id = newQris.substr(index, 2);
      const lenStr = newQris.substr(index + 2, 2);
      const len = parseInt(lenStr, 10);
      if (isNaN(len)) break;
      const value = newQris.substr(index + 4, len);
      tags[id] = value;
      index += 4 + len;
  }

  // Update Amount (Tag 54)
  // Check strict mode: 01 for point of initiation method (11=static, 12=dynamic)
  // Usually we change 01 to 12 for dynamic, but 11 works often too.
  // Let's set 01 to 12 if we want to be "Dynamic".
  if (tags['01'] === '11') tags['01'] = '12';

  const amountStr = amount.toString();
  tags['54'] = amountStr; // Tag 54 is Amount

  // Sort tags? EMVCo says tag order: 00-63.
  const orderedKeys = Object.keys(tags).sort((a, b) => parseInt(a) - parseInt(b));
  
  let payload = '';
  orderedKeys.sort().forEach(tag => {
      const val = tags[tag];
      const len = val.length.toString().padStart(2, '0');
      payload += tag + len + val;
  });

  // Append CRC Tag 63
  payload += '6304';
  const crcVal = crc16(payload);
  return payload + crcVal;
}
