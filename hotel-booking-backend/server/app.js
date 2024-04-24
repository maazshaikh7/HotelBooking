const express = require('express');
const cors = require('cors');
const mongoose =require('mongoose');
const app = express();
const port = 5000;
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userController = require('./userController');
const crypto = require('crypto');
const { PDFDocument } = require('pdf-lib');
const { v4: uuidv4 } = require('uuid');



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// Signup route
app.post('/signup', userController.signup);

// Login route
app.post('/login', userController.login);


mongoose.connect('{{YOUR DATABASE LINK}}', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Find the user in your database using the provided 'username'
      const user = await User.findOne({ email: username });

      // If the user is not found, return an error
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      // Check if the provided 'password' matches the user's password
      const passwordMatch = await user.comparePassword(password);

      // If the password doesn't match, return an error
      if (!passwordMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

      // If the user and password are valid, return the user object
      return done(null, user);
    } catch (error) {
      // If an error occurs during authentication, return the error
      return done(error);
    }
  })
);


const bookingsByUserSchema = new mongoose.Schema({
  username: String,
  owner: String,
  bookingID: {
    type: String,
    unique: true,
    required: true,
  },
  startDate: Date,
  endDate: Date,
  roomID: String,
  email: String,
  address: String,
  sellerphonenumber: Number,
});

const BookingsByUser = mongoose.model('BookingsByUser', bookingsByUserSchema);

