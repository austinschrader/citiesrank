/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9lwmm8sntjq5frg")

  collection.listRule = "@request.auth.id != '' || @collection.lists.visibility = 'public'\n"
  collection.viewRule = "@request.auth.id != '' || @collection.lists.visibility = 'public'\n"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9lwmm8sntjq5frg")

  collection.listRule = "@request.auth.id != \"\""
  collection.viewRule = null

  return dao.saveCollection(collection)
})
