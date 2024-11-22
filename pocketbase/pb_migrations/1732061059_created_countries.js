/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "wmmnhjc7jej7ohx",
    "created": "2024-11-20 00:04:19.088Z",
    "updated": "2024-11-20 00:04:19.088Z",
    "name": "countries",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "vnqxauqs",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("wmmnhjc7jej7ohx");

  return dao.deleteCollection(collection);
})
