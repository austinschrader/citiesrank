/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cities_list")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_sTXdpDU` ON `cities` (`slug`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cities_list")

  collection.indexes = []

  return dao.saveCollection(collection)
})
