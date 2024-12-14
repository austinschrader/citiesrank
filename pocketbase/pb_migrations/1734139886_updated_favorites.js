/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("iyo1zz4obzuvt9p")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_2B6vnAZ` ON `favorites` (\n  `user`,\n  `city`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("iyo1zz4obzuvt9p")

  collection.indexes = []

  return dao.saveCollection(collection)
})
