class User {
   _id: string
   firstname: string
   lastname: string
   email: string
   password: string
   role: string
   createdAt: Date
   updatedAt: Date
   accessToken: string
   accessTokenExpiry: Date
   verified: boolean
   emailToken: string
   emailVerified: boolean
   emailVerifiedAt: Date

   constructor(data: any) {
      this._id = data._id
      this.firstname = data.firstname
      this.lastname = data.lastname
      this.email = data.email
      this.password = data.password
      this.role = data.role ? data.role : 'user'
      this.createdAt = data.createdAt ? data.createdAt : new Date().toISOString()
      this.updatedAt = data.updatedAt ? data.updatedAt : new Date().toISOString()
      this.accessToken = data.accessToken
      this.accessTokenExpiry = data.accessTokenExpiry
      this.verified = data.verified ? data.verified : false
      this.emailToken = data.emailToken
      this.emailVerified = data.emailVerified ? data.emailVerified : false
      this.emailVerifiedAt = data.emailVerifiedAt
   }

   static async checkForm(data: any) {
      if (!data.firstname) throw new Error('Firstname is required')
      if (!data.lastname) throw new Error('Lastname is required');
      if (!data.email) throw new Error('Email is required');
      if (data.email.search(/@/) === -1 || data.email.search(/\./) === -1) throw new Error('Email incorrect');
      if (!data.password) throw new Error('Password is required');
      if (!data.passwordConfirm) throw new Error('Password confirmation is required');
      if (data.password !== data.passwordConfirm) throw new Error('Passwords do not match');
      if (data.password.length < 6) throw new Error('Password must be at least 6 characters long');
      if (data.password.length > 20) throw new Error('Password must be less than 20 characters long');
      if (data.password.search(/[a-zA-Z]/) === -1) throw new Error('Password must contain at least one letter');
      if (data.password.search(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) === -1) throw new Error('Password must contain at least one special character');
      if (data.password.search(/[A-Z]/) === -1) throw new Error('Password must contain at least one uppercase letter');
      if (data.password.search(/[a-z]/) === -1) throw new Error('Password must contain at least one lowercase letter');
      if (data.password.search(/[0-9]/) === -1) throw new Error('Password must contain at least one digit');
      if (data.password.search(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) === -1) throw new Error('Password must contain at least one special character');

      return true
   }
}

export default User