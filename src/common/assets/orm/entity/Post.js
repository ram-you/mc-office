
 
 

module.exports =  {
  name: "Post",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    title: {
      type: String
    },
    text: {
      type: String
    }
  }
}