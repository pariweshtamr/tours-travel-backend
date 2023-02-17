import User from "./UserSchema.js"

export const getAllUsers = () => {
  return User.find()
}
export const getUserById = (_id) => {
  return User.findById(_id)
}
export const getUserByFilter = (filter) => {
  return User.findOne(filter)
}
export const createUser = (obj) => {
  return User(obj).save()
}
export const updateUser = (filter, obj) => {
  return User.findByIdAndUpdate(filter, obj, { new: true })
}
export const deleteUser = (_id) => {
  return User.findByIdAndDelete(_id)
}
