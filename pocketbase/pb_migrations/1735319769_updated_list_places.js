/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9lwmm8sntjq5frg")

  collection.listRule = "@request.auth.id != \"\""
  collection.createRule = "@request.auth.id != \"\" && @request.auth.id = list.user"
  collection.updateRule = "@request.auth.id != \"\" && @request.auth.id = list.user"
  collection.deleteRule = "@request.auth.id != \"\" && @request.auth.id = list.user"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9lwmm8sntjq5frg")

  collection.listRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
