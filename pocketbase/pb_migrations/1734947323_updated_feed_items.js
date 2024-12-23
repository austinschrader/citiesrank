/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x16smsxafwg9b0c")

  collection.createRule = "@request.auth.id != \"\" && (@request.auth.id = @request.data.curator || @request.auth.isAdmin = true)"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x16smsxafwg9b0c")

  collection.createRule = "@request.auth.id != \"\" && @request.auth.id = @request.data.curator"

  return dao.saveCollection(collection)
})
