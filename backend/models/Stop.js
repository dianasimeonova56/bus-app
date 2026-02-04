import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';

const baseOptions = {
  discriminatorKey: 'type',
  collection: 'stops',
};

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const stopSchema = new Schema({
  name: {
    type: String,
    required: [true, "Stop name field is required!"]
  },
  address: {
    type: String,
    required: [true, "Stop address field is required!"]
  },
  location: {
    type: pointSchema,
    required: [true, "Location is required!"]
  },
  type: {
    type: String,
    enum: ['Bus Station', 'Normal Stop']
  },
}, baseOptions)

const Stop = model('Stop', stopSchema)

const busStationSchema = new Schema({
  sectors: {
    type: Number,
    required: true
  },
  isMainStation: {
    type: Boolean,
    default: false
  },
  west: {
    type: Boolean,
    default: false
  },
  south: {
    type: Boolean,
    default: false
  }
});

Stop.discriminator('Bus Station', busStationSchema)

export default Stop;