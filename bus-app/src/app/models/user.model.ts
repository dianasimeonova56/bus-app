export interface User {
    _id: String,
    first_name: String,
    last_name: String,
    email: String,
    phone_number: String,
    password: String,
    created_at: Date,
    user_role: String,
    isVerifiedAs: String
}