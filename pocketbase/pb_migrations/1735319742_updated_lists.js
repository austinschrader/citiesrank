/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5iaqdk8ccqd45xr")

  collection.listRule = "@request.auth.id != \"\""
  collection.viewRule = ""
  collection.createRule = "@request.auth.id != \"\" && @request.data.user = @request.auth.id"
  collection.updateRule = "@request.auth.id != \"\" && @request.auth.id = user"
  collection.deleteRule = "@request.auth.id != \"\" && @request.auth.id = user"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5iaqdk8ccqd45xr")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
