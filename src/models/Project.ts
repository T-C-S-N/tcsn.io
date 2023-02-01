class Project {
   _id?: string
   title: string
   description: string
   details: string
   images: string[]
   url: string
   isOnline: boolean
   createdAt?: Date
   updatedAt?: Date

   constructor(data: any) {
      this._id = data._id
      this.title = data.title
      this.description = data.description
      this.details = data.details
      this.images = data.images ? data.images : []
      this.url = data.url ? data.url : ''
      this.isOnline = data.isOnline ? JSON.parse(data.isOnline.toString()) : false
      this.createdAt = data.createdAt ? data.createdAt : new Date().toISOString()
      this.updatedAt = data.updatedAt ? data.updatedAt : new Date().toISOString()
   }

   static async checkUpdateForm(data: any) {
      if (!data.title) throw new Error('Title is required')
      if (!data.description) throw new Error('Description is required');
      if (!data.details) throw new Error('Details is required');

      return true
   }
}

export default Project