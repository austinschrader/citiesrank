/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u9faetevylf7r8c")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = ""
  collection.deleteRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u9faetevylf7r8c")

  collection.listRule = "@request.auth.id != \"\" && (@request.auth.id = user.id || @request.auth.id = list.user)"
  collection.viewRule = "@request.auth.id != \"\" && (@request.auth.id = user.id || @request.auth.id = list.user)"
  collection.createRule = "@request.auth.id != \"\" && @request.auth.id != list.user"
  collection.deleteRule = "@request.auth.id = user.id"

  return dao.saveCollection(collection)
})
