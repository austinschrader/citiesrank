/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q3vyc63gx58hvfm")

  collection.updateRule = ""
  collection.deleteRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q3vyc63gx58hvfm")

  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
