
interface Image {
   alt: string,
   src: string,
   type: string
}

interface DetailItem {
   key: string,
   value: string,
}

class Project {
   _id?: string
   title: string
   titleColor: string
   description: string
   details: DetailItem[]
   thumbnail: Image
   images: Image[]
   desktopUI: Image[]
   mobileUI: Image[]
   url: string
   tags: string[]
   isOnline: boolean
   createdAt?: Date
   updatedAt?: Date

   constructor(data: any) {
      this._id = data._id
      this.title = data.title ? data.title : ''
      this.titleColor = data.titleColor ? data.titleColor : ''
      this.description = data.description ? data.description : ''
      this.details = data.details ? data.details : []
      this.thumbnail = data.thumbnail ? data.thumbnail : ''
      this.images = data.images ? data.images : []
      this.desktopUI = data.desktopUI ? data.desktopUI : []
      this.mobileUI = data.mobileUI ? data.mobileUI : []
      this.url = data.url ? data.url : ''
      this.tags = data.tags ? data.tags : []
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