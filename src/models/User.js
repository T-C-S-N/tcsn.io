import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  verified: {
    type: Boolean,
    default: false
  },
  emailToken: {
    type: String,
    default: null
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerifiedAt: {
    type: Date,
    default: null
  },
  accessToken: {
    type: String,
    default: null
  },
  accessTokenExpiry: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  collection: 'users'
})

// Indexes
userSchema.index({ email: 1 })
userSchema.index({ accessToken: 1 })
userSchema.index({ emailToken: 1 })

// Methods
userSchema.methods.toJSON = function() {
  const user = this.toObject()
  delete user.password
  delete user.accessToken
  delete user.emailToken
  return user
}

userSchema.methods.getFullName = function() {
  return `${this.firstname} ${this.lastname}`
}

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() })
}

userSchema.statics.findByToken = function(token) {
  return this.findOne({ 
    accessToken: token,
    accessTokenExpiry: { $gt: new Date() }
  })
}

const User = mongoose.model('User', userSchema)

export default User
