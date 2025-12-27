import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const passengerSchema = new Schema({
    first_name: {
        type: String,
        required: [true, "First name field is required!"],
        minLength: [3, 'First name should be at least 3 chars long'],
    },
    last_name: {
        type: String,
        required: [true, "Last name field is required!"],
        minLength: [3, 'Last name should be at least 3 chars long'],
    },
    email: {
        type: String,
        required: [true, "Email field is required!"],
        minLength: [10, 'Email should be at least 10 chars long']
    },
    phone_number: {
        type: String,
        required: [true, "Phone number field is required!"],
    },
    password: {
        required: [true, "Password is required!"],
        minLength: [4, 'Password should be at least 4 chars long']
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now 
    },
    user_role: {
         type: String,
        enum: ['passenger', 'admin'],
    }
})

passengerSchema.pre('save', async function() {
    this.password = await bcrypt.hash(this.password, 10);
})

const Passenger = model('Passenger', passengerSchema)

export default Passenger;