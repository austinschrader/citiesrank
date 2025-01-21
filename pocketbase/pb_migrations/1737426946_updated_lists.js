/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5iaqdk8ccqd45xr")

  collection.listRule = "@request.auth.id != '' || visibility = 'public'"
  collection.viewRule = "@request.auth.id != '' || visibility = 'public'"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5iaqdk8ccqd45xr")

  collection.listRule = "@request.auth.id != \"\""
  collection.viewRule = "@request.auth.id != \"\" && @request.data.user = @request.auth.id"

  return dao.saveCollection(collection)
})
