import { randomBytes } from 'crypto';

function generateUniqueBookingID() {
    const randomBuffer = randomBytes(10);
    const hexString = randomBuffer.toString('hex');
    const bookingID = hexString.slice(0, 20);
    return bookingID;
}