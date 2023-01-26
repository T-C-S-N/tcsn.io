class Project {
   _id: string
   title: string
   description: string
   details: string
   url: string
   isOnline: string
   createdAt: Date
   updatedAt: Date

   constructor(data: any) {
      this._id = data._id
      this.title = data.title
      this.description = data.description
      this.details = data.details
      this.url = data.url ? data.url : ''
      this.isOnline = data.isOnline ? data.isOnline : false
      this.createdAt = data.createdAt ? data.createdAt : new Date().toISOString()
      this.updatedAt = data.updatedAt ? data.updatedAt : new Date().toISOString()
   }

   static async checkForm(data: any) {
      if (!data.title) throw new Error('Title is required')
      if (!data.description) throw new Error('Description is required');
      if (!data.details) throw new Error('Details is required');

      return true
   }
}

export default Project