app.get('/invoicePDF/:bookingID', async (req, res) => {
  const { bookingID } = req.params;
  try {
    const booking = await BookingsByUser.findOne({ bookingID });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const pdfDoc = await PDFDocument.PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();
    const contentStream = pdfDoc.createContentStream([
      PDFDocument.PDFObject.fromJSON({ operator: 'BT' }),
      PDFDocument.PDFObject.fromJSON({ operator: 'Tf', operands: ['/Helvetica', 24] }),
      PDFDocument.PDFObject.fromJSON({ operator: 'Td', operands: [50, height - 50] }),
      PDFDocument.PDFObject.fromJSON({ operator: 'Tj', operands: [`${booking.bookingID}`] }),
      PDFDocument.PDFObject.fromJSON({ operator: 'ET' }),
    ]);

    page.getOperatorList().addContent(contentStream);
    page.drawText(`Invoice for Booking: ${booking.bookingID}`, { x: 50, y: height - 50 });

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${booking.bookingID}.pdf`);
    res.send(pdfBytes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const hotelSchema = new mongoose.Schema({
  allhotelID: {
    type: String,
    unique: true,
    required: true,
  },
  roomIDs: [String],
  name: String,
  location: String,
  numberOfRooms: {
    type: Number,
    default: 0,
  },
});

const Hotel = mongoose.model('Hotel', hotelSchema);

app.get('/AllHotels', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

app.post('/AllHotelsCreate', async (req, res) => {
  try {
    const uniqueHotelID = generateUniqueHotelID();
    const hotelData = { allhotelID: uniqueHotelID, ...req.body };
    const hotel = new Hotel(hotelData);
    await hotel.save();
    res.json({ message: 'Hotel created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create hotel' });
    }
  }
});

function generateUniqueHotelID() {
  return uuidv4();
}



app.get('/InvoiceInfo/:bookingID', async (req, res) => {
  const { bookingID } = req.params;

  try {
    // Fetch the booking data from the database based on bookingID
    const booking = await BookingsByUser.findOne({ bookingID });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching invoice data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const feedbackSchema = new mongoose.Schema({
  roomID: String,
  cleanlinessRating: Number,
  serviceRating: Number,
  comfortRating: Number,
  locationRating: Number,
  valueRating: Number,
  feedbackText: String,
  suggestions: String,
});


const Feedback = mongoose.model('Feedback', feedbackSchema);

app.post('/feedback/:roomID', async (req, res) => {
  const { roomID } = req.params;
  const feedbackData = req.body;
  try {
    // Find all feedback entries for the given room
    const feedbackEntries = await Feedback.find({ roomID });

  if (feedbackEntries.length > 0) {
    // Calculate the average ratings from all feedback entries
    const avgCleanlinessRating =
      feedbackEntries.reduce((total, entry) => total + entry.cleanlinessRating, 0) /
      feedbackEntries.length;

    const avgServiceRating =
      feedbackEntries.reduce((total, entry) => total + entry.serviceRating, 0) /
      feedbackEntries.length;

    const avgComfortRating =
      feedbackEntries.reduce((total, entry) => total + entry.comfortRating, 0) /
      feedbackEntries.length;

    const avgLocationRating =
      feedbackEntries.reduce((total, entry) => total + entry.locationRating, 0) /
      feedbackEntries.length;

    const avgValueRating =
      feedbackEntries.reduce((total, entry) => total + entry.valueRating, 0) /
      feedbackEntries.length;

    // Calculate the overall rating as the average of the individual ratings
    const overallRating =
    Math.floor((avgCleanlinessRating + avgServiceRating + avgComfortRating + avgLocationRating + avgValueRating) / 5);

    // Find and update the room's rating with the new overall rating
    const room = await Room.findOne({ roomID });
    console.log(overallRating)
    if(room.rating===0){
      room.rating = Math.floor(overallRating);
      await room.save();
    }
    room.rating = Math.floor(room.rating+overallRating)/2;
    await room.save();
  }
} catch (error) {
  res.status(500).json({ error: 'Internal server error' });
}
  try {
    const newFeedback = new Feedback({ roomID, ...feedbackData });
    await newFeedback.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


const hotelBookingDataSchema = new mongoose.Schema({
  daysOccupied: {
    type: Number,
    default: 0,
  },
  bookedByUsername: {
    type: String,
    default: '',
  },
  totalCost: {
    type: Number,
    default: 0,
  },
  accomodates: {
    type: Number,
    default: 1,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  }
});

app.get('/room-details/:roomID', async (req, res) => {
  try {
    const requestedRoomID = req.params.roomID;
    const room = await Room.findOne({ roomID: requestedRoomID });
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    console.error('Error retrieving room data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const roomSchema = new mongoose.Schema({
  parentHotel: String,
  roomID: {
    type: String,
    unique: true, 
    required: true, 
  },
  title: String,
  description: String,
  price: Number,
  amenities: [String],
  photos: [String],
  location: String,
  sellerphonenumber: Number,
  rating: {
    type: Number,
    default: 0,
  },
  categories: [String],
  address: String,
  latitude: Number, 
  longitude: Number,
  owner: String,
  bookings: [hotelBookingDataSchema],
  overallTotalCost: {
    type: Number,
    default: 0,
  },
  unique: String,
  room_layout: String,
  promotion: {
    type:Number,
    default:0,
  },
  
});

app.get('/landingpagerooms', async (req, res) => {
  try {
    const rooms = await Room.find({})
      .sort({ promotion: -1 }) 
      .limit(2);
    const formattedRooms = rooms.map((room) => ({
      hotel_layout: room.hotel_layout,
      name: room.title,
      amenities: room.amenities,
      price: room.price,
      title: room.title,
      photo: room.photos,
      RoomID: room.roomID
    }));

    res.json(formattedRooms);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/book-room/:roomID', async (req, res) => {
  const { roomID } = req.params;
  const { startDate, endDate, bookedByUsername, totalCost, daysOccupied,email } = req.body
  try {
    const room = await Room.findOne({ roomID });
    const newBooking = {
      startDate,
      endDate,
      bookedByUsername,
      totalCost,
      daysOccupied,
    };

    const uniqueBookingID = generateUniqueBookingID();
    console.log(uniqueBookingID)
    const userBooking = new BookingsByUser({
      roomID,
      username: bookedByUsername,
      owner: room.owner,
      bookingID: uniqueBookingID,
      startDate,
      endDate,
      email:email,
      address: room.address,
      sellerphonenumber: room.sellerphonenumber,
    });
    await userBooking.save();
    room.bookings.push(newBooking);
    room.overallTotalCost += totalCost;
    await room.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error booking the room:', error);
    res.status(500).json({ error: 'Booking failed' });
  }
});



app.get('/profile', async (req, res) => {
  const username = req.query.username;
  console.log(username)
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  const rooms = await Room.find({ owner: username });
  res.json({ username, rooms });
});

// Read hotel data from Mongo
app.get('/allhotels/:parentHotel', async (req, res) => {
  try {
    const parentHotel = req.params.parentHotel; 
    const roomsWithFirstPhotos = await Room.find({ parentHotel }, 'roomID id title price location categories rating photos').exec();
    const rooms = roomsWithFirstPhotos.map((room) => {
      return {
        roomID: room.roomID,
        id: room.id,
        title: room.title,
        price: room.price,
        location: room.location,
        categories: room.categories,
        rating: room.rating,
        photos: room.photos.length > 0 ? room.photos[0] : null,
      };
    });
    console.log(rooms);
    res.json(rooms);
  } catch (error) {
    console.error('Error retrieving room data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.get('/UserBookings', async (req, res) => {
    const username = req.query.username;
    console.log("Hi "+username)
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    const userBookings = await BookingsByUser.find({ username });
    console.log(userBookings)
    res.json({ bookings: userBookings });
});


app.get('/hotel/:roomID', async (req, res) => {
  try {
    const requestedRoomID = req.params.roomID;
    const room = await Room.findOne(
      { roomID: requestedRoomID },
      ' -overallTotalCost -bookings.bookedByUsername -bookings.totalCost -bookings.accomodates -bookings.daysOccupied'
    ); 
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
    console.log(room);
  } catch (error) {
    console.error('Error retrieving room data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


function generateUniqueRoomID() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 6;
  let roomID = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomID += characters[randomIndex];
  }
  return roomID;
}

const Room = mongoose.model('Room', roomSchema);
app.post('/roomsadd', async (req, res) => {
  const uniqueRoomID = generateUniqueRoomID();
  console.log(req.body);
  const { title, description, price, amenities, photos, location, sellerphonenumber,categories, address, latitude ,longitude, owner,room_layout, unique, parentHotel} = req.body;
  const room = new Room({ roomID: uniqueRoomID, title, description, price, amenities, photos, location, sellerphonenumber, categories, address,latitude ,longitude, owner,room_layout, unique, parentHotel });
   
  try {
    await room.save();
    
    const filter = { allhotelID: parentHotel };
    const update = {
      $push: { roomIDs: room.roomID }, 
      $inc: { numberOfRooms: 1 }, 
    };
    
    await Hotel.findOneAndUpdate(filter, update);

    res.json({ message: 'Room added successfully' });
  } 
    catch (error) {
    res.status(500).json({ error: 'Failed to add room' });
  }
});

function generateUniqueBookingID() {
  const randomBuffer = crypto.randomBytes(10);
  const hexString = randomBuffer.toString('hex');
  const bookingID = hexString.slice(0, 20);
  return bookingID;
}



app.post('/check-credentials', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await user.findOne({ username, password });
    if (user) {
      return res.json({ success: true, message: 'Credentials are valid.' });
    }
    return res.json({ success: false, message: 'Invalid credentials.' });
  } catch (error) {
    console.error('Error checking credentials:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

const admin = [
  { username: "admin", password: "admin@123" },
  { username: "user2", password: "password2" },
];

app.post("/adminlogin", (req, res) => {
  const { username, password } = req.body;
  const matchedAdmin = admin.find((user) => user.username === username && user.password === password);
  if (matchedAdmin) {
    res.status(200).json({ message: "Authentication successful" });
  } else {
    res.status(401).json({ message: "Authentication failed" });
  }
});


const transactionSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  bookedByUsername: String,
  totalCost: Number,
  daysOccupied: Number,
  email: String,
  owner: String,
  roomID: String,
  breakfast: Boolean,
  lunch: Boolean,
  dinner: Boolean,
  TotalTransaction: Number, 
});

const TransactionData = mongoose.model('TransactionData', transactionSchema);

app.post('/create-transaction/:roomID', async (req, res) => {
  const { roomID } = req.params;
  try {
    const {
      startDate,
      endDate,
      bookedByUsername,
      totalCost,
      daysOccupied,
      email,
      owner,
      roomID,
      breakfast,
      lunch,
      dinner,
    } = req.body;
    console.log(req.body);

    const TotalTransaction =
    (breakfast ? 500 : 0) * daysOccupied +
    (lunch ? 500 : 0) * daysOccupied +
    (dinner ? 500 : 0) * daysOccupied + totalCost;

    console.log(TotalTransaction);

    const transactionData = new TransactionData({
      startDate,
      endDate,
      totalCost,
      bookedByUsername,
      daysOccupied,
      email,
      owner,
      roomID,
      breakfast,
      lunch,
      dinner,
      TotalTransaction,
    });

    const savedTransactionData = await transactionData.save();
    res.status(201).json(savedTransactionData);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Error creating transaction' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
