interface Library {
   name: string,
   description: string,
   images: Image[]
}

interface Image {
   name: string,
   description: string,
   alt: string,
   src: string,
   type: string,
   width: number,
   height: number,
   class: string,
}

interface DetailItem {
   key: string,
   value: string,
}

class Project {
   _id?: string
   display: boolean
   type: string
   title: string
   titleColor: string
   description: string
   details: DetailItem[]
   thumbnail: Image
   libraries: Library[]
   url: string
   tags: string[]
   isOnline: boolean
   createdAt?: Date
   updatedAt?: Date

   constructor(data: any) {
      this._id = data._id
      this.display = data.display ? data.display : false
      this.type = data.type ? data.type : ''
      this.title = data.title ? data.title : ''
      this.titleColor = data.titleColor ? data.titleColor : ''
      this.description = data.description ? data.description : ''
      this.details = data.details ? data.details : []
      this.thumbnail = data.thumbnail ? data.thumbnail : ''
      this.libraries = data.libraries ? data.libraries : []
      this.url = data.url ? data.url : ''
      this.tags = data.tags ? data.tags : []
      this.isOnline = data.isOnline ? JSON.parse(data.isOnline.toString()) : false
      this.createdAt = data.createdAt ? data.createdAt : new Date().toISOString()
      this.updatedAt = data.updatedAt ? data.updatedAt : new Date().toISOString()
   }

   static async checkUpdateForm(data: any) {
      if (!data.title) throw new Error('Title is required')

      return true
   }
}

export default Project