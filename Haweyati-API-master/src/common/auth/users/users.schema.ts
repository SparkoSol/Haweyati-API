export const UsersSchema = {
    username: {
        type: String,
        required: false,
        unique: true
    },

    password: {
        type: String,
        required: false
    }
}