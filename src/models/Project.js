import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  alt: String,
  src: {
    type: String,
    required: true
  },
  type: String,
  width: Number,
  height: Number,
  class: String
}, { _id: false })

const librarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  images: [imageSchema]
}, { _id: false })

const detailItemSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
}, { _id: false })

const projectSchema = new mongoose.Schema({
  display: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  titleColor: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  details: [detailItemSchema],
  thumbnail: imageSchema,
  libraries: [librarySchema],
  url: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isOnline: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'projects'
})

// Indexes
projectSchema.index({ title: 1 })
projectSchema.index({ type: 1 })
projectSchema.index({ tags: 1 })
projectSchema.index({ display: 1 })
projectSchema.index({ createdAt: -1 })

// Methods
projectSchema.methods.toJSON = function() {
  const project = this.toObject()
  return project
}

projectSchema.methods.getDisplayTags = function() {
  return this.tags.join(', ')
}

// Static methods
projectSchema.statics.findByType = function(type) {
  return this.find({ type: type, display: true })
}

projectSchema.statics.findDisplayed = function() {
  return this.find({ display: true }).sort({ createdAt: -1 })
}

projectSchema.statics.findByTag = function(tag) {
  return this.find({ 
    tags: { $in: [tag] }, 
    display: true 
  }).sort({ createdAt: -1 })
}

projectSchema.statics.checkUpdateForm = function(data) {
  if (!data.title) {
    throw new Error('Title is required')
  }
  if (!data.type) {
    throw new Error('Type is required')
  }
  if (!data.description) {
    throw new Error('Description is required')
  }
  return true
}

const Project = mongoose.model('Project', projectSchema)

export default Project
