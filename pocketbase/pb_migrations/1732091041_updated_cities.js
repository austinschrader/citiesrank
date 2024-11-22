/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4p9o81cfqrmoah0")

  collection.name = "cities2"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4p9o81cfqrmoah0")

  collection.name = "cities"

  return dao.saveCollection(collection)
})